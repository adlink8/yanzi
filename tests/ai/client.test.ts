import { afterEach, describe, expect, it, vi } from 'vitest'
import { createChatCompletion, createChatStream } from '@/lib/ai/client'

const ORIGINAL = {
  baseUrl: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL
}

afterEach(() => {
  vi.unstubAllGlobals()
  if (ORIGINAL.baseUrl === undefined) delete process.env.OPENAI_BASE_URL
  else process.env.OPENAI_BASE_URL = ORIGINAL.baseUrl
  if (ORIGINAL.apiKey === undefined) delete process.env.OPENAI_API_KEY
  else process.env.OPENAI_API_KEY = ORIGINAL.apiKey
  if (ORIGINAL.model === undefined) delete process.env.OPENAI_MODEL
  else process.env.OPENAI_MODEL = ORIGINAL.model
})

describe('AI client', () => {
  it('throws AI_NOT_CONFIGURED without key', async () => {
    delete process.env.OPENAI_API_KEY
    await expect(
      createChatCompletion([{ role: 'user', content: 'hi' }])
    ).rejects.toThrow('AI_NOT_CONFIGURED')
    await expect(
      createChatStream([{ role: 'user', content: 'hi' }])
    ).rejects.toThrow('AI_NOT_CONFIGURED')
  })

  it('createChatCompletion returns content on success', async () => {
    process.env.OPENAI_API_KEY = 'sk-test'
    process.env.OPENAI_BASE_URL = 'https://api.openai.com/v1'
    process.env.OPENAI_MODEL = 'gpt-4o-mini'

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: '  你好  ' } }]
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    const text = await createChatCompletion([{ role: 'user', content: 'hi' }])
    expect(text).toBe('你好')
    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://api.openai.com/v1/chat/completions')
    expect(init.method).toBe('POST')
  })

  it('createChatStream returns body on success', async () => {
    process.env.OPENAI_API_KEY = 'sk-test'
    const body = new ReadableStream()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      body
    })
    vi.stubGlobal('fetch', fetchMock)

    const stream = await createChatStream([{ role: 'user', content: 'hi' }])
    expect(stream).toBe(body)
  })

  it('surfaces provider error messages', async () => {
    process.env.OPENAI_API_KEY = 'sk-test'
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: { message: 'quota exceeded' } })
      })
    )

    await expect(
      createChatCompletion([{ role: 'user', content: 'hi' }])
    ).rejects.toThrow('quota exceeded')
  })
})
