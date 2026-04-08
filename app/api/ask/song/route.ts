import { NextResponse } from 'next/server'
import { createChatCompletion } from '@/lib/ai/client'
import { buildSongContext } from '@/lib/ai/context-builders'
import { getAiConfig } from '@/lib/ai/config'
import { buildSongSystemPrompt, buildSongUserPrompt } from '@/lib/ai/prompts'
import { getAlbum, getSong, getSongDeepRead } from '@/lib/content'

export async function POST(request: Request) {
  const config = getAiConfig()
  const body = (await request.json().catch(() => null)) as { slug?: string; question?: string } | null
  const slug = body?.slug?.trim()
  const question = body?.question?.trim()

  if (!slug || !question) {
    return NextResponse.json(
      {
        ok: false,
        code: 'INVALID_REQUEST',
        message: '请提供歌曲 slug 和问题内容。'
      },
      { status: 400 }
    )
  }

  const song = await getSong(slug)

  if (!song) {
    return NextResponse.json(
      {
        ok: false,
        code: 'SONG_NOT_FOUND',
        message: '未找到对应歌曲。'
      },
      { status: 404 }
    )
  }

  const [album, deepRead] = await Promise.all([getAlbum(song.albumSlug), getSongDeepRead(song.slug)])
  const context = buildSongContext(song, album, deepRead)

  try {
    const answer = await createChatCompletion([
      { role: 'system', content: buildSongSystemPrompt() },
      { role: 'user', content: buildSongUserPrompt(context, question) }
    ])

    return NextResponse.json({
      ok: true,
      answer,
      provider: config.provider,
      model: config.model,
      song: {
        slug: song.slug,
        title: song.title
      }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI_REQUEST_FAILED'

    return NextResponse.json(
      {
        ok: false,
        code: 'AI_REQUEST_FAILED',
        message,
        provider: config.provider,
        model: config.model
      },
      { status: 500 }
    )
  }
}