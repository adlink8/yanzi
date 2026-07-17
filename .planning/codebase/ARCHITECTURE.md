# Architecture

**Analysis Date:** 2026-07-17

## Pattern Overview

**Overall:** Next.js App Router monolith (file-backed content + edge API handlers)

**Key Characteristics:**
- Single-repo full stack: SSR/SSG pages, Route Handlers, domain logic, and editorial content live in one Next.js 15 app
- JSON / Markdown / TXT content pipeline — no database; catalog and deep-reads are source of truth on disk
- Dual content access paths: Node `fs` for page generation; bundled JSON imports for Edge-compatible API routes
- Cloud-first AI via OpenAI-compatible HTTP (`OPENAI_BASE_URL` / cloud or optional local); streaming chat only
- Pure-function recommendation layer (mood / related / daily) scored over in-memory song metadata

## Layers

**Presentation (App Router pages + client UI):**
- Purpose: Render catalog, deep-read detail, timeline, home discovery, and feedback UI
- Location: `app/`, `components/`
- Contains: Server Components for data pages; `'use client'` panels for search, AI chat, mood recommend, theme, feedback
- Depends on: `lib/content`, `lib/recommend`, `lib/context`, `types/content`
- Used by: Browser (user navigation)

**API / Edge Runtime:**
- Purpose: Interactive endpoints that cannot be fully static (AI Q&A, mood recommend, feedback)
- Location: `app/api/**/route.ts`
- Contains: `export const runtime = 'edge'` handlers returning JSON or SSE streams
- Depends on: `lib/ai/*`, `lib/content/static-client`, `lib/recommend/mood`, env bindings (GitHub / R2 for feedback)
- Used by: Client components via `fetch`

**Domain logic:**
- Purpose: Content loading/sanitization, AI prompt/context assembly, recommendation scoring
- Location: `lib/content/`, `lib/ai/`, `lib/recommend/`, `lib/context/`
- Contains: Pure and async helpers; no UI
- Depends on: `types/content`, Node `fs` (content index only), `gray-matter`, env for AI
- Used by: Pages (Node path) and API routes (edge-safe subset)

**Content source of truth:**
- Purpose: Store catalog metadata, deep-reads, lyrics, tags, timeline
- Location: `content/`
- Contains: `*.json` indexes, `songs/deep-reads/*.md`, `songs/raw-lyrics/*.txt`
- Depends on: Editorial process and maintenance scripts
- Used by: `lib/content/index.ts` (full), `lib/content/static-client.ts` (JSON only via import)

**Types:**
- Purpose: Shared TypeScript models for songs, albums, tags, timeline, deep-read structure
- Location: `types/content.ts`
- Contains: `Song`, `Album`, `Tag`, `TimelineEvent`, `SongDeepRead`, interpretation/design subtypes
- Depends on: Nothing
- Used by: `lib/*`, pages, client list props, tests

**Tooling / quality gates:**
- Purpose: Offline audits, catalog gates, MV remediation, scaffolds — not part of runtime request path
- Location: `scripts/`, `docs/` audit artifacts
- Contains: Node `.mjs` scripts; audit JSON/MD outputs
- Depends on: `content/`, previous audit JSON under `docs/`
- Used by: npm scripts (`gate:content`, `audit:*`, etc.)

**Deploy / platform:**
- Purpose: Cloudflare Pages via `@cloudflare/next-on-pages` + Wrangler
- Location: `package.json` (`build:cf`), `wrangler.jsonc`
- Contains: Pages build output under `.vercel/output/static`; edge functions for API routes
- Depends on: Next build + next-on-pages adapter
- Used by: Production hosting

## Data Flow

**Song / album page (static content → render + AI panel):**

1. Build or request hits `app/songs/[slug]/page.tsx` or `app/albums/[slug]/page.tsx` (Server Component; `dynamic = 'force-static'`, `generateStaticParams` from catalog)
2. Page calls `getSong` / `getAlbum` / `getSongDeepRead` / `getSongs` from `lib/content/index.ts`
3. Content layer reads `content/songs/index.json`, `content/albums/index.json`, optional `deep-reads/{slug}.md` (gray-matter) + `raw-lyrics/{slug}.txt`
4. Sanitize/parse pipeline fills fallbacks for corrupted/placeholder text (`lib/content/sanitize.ts`)
5. Page computes related songs via `recommendRelatedSongs` (song page only), renders overview / lyrics / line-by-line / design sections
6. Client `SongAiPanel` / `AlbumAiPanel` mount for interactive Q&A (separate flow below)

