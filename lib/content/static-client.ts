import type { Album, Song } from '@/types/content'
import songsData from '@/content/songs/index.json'
import albumsData from '@/content/albums/index.json'

/**
 * A lightweight data fetcher for Edge Runtime.
 * IMPORTANT: Do not fetch "/content/*.json" over HTTP in production.
 * Cloudflare Pages output does not expose the repository's /content directory as static files.
 * Keep using bundled JSON imports here to avoid runtime 404/request failures.
 */

export async function getSongsStatic(baseUrl?: string): Promise<Song[]> {
  void baseUrl
  return songsData as Song[]
}

export async function getSongStatic(slug: string, baseUrl?: string): Promise<Song | undefined> {
  const songs = await getSongsStatic(baseUrl)
  return songs.find(s => s.slug === slug)
}

export async function getAlbumsStatic(baseUrl?: string): Promise<Album[]> {
  void baseUrl
  return albumsData as Album[]
}

export async function getAlbumStatic(slug: string, baseUrl?: string): Promise<Album | undefined> {
  const albums = await getAlbumsStatic(baseUrl)
  return albums.find(a => a.slug === slug)
}

export async function getSongsByAlbumStatic(albumSlug: string, baseUrl?: string): Promise<Song[]> {
  const songs = await getSongsStatic(baseUrl)
  return songs.filter(s => s.albumSlug === albumSlug)
}
