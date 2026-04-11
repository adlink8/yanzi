import type { Song } from '@/types/content'

function hashDate(dateKey: string): number {
  let hash = 0
  for (let index = 0; index < dateKey.length; index += 1) {
    hash = (hash * 31 + dateKey.charCodeAt(index)) % 1000000007
  }
  return hash
}

export function pickDailySong(songs: Song[], date = new Date()): Song | null {
  if (songs.length === 0) {
    return null
  }

  const preferred = songs.filter((song) => song.favoriteLevel === 'high' || song.hasDeepRead)
  const pool = preferred.length > 0 ? preferred : songs
  const dateKey = date.toISOString().slice(0, 10)
  const index = hashDate(dateKey) % pool.length
  return pool[index] ?? pool[0] ?? null
}