**API ask routes (context → AI stream → UI):**

1. Client posts `{ slug, question }` to `/api/ask/song` or `/api/ask/album`
2. Edge handler loads catalog via `lib/content/static-client.ts` (bundled JSON imports — not HTTP, not `fs`)
3. `buildSongPrompt` / `buildAlbumPrompt` in `lib/ai/context-builders.ts` builds chat messages from metadata summaries (current route path does not load deep-read MD on edge)
4. `createChatStream` in `lib/ai/client.ts` POSTs OpenAI-compatible `/chat/completions` with `stream: true` using `getAiConfig()`
5. Handler returns `text/event-stream` body; client reads SSE `data:` lines and appends `choices[0].delta.content`
6. Errors surface as HTTP 4xx/5xx or client-displayed message (`AI_NOT_CONFIGURED`, stream failures)

**Mood recommend (pure score → API → UI):**

1. Home page embeds client `MoodRecommender`
2. User submits mood → `POST /api/recommend/mood` with `{ mood }`
3. Edge route imports `content/songs/index.json` and calls `recommendSongsByMood` (`lib/recommend/mood.ts`)
4. Scorer matches mood/theme/keywords/summary/title; falls back to favorites/ready songs
5. JSON `{ ok, recommendations[] }` returned; UI links to `/songs/{slug}`

**Daily / related recommend (server-only, no API):**

1. Home: `pickDailySong(songs)` in `lib/recommend/daily.ts` (date-hash pick from high-favorite / deep-read pool)
2. Song detail: `recommendRelatedSongs(song, songs)` in `lib/recommend/related.ts` (related links, same album, tag overlap)
3. Results rendered in Server Components or passed as props to client companions

**Static content pipeline (no DB):**

1. Editors maintain `content/**` (slug-aligned JSON / MD / TXT)
2. Optional scripts audit, remediate, scaffold (`scripts/*.mjs`)
3. `npm run gate:content` enforces coverage thresholds from prior audit JSON under `docs/`
4. Next build SSG-generates song/album detail routes from indexes; deep-read MD baked into page HTML at build time

**Feedback / contribution:**

1. Client `FeedbackForm` posts JSON (+ base64 attachments) to `/api/feedback`
2. Edge handler honeypot-checks, validates length, optionally uploads files to R2 binding `CONTRIBUTIONS`
3. Creates GitHub Issue via `GITHUB_FEEDBACK_*` env vars; returns issue URL

**State Management:**
- Server: request/build-time data only; no global server store
- Client local state: React `useState` for AI panels, mood form, song search filter, feedback form
- Theme: `ThemeProvider` (`lib/context/theme-context.tsx`) persists `backgroundMode` (`pure` | `artist` | `archive`) in `localStorage`
- No Redux/Zustand/React Query; no session auth layer

## Key Abstractions

**Content repository (Node):**
- Purpose: Async loaders over filesystem with sanitize/parse for production-quality display
- Examples: `lib/content/index.ts`, `lib/content/sanitize.ts`
- Pattern: Repository functions (`getSongs`, `getSongDeepRead`, …) returning typed domain objects

**Static catalog (Edge):**
- Purpose: Edge-safe song/album reads without Node `fs` or serving raw `/content`
- Examples: `lib/content/static-client.ts`
- Pattern: Bundled `import` of JSON modules; mirror of subset of content API

**Song deep-read document:**
- Purpose: Editorial long-form + structured frontmatter (MV, lyric blocks, interpretations, design)
- Examples: `content/songs/deep-reads/{slug}.md`, parsed into `SongDeepRead` in `types/content.ts`
- Pattern: Gray-matter frontmatter + markdown body; lyrics preferred from `raw-lyrics/{slug}.txt`

**OpenAI-compatible AI client:**
- Purpose: Provider-agnostic chat completion and streaming
- Examples: `lib/ai/client.ts`, `lib/ai/config.ts`
- Pattern: Env-driven `baseUrl` / `apiKey` / `model`; cloud defaults; localhost base URL labeled as optional Ollama

**Prompt / context builders:**
- Purpose: Assemble system+user messages from song/album context
- Examples: `lib/ai/context-builders.ts` (used by ask routes); richer unused-style helpers also in `lib/ai/prompts.ts`
- Pattern: Pure string builders; answer constrained to site materials (prompt policy)

**Recommendation scorers:**
- Purpose: Deterministic ranking without ML
- Examples: `lib/recommend/mood.ts`, `lib/recommend/related.ts`, `lib/recommend/daily.ts`
- Pattern: Weighted tag/keyword/album overlap → `{ song, score, reasons }[]`

