import { describe, expect, it } from 'vitest'
import { recommendRelatedSongs } from '@/lib/recommend/related'
import { makeSong } from '../helpers/fixtures'

describe('recommendRelatedSongs', () => {
  const current = makeSong({
    slug: 'a',
    albumSlug: 'yanzi',
    moodTags: ['成长'],
    themeTags: ['青春'],
    keywords: ['童年'],
    relatedSongs: ['b'],
    favoriteLevel: 'medium'
  })

  const songs = [
    current,
    makeSong({
      slug: 'b',
      albumSlug: 'other',
      moodTags: [],
      themeTags: [],
      keywords: [],
      relatedSongs: [],
      favoriteLevel: 'low'
    }),
    makeSong({
      slug: 'c',
      albumSlug: 'yanzi',
      moodTags: ['成长'],
      themeTags: ['青春'],
      keywords: ['童年'],
      relatedSongs: [],
      favoriteLevel: 'high'
    }),
    makeSong({
      slug: 'd',
      albumSlug: 'x',
      moodTags: ['释然'],
      themeTags: ['告别'],
      keywords: ['分开'],
      relatedSongs: [],
      favoriteLevel: 'low'
    })
  ]

  it('excludes the current song and ranks multi-signal matches higher', () => {
    const result = recommendRelatedSongs(current, songs, 4)
    const slugs = result.map((item) => item.song.slug)

    expect(slugs).not.toContain('a')
    // c shares album + tags + keywords + high favorite (> pure related link score of b)
    expect(slugs[0]).toBe('c')
    expect(slugs).toContain('b')
    expect(result.every((item) => item.score > 0)).toBe(true)
  })

  it('returns empty when candidates share no signals', () => {
    const alone = makeSong({
      slug: 'solo',
      albumSlug: 'album-a',
      relatedSongs: [],
      moodTags: [],
      themeTags: [],
      keywords: [],
      favoriteLevel: 'low'
    })
    const others = [
      makeSong({
        slug: 'z',
        albumSlug: 'album-z',
        relatedSongs: [],
        moodTags: [],
        themeTags: [],
        keywords: [],
        favoriteLevel: 'low'
      })
    ]
    expect(recommendRelatedSongs(alone, [alone, ...others], 2)).toHaveLength(0)
  })
})
