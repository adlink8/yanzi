import { NextResponse } from 'next/server'
import { getSongs } from '@/lib/content'
import { recommendSongsByMood } from '@/lib/recommend/mood'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { mood?: string } | null
  const mood = body?.mood?.trim() ?? ''

  const songs = await getSongs()
  const recommendations = recommendSongsByMood(songs, mood)

  return NextResponse.json({
    ok: true,
    mood,
    recommendations: recommendations.map((item) => ({
      score: item.score,
      reasons: item.reasons,
      song: {
        slug: item.song.slug,
        title: item.song.title,
        summary: item.song.summary,
        moodTags: item.song.moodTags,
        themeTags: item.song.themeTags,
        favoriteLevel: item.song.favoriteLevel,
        hasDeepRead: item.song.hasDeepRead
      }
    }))
  })
}