**Domain types:**
- Purpose: Single shared contract for catalog and deep-read shape
- Examples: `types/content.ts`
- Pattern: Exported TypeScript types only (no runtime validators)

## Entry Points

**Root layout / shell:**
- Location: `app/layout.tsx`
- Triggers: Every page render
- Responsibilities: Metadata, global CSS, nav, `ThemeProvider`, `BackgroundLayer`, `ThemeSwitcher`

**Home page:**
- Location: `app/page.tsx`
- Triggers: `/`
- Responsibilities: Catalog counts, daily song, mood recommender, featured high-favorites

**Song list / detail:**
- Location: `app/songs/page.tsx`, `app/songs/[slug]/page.tsx`
- Triggers: `/songs`, `/songs/{slug}`
- Responsibilities: Client search list; SSG detail with deep-read sections, related songs, AI panel

**Album list / detail:**
- Location: `app/albums/page.tsx`, `app/albums/[slug]/page.tsx`
- Triggers: `/albums`, `/albums/{slug}`
- Responsibilities: Year-sorted album grid; SSG detail with track list and album AI panel

**Timeline:**
- Location: `app/timeline/page.tsx`
- Triggers: `/timeline`
- Responsibilities: Chronological events linked to albums when available

**Feedback page:**
- Location: `app/feedback/page.tsx`
- Triggers: `/feedback`
- Responsibilities: Contribution hub wrapping `FeedbackForm`

**AI ask APIs:**
- Location: `app/api/ask/song/route.ts`, `app/api/ask/album/route.ts`
- Triggers: `POST` from AI panels
- Responsibilities: Edge catalog lookup, prompt build, stream AI response

**Mood recommend API:**
- Location: `app/api/recommend/mood/route.ts`
- Triggers: `POST` from `MoodRecommender`
- Responsibilities: Score songs by mood; return compact JSON

**Feedback API:**
- Location: `app/api/feedback/route.ts`
- Triggers: `POST` from `FeedbackForm`
- Responsibilities: Validate, optional R2 upload, GitHub issue creation

**Dev / build / test:**
- Location: `package.json` scripts
- Triggers: CLI (`npm run dev` :3008, `npm run build`, `npm test`, `npm run build:cf`)
- Responsibilities: Local server, production Next build, Vitest, Cloudflare adapter build

## Error Handling

**Strategy:** Fail soft in content display (sanitize + fallbacks); fail hard with HTTP status for invalid API input; stream/AI failures reported to client UI.

**Patterns:**
- Content: missing deep-read → `null`; placeholder/corrupted strings replaced via `sanitizeText` / `isPlaceholderLikeText`; pages show “待精修” empty states instead of crashing
- Pages: unknown slug → `notFound()`; detail routes use `dynamicParams = false` so only generated slugs exist at build
- API validation: missing fields → 400; not found → 404; AI config/stream failure → 500 with message body
- Mood API: invalid JSON → `{ ok: false, code: 'INVALID_JSON' }`; empty mood falls back to favorites inside scorer
- Feedback: honeypot silent success; length validation 400; missing GitHub env 503; GitHub failure 502
- Client AI panels: catch network/parse errors into local `error` string; ignore partial SSE JSON parse errors while streaming

## Cross-Cutting Concerns

**Logging:** Minimal `console.error` in AI ask routes; no structured logger or log aggregation in app code. Operational AI logs may appear under `log/` from external tooling (not wired into request handlers).

**Validation:**
- Ad-hoc in routes (`typeof`, trim, min length)
- Content sanitization for display integrity
- Content quality gates via scripts + `docs/*-AUDIT.json`, not request-time schemas
- TypeScript `strict` + Next `experimental.typedRoutes`

**Authentication:** None. Private self-use app; no user accounts, sessions, or route guards. Feedback uses server-side GitHub token / optional R2 binding only.

**Styling:** Tailwind CSS (`tailwind.config.ts`, `app/globals.css`) with semantic tokens (`ink`, `paper`, `muted`, `line`, `accent` via CSS vars for era/theme).

**Runtime split:**
- Pages / content loaders: Node (build-time `fs`)
- API routes: Edge (`runtime = 'edge'`) for Cloudflare Pages compatibility
- Do not use Node-only APIs inside edge routes; use `static-client` for catalog

**Path alias:** `@/*` → repo root (`tsconfig.json`) for all app/lib/component imports.

---

*Architecture analysis: 2026-07-17*
