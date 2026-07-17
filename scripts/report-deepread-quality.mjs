import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { SCAFFOLD_MARKERS } from './config/audit-rules.mjs'
import { normalizeText, safeArray } from './lib/audit-utils.mjs'

const root = process.cwd()
const deepReadsDir = path.join(root, 'content', 'songs', 'deep-reads')
const songsPath = path.join(root, 'content', 'songs', 'index.json')
const reportJsonPath = path.join(root, 'docs', 'DEEPREAD-QUALITY-REPORT.json')
const reportMdPath = path.join(root, 'docs', 'DEEPREAD-QUALITY-REPORT.md')

const FAVORITE_ORDER = { high: 0, medium: 1, low: 2, unknown: 3 }
const TIER_ORDER = { scaffold: 0, passable: 1, editorial: 2 }

function collectTextBlobs(data, body) {
  const parts = [body]
  const interpretations = safeArray(data.lyricInterpretations)
  for (const item of interpretations) {
    parts.push(normalizeText(item?.lyricText))
    parts.push(normalizeText(item?.interpretation))
    parts.push(normalizeText(item?.whyItMatters))
    parts.push(normalizeText(item?.section))
    parts.push(normalizeText(item?.reference))
  }
  const design = data.songDesign && typeof data.songDesign === 'object' ? data.songDesign : {}
  parts.push(normalizeText(design.summary))
  for (const key of ['structure', 'emotionCurve', 'craftNotes']) {
    for (const line of safeArray(design[key])) {
      parts.push(normalizeText(line))
    }
  }
  return parts.filter(Boolean).join('\n')
}

function findScaffoldHits(text) {
  return SCAFFOLD_MARKERS.filter((marker) => text.includes(marker))
}

function interpretationUniqueness(interpretations) {
  const texts = interpretations
    .map((item) => normalizeText(item?.interpretation))
    .filter(Boolean)
  if (texts.length === 0) return 0
  const unique = new Set(texts)
  return unique.size / texts.length
}

function isWeakInterpretation(item) {
  const text = normalizeText(item?.interpretation)
  if (text.length < 40) return true
  if (findScaffoldHits(text).length > 0) return true
  if (text.includes('这一句的价值在于')) return true
  return false
}

function classifyDeepRead({ body, data, scaffoldHits }) {
  const interpretations = safeArray(data.lyricInterpretations)
  const design = data.songDesign && typeof data.songDesign === 'object' ? data.songDesign : null
  const uniqueRatio = interpretationUniqueness(interpretations)
  const weakCount = interpretations.filter(isWeakInterpretation).length
  const bodyLen = body.length
  const hasMv = Boolean(normalizeText(data.mvUrl))

  const flags = []
  if (!hasMv) flags.push('missing_mvUrl')
  if (interpretations.length === 0) flags.push('empty_lyricInterpretations')
  if (interpretations.length > 0 && interpretations.length < 3) flags.push('weak_lyricInterpretations_count')
  if (weakCount > 0 && weakCount === interpretations.length) flags.push('all_interpretations_weak')
  if (weakCount > 0 && weakCount < interpretations.length) flags.push('some_interpretations_weak')
  if (!design || normalizeText(design.summary).length < 20) flags.push('weak_songDesign')
  if (bodyLen < 120) flags.push('short_body')
  if (scaffoldHits.length > 0) flags.push(`scaffold:${scaffoldHits.join('|')}`)

  let tier = 'passable'
  if (scaffoldHits.length > 0 || weakCount >= Math.max(2, Math.ceil(interpretations.length * 0.6))) {
    tier = 'scaffold'
  } else if (
    interpretations.length >= 3 &&
    uniqueRatio >= 0.9 &&
    weakCount === 0 &&
    bodyLen >= 160 &&
    design &&
    normalizeText(design.summary).length >= 40
  ) {
    tier = 'editorial'
  }

  return {
    tier,
    flags,
    interpretationCount: interpretations.length,
    weakInterpretationCount: weakCount,
    uniqueInterpretationRatio: Number(uniqueRatio.toFixed(2)),
    bodyChars: bodyLen,
    hasMvUrl: hasMv,
    scaffoldHits
  }
}

function mdTable(rows) {
  if (rows.length === 0) {
    return '| (none) | - | - | - | - |\n|--------|---|---|---|---|'
  }
  const header =
    '| slug | title | favorite | tier | flags |\n|------|-------|----------|------|-------|'
  const body = rows
    .map((row) => {
      const flags = row.flags.length > 0 ? row.flags.join('; ') : '-'
      return `| ${row.slug} | ${row.title} | ${row.favoriteLevel} | ${row.tier} | ${flags} |`
    })
    .join('\n')
  return `${header}\n${body}`
}

