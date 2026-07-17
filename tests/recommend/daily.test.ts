import { describe, expect, it } from 'vitest'
import { pickDailySong } from '@/lib/recommend/daily'
import { makeSong } from '../helpers/fixtures'

describe('pickDailySong', () => {
  it('returns null for empty catalog', () => {
    expect(pickDailySong([])).toBeNull()
  })

  it('prefers high-favorite / deep-read pool and is stable for a date', () => {
    const songs = [
      makeSong({ slug: 'low-1', favoriteLevel: 'low', hasDeepRead: false, status: 'ready' }),
      makeSong({ slug: 'high-1', favoriteLevel: 'high', hasDeepRead: true, status: 'ready' }),
      makeSong({ slug: 'high-2', favoriteLevel: 'high', hasDeepRead: true, status: 'ready' })
    ]

    const date = new Date('2026-07-17T12:00:00.000Z')
    const a = pickDailySong(songs, date)
    const b = pickDailySong(songs, date)

    expect(a?.slug).toBe(b?.slug)
    expect(['high-1', 'high-2']).toContain(a?.slug)
  })

  it('falls back to full list when preferred pool is empty', () => {
    const songs = [
      makeSong({ slug: 'only', favoriteLevel: 'low', hasDeepRead: false })
    ]
    expect(pickDailySong(songs, new Date('2020-01-01T00:00:00.000Z'))?.slug).toBe('only')
  })
})
