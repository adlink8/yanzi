import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const root = process.cwd()
const contentRoot = path.join(root, 'content')
const songsPath = path.join(contentRoot, 'songs', 'index.json')
const albumsPath = path.join(contentRoot, 'albums', 'index.json')
const timelinePath = path.join(contentRoot, 'timeline', 'index.json')
const deepReadsDir = path.join(contentRoot, 'songs', 'deep-reads')
const rawLyricsDir = path.join(contentRoot, 'songs', 'raw-lyrics')

const CJK_PATTERN = /[\u3400-\u9FFF]/
const PLACEHOLDER_MARKERS = ['待补充', '基础深读版本整理']
const CJK_LINE_PATTERN = /[\u3400-\u9FFF]/
const TITLE_FALLBACK = '标题待补'
const ENGLISH_TOKENS = new Set([
  'a',
  'ain',
  'alone',
  'all',
  'be',
  'child',
  'concert',
  'diamonds',
  'dream',
  'e',
  'enough',
  'get',
  'good',
  'honey',
  'hey',
  'i',
  'jude',
  'just',
  'leave',
  'little',
  'love',
  'lover',
  'me',
  'moment',
  'mine',
  'my',
  'o',
  'of',
  'on',
  'one',
  'opening',
  'people',
  'radio',
  'rise',
  'road',
  'silent',
  'someone',
  'song',
  'sparkling',
  'sparking',
  'start',
  'story',
  'stefanie',
  'sweet',
  'that',
  'the',
  'there',
  'these',
  'u',
  'united',
  'up2u',
  'venus',
  'we',
  'will',
  'would',
  'years',
  'your'
])

function questionMarkCount(value) {
  const matches = value.match(/\?/g)
  return matches ? matches.length : 0
}

function isCorruptedText(value) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return false
  if (trimmed.includes('�')) return true
  if (/\?{2,}/.test(trimmed)) return true

  const qCount = questionMarkCount(trimmed)
  if (qCount === 0) return false

  const compactLength = trimmed.replace(/\s+/g, '').length
  if (compactLength === 0) return true

  if (qCount / compactLength >= 0.12) return true
  if (!CJK_PATTERN.test(trimmed)) return true

  return false
}

function isPlaceholderLike(value) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return true
  if (PLACEHOLDER_MARKERS.some((marker) => trimmed.includes(marker))) return true
  return isCorruptedText(trimmed)
}

function humanizeSlug(slug) {
  const trimmed = String(slug || '').trim()
  if (!trimmed) return '未命名条目'
  const words = trimmed
    .split('-')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      if (/^\d+$/.test(part)) return part
      return `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`
    })
  return words.length > 0 ? words.join(' ') : '未命名条目'
}

function sanitizeText(value, fallback = '') {
  const trimmed = String(value || '').trim()
  if (!trimmed) return fallback
  if (isPlaceholderLike(trimmed)) return fallback
  return trimmed
}

function sanitizeTextArray(values) {
  if (!Array.isArray(values)) return []
  return values
    .map((item) => sanitizeText(item, ''))
    .filter((item) => item.length > 0)
}

function sanitizeMultilineText(value) {
  if (!value) return ''
  const lines = String(value)
    .split(/\r?\n/g)
    .filter((line) => {
      const trimmed = line.trim()
      if (!trimmed) return true
      return !isPlaceholderLike(trimmed)
    })
  return lines.join('\n').trim()
}

function cjkRatio(value) {
  const text = String(value || '')
  if (!text) return 0
  const cjkChars = (text.match(/[\u3400-\u9FFF]/g) || []).length
  return cjkChars / text.length
}

