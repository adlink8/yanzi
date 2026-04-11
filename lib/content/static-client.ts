import type { Album, Song } from '@/types/content'

/**
 * A lightweight data fetcher for Edge Runtime / Client side.
 * It avoids using node:fs and node:path.
 * In production, it can fetch from pre-generated static JSON files.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || ''

export async function getSongsStatic(): Promise<Song[]> {
  const res = await fetch(`${BASE_URL}/content/songs/index.json`)
  if (!res.ok) return []
  return res.json()
}

export async function getSongStatic(slug: string): Promise<Song | undefined> {
  const songs = await getSongsStatic()
  return songs.find(s => s.slug === slug)
}

export async function getAlbumsStatic(): Promise<Album[]> {
  const res = await fetch(`${BASE_URL}/content/albums/index.json`)
  if (!res.ok) return []
  return res.json()
}

export async function getAlbumStatic(slug: string): Promise<Album | undefined> {
  const albums = await getAlbumsStatic()
  return albums.find(a => a.slug === slug)
}

export async function getSongsByAlbumStatic(albumSlug: string): Promise<Song[]> {
  const songs = await getSongsStatic()
  return songs.filter(s => s.albumSlug === albumSlug)
}
