import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/ai/client', () => ({
  createChatStream: vi.fn()
}))

vi.mock('@/lib/content/static-client', () => ({
  getSongStatic: vi.fn(),
  getAlbumStatic: vi.fn()
}))

import { POST } from '@/app/api/ask/song/route'
import { createChatStream } from '@/lib/ai/client'
import { getAlbumStatic, getSongStatic } from '@/lib/content/static-client'
import { makeAlbum, makeSong } from '../helpers/fixtures'

const createChatStreamMock = vi.mocked(createChatStream)
const getSongStaticMock = vi.mocked(getSongStatic)
const getAlbumStaticMock = vi.mocked(getAlbumStatic)

describe('POST /api/ask/song', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 400 when slug or question missing', async () => {
    const request = new Request('http://localhost/api/ask/song', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'tian-hei-hei' })
    }) as any

    const response = await POST(request)
    expect(response.status).toBe(400)
    expect(await response.text()).toContain('Missing')
  })

  it('returns 404 when song is not found', async () => {
    getSongStaticMock.mockResolvedValue(undefined)
    const request = new Request('http://localhost/api/ask/song', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'missing', question: '讲讲这首歌' })
    }) as any

    const response = await POST(request)
    expect(response.status).toBe(404)
  })

  it('streams when song exists and AI client succeeds', async () => {
    getSongStaticMock.mockResolvedValue(makeSong())
    getAlbumStaticMock.mockResolvedValue(makeAlbum())
    const body = new ReadableStream()
    createChatStreamMock.mockResolvedValue(body as any)

    const request = new Request('http://localhost/api/ask/song', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'tian-hei-hei', question: '讲讲这首歌' })
    }) as any

    const response = await POST(request)
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toContain('text/event-stream')
    expect(createChatStreamMock).toHaveBeenCalledOnce()
  })

  it('returns 500 JSON when AI client throws', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    getSongStaticMock.mockResolvedValue(makeSong())
    getAlbumStaticMock.mockResolvedValue(makeAlbum())
    createChatStreamMock.mockRejectedValue(new Error('AI_NOT_CONFIGURED'))

    const request = new Request('http://localhost/api/ask/song', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: 'tian-hei-hei', question: '讲讲这首歌' })
    }) as any

    const response = await POST(request)
    const payload = await response.json() as { error: string }
    expect(response.status).toBe(500)
    expect(payload.error).toBe('AI_NOT_CONFIGURED')
    consoleSpy.mockRestore()
  })
})
