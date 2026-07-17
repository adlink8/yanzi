/**
 * Prepare depth-upgrade batches for already-editorial but thin deep-reads.
 * Usage: node scripts/prepare-deepread-depth-batches.mjs --limit 48 --size 6
 */
import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const reportPath = path.join(root, 'docs', 'DEEPREAD-QUALITY-REPORT.json')
const songsPath = path.join(root, 'content', 'songs', 'index.json')
const outDir = path.join(root, 'docs', 'deepread-batches')

function parseArgs(argv) {
  const args = { size: 6, limit: 48, bodyMax: 220, interpMax: 4 }
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i]
    if (a === '--size') args.size = Math.max(1, Number(argv[++i]) || 6)
    else if (a === '--limit') args.limit = Math.max(1, Number(argv[++i]) || 48)
    else if (a === '--body-max') args.bodyMax = Number(argv[++i]) || 220
    else if (a === '--interp-max') args.interpMax = Number(argv[++i]) || 4
  }
  return args
}

const FAV = { high: 0, medium: 1, low: 2, unknown: 3 }

function buildPrompt(batch) {
  const lines = batch.songs
    .map(
      (s, n) =>
        `${n + 1}. \`${s.slug}\` — ${s.title} (fav=${s.favoriteLevel}, body=${s.bodyChars}, interp=${s.interpretationCount})`
    )
    .join('\n')

  return `# Deep-read DEPTH upgrade ${batch.id}

## Role
加深已有 editorial 解读：更细、更贴这首歌，禁止回退成模板。

## Spec
\`docs/DEEPREAD-EDITORIAL-SPEC.md\`

## Working directory
\`/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads\`

## Songs ONLY
${lines}

## Depth requirements (stricter)
For each slug:
1. Read \`raw-lyrics/{slug}.txt\`, current deep-read, and index card
2. Expand **body overview to ≥280 Chinese characters** — unique imagery/era/mechanism for THIS song
3. Ensure **5–6 lyricInterpretations**, each on a **different real lyric line**, unique prose
4. Enrich songDesign (structure / emotionCurve / craftNotes) with concrete devices of THIS track
5. Keep verified mvUrl only; never invent URLs
6. \`updatedAt\` today; \`status: ready\`
7. Lightly fix index summary/tags if still generic

## Forbidden
Scaffold phrases; cross-song copy-paste; inventing lyrics/MV; fake 开场句 lyricText

## Verify
\`\`\`bash
npm run verify:deepread-batch -- --batch ${batch.number}
\`\`\`
Also ensure each body is ≥280 chars.

## Return
## Batch ${batch.id} Complete
- slugs: ...
- verify: pass/fail
- notes: ...
`
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const [report, songs] = await Promise.all([
    fs.readFile(reportPath, 'utf8').then(JSON.parse),
    fs.readFile(songsPath, 'utf8').then(JSON.parse)
  ])
  const songBySlug = new Map(songs.map((s) => [s.slug, s]))

  let cands = (report.items || []).filter((i) => {
    const thinBody = (i.bodyChars || 0) < args.bodyMax
    const thinInterp = (i.interpretationCount || 0) <= args.interpMax
    const highThin = i.favoriteLevel === 'high' && (i.bodyChars || 0) < 300
    return thinBody || thinInterp || highThin
  })

  cands.sort((a, b) => {
    const fa = FAV[a.favoriteLevel] ?? 3
    const fb = FAV[b.favoriteLevel] ?? 3
    if (fa !== fb) return fa - fb
    if ((a.bodyChars || 0) !== (b.bodyChars || 0)) return (a.bodyChars || 0) - (b.bodyChars || 0)
    return String(a.slug).localeCompare(String(b.slug))
  })

  cands = cands.slice(0, args.limit)

  await fs.mkdir(outDir, { recursive: true })
  for (const name of await fs.readdir(outDir)) {
    if (/^BATCH-\d+\.(md|json)$/.test(name) || name === 'MANIFEST.json') {
      await fs.unlink(path.join(outDir, name))
    }
  }

  const batches = []
  for (let i = 0; i < cands.length; i += args.size) {
    const slice = cands.slice(i, i + args.size)
    const number = batches.length + 1
    const id = `BATCH-${String(number).padStart(3, '0')}`
    const batchSongs = slice.map((item) => {
      const card = songBySlug.get(item.slug) || {}
      return {
        slug: item.slug,
        title: item.title || card.title || item.slug,
        favoriteLevel: item.favoriteLevel || 'unknown',
        tier: item.tier,
        bodyChars: item.bodyChars,
        interpretationCount: item.interpretationCount,
        albumSlug: card.albumSlug || '',
        moodTags: card.moodTags || [],
        themeTags: card.themeTags || [],
        summary: card.summary || '',
        deepReadPath: `content/songs/deep-reads/${item.slug}.md`,
        rawLyricsPath: `content/songs/raw-lyrics/${item.slug}.txt`,
        goal: 'depth_upgrade'
      }
    })
    const batch = {
      id,
      number,
      size: batchSongs.length,
      mode: 'depth_upgrade',
      songs: batchSongs,
      createdAt: new Date().toISOString()
    }
    batches.push(batch)
    await fs.writeFile(path.join(outDir, `${id}.json`), `${JSON.stringify(batch, null, 2)}\n`, 'utf8')
    await fs.writeFile(path.join(outDir, `${id}.md`), `${buildPrompt(batch)}\n`, 'utf8')
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    mode: 'depth_upgrade',
    filters: args,
    totalCandidates: cands.length,
    batchCount: batches.length,
    batches: batches.map((b) => ({
      id: b.id,
      number: b.number,
      size: b.size,
      slugs: b.songs.map((s) => s.slug)
    }))
  }
  await fs.writeFile(path.join(outDir, 'MANIFEST.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  await fs.writeFile(
    path.join(outDir, 'README.md'),
    `# Depth upgrade batches\n\n${cands.length} songs / ${batches.length} batches (body thin / few interpretations / high favorites).\n`,
    'utf8'
  )

  console.log(JSON.stringify({ ok: true, totalCandidates: cands.length, batchCount: batches.length, batches: manifest.batches.map((b) => b.id) }, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
