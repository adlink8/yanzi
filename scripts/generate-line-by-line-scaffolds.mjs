import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const root = process.cwd()
const rawLyricsDir = path.join(root, 'content', 'songs', 'raw-lyrics')
const deepReadsDir = path.join(root, 'content', 'songs', 'deep-reads')
const indexPath = path.join(root, 'content', 'songs', 'index.json')

function toIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

function splitLyricBlocks(text) {
  return text
    .split(/\r?\n\s*\r?\n/g)
    .map((block) => block.trim())
    .filter(Boolean)
}

function splitLyricLines(text) {
  return text
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean)
}

function buildPlaceholderInterpretations(fullLyrics) {
  const lines = splitLyricLines(fullLyrics)
  return lines.map((line, index) => ({
    id: `line-${String(index + 1).padStart(3, '0')}`,
    section: '逐句解读',
    reference: `第 ${index + 1} 行`,
    lyricText: line,
    interpretation: '待补充：这句歌词的详细解读。',
    whyItMatters: '待补充：这句歌词在整首歌中的作用。'
  }))
}

function defaultBody(title) {
  return `${title} 的整体解读待补充。`
}

function deriveTitle(slug, indexedSongsMap) {
  return indexedSongsMap.get(slug)?.title || slug
}

const indexedSongs = JSON.parse(await fs.readFile(indexPath, 'utf8'))
const indexedSongsMap = new Map(indexedSongs.map((song) => [song.slug, song]))

await fs.mkdir(deepReadsDir, { recursive: true })

const rawFiles = (await fs.readdir(rawLyricsDir)).filter((name) => name.endsWith('.txt')).sort()
let created = 0
let updated = 0
let preserved = 0

for (const fileName of rawFiles) {
  const slug = fileName.replace(/\.txt$/i, '')
  const rawLyrics = (await fs.readFile(path.join(rawLyricsDir, fileName), 'utf8')).trim()
  if (!rawLyrics) continue

  const deepReadPath = path.join(deepReadsDir, `${slug}.md`)
  let existingData = {}
  let existingBody = ''
  let exists = false

  try {
    const existingRaw = await fs.readFile(deepReadPath, 'utf8')
    const parsed = matter(existingRaw)
    existingData = parsed.data || {}
    existingBody = (parsed.content || '').trim()
    exists = true
  } catch {
    exists = false
  }

  const lyricBlocks = splitLyricBlocks(rawLyrics)
  const existingInterpretations = Array.isArray(existingData.lyricInterpretations) ? existingData.lyricInterpretations : []
  const shouldPreserveInterpretations = existingInterpretations.length > 0

  const nextData = {
    slug,
    title: typeof existingData.title === 'string' && existingData.title.trim() ? existingData.title.trim() : deriveTitle(slug, indexedSongsMap),
    status: typeof existingData.status === 'string' && existingData.status.trim() ? existingData.status.trim() : 'draft',
    updatedAt: toIsoDate(),
    ...(typeof existingData.mvTitle === 'string' && existingData.mvTitle.trim() ? { mvTitle: existingData.mvTitle.trim() } : {}),
    ...(typeof existingData.mvUrl === 'string' && existingData.mvUrl.trim() ? { mvUrl: existingData.mvUrl.trim() } : {}),
    lyricBlocks,
    lyricInterpretations: shouldPreserveInterpretations ? existingInterpretations : buildPlaceholderInterpretations(rawLyrics),
    ...(existingData.songDesign ? { songDesign: existingData.songDesign } : {})
  }

  const nextBody = existingBody || defaultBody(nextData.title)
  const output = matter.stringify(nextBody, nextData)
  await fs.writeFile(deepReadPath, output, 'utf8')

  if (!exists) {
    created += 1
  } else {
    updated += 1
    if (shouldPreserveInterpretations) {
      preserved += 1
    }
  }
}

console.log(JSON.stringify({
  rawLyricsCount: rawFiles.length,
  created,
  updated,
  preservedInterpretations: preserved
}, null, 2))