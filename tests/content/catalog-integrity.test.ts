import { describe, expect, it } from 'vitest'
import songsData from '@/content/songs/index.json'
import albumsData from '@/content/albums/index.json'
import type { Album, Song } from '@/types/content'

const songs = songsData as Song[]
const albums = albumsData as Album[]

describe('catalog integrity (live content)', () => {
  it('has unique song and album slugs', () => {
    const songSlugs = songs.map((s) => s.slug)
    const albumSlugs = albums.map((a) => a.slug)
    expect(new Set(songSlugs).size).toBe(songSlugs.length)
    expect(new Set(albumSlugs).size).toBe(albumSlugs.length)
  })

  it('every song.albumSlug points to an existing album', () => {
    const albumSet = new Set(albums.map((a) => a.slug))
    const orphans = songs.filter((s) => !albumSet.has(s.albumSlug))
    expect(orphans).toEqual([])
  })

  it('album.songSlugs matches songs filtered by albumSlug', () => {
    const drifts: string[] = []
    for (const album of albums) {
      const listed = [...(album.songSlugs || [])].sort()
      const actual = songs
        .filter((s) => s.albumSlug === album.slug)
        .map((s) => s.slug)
        .sort()
      if (JSON.stringify(listed) !== JSON.stringify(actual)) {
        drifts.push(album.slug)
      }
    }
    expect(drifts).toEqual([])
  })

  it('every song has required core fields', () => {
    for (const song of songs) {
      expect(song.slug).toBeTruthy()
      expect(song.title).toBeTruthy()
      expect(song.albumSlug).toBeTruthy()
      expect(song.status).toMatch(/^(draft|ready)$/)
      expect(Array.isArray(song.moodTags)).toBe(true)
      expect(Array.isArray(song.themeTags)).toBe(true)
    }
  })
})
