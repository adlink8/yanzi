# Coding Conventions

**Analysis Date:** 2026-07-17

## Naming Patterns

**Files:**
- Source modules: `kebab-case.ts` / `kebab-case.tsx` (e.g. `mood-recommender.tsx`, `static-client.ts`, `context-builders.ts`)
- App Router pages/routes: fixed Next.js names — `page.tsx`, `layout.tsx`, `route.ts`, `globals.css`
- Dynamic segments: `[slug]/` under `app/songs/` and `app/albums/`
- Domain types: `types/content.ts` (shared content models)
- Content assets: kebab-case **pinyin** slugs for songs/albums — e.g. `tian-hei-hei`, `wo-huai-nian-de`, `yanzi`, `ni-guang`
- Deep reads / lyrics: `content/songs/deep-reads/{slug}.md`, `content/songs/raw-lyrics/{slug}.txt`
- Tests: mirror domain under `tests/`, suffix `.test.ts` (e.g. `tests/recommend/mood.test.ts`, `tests/api/recommend-mood-route.test.ts`)
- Scripts: `scripts/*.mjs` (Node ESM maintenance tools)

**Functions:**
- Named exports, verb-first camelCase: `getSongs`, `recommendSongsByMood`, `buildSongPrompt`, `sanitizeText`, `pickDailySong`
- Content loaders: `getX` (Node/fs path) vs `getXStatic` (edge-safe JSON import path)
- AI helpers: `createChatCompletion`, `createChatStream`, `build*Context`, `build*Prompt`
- React components: PascalCase named exports matching file purpose — `MoodRecommender`, `SongAiPanel`, `ThemeProvider`
- Event handlers in components: `handleRecommend`, `handleAsk`, `handleSubmit`
- Internal pure helpers stay unexported when local: `normalize`, `containsTerm`, `hashDate`, `cleanText`

**Variables:**
- camelCase for locals and props: `moodTags`, `albumSlug`, `hasDeepRead`, `canSubmit`
- Boolean prefixes: `hasOverview`, `hasLineByLine`, `loading`, `asked`
- Constants: UPPER_SNAKE for module-level defaults (`DEFAULT_BASE_URL`, `DEFAULT_MODEL`, `PLACEHOLDER_MARKERS`)
- Comparator params often `left` / `right` in sort callbacks

**Types:**
- `export type` (not `interface`) for domain and DTO shapes: `Song`, `Album`, `MoodRecommendation`, `ChatMessage`, `AiConfig`
- Request/body shapes colocated with routes: `RequestPayload`, `FeedbackBody`
- Props: `SongAiPanelProps`, context: `ThemeContextType`
- Union string literals for enums: `favoriteLevel?: 'low' | 'medium' | 'high'`, `status: 'draft' | 'ready'`, `BackgroundMode = 'pure' | 'artist' | 'archive'`
- Prefer `type` imports: `import type { Song } from '@/types/content'`

## Code Style

**Formatting:**
- No Prettier config in repo; style is enforced by existing code consistency
- **2-space indentation**
- **Single quotes** for strings
- **No semicolons**
- Trailing commas common in multi-line objects/arrays
- Prefer concise early returns over deep nesting

**Linting:**
- `npm run lint` → `next lint` (Next.js ESLint integration)
- No standalone `eslint.config.*` / `.eslintrc` in repo root
- TypeScript: `strict: true` in `tsconfig.json`; `allowJs: false`

**TypeScript / Next:**
- Path alias `@/*` → project root (`tsconfig.json` + Vitest alias)
- `experimental.typedRoutes: true` in `next.config.mjs` — cast hrefs as `Route` when building dynamic paths
- Client components must start with `'use client'`
- Edge API routes export `export const runtime = 'edge'`
- Static catalog pages use `export const dynamic = 'force-static'` and `dynamicParams = false` with `generateStaticParams`

## Import Organization

**Order (observed):**
1. Framework / React (`'use client'`, `next/*`, `react`)
2. Node built-ins when needed (`node:fs`, `node:path`)
3. Third-party packages (`gray-matter`, `marked`, `@cloudflare/next-on-pages`)
4. Internal `@/` modules — types, lib, components, content JSON
5. Relative imports only when truly local (rare; prefer `@/`)

**Path Aliases:**
- `@/` is the only alias — e.g. `@/lib/recommend/mood`, `@/types/content`, `@/content/songs/index.json`, `@/components/song/song-ai-panel`
- Vitest mirrors alias: `resolve.alias['@'] = process.cwd()` in `vitest.config.ts`

**Import style:**
- Named exports preferred; no barrel `index.ts` re-exports under `components/` or `lib/recommend/`
- `lib/content/index.ts` is the content module entry (functions live in that file + sibling modules)
- Prefer `import type` for type-only imports

## Error Handling

**Patterns:**

1. **API JSON routes (structured):** return typed error payloads with HTTP status
```typescript
// app/api/recommend/mood/route.ts
try {
  payload = (await request.json()) as RequestPayload
} catch {
  return NextResponse.json(
    { ok: false, code: 'INVALID_JSON', message: '请求体不是有效 JSON。' },
    { status: 400 }
  )
}
```

2. **Success envelope:** prefer `{ ok: true, ...data }` / `{ ok: false, message, code? }` for JSON APIs (`mood`, `feedback`)

