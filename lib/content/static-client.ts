import type { Album, Song } from '@/types/content'

/**
 * A lightweight data fetcher for Edge Runtime / Client side.
 * It avoids using node:fs and node:path.
 * In production, it can fetch from pre-generated static JSON files.
 */

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, '')
}

function resolveUrl(path: string, baseUrl?: string): string {
  const envBaseUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || ''
  const resolvedBaseUrl = baseUrl?.trim() || envBaseUrl

  if (!resolvedBaseUrl) {
    return path
  }

  return `${normalizeBaseUrl(resolvedBaseUrl)}${path}`
}

export async function getSongsStatic(baseUrl?: string): Promise<Song[]> {
  const res = await fetch(resolveUrl('/content/songs/index.json', baseUrl))
  if (!res.ok) return []
  return res.json()
}

export async function getSongStatic(slug: string, baseUrl?: string): Promise<Song | undefined> {
  const songs = await getSongsStatic(baseUrl)
  return songs.find(s => s.slug === slug)
}

export async function getAlbumsStatic(baseUrl?: string): Promise<Album[]> {
  const res = await fetch(resolveUrl('/content/albums/index.json', baseUrl))
  if (!res.ok) return []
  return res.json()
}

export async function getAlbumStatic(slug: string, baseUrl?: string): Promise<Album | undefined> {
  const albums = await getAlbumsStatic(baseUrl)
  return albums.find(a => a.slug === slug)
}

export async function getSongsByAlbumStatic(albumSlug: string, baseUrl?: string): Promise<Song[]> {
  const songs = await getSongsStatic(baseUrl)
  return songs.filter(s => s.albumSlug === albumSlug)
}