function normalizeSlugLike(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function isSlugLikeLatinTitle(title, slug) {
  if (!title || CJK_LINE_PATTERN.test(title)) return false
  return normalizeSlugLike(title) === normalizeSlugLike(slug)
}

function isLikelyEnglishSlug(slug) {
  const tokens = String(slug || '')
    .toLowerCase()
    .split('-')
    .map((part) => part.trim())
    .filter(Boolean)

  if (tokens.length === 0) return false

  let english = 0
  let unknown = 0

  for (const token of tokens) {
    if (/^\d+$/.test(token)) continue
    if (ENGLISH_TOKENS.has(token)) {
      english += 1
    } else {
      unknown += 1
    }
  }

  return english > 0 && unknown === 0
}

function normalizeLatinTitle(value) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return trimmed
  if (CJK_PATTERN.test(trimmed)) return trimmed
  if (!/^[A-Za-z0-9\s'-]+$/.test(trimmed)) return trimmed

  return trimmed
    .split(/\s+/g)
    .filter(Boolean)
    .map((part) => {
      if (/^\d+$/.test(part)) return part
      return `${part.slice(0, 1).toUpperCase()}${part.slice(1).toLowerCase()}`
    })
    .join(' ')
}

function splitLyricBlocks(text) {
  return String(text || '')
    .split(/\r?\n\s*\r?\n/g)
    .map((block) => block.trim())
    .filter(Boolean)
}

function sanitizeInterpretations(value) {
  if (!Array.isArray(value)) return []
  return value
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null
      const id = sanitizeText(item.id, `unit-${index + 1}`)
      const section = sanitizeText(item.section, '')
      const reference = sanitizeText(item.reference, '')
      const lyricText = sanitizeText(item.lyricText, '')
      const interpretation = sanitizeText(item.interpretation, '')
      const whyItMatters = sanitizeText(item.whyItMatters, '')

      if (!section || !reference || !interpretation) return null

      return {
        id,
        section,
        reference,
        ...(lyricText ? { lyricText } : {}),
        interpretation,
        ...(whyItMatters ? { whyItMatters } : {})
      }
    })
    .filter(Boolean)
}

function sanitizeSongDesign(value) {
  if (!value || typeof value !== 'object') return undefined
  const summary = sanitizeText(value.summary, '')
  const structure = sanitizeTextArray(value.structure)
  const emotionCurve = sanitizeTextArray(value.emotionCurve)
  const craftNotes = sanitizeTextArray(value.craftNotes)

  if (!summary && structure.length === 0 && emotionCurve.length === 0 && craftNotes.length === 0) {
    return undefined
  }

  return {
    ...(summary ? { summary } : {}),
    ...(structure.length > 0 ? { structure } : {}),
    ...(emotionCurve.length > 0 ? { emotionCurve } : {}),
    ...(craftNotes.length > 0 ? { craftNotes } : {})
  }
}

const rawAlbums = JSON.parse(await fs.readFile(albumsPath, 'utf8'))
const sanitizedAlbums = rawAlbums.map((album) => {
  const title = normalizeLatinTitle(sanitizeText(album.title, humanizeSlug(album.slug)))
  const representativeSongs = sanitizeTextArray(album.representativeSongs)
  return {
    ...album,
    title,
    era: sanitizeText(album.era, `${album.releaseYear ?? '未知'} 时期`),
    summary: sanitizeText(album.summary, `《${title}》资料整理中。`),
    coreThemes: (() => {
      const themes = sanitizeTextArray(album.coreThemes)
      return themes.length > 0 ? themes : ['资料整理中']
    })(),
    representativeSongs: representativeSongs.length > 0 ? representativeSongs : ['资料整理中'],
    songSlugs: Array.isArray(album.songSlugs)
      ? album.songSlugs.map((slug) => String(slug).trim()).filter(Boolean)
      : []
  }
})
await fs.writeFile(albumsPath, `${JSON.stringify(sanitizedAlbums, null, 2)}\n`, 'utf8')

const albumsBySlug = new Map(sanitizedAlbums.map((album) => [album.slug, album]))

const rawLyricsBySlug = new Map()
const rawLyricFiles = (await fs.readdir(rawLyricsDir)).filter((file) => file.endsWith('.txt'))
for (const fileName of rawLyricFiles) {
  const slug = fileName.replace(/\.txt$/i, '')
  const text = sanitizeMultilineText(await fs.readFile(path.join(rawLyricsDir, fileName), 'utf8'))
  rawLyricsBySlug.set(slug, text)
}