3. **Streaming AI routes:** plain `Response` with status text or JSON error body; wrap outer logic in try/catch
```typescript
// app/api/ask/song/route.ts
if (!slug || !question) {
  return new Response('Missing slug or question', { status: 400 })
}
// ...
catch (error: any) {
  console.error('AI Error:', error)
  return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

4. **Domain/lib throws:** AI client throws machine-readable codes: `AI_NOT_CONFIGURED`, `AI_REQUEST_FAILED`, `AI_EMPTY_RESPONSE`, `AI_STREAM_FAILED`

5. **Optional I/O:** catch and return null/undefined rather than throw (`getSongDeepRead`, `readOptionalTextFile`)

6. **Pages:** missing entity → `notFound()` from `next/navigation`

7. **Client UI:** try/catch around `fetch`; set local `error` state; use `finally` to clear loading; never leave spinners stuck

8. **Soft failures:** honey pot spam returns fake success; missing R2 binding skips uploads and records `skippedFiles`

**Input validation:**
- Treat unknown JSON fields as `unknown`, then narrow (`typeof payload.mood === 'string' ? payload.mood.trim() : ''`)
- Sanitize / length-limit user text server-side (`cleanText(input, limit)`)
- Content pipeline sanitizes placeholders and corruption via `lib/content/sanitize.ts`

## Logging

**Framework:** `console` only (no structured logger)

**Patterns:**
- `console.error` for API/client failures (`AI Error:`, feedback submit failures)
- Avoid noisy `console.log` in production paths; one debug log exists in theme/background sync
- Do not log secrets, tokens, or full request bodies with credentials
- Prefer user-facing Chinese messages in API `message` fields; keep machine codes in English (`INVALID_JSON`, error throw codes)

## Comments

**When to Comment:**
- Non-obvious runtime constraints (Edge vs Node, Cloudflare static asset limits)
- Security / anti-abuse (honey pot)
- Domain policy for AI (ground answers in site content only)

**JSDoc/TSDoc:**
- Sparse; short block comments on public AI helpers (`createChatCompletion`, `createChatStream`) and edge static client
- Inline `//` for brief rationale, not for restating code

**Example of a high-value comment:**
```typescript
// lib/content/static-client.ts
/**
 * A lightweight data fetcher for Edge Runtime.
 * IMPORTANT: Do not fetch "/content/*.json" over HTTP in production.
 * Cloudflare Pages output does not expose the repository's /content directory as static files.
 */
```

## Function Design

**Size:**
- Keep route handlers small: parse → validate → call lib → map response
- Pure scoring/recommend functions stay in `lib/recommend/*` (testable, no I/O)
- Prefer focused helpers over mega-functions; content parsing uses small `parse*` / `sanitize*` helpers

**Parameters:**
- Domain objects first, then options: `recommendRelatedSongs(currentSong, songs, limit = 4)`
- Optional config via defaults rather than large options objects when only one optional exists
- Avoid boolean flag soup; use explicit unions on data models instead

**Return Values:**
- Explicit TypeScript return types on exported domain functions where helpful
- Recommendation items: `{ song, score, reasons: string[] }`
- Loaders: `Promise<T | undefined>` or `Promise<T | null>` for missing entities
- API: `NextResponse.json(...)` or streaming `Response`

## Module Design

**Exports:**
- Named exports only for lib and components (no default exports except Next pages/layouts/config files)
- Pages: `export default async function SongDetailPage(...)`
- Config: `export default` for `next.config.mjs`, `tailwind.config.ts`, `vitest.config.ts`

**Barrel Files:**
- Not used for components or recommend modules — import concrete files
- `lib/content` resolves to `lib/content/index.ts` as the content API surface

**Layering (prescriptive):**
| Layer | Path | Responsibility |
|-------|------|----------------|
| UI pages | `app/**/page.tsx` | Compose data + components; static generation |
| UI components | `components/{album,common,layout,song}/` | Client interactivity and presentation |
| API routes | `app/api/**/route.ts` | HTTP boundary; edge runtime when required |
| Domain logic | `lib/recommend/*`, `lib/ai/*`, `lib/content/*` | Pure or side-effect-contained logic |
| Types | `types/content.ts` | Shared content schema types |
| Content data | `content/**` | JSON indexes + MD/TXT editorial assets |

**UI patterns:**
- Tailwind utility classes; design tokens via theme colors: `ink`, `paper`, `muted`, `line`, `accent`
- Shared surface class: `card` (from globals CSS)
- Chinese UI copy for end users; English for code identifiers and commit prefixes

**Content / slug rules (prescriptive):**
- Song and album slugs: kebab-case pinyin, consistent across `index.json`, deep-read MD, raw-lyrics TXT, and routes
- Never invent alternate slug spellings for the same work
- Prefer fixing data through sanitize fallbacks rather than crashing the page

**Commits (from project guidelines):**
- Conventional Commits: `feat:`, `fix:`, `build:`, `chore:`, `content:`
- One concern per commit

**Security:**
- Secrets only via env (`.env.local` — never commit)
- Server-only tokens: `GITHUB_FEEDBACK_*`, `OPENAI_API_KEY`, etc.
- Client may use only `NEXT_PUBLIC_*` when necessary

---

*Convention analysis: 2026-07-17*
