import { describe, expect, it } from 'vitest'
import { POST } from '@/app/api/recommend/mood/route'

describe('POST /api/recommend/mood', () => {
  it('returns recommendations for a valid mood payload', async () => {
    const request = new Request('http://localhost/api/recommend/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood: '治愈' })
    })

    const response = await POST(request)
    const payload = await response.json() as { ok: boolean; recommendations?: unknown[] }

    expect(response.status).toBe(200)
    expect(payload.ok).toBe(true)
    expect(Array.isArray(payload.recommendations)).toBe(true)
    expect((payload.recommendations ?? []).length).toBeGreaterThan(0)
  })

  it('returns 400 for invalid json', async () => {
    const request = new Request('http://localhost/api/recommend/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{'
    })

    const response = await POST(request)
    const payload = await response.json() as { ok: boolean; code?: string }

    expect(response.status).toBe(400)
    expect(payload.ok).toBe(false)
    expect(payload.code).toBe('INVALID_JSON')
  })
})
