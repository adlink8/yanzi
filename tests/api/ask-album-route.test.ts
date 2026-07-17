import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/ai/client', () => ({
  createChatStream: vi.fn()
}))

vi.mock('@/lib/content/static-client', () => ({
  getAlbumStatic: vi.fn(),
  getSongsByAlbumStatic: vi.fn()
}))

import { POST } from '@/app/api/ask/album/route'
import { createChatStream } from '@/lib/ai/client'
import { getAlbumStatic, getSongsByAlbumStatic } from '@/lib/content/static-client'
import { makeAlbum, makeSong } from '../helpers/fixtures'

const createChatStreamMock = vi.mocked(createChatStream)
const getAlbumStaticMock = vi.mocked(getAlbumStatic)
const getSongsByAlbumStaticMock = vi.mocked(getSongsByAlbumStatic)

describe('POST /api/ask/album', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 when slug or question missing', async () => {
    const request = new Request('http://localhost/api/ask/album', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: '讲讲这张专辑' })
    }) as any

    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('returns 404 when album is not found', async () => {
    getAlbumStaticMock.mockResolvedValue(undefined)
    const request = new Request('http://localhost/api/ask/album', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'missing', question: '讲讲这张专辑' })
    }) as any

    const response = await POST(request)
    expect(response.status).toBe(404)
  })

  it('streams when album exists and AI client succeeds', async () => {
    getAlbumStaticMock.mockResolvedValue(makeAlbum())
    getSongsByAlbumStaticMock.mockResolvedValue([makeSong()])
    createChatStreamMock.mockResolvedValue(new ReadableStream() as any)

    const request = new Request('http://localhost/api/ask/album', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'yanzi', question: '讲讲这张专辑' })
    }) as any

    const response = await POST(request)
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toContain('text/event-stream')
  })
})
