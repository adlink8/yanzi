import { type NextRequest } from 'next/server'
import { buildSongPrompt } from '@/lib/ai/context-builders'
import { createChatStream } from '@/lib/ai/client'
import { getSongStatic, getAlbumStatic } from '@/lib/content/static-client'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const origin = new URL(request.url).origin
    const { slug, question } = await request.json()
    if (!slug || !question) {
      return new Response('Missing slug or question', { status: 400 })
    }

    const song = await getSongStatic(slug, origin)
    if (!song) {
      return new Response('Song not found', { status: 404 })
    }

    const album = await getAlbumStatic(song.albumSlug, origin)
    const messages = buildSongPrompt(song, album || undefined, question)
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