function pickChineseTitleFromDeepRead(rawMarkdown) {
  const parsed = matter(rawMarkdown)
  const titleInFrontmatter = sanitizeText(parsed.data.title, '')
  if (
    titleInFrontmatter &&
    CJK_LINE_PATTERN.test(titleInFrontmatter) &&
    !/[A-Za-z]/.test(titleInFrontmatter) &&
    titleInFrontmatter !== TITLE_FALLBACK
  ) {
    return titleInFrontmatter
  }

  const body = sanitizeMultilineText(parsed.content)
  if (!body) return ''

  const startsWith = body.match(/^\s*《([^》]{1,30})》/)
  if (startsWith && CJK_LINE_PATTERN.test(startsWith[1]) && !/[A-Za-z]/.test(startsWith[1])) {
    return startsWith[1].trim()
  }

  const earlyText = body.slice(0, 800)
  const earlyMatch = earlyText.match(/《([^》]{1,30})》/)
  if (earlyMatch && CJK_LINE_PATTERN.test(earlyMatch[1]) && !/[A-Za-z]/.test(earlyMatch[1])) {
    return earlyMatch[1].trim()
  }

  const all = [...body.matchAll(/《([^》]{1,30})》/g)]
    .map((match) => match[1].trim())
    .filter((candidate) => CJK_LINE_PATTERN.test(candidate) && !/[A-Za-z]/.test(candidate) && candidate !== TITLE_FALLBACK)

  return all[0] || ''
}

const inferredChineseTitleBySlug = new Map()
const deepReadFilesForInfer = (await fs.readdir(deepReadsDir)).filter((file) => file.endsWith('.md') && file !== '_template.md')
for (const fileName of deepReadFilesForInfer) {
  const slug = fileName.replace(/\.md$/i, '')
  const rawMarkdown = await fs.readFile(path.join(deepReadsDir, fileName), 'utf8')
  const inferred = pickChineseTitleFromDeepRead(rawMarkdown)
  if (inferred) inferredChineseTitleBySlug.set(slug, inferred)
}

const rawSongs = JSON.parse(await fs.readFile(songsPath, 'utf8'))
const sanitizedSongs = rawSongs.map((song) => {
  let title = normalizeLatinTitle(sanitizeText(song.title, humanizeSlug(song.slug)))
  if (title === TITLE_FALLBACK && inferredChineseTitleBySlug.has(song.slug)) {
    title = inferredChineseTitleBySlug.get(song.slug)
  }
  if (title === TITLE_FALLBACK && isLikelyEnglishSlug(song.slug)) {
    title = normalizeLatinTitle(humanizeSlug(song.slug))
  }
  const rawLyrics = rawLyricsBySlug.get(song.slug) || ''
  const likelyChinese = cjkRatio(rawLyrics) > 0.2 || !rawLyrics
  if (isSlugLikeLatinTitle(title, song.slug) && likelyChinese && !isLikelyEnglishSlug(song.slug)) {
    title = TITLE_FALLBACK
  }

  const album = albumsBySlug.get(song.albumSlug)
  return {
    ...song,
    title,
    era: sanitizeText(song.era, sanitizeText(album?.era, '未知时期')),
    summary: sanitizeText(song.summary, `《${title}》的解读正在整理中。`),
    moodTags: sanitizeTextArray(song.moodTags),
    themeTags: sanitizeTextArray(song.themeTags),
    keywords: sanitizeTextArray(song.keywords),
    relatedSongs: Array.isArray(song.relatedSongs)
      ? song.relatedSongs.map((slug) => String(slug).trim()).filter(Boolean)
      : []
  }
})
await fs.writeFile(songsPath, `${JSON.stringify(sanitizedSongs, null, 2)}\n`, 'utf8')

const songsBySlug = new Map(sanitizedSongs.map((song) => [song.slug, song]))

const rawTimeline = JSON.parse(await fs.readFile(timelinePath, 'utf8'))
const sanitizedTimeline = rawTimeline.map((event) => {
  const relatedAlbum = event.relatedAlbumSlug ? albumsBySlug.get(event.relatedAlbumSlug) : undefined
  const fallbackTitle = relatedAlbum ? `《${relatedAlbum.title}》时期` : `${event.date} 事件`
  return {
    ...event,
    title: sanitizeText(event.title, fallbackTitle),
    description: sanitizeText(
      event.description,
      relatedAlbum ? `与《${relatedAlbum.title}》相关的时期资料整理中。` : '该时期说明正在整理中。'
    )
  }
})
await fs.writeFile(timelinePath, `${JSON.stringify(sanitizedTimeline, null, 2)}\n`, 'utf8')

const deepReadFiles = (await fs.readdir(deepReadsDir)).filter((file) => file.endsWith('.md'))
let deepReadUpdated = 0

