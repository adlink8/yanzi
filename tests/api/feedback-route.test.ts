import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@cloudflare/next-on-pages', () => ({
  getRequestContext: vi.fn(() => {
    throw new Error('no cf context')
  })
}))

import { POST } from '@/app/api/feedback/route'

const ORIGINAL = {
  token: process.env.GITHUB_FEEDBACK_TOKEN,
  owner: process.env.GITHUB_FEEDBACK_OWNER,
  repo: process.env.GITHUB_FEEDBACK_REPO
}

describe('POST /api/feedback', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
    process.env.GITHUB_FEEDBACK_TOKEN = 'ghp_test'
    process.env.GITHUB_FEEDBACK_OWNER = 'owner'
    process.env.GITHUB_FEEDBACK_REPO = 'repo'
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    if (ORIGINAL.token === undefined) delete process.env.GITHUB_FEEDBACK_TOKEN
    else process.env.GITHUB_FEEDBACK_TOKEN = ORIGINAL.token
    if (ORIGINAL.owner === undefined) delete process.env.GITHUB_FEEDBACK_OWNER
    else process.env.GITHUB_FEEDBACK_OWNER = ORIGINAL.owner
    if (ORIGINAL.repo === undefined) delete process.env.GITHUB_FEEDBACK_REPO
    else process.env.GITHUB_FEEDBACK_REPO = ORIGINAL.repo
  })

  it('returns 400 for invalid body', async () => {
    const request = new Request('http://localhost/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{'
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('honeypot returns soft success', async () => {
    const request = new Request('http://localhost/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        suggestion: '这是一条足够长的建议',
        website: 'http://spam.example'
      })
    })
    const response = await POST(request)
    const payload = await response.json() as { ok: boolean }
    expect(response.status).toBe(200)
    expect(payload.ok).toBe(true)
  })

  it('rejects short suggestions', async () => {
    const request = new Request('http://localhost/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suggestion: '短' })
    })
    const response = await POST(request)
    expect(response.status).toBe(400)
  })

  it('returns 503 when GitHub env is missing', async () => {
    delete process.env.GITHUB_FEEDBACK_TOKEN
    const request = new Request('http://localhost/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suggestion: '这是一条足够长的建议内容' })
    })
    const response = await POST(request)
    expect(response.status).toBe(503)
  })

  it('creates GitHub issue on success path', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ html_url: 'https://github.com/owner/repo/issues/1' })
    })
    vi.stubGlobal('fetch', fetchMock)

    const request = new Request('http://localhost/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'fan',
        suggestion: '建议补充某首歌曲的 MV 链接信息',
        pagePath: '/songs/tian-hei-hei'
      })
    })

    const response = await POST(request)
    const payload = await response.json() as { ok: boolean; issueUrl?: string }
    expect(response.status).toBe(200)
    expect(payload.ok).toBe(true)
    expect(payload.issueUrl).toContain('github.com')
    expect(fetchMock).toHaveBeenCalledOnce()
  })
})
