import { NextResponse } from 'next/server'
import { createChatCompletion } from '@/lib/ai/client'
import { buildAlbumContext } from '@/lib/ai/context-builders'
import { getAiConfig } from '@/lib/ai/config'
import { buildAlbumSystemPrompt, buildAlbumUserPrompt } from '@/lib/ai/prompts'
import { getAlbum, getSongsByAlbum } from '@/lib/content'

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
        message: '请提供专辑 slug 和问题内容。'
      },
      { status: 400 }
    )
  }

  const album = await getAlbum(slug)

  if (!album) {
    return NextResponse.json(
      {
        ok: false,
        code: 'ALBUM_NOT_FOUND',
        message: '未找到对应专辑。'
      },
      { status: 404 }
    )
  }

  const songs = await getSongsByAlbum(album.slug)
  const context = buildAlbumContext(album, songs)

  try {
    const answer = await createChatCompletion([
      { role: 'system', content: buildAlbumSystemPrompt() },
      { role: 'user', content: buildAlbumUserPrompt(context, question) }
    ])

    return NextResponse.json({
      ok: true,
      answer,
      provider: config.provider,
      model: config.model,
      album: {
        slug: album.slug,
        title: album.title
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