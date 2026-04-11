import { type NextRequest } from 'next/server'
import { buildAlbumPrompt } from '@/lib/ai/context-builders'
import { createChatStream } from '@/lib/ai/client'
import { getAlbum, getSongsByAlbum } from '@/lib/content'

export async function POST(request: NextRequest) {
  try {
    const { slug, question } = await request.json()
    if (!slug || !question) {
      return new Response('Missing slug or question', { status: 400 })
    }

    const album = await getAlbum(slug)
    if (!album) {
      return new Response('Album not found', { status: 404 })
    }

    const songs = await getSongsByAlbum(slug)
    const messages = buildAlbumPrompt(album, songs, question)
    const stream = await createChatStream(messages)

    if (!stream) {
      return new Response('Failed to create stream', { status: 500 })
    }

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('AI Error:', error)
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
