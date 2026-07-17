/**
 * Verify deep-reads for a prepared batch (or explicit slugs) are editorial-quality.
 *
 * Usage:
 *   node scripts/verify-deepread-batch.mjs --batch 1
 *   node scripts/verify-deepread-batch.mjs --slugs tian-hei-hei,yu-jian
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { SCAFFOLD_MARKERS } from './config/audit-rules.mjs'
import { normalizeText, safeArray } from './lib/audit-utils.mjs'

const root = process.cwd()
const deepReadsDir = path.join(root, 'content', 'songs', 'deep-reads')
const rawLyricsDir = path.join(root, 'content', 'songs', 'raw-lyrics')
const batchesDir = path.join(root, 'docs', 'deepread-batches')

const EXTRA_BANNED = [
  '这一句的价值在于',
  '先立气质',
  '铺垫-推进-转折-收束',
  '情绪结构样本',
  '往更明确的情绪方向推进',
  '它的重要性在于把听感从'
]

function parseArgs(argv) {
  const args = { batch: null, slugs: [] }
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i]
    if (a === '--batch') args.batch = Number(argv[++i])
    else if (a === '--slugs') {
      args.slugs = String(argv[++i] || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    }
  }
  return args
}

function findHits(text) {
  const hits = []
  for (const m of SCAFFOLD_MARKERS) {
    if (text.includes(m)) hits.push(m)
  }
  for (const m of EXTRA_BANNED) {
    if (text.includes(m)) hits.push(m)
  }
  return [...new Set(hits)]
}

function uniqueRatio(interpretations) {
  const texts = interpretations.map((i) => normalizeText(i?.interpretation)).filter(Boolean)
  if (texts.length === 0) return 0
  return new Set(texts).size / texts.length
}

async function loadSlugs(args) {
  if (args.slugs.length > 0) return args.slugs
  if (!args.batch) {
    throw new Error('Provide --batch N or --slugs a,b,c')
  }
  const id = `BATCH-${String(args.batch).padStart(3, '0')}`
  const raw = await fs.readFile(path.join(batchesDir, `${id}.json`), 'utf8')
  const batch = JSON.parse(raw)
  return batch.songs.map((s) => s.slug)
}

async function verifySlug(slug) {
  const mdPath = path.join(deepReadsDir, `${slug}.md`)
  const rawPath = path.join(rawLyricsDir, `${slug}.txt`)
  const md = await fs.readFile(mdPath, 'utf8')
  const { data, content: body } = matter(md)
  let rawLyrics = ''
  try {
    rawLyrics = await fs.readFile(rawPath, 'utf8')
  } catch {
    rawLyrics = ''
  }

  const interpretations = safeArray(data.lyricInterpretations)
  const design = data.songDesign && typeof data.songDesign === 'object' ? data.songDesign : null
  const blob = [
    body,
    ...interpretations.map((i) => `${i?.interpretation || ''}\n${i?.whyItMatters || ''}`)
  ].join('\n')
  const hits = findHits(blob)
  const uniq = uniqueRatio(interpretations)

  const lyricAnchorIssues = []
  const compactRaw = rawLyrics.replace(/\s+/g, '')
  const rawIsPlaceholder =
    !compactRaw ||
    rawLyrics.includes('待补录') ||
    rawLyrics.includes('待补充') ||
    rawLyrics.includes('补录要求')

  if (!rawIsPlaceholder && compactRaw.length > 40) {
    for (const unit of interpretations) {
      const lt = normalizeText(unit?.lyricText)
      if (!lt || lt.length < 2) {
        lyricAnchorIssues.push('empty_lyricText')
        continue
      }
      const compactLt = lt.replace(/\s+/g, '').replace(/[，,。！？、]/g, '')
      if (compactLt.length >= 4 && !compactRaw.includes(compactLt.slice(0, Math.min(12, compactLt.length)))) {
        // soft check: allow minor punctuation diffs; flag only if no 4-char overlap
        const window = compactLt.slice(0, 8)
        if (window.length >= 4 && !compactRaw.includes(window)) {
          lyricAnchorIssues.push(`lyric_not_in_raw:${lt.slice(0, 20)}`)
        }
      }
    }
  }

  const errors = []
  if (hits.length) errors.push(`scaffold_hits:${hits.join('|')}`)
  if (normalizeText(body).length < 160) errors.push('body_too_short')
  if (interpretations.length < 3) errors.push('interpretations_lt_3')
  if (uniq < 0.9) errors.push(`low_unique_ratio:${uniq.toFixed(2)}`)
  if (!design || normalizeText(design.summary).length < 40) errors.push('weak_songDesign')
  if (lyricAnchorIssues.length > 0) errors.push(...lyricAnchorIssues.slice(0, 5))

  const ok = errors.length === 0
  return {
    slug,
    ok,
    tierGuess: ok ? 'editorial' : 'fail',
    interpretationCount: interpretations.length,
    uniqueRatio: Number(uniq.toFixed(2)),
    bodyChars: normalizeText(body).length,
    errors
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const slugs = await loadSlugs(args)
  const results = []
  for (const slug of slugs) {
    results.push(await verifySlug(slug))
  }
  const failed = results.filter((r) => !r.ok)
  const payload = {
    ok: failed.length === 0,
    checked: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
    results
  }
  console.log(JSON.stringify(payload, null, 2))
  if (!payload.ok) process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
