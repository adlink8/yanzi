import type { Song } from '@/types/content'

export type MoodRecommendation = {
  song: Song
  score: number
  reasons: string[]
}

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function containsTerm(value: string, term: string): boolean {
  return value.toLowerCase().includes(term)
}

export function recommendSongsByMood(songs: Song[], mood: string): MoodRecommendation[] {
  const term = normalize(mood)

  if (!term) {
    return songs
      .filter((song) => song.favoriteLevel === 'high')
      .slice(0, 5)
      .map((song) => ({
        song,
        score: 1,
        reasons: ['站内优先回看']
      }))
  }

  const results = songs
    .map((song) => {
      let score = 0
      const reasons: string[] = []

      if (song.moodTags.some((tag) => normalize(tag) === term)) {
        score += 5
        reasons.push(`情绪标签命中：${mood}`)
      } else if (song.moodTags.some((tag) => containsTerm(tag, term) || containsTerm(term, normalize(tag)))) {
        score += 4
        reasons.push('情绪标签接近')
      }

      if (song.themeTags.some((tag) => containsTerm(tag, term) || containsTerm(term, normalize(tag)))) {
        score += 2
        reasons.push('主题标签相关')
      }

      if (song.keywords.some((keyword) => containsTerm(keyword, term) || containsTerm(term, normalize(keyword)))) {
        score += 2
        reasons.push('关键词相关')
      }

      if (containsTerm(song.summary, term) || containsTerm(song.title, term)) {
        score += 1
        reasons.push('摘要或标题提及')
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

  if (results.length > 0) {
    return results.slice(0, 6)
  }

  return songs
    .filter((song) => song.favoriteLevel === 'high' || song.status === 'ready')
    .slice(0, 6)
    .map((song) => ({
      song,
      score: 0.5,
      reasons: ['没有直接命中，返回站内优先歌曲']
    }))
}