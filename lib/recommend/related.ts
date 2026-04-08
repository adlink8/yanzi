import type { Song } from '@/types/content'

export type RelatedSongRecommendation = {
  song: Song
  score: number
  reasons: string[]
}

function intersectionCount(left: string[], right: string[]): number {
  const rightSet = new Set(right)
  let count = 0
  for (const item of left) {
    if (rightSet.has(item)) {
      count += 1
    }
  }
  return count
}

export function recommendRelatedSongs(currentSong: Song, songs: Song[], limit = 4): RelatedSongRecommendation[] {
  return songs
    .filter((song) => song.slug !== currentSong.slug)
    .map((song) => {
      let score = 0
      const reasons: string[] = []

      if (currentSong.relatedSongs.includes(song.slug) || song.relatedSongs.includes(currentSong.slug)) {
        score += 5
        reasons.push('站内已标记为关联歌曲')
      }

      if (song.albumSlug === currentSong.albumSlug) {
        score += 3
        reasons.push('来自同一张专辑')
      }

      const moodOverlap = intersectionCount(currentSong.moodTags, song.moodTags)
      if (moodOverlap > 0) {
        score += moodOverlap * 2
        reasons.push(`共享 ${moodOverlap} 个情绪标签`)
      }

      const themeOverlap = intersectionCount(currentSong.themeTags, song.themeTags)
      if (themeOverlap > 0) {
        score += themeOverlap * 2
        reasons.push(`共享 ${themeOverlap} 个主题标签`)
      }

      const keywordOverlap = intersectionCount(currentSong.keywords, song.keywords)
      if (keywordOverlap > 0) {
        score += keywordOverlap
        reasons.push('关键词有交集')
      }

      if (song.favoriteLevel === 'high') {
        score += 0.5
      }

      return {
        song,
        score,
        reasons
      }
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
}