async function main() {
  const [songsRaw, deepReadNames] = await Promise.all([
    fs.readFile(songsPath, 'utf8'),
    fs.readdir(deepReadsDir)
  ])

  const songs = JSON.parse(songsRaw)
  const songBySlug = new Map(songs.map((song) => [song.slug, song]))
  const names = deepReadNames.filter((name) => name.endsWith('.md') && name !== '_template.md')

  const items = []

  for (const name of names) {
    const slug = name.replace(/\.md$/i, '')
    const fullPath = path.join(deepReadsDir, name)
    const raw = await fs.readFile(fullPath, 'utf8')
    const parsed = matter(raw)
    const body = normalizeText(parsed.content)
    const data = parsed.data || {}
    const blob = collectTextBlobs(data, body)
    const scaffoldHits = findScaffoldHits(blob)
    const measured = classifyDeepRead({ body, data, scaffoldHits })
    const song = songBySlug.get(slug)

    items.push({
      slug,
      title: normalizeText(data.title) || song?.title || slug,
      favoriteLevel: song?.favoriteLevel || 'unknown',
      moodTags: safeArray(song?.moodTags),
      themeTags: safeArray(song?.themeTags),
      summary: normalizeText(song?.summary),
      ...measured
    })
  }

  items.sort((a, b) => {
    const fav = (FAVORITE_ORDER[a.favoriteLevel] ?? 9) - (FAVORITE_ORDER[b.favoriteLevel] ?? 9)
    if (fav !== 0) return fav
    const tier = (TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9)
    if (tier !== 0) return tier
    return a.slug.localeCompare(b.slug)
  })

  const byTier = { scaffold: 0, passable: 0, editorial: 0 }
  for (const item of items) {
    byTier[item.tier] = (byTier[item.tier] || 0) + 1
  }

  const highFavorite = items.filter((item) => item.favoriteLevel === 'high')
  const highPriorityQueue = highFavorite.filter((item) => item.tier !== 'editorial')

  const report = {
    generatedAt: new Date().toISOString(),
    scanned: items.length,
    tierCounts: byTier,
    highFavoriteCount: highFavorite.length,
    highFavoriteEditorial: highFavorite.filter((i) => i.tier === 'editorial').length,
    highPriorityQueue: highPriorityQueue.map((i) => i.slug),
    scaffoldMarkers: SCAFFOLD_MARKERS,
    items
  }

  await fs.writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  const highTable = mdTable(highFavorite)
  const scaffoldRows = items.filter((i) => i.tier === 'scaffold').slice(0, 40)
  const md = `# DeepRead Quality Report

Generated: ${report.generatedAt}

## Summary

- deep-reads scanned: ${report.scanned}
- tier scaffold: ${byTier.scaffold}
- tier passable: ${byTier.passable}
- tier editorial: ${byTier.editorial}
- favoriteLevel=high: ${report.highFavoriteCount} (editorial ${report.highFavoriteEditorial})

## Classification rules

- **scaffold**: body/YAML hits scaffold markers, or majority of lyricInterpretations are weak/template.
- **editorial**: no scaffold hits, ≥3 unique solid interpretations, body ≥160 chars, songDesign.summary present.
- **passable**: everything else (usable but not yet editorial).

Scaffold markers: ${SCAFFOLD_MARKERS.map((m) => `\`${m}\``).join(', ')}

## High-favorite songs

${highTable}

## High-priority queue (high favorite, not editorial)

${highPriorityQueue.length === 0 ? '- none' : highPriorityQueue.map((s) => `- ${s.slug} (${s.tier})`).join('\n')}

## Scaffold sample (up to 40)

${mdTable(scaffoldRows)}
`

  await fs.writeFile(reportMdPath, md, 'utf8')

  console.log(
    JSON.stringify(
      {
        scanned: report.scanned,
        tierCounts: byTier,
        highFavoriteCount: report.highFavoriteCount,
        highFavoriteEditorial: report.highFavoriteEditorial,
        highPriorityQueue: report.highPriorityQueue,
        reportJson: 'docs/DEEPREAD-QUALITY-REPORT.json',
        reportMd: 'docs/DEEPREAD-QUALITY-REPORT.md'
      },
      null,
      2
    )
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