for (const fileName of deepReadFiles) {
  if (fileName === '_template.md') continue

  const slug = fileName.replace(/\.md$/i, '')
  const fullPath = path.join(deepReadsDir, fileName)
  const rawMarkdown = await fs.readFile(fullPath, 'utf8')
  const parsed = matter(rawMarkdown)
  const song = songsBySlug.get(slug)
  let title = normalizeLatinTitle(sanitizeText(parsed.data.title, song?.title || humanizeSlug(slug)))
  if (title === TITLE_FALLBACK && song?.title && song.title !== TITLE_FALLBACK) {
    title = song.title
  }
  if (title === TITLE_FALLBACK && isLikelyEnglishSlug(slug)) {
    title = normalizeLatinTitle(humanizeSlug(slug))
  }
  const rawLyrics = rawLyricsBySlug.get(slug) || ''
  const likelyChinese = cjkRatio(rawLyrics) > 0.2 || !rawLyrics
  if (isSlugLikeLatinTitle(title, slug) && likelyChinese && !isLikelyEnglishSlug(slug)) {
    title = TITLE_FALLBACK
  }
  const mvTitle = sanitizeText(parsed.data.mvTitle, '')
  const mvUrl = sanitizeText(parsed.data.mvUrl, '')
  const fullLyricsFromFrontmatter = sanitizeMultilineText(parsed.data.fullLyrics)
  const rawLyricsPath = path.join(rawLyricsDir, `${slug}.txt`)

  let rawLyricsFromFile = ''
  try {
    rawLyricsFromFile = sanitizeMultilineText(await fs.readFile(rawLyricsPath, 'utf8'))
  } catch {
    rawLyricsFromFile = ''
  }

  const lyricBlocks = (() => {
    const rawLyricBlocks = Array.isArray(parsed.data.lyricBlocks) ? parsed.data.lyricBlocks : []
    const fromFrontmatter = sanitizeTextArray(rawLyricBlocks.map((block) => sanitizeMultilineText(block)))
    if (fromFrontmatter.length > 0) return fromFrontmatter
    if (rawLyricsFromFile) return splitLyricBlocks(rawLyricsFromFile)
    return []
  })()

  const lyricInterpretations = sanitizeInterpretations(parsed.data.lyricInterpretations)
  const songDesign = sanitizeSongDesign(parsed.data.songDesign)
  const body = sanitizeMultilineText(parsed.content)
  const nextBody = body || `${title === TITLE_FALLBACK ? '这首歌' : title} 的整体解读正在整理中。`

  const nextData = {
    slug,
    title,
    status: sanitizeText(parsed.data.status, 'ready'),
    ...(sanitizeText(parsed.data.updatedAt, '') ? { updatedAt: sanitizeText(parsed.data.updatedAt, '') } : {}),
    ...(mvTitle ? { mvTitle } : {}),
    ...(mvUrl ? { mvUrl } : {}),
    ...(fullLyricsFromFrontmatter ? { fullLyrics: fullLyricsFromFrontmatter } : {}),
    ...(lyricBlocks.length > 0 ? { lyricBlocks } : {}),
    ...(lyricInterpretations.length > 0 ? { lyricInterpretations } : {}),
    ...(songDesign ? { songDesign } : {})
  }

  const output = matter.stringify(nextBody, nextData)
  if (output !== rawMarkdown) {
    await fs.writeFile(fullPath, output, 'utf8')
    deepReadUpdated += 1
  }
}

const countCorruptedSongs = sanitizedSongs.filter((song) => isPlaceholderLike(song.title) || isPlaceholderLike(song.era)).length
const countCorruptedAlbums = sanitizedAlbums.filter((album) => isPlaceholderLike(album.title) || isPlaceholderLike(album.summary)).length
const countCorruptedTimeline = sanitizedTimeline.filter((event) => isPlaceholderLike(event.title) || isPlaceholderLike(event.description)).length

console.log(
  JSON.stringify(
    {
      songs: sanitizedSongs.length,
      albums: sanitizedAlbums.length,
      timeline: sanitizedTimeline.length,
      deepReadFiles: deepReadFiles.length,
      deepReadUpdated,
      remainingCorruptedSongs: countCorruptedSongs,
      remainingCorruptedAlbums: countCorruptedAlbums,
      remainingCorruptedTimeline: countCorruptedTimeline
    },
    null,
    2
  )
)
