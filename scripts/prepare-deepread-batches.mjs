/**
 * Prepare parallel subagent work packages for per-song editorial deep-reads.
 *
 * Usage:
 *   node scripts/prepare-deepread-batches.mjs
 *   node scripts/prepare-deepread-batches.mjs --size 6 --limit 24 --favorite medium
 *   node scripts/prepare-deepread-batches.mjs --tiers scaffold,passable --size 5
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const reportPath = path.join(root, 'docs', 'DEEPREAD-QUALITY-REPORT.json')
const songsPath = path.join(root, 'content', 'songs', 'index.json')
const outDir = path.join(root, 'docs', 'deepread-batches')
const manifestPath = path.join(outDir, 'MANIFEST.json')

function parseArgs(argv) {
  const args = {
    size: 6,
    limit: 0,
    favorite: 'all', // all | high | medium | low
    tiers: ['scaffold', 'passable'],
    refresh: false
  }
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i]
    if (a === '--size') args.size = Math.max(1, Number(argv[++i]) || 6)
    else if (a === '--limit') args.limit = Math.max(0, Number(argv[++i]) || 0)
    else if (a === '--favorite') args.favorite = String(argv[++i] || 'all')
    else if (a === '--tiers') {
      args.tiers = String(argv[++i] || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    } else if (a === '--refresh') args.refresh = true
  }
  return args
}

const FAVORITE_ORDER = { high: 0, medium: 1, low: 2, unknown: 3 }

function buildAgentPrompt(batch) {
  const songLines = batch.songs
    .map(
      (s, idx) =>
        `${idx + 1}. \`${s.slug}\` — ${s.title} (favorite=${s.favoriteLevel}, was ${s.tier})`
    )
    .join('\n')

  return `# Deep-read editorial batch ${batch.id}

## Role
你是内容执行子代理。把下列歌曲的 deep-read 从模板改为 **按曲定制** 解读。

## Working directory
\`/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads\`

## Spec (must follow)
Read and obey: \`docs/DEEPREAD-EDITORIAL-SPEC.md\`

## Songs in this batch ONLY
${songLines}

Do **not** edit songs outside this list.

## Per-song workflow
For each slug:
1. Read \`content/songs/raw-lyrics/{slug}.txt\` (if placeholder-only, still write song-specific overview from card summary; skip fake lyricText stubs).
2. Read current \`content/songs/deep-reads/{slug}.md\` and index card in \`content/songs/index.json\`.
3. Rewrite deep-read YAML + body:
   - body overview: song-specific, ≥160 Chinese chars, no scaffold phrases
   - lyricInterpretations: 4–6 units, each anchored to **real lyric lines**
   - each interpretation unique (no copy-paste across units or songs)
   - songDesign specific to this track
   - keep verified mvUrl only; delete known-fake mass URLs; never invent
   - updatedAt: today's date; status: ready
4. Lightly align index summary/moodTags/themeTags only if clearly wrong.

## Forbidden
- Template language listed in the spec
- Inventing lyrics, MV links, or interview facts
- Changing other songs / album structure

## Verify before finish
\`\`\`bash
npm run verify:deepread-batch -- --batch ${batch.number}
npm run report:deepread-quality
\`\`\`
All songs in this batch must be \`editorial\`.

## Return (confirmation only)
## Batch ${batch.id} Complete
- slugs upgraded: ...
- verify: pass/fail
- notes: ...
`
}

async function ensureReport(refresh) {
  try {
    if (refresh) throw new Error('refresh')
    await fs.access(reportPath)
  } catch {
    const { spawn } = await import('node:child_process')
    await new Promise((resolve, reject) => {
      const child = spawn('node', ['scripts/report-deepread-quality.mjs'], {
        cwd: root,
        stdio: 'inherit'
      })
      child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`report exit ${code}`))))
    })
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  await ensureReport(args.refresh)

  const [reportRaw, songsRaw] = await Promise.all([
    fs.readFile(reportPath, 'utf8'),
    fs.readFile(songsPath, 'utf8')
  ])
  const report = JSON.parse(reportRaw)
  const songs = JSON.parse(songsRaw)
  const songBySlug = new Map(songs.map((s) => [s.slug, s]))

  let candidates = (report.items || []).filter((item) => args.tiers.includes(item.tier))

  if (args.favorite !== 'all') {
    candidates = candidates.filter((item) => item.favoriteLevel === args.favorite)
  }

  candidates.sort((a, b) => {
    const fa = FAVORITE_ORDER[a.favoriteLevel] ?? 9
    const fb = FAVORITE_ORDER[b.favoriteLevel] ?? 9
    if (fa !== fb) return fa - fb
    const ta = a.tier === 'scaffold' ? 0 : 1
    const tb = b.tier === 'scaffold' ? 0 : 1
    if (ta !== tb) return ta - tb
    return String(a.slug).localeCompare(String(b.slug))
  })

  if (args.limit > 0) {
    candidates = candidates.slice(0, args.limit)
  }

  await fs.mkdir(outDir, { recursive: true })

  // clear old batch md/json except keep directory
  const existing = await fs.readdir(outDir)
  for (const name of existing) {
    if (/^BATCH-\d+\.(md|json)$/.test(name) || name === 'MANIFEST.json') {
      await fs.unlink(path.join(outDir, name))
    }
  }

  const batches = []
  for (let i = 0; i < candidates.length; i += args.size) {
    const slice = candidates.slice(i, i + args.size)
    const number = String(batches.length + 1).padStart(3, '0')
    const id = `BATCH-${number}`
    const batchSongs = slice.map((item) => {
      const card = songBySlug.get(item.slug) || {}
      return {
        slug: item.slug,
        title: item.title || card.title || item.slug,
        favoriteLevel: item.favoriteLevel || card.favoriteLevel || 'unknown',
        tier: item.tier,
        albumSlug: card.albumSlug || '',
        moodTags: card.moodTags || item.moodTags || [],
        themeTags: card.themeTags || item.themeTags || [],
        summary: card.summary || item.summary || '',
        deepReadPath: `content/songs/deep-reads/${item.slug}.md`,
        rawLyricsPath: `content/songs/raw-lyrics/${item.slug}.txt`
      }
    })

    const batch = {
      id,
      number: Number(number),
      size: batchSongs.length,
      songs: batchSongs,
      createdAt: new Date().toISOString()
    }
    batches.push(batch)

    const jsonPath = path.join(outDir, `${id}.json`)
    const mdPath = path.join(outDir, `${id}.md`)
    await fs.writeFile(jsonPath, `${JSON.stringify(batch, null, 2)}\n`, 'utf8')
    await fs.writeFile(mdPath, `${buildAgentPrompt(batch)}\n`, 'utf8')
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    filters: {
      size: args.size,
      limit: args.limit || null,
      favorite: args.favorite,
      tiers: args.tiers
    },
    totalCandidates: candidates.length,
    batchCount: batches.length,
    batches: batches.map((b) => ({
      id: b.id,
      number: b.number,
      size: b.size,
      slugs: b.songs.map((s) => s.slug),
      promptFile: `docs/deepread-batches/${b.id}.md`,
      dataFile: `docs/deepread-batches/${b.id}.json`
    }))
  }

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

  const indexLines = [
    '# Deep-read editorial batches',
    '',
    `Generated: ${manifest.generatedAt}`,
    '',
    `Candidates: **${manifest.totalCandidates}** · Batches: **${manifest.batchCount}** · size=${args.size}`,
    '',
    'Filters: `tiers=' +
      args.tiers.join(',') +
      '` favorite=`' +
      args.favorite +
      '`',
    '',
    'Spec: `docs/DEEPREAD-EDITORIAL-SPEC.md`',
    '',
    '| Batch | Songs | Prompt |',
    '|-------|------:|--------|'
  ]
  for (const b of manifest.batches) {
    indexLines.push(
      `| ${b.id} | ${b.size} | [\`${b.promptFile}\`](./${path.basename(b.promptFile)}) |`
    )
  }
  indexLines.push('')
  indexLines.push('## Dispatch')
  indexLines.push('')
  indexLines.push('Assign **one subagent per BATCH-*.md**. Each agent upgrades only its slugs to `editorial`.')
  indexLines.push('')
  indexLines.push('```bash')
  indexLines.push('npm run prepare:deepread-batches -- --size 6 --favorite medium --limit 24')
  indexLines.push('npm run verify:deepread-batch -- --batch 1')
  indexLines.push('```')
  indexLines.push('')

  await fs.writeFile(path.join(outDir, 'README.md'), `${indexLines.join('\n')}\n`, 'utf8')

  console.log(
    JSON.stringify(
      {
        ok: true,
        totalCandidates: candidates.length,
        batchCount: batches.length,
        outDir: 'docs/deepread-batches',
        firstBatches: manifest.batches.slice(0, 5).map((b) => b.id)
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
