# Testing Patterns

**Analysis Date:** 2026-07-17

## Test Framework

**Runner:**
- Vitest `^4.1.4` (devDependency)
- Config: `vitest.config.ts`

**Assertion Library:**
- Vitest built-in `expect` (no separate Chai/Jest install)

**Environment:**
- `environment: 'node'`
- `include: ['tests/**/*.test.ts']`
- Path alias `@` → `process.cwd()` (same as app `@/*`)

**Run Commands:**
```bash
npm test              # vitest run — all tests once
npm run test:watch    # vitest — watch mode
# Coverage: not configured (no coverage script or thresholds in package.json / vitest.config.ts)
```

## Test File Organization

**Location:**
- Separate `tests/` tree (not co-located next to source files)

**Naming:**
- `*.test.ts` only
- Unit: domain-aligned name under feature folder — `tests/recommend/mood.test.ts`
- Route/handler: descriptive route name — `tests/api/recommend-mood-route.test.ts`

**Structure:**
```
tests/
  api/
    recommend-mood-route.test.ts   # import POST from app/api/.../route
  recommend/
    mood.test.ts                   # pure lib/recommend logic
```

**Prescriptive scope (from AGENTS.md + current practice):**
- Add or update tests for any change in `lib/recommend/*` and `app/api/*` behavior
- Prefer behavior assertions (status, payload shape, ranking order) over implementation details

## Test Structure

**Suite Organization:**
```typescript
import { describe, expect, it } from 'vitest'
import { recommendSongsByMood } from '@/lib/recommend/mood'
import type { Song } from '@/types/content'

const songs: Song[] = [
  {
    slug: 'tian-hei-hei',
    title: '天黑黑',
    albumSlug: 'yanzi',
    // ...minimal Song fields required by the function under test
    moodTags: ['成长', '想念'],
    themeTags: ['青春'],
    keywords: ['童年'],
    summary: '…',
    favoriteLevel: 'high',
    hasDeepRead: true,
    relatedSongs: [],
    status: 'ready'
  }
]

describe('recommendSongsByMood', () => {
  it('returns strongest mood matches first', () => {
    const result = recommendSongsByMood(songs, '成长')
    expect(result.length).toBeGreaterThan(0)
    expect(result[0]?.song.slug).toBe('tian-hei-hei')
    expect(result[0]?.reasons.some((reason) => reason.includes('情绪标签'))).toBe(true)
  })

  it('returns high-favorite songs when mood is empty', () => {
    const result = recommendSongsByMood(songs, '')
    expect(result).toHaveLength(1)
    expect(result[0]?.song.slug).toBe('tian-hei-hei')
  })
})
```

**Patterns:**
- **Setup:** inline fixture arrays at module top of the test file (no shared fixtures package yet)
- **Teardown:** none used; tests are pure / request-scoped
- **Suite name:** function name or HTTP method + path (`POST /api/recommend/mood`)
- **Case name:** outcome-focused English sentences
- **Assertions:** status codes, `ok` flags, array length, first-ranked slug, error `code` strings

## Mocking

**Framework:** Vitest supports `vi.mock` / `vi.fn` / `vi.spyOn`, but **current tests do not mock**

**Patterns:**
```typescript
// Not used today. When needed for external I/O, prefer:
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/ai/client', () => ({
  createChatStream: vi.fn(async () => null)
}))
```

**What to Mock:**
- Network calls (GitHub API, OpenAI/Ollama) when testing ask/feedback routes
- Cloudflare bindings (`getRequestContext`, R2) when adding feedback route tests
- Time (`Date`) only if testing `pickDailySong` determinism with fixed dates — or pass explicit `date` argument (preferred; API already allows it)

**What NOT to Mock:**
- Pure scoring in `lib/recommend/*` — use real fixtures
- Small JSON-backed handlers that only transform catalog data (mood recommend route uses real `content/songs/index.json`)
- Type definitions and pure sanitize helpers when under unit test

## Fixtures and Factories

**Test Data:**
```typescript
// Minimal Song objects with required fields from types/content.ts
const songs: Song[] = [
  {
    slug: 'tian-hei-hei',
    title: '天黑黑',
    albumSlug: 'yanzi',
    releaseYear: 2000,
    era: '出道起点',
    trackNumber: 1,
    moodTags: ['成长', '想念'],
    themeTags: ['青春'],
    keywords: ['童年'],
    summary: '把长大后的失落和小时候的安全感并置。',
    favoriteLevel: 'high',
    hasDeepRead: true,
    relatedSongs: [],
    status: 'ready'
  }
]
```

**Location:**
- Inline in the test file (current pattern)
- Production catalog: `content/songs/index.json` is loaded by route tests via route imports (integration-style)

**Prescriptive:**
- Prefer minimal typed fixtures over full catalog copies for unit tests
- Keep slugs realistic kebab-case pinyin so failures match product data
- For API tests, build `Request` objects with URL, method, headers, and body

## Coverage

**Requirements:** None enforced (no `coverage` block in Vitest config, no CI threshold script)

**View Coverage:**
```bash
npx vitest run --coverage   # only after adding @vitest/coverage-v8 (or similar); not set up yet
```

**Practical minimum (prescriptive):**
- Every new export in `lib/recommend/*` gets at least ranking / edge-case cases (empty input, no match, ties preference)
- Every changed API route gets happy path + validation failure path

## Test Types

**Unit Tests:**
- Pure functions in `lib/recommend/*` (and similarly pure helpers)
- No DOM / React Testing Library in use
- Example: mood scoring order and empty-mood fallback

**Integration Tests:**
- Direct import of route `POST` handlers with `new Request(...)`
- Assert HTTP status + JSON body without starting Next server
```typescript
import { POST } from '@/app/api/recommend/mood/route'

const request = new Request('http://localhost/api/recommend/mood', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ mood: '治愈' })
})
const response = await POST(request)
const payload = await response.json() as { ok: boolean; recommendations?: unknown[] }
expect(response.status).toBe(200)
expect(payload.ok).toBe(true)
```

**E2E Tests:**
- Not used (no Playwright/Cypress)

**Content quality (related, not Vitest):**
- Editorial/content gates live as Node scripts, not unit tests:
  - `npm run gate:content`
  - `npm run audit:content`
  - `npm run audit:catalog`
- Run these when changing catalog/deep-read content; do not replace them with Vitest unless adding pure logic

## Common Patterns

**Async Testing:**
```typescript
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
```

**Error Testing:**
```typescript
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
```

**Casting payloads:**
- Use `as { ok: boolean; ... }` on `response.json()` results rather than shared API schema package
- Prefer asserting public contract fields (`ok`, `code`, `recommendations`) over private internals

**Gaps to close when touching related code:**
- No tests yet for `lib/recommend/related.ts`, `lib/recommend/daily.ts`
- No tests yet for `app/api/ask/*`, `app/api/feedback/route.ts`
- No component / React tests
- When adding those, follow the same `tests/` layout and behavior-first style

**Before PR (from AGENTS.md):**
```bash
npm test
npm run build
# if deployment-related:
npm run build:cf
```

---

*Testing analysis: 2026-07-17*
