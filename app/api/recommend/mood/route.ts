import { NextResponse } from 'next/server'
import songsData from '@/content/songs/index.json'
import { recommendSongsByMood } from '@/lib/recommend/mood'
import type { Song } from '@/types/content'

export const runtime = 'edge'

type RequestPayload = {
  mood?: unknown
}

const songs = songsData as Song[]

export async function POST(request: Request) {
  let payload: RequestPayload = {}
  try {
    payload = (await request.json()) as RequestPayload
  } catch {
    return NextResponse.json(
      {
        ok: false,
        code: 'INVALID_JSON',
        message: '请求体不是有效 JSON。'
      },
      { status: 400 }
    )
  }

  const mood = typeof payload.mood === 'string' ? payload.mood.trim() : ''
  const recommendations = recommendSongsByMood(songs, mood)

  return NextResponse.json({
    ok: true,
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
