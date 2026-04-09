import { describe, expect, it } from 'vitest'
import { recommendSongsByMood } from '@/lib/recommend/mood'
import type { Song } from '@/types/content'

const songs: Song[] = [
  {
    slug: 'tian-hei-hei',
    title: '天黑黑',
    albumSlug: 'yanzi',
    releaseYear: 2000,
    era: '出道起点',
    trackNumber: 1,
    moodTags: ['成长', '想念'],
    themeTags: ['青春'],
    keywords: ['童年'],
    summary: '把长大后的失落和小时候的安全感并置。',
    favoriteLevel: 'high',
    hasDeepRead: true,
    relatedSongs: [],
    status: 'ready'
  },
  {
    slug: 'wo-bu-nan-guo',
    title: '我不难过',
    albumSlug: 'wei-wan-cheng',
    releaseYear: 2003,
    era: '成熟过渡',
    trackNumber: 5,
    moodTags: ['释然'],
    themeTags: ['关系变化'],
    keywords: ['告别'],
    summary: '冷静地说分开。',
    favoriteLevel: 'medium',
    hasDeepRead: true,
    relatedSongs: [],
    status: 'ready'
  }
]

describe('recommendSongsByMood', () => {
  it('returns strongest mood matches first', () => {
    const result = recommendSongsByMood(songs, '成长')
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]?.song.slug).toBe('tian-hei-hei')
    expect(result[0]?.reasons.some((reason) => reason.includes('情绪标签'))).toBe(true)
  })

  it('returns high-favorite songs when mood is empty', () => {
    const result = recommendSongsByMood(songs, '')
    expect(result).toHaveLength(1)
    expect(result[0]?.song.slug).toBe('tian-hei-hei')
  })
})
