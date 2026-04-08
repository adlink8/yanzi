import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const root = process.cwd()
const songsPath = path.join(root, 'content', 'songs', 'index.json')
const deepReadsDir = path.join(root, 'content', 'songs', 'deep-reads')
const mapPath = process.argv[2]

if (!mapPath) {
  console.error('Usage: node scripts/apply-title-map.mjs <title-map.json>')
  process.exit(1)
}

const titleMap = JSON.parse(await fs.readFile(path.resolve(mapPath), 'utf8'))

if (!titleMap || typeof titleMap !== 'object' || Array.isArray(titleMap)) {
  console.error('Invalid title map JSON. Expecting an object: { "slug": "中文标题" }')
  process.exit(1)
}

function sanitizeTitle(value) {
  return String(value || '').trim()
}

const songs = JSON.parse(await fs.readFile(songsPath, 'utf8'))
let songsUpdated = 0
const touchedSlugs = new Set()

for (const song of songs) {
  const mapped = sanitizeTitle(titleMap[song.slug])
  if (!mapped) continue
  if (song.title !== mapped) {
    song.title = mapped
    songsUpdated += 1
  }
  touchedSlugs.add(song.slug)
}

await fs.writeFile(songsPath, `${JSON.stringify(songs, null, 2)}\n`, 'utf8')

let deepReadsUpdated = 0
for (const slug of touchedSlugs) {
  const mdPath = path.join(deepReadsDir, `${slug}.md`)
  try {
    const raw = await fs.readFile(mdPath, 'utf8')
    const parsed = matter(raw)
    const mapped = sanitizeTitle(titleMap[slug])
    if (!mapped) continue

    const nextData = {
      ...parsed.data,
      slug,
      title: mapped
    }

    const output = matter.stringify(parsed.content, nextData)
    if (output !== raw) {
      await fs.writeFile(mdPath, output, 'utf8')
      deepReadsUpdated += 1
    }
  } catch {
    // ignore missing files
  }
}

console.log(
  JSON.stringify(
    {
      mappedCount: Object.keys(titleMap).length,
      songsUpdated,
      deepReadsUpdated
    },
    null,
    2
  )
)
