import { promises as fs } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import {
  humanizeSlug,
  sanitizeMultilineText,
  sanitizeText,
  sanitizeTextArray
} from '@/lib/content/sanitize'
import type {
  Album,
  Song,
  SongDeepRead,
  SongDesignAnalysis,
  SongInterpretationUnit,
  Tag,
  TimelineEvent
} from '@/types/content'

const contentRoot = path.join(process.cwd(), 'content')

function sanitizeSong(song: Song): Song {
  const title = sanitizeText(song.title, '标题待补')
  const summary = sanitizeText(song.summary, `《${title}》的解读正在整理中。`)

  return {
    ...song,
    title,
    era: sanitizeText(song.era, '未知时期'),
    summary,
    moodTags: sanitizeTextArray(song.moodTags),
    themeTags: sanitizeTextArray(song.themeTags),
    keywords: sanitizeTextArray(song.keywords),
    relatedSongs: song.relatedSongs
      .map((slug) => slug.trim())
      .filter((slug) => slug.length > 0)
  }
}

function sanitizeAlbum(album: Album): Album {
  const title = sanitizeText(album.title, humanizeSlug(album.slug))
  const representativeSongs = sanitizeTextArray(album.representativeSongs)

  return {
    ...album,
    title,
    era: sanitizeText(album.era, '未知时期'),
    summary: sanitizeText(album.summary, `《${title}》的专辑说明正在整理中。`),
    coreThemes: sanitizeTextArray(album.coreThemes),
    representativeSongs: representativeSongs.length > 0 ? representativeSongs : ['资料整理中'],
    songSlugs: album.songSlugs
      .map((slug) => slug.trim())
      .filter((slug) => slug.length > 0)
  }
}

function sanitizeTimelineEvent(event: TimelineEvent): TimelineEvent {
  const fallbackTitle = event.relatedAlbumSlug
    ? `《${humanizeSlug(event.relatedAlbumSlug)}》时期`
    : `${event.date} 事件`

  return {
    ...event,
    title: sanitizeText(event.title, fallbackTitle),
    description: sanitizeText(event.description, '该时期说明正在整理中。')
  }
}

async function readJsonFile<T>(relativePath: string): Promise<T> {
  if (typeof window === 'undefined' && !process.versions.node) {
    // We are in Edge Runtime but somehow reached here at runtime
    // This shouldn't happen during SSG, but if it does, we need to fail gracefully or fetch from a known origin
    throw new Error(`Cannot read file ${relativePath} in Edge Runtime.`)
  }
  const fullPath = path.join(contentRoot, relativePath)
  const raw = await fs.readFile(fullPath, 'utf8')
  return JSON.parse(raw) as T
}

async function readOptionalTextFile(relativePath: string): Promise<string | null> {
  if (typeof window === 'undefined' && !process.versions.node) {
    return null
  }
  const fullPath = path.join(contentRoot, relativePath)
  try {
    const raw = await fs.readFile(fullPath, 'utf8')
    const trimmed = raw.trim()
    return trimmed.length > 0 ? trimmed : null
  } catch {
    return null
  }
}

function isSongInterpretationUnit(value: SongInterpretationUnit | null): value is SongInterpretationUnit {
  return value !== null
}

function parseInterpretationUnits(value: unknown): SongInterpretationUnit[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item, index): SongInterpretationUnit | null => {
      if (!item || typeof item !== 'object') {
        return null
      }

      const candidate = item as Record<string, unknown>
      const id = typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id.trim() : `unit-${index + 1}`
      const section = sanitizeText(typeof candidate.section === 'string' ? candidate.section : '', '')
      const reference = sanitizeText(typeof candidate.reference === 'string' ? candidate.reference : '', '')
      const lyricText = sanitizeText(typeof candidate.lyricText === 'string' ? candidate.lyricText : '', '')
      const interpretation = sanitizeText(typeof candidate.interpretation === 'string' ? candidate.interpretation : '', '')
      const whyItMatters = sanitizeText(typeof candidate.whyItMatters === 'string' ? candidate.whyItMatters : '', '')

      if (!section || !reference || !interpretation) {
        return null
      }

      return {
        id,
        section,
        reference,
        lyricText: lyricText || undefined,
        interpretation,
        whyItMatters: whyItMatters || undefined
      }
    })
    .filter(isSongInterpretationUnit)
}

function parseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .map((item) => sanitizeText(item, ''))
    .filter((item) => item.length > 0)
}

function parseSongDesign(value: unknown): SongDesignAnalysis | undefined {
  if (!value || typeof value !== 'object') {
    return undefined
  }

  const candidate = value as Record<string, unknown>
  const summary = sanitizeText(typeof candidate.summary === 'string' ? candidate.summary : '', '')
  const structure = parseStringArray(candidate.structure)
  const emotionCurve = parseStringArray(candidate.emotionCurve)
  const craftNotes = parseStringArray(candidate.craftNotes)

  if (!summary && structure.length === 0 && emotionCurve.length === 0 && craftNotes.length === 0) {
    return undefined
  }

  return {
    summary: summary || undefined,
    structure,
    emotionCurve,
    craftNotes
  }
}

export async function getSongs(): Promise<Song[]> {
  const songs = await readJsonFile<Song[]>('songs/index.json')
  return songs.map(sanitizeSong)
}

export async function getSong(slug: string): Promise<Song | undefined> {
  const songs = await getSongs()
  return songs.find((song) => song.slug === slug)
}

export async function getSongsByAlbum(albumSlug: string): Promise<Song[]> {
  const songs = await getSongs()
  return songs.filter((song) => song.albumSlug === albumSlug)
}

export async function getAlbums(): Promise<Album[]> {
  const albums = await readJsonFile<Album[]>('albums/index.json')
  return albums.map(sanitizeAlbum)
}

export async function getAlbum(slug: string): Promise<Album | undefined> {
  const albums = await getAlbums()
  return albums.find((album) => album.slug === slug)
}

export async function getTags(): Promise<Tag[]> {
  return readJsonFile<Tag[]>('tags/index.json')
}

export async function getTimeline(): Promise<TimelineEvent[]> {
  const timeline = await readJsonFile<TimelineEvent[]>('timeline/index.json')
  return timeline.map(sanitizeTimelineEvent)
}

export async function getSongDeepRead(slug: string): Promise<SongDeepRead | null> {
  if (typeof window === 'undefined' && !process.versions.node) {
    return null
  }
  const filePath = path.join(contentRoot, 'songs', 'deep-reads', `${slug}.md`)
  try {
    const [rawMarkdown, rawLyrics] = await Promise.all([
      fs.readFile(filePath, 'utf8'),
      readOptionalTextFile(path.join('songs', 'raw-lyrics', `${slug}.txt`))
    ])
    const { content, data } = matter(rawMarkdown)

    const mvUrl = typeof data.mvUrl === 'string' ? data.mvUrl.trim() : ''
    const mvTitle = sanitizeText(typeof data.mvTitle === 'string' ? data.mvTitle : '', '')
    const fullLyricsFromFrontmatter = sanitizeMultilineText(typeof data.fullLyrics === 'string' ? data.fullLyrics : '')

    return {
      content: sanitizeMultilineText(content),
      mvUrl: mvUrl || undefined,
      mvTitle: mvTitle || undefined,
      fullLyrics: rawLyrics || fullLyricsFromFrontmatter || undefined,
      lyricBlocks: parseStringArray(data.lyricBlocks),
      lyricInterpretations: parseInterpretationUnits(data.lyricInterpretations),
      songDesign: parseSongDesign(data.songDesign)
    }
  } catch {
    return null
  }
}
