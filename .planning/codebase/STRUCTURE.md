# Codebase Structure

**Analysis Date:** 2026-07-17

## Directory Layout

```
stefanie-sun-deep-reads/
├── app/                      # Next.js App Router pages + API route handlers
│   ├── layout.tsx            # Root shell, nav, theme providers
│   ├── page.tsx              # Home
│   ├── globals.css           # Global + theme CSS tokens
│   ├── songs/                # Song list + [slug] detail (SSG)
│   ├── albums/               # Album list + [slug] detail (SSG)
│   ├── timeline/             # Timeline page
│   ├── feedback/             # Contribution form page
│   └── api/                  # Edge route handlers
│       ├── ask/song/         # Streaming song Q&A
│       ├── ask/album/        # Streaming album Q&A
│       ├── recommend/mood/   # Mood recommendation JSON
│       └── feedback/         # GitHub issue + optional R2 upload
├── components/               # React UI by domain
│   ├── album/                # Album-specific client panels
│   ├── song/                 # Song AI panel + search list
│   ├── common/               # Cross-page widgets (mood, feedback, home)
│   └── layout/               # Background + theme switcher
├── lib/                      # Domain logic (no UI)
│   ├── content/              # Load/sanitize catalog + deep-reads
│   ├── ai/                   # AI config, client, prompts/context
│   ├── recommend/            # Mood / related / daily scorers
│   ├── context/              # Client theme React context
│   ├── search/               # Reserved (empty)
│   └── utils/                # Reserved (empty)
├── content/                  # Editorial source of truth (no DB)
│   ├── songs/
│   │   ├── index.json        # Song catalog
│   │   ├── deep-reads/       # {slug}.md deep-read + frontmatter
│   │   └── raw-lyrics/       # {slug}.txt full lyrics
│   ├── albums/
│   │   ├── index.json        # Album catalog
│   │   └── notes/            # Optional album notes
│   ├── tags/index.json
│   ├── timeline/index.json
│   └── feedback/             # Local feedback artifacts (if any)
├── types/
│   └── content.ts            # Shared domain types
├── tests/                    # Vitest suites
│   ├── api/                  # Route handler tests
│   └── recommend/            # Pure scorer tests
├── scripts/                  # Offline content audit / gate / repair
│   ├── config/               # Audit rule config
│   └── lib/                  # Shared script helpers
├── docs/                     # Ops notes + audit outputs / worklists
├── project/                  # Informal project status notes
├── .planning/                # GSD planning artifacts
├── public/                   # Static assets (currently empty)
├── out/                      # Next static export output (generated)
├── log/                      # External/runtime log dumps (not app code)
├── package.json
├── next.config.mjs
├── wrangler.jsonc            # Cloudflare Pages config
├── tailwind.config.ts
├── vitest.config.ts
├── tsconfig.json
├── AGENTS.md                 # Repo guidelines for agents
├── CLAUDE.md                 # GSD-injected project context
├── PROJECT.md
└── README.md
```

## Directory Purposes

**`app/`:**
- Purpose: Routing, page composition, API surface
- Contains: `page.tsx` Server Components, `route.ts` handlers, `layout.tsx`, `globals.css`
- Key files: `app/layout.tsx`, `app/page.tsx`, `app/songs/[slug]/page.tsx`, `app/api/ask/song/route.ts`

**`components/`:**
- Purpose: Reusable UI, mostly client interactive pieces
- Contains: Domain-grouped `.tsx` files
- Key files: `components/song/song-ai-panel.tsx`, `components/song/song-search-list.tsx`, `components/common/mood-recommender.tsx`, `components/layout/background-layer.tsx`

**`lib/`:**
- Purpose: Business logic and integrations
- Contains: Content loaders, AI client, recommenders, theme context
- Key files: `lib/content/index.ts`, `lib/content/static-client.ts`, `lib/ai/client.ts`, `lib/recommend/mood.ts`

**`content/`:**
- Purpose: Human-edited catalog and deep-reads
- Contains: JSON indexes, Markdown deep-reads, TXT lyrics
- Key files: `content/songs/index.json`, `content/albums/index.json`, `content/songs/deep-reads/*.md`

**`types/`:**
- Purpose: Shared TypeScript contracts
- Contains: `content.ts` only
- Key files: `types/content.ts`

**`tests/`:**
- Purpose: Automated unit/API tests (Vitest, Node env)
- Contains: `*.test.ts` mirroring `lib` / `app/api` concerns
- Key files: `tests/recommend/mood.test.ts`, `tests/api/recommend-mood-route.test.ts`

**`scripts/`:**
- Purpose: Content quality gates and one-off maintenance
- Contains: `.mjs` Node scripts + `scripts/config/`, `scripts/lib/`
- Key files: `scripts/validate-content-gate.mjs`, `scripts/audit-content-issues.mjs`, `scripts/audit-catalog-normalization.mjs`

**`docs/`:**
- Purpose: Design notes, progress, audit JSON/MD artifacts consumed by gates
- Contains: `TECH-DESIGN.md`, `CONTENT-ISSUES-AUDIT.json`, reclassify worklists, etc.
- Key files: `docs/TECH-DESIGN.md`, `docs/CATALOG-NORMALIZATION-AUDIT.json`

**`.planning/`:**
- Purpose: GSD project planning (roadmap, state, codebase maps)
- Contains: `PROJECT.md`, `ROADMAP.md`, `STATE.md`, `phases/`, `codebase/`
- Key files: `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`

**`public/`:**
- Purpose: Static public assets served by Next
- Contains: Currently empty — place favicon/images here if needed
- Key files: (none yet)

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root HTML shell and navigation
- `app/page.tsx`: Home discovery
- `app/songs/[slug]/page.tsx`: Song deep-read SSG page
- `app/albums/[slug]/page.tsx`: Album SSG page
- `app/api/ask/song/route.ts`: Song AI stream endpoint
- `app/api/ask/album/route.ts`: Album AI stream endpoint
- `app/api/recommend/mood/route.ts`: Mood recommend endpoint
- `app/api/feedback/route.ts`: Contribution / feedback endpoint

**Configuration:**
- `package.json`: Scripts and dependencies
- `next.config.mjs`: Next config (`typedRoutes`)
- `tsconfig.json`: Strict TS + `@/*` paths
- `tailwind.config.ts`: Design tokens and content globs
- `vitest.config.ts`: Test env and alias
- `wrangler.jsonc`: Cloudflare Pages output dir (must stay `.vercel/output/static`)
- `.env.local` (not committed): `OPENAI_*`, `GITHUB_FEEDBACK_*`, optional public webhook

**Core Logic:**
- `lib/content/index.ts`: Node FS content API for pages
- `lib/content/static-client.ts`: Edge-safe bundled JSON catalog
- `lib/content/sanitize.ts`: Corruption/placeholder filtering
- `lib/ai/config.ts` + `lib/ai/client.ts`: Provider config and chat/stream
- `lib/ai/context-builders.ts`: Message assembly for ask routes
- `lib/recommend/mood.ts` | `related.ts` | `daily.ts`: Ranking algorithms
- `types/content.ts`: Domain models

**Testing:**
- `tests/recommend/*.test.ts`: Pure recommend behavior
- `tests/api/*.test.ts`: Edge/API handler contracts
- Run: `npm test` (once) or `npm run test:watch`

## Naming Conventions

**Files:**
- Pages / layouts: `page.tsx`, `layout.tsx` (App Router convention)
- API handlers: `route.ts` under URL-shaped folders
- Components: `kebab-case.tsx` exporting PascalCase (`song-ai-panel.tsx` → `SongAiPanel`)
- Lib modules: `kebab-case.ts` with named exports
- Content deep-reads / lyrics: `{song-slug}.md` / `{song-slug}.txt` matching catalog `slug`
- Scripts: `verb-topic.mjs` (e.g. `audit-content-issues.mjs`, `validate-content-gate.mjs`)
- Tests: `tests/{area}/{name}.test.ts`

**Directories:**
- App routes: plural resource segments (`songs`, `albums`) + dynamic `[slug]`
- Components: domain folders (`song`, `album`, `common`, `layout`)
- Lib: concern folders (`content`, `ai`, `recommend`, `context`)
- Content: parallel resource trees under `content/{songs,albums,tags,timeline}`

**Slugs:**
- Always kebab-case pinyin (or established romanization), consistent across JSON, MD, TXT, and URL segments
- Example: `yu-jian` → `/songs/yu-jian`, `content/songs/deep-reads/yu-jian.md`, `content/songs/raw-lyrics/yu-jian.txt`

**Code style (from repo guidelines):**
- TypeScript strict; 2-space indent; single quotes; no semicolons
- Import with `@/` path alias
- Prefer small explicit route handlers returning typed JSON/SSE

## Where to Add New Code

**New Feature (user-facing page + logic):**
- Primary page: `app/{feature}/page.tsx` (or nested under existing resource)
- Interactive UI: `components/{domain}/` or `components/common/` if shared
- Domain logic: `lib/{concern}/`
- Types: extend `types/content.ts` or add `types/{area}.ts` if large
- Tests: `tests/{area}/*.test.ts`
- Wire nav in `app/layout.tsx` if top-level

**New API endpoint:**
- Implementation: `app/api/{path}/route.ts`
- Prefer `export const runtime = 'edge'` for Cloudflare compatibility
- Shared logic in `lib/`; do **not** use `fs` on edge — use `lib/content/static-client.ts` or JSON imports
- Tests: `tests/api/{name}.test.ts` for behavior/payload contracts

**New Component/Module:**
- Implementation: `components/{album|song|common|layout}/kebab-name.tsx`
- Client interactivity: add `'use client'` at top
- Server-only presentational chunks can live inline in page files if not reused

**New song / album content (editorial):**
1. Add or update entry in `content/songs/index.json` / `content/albums/index.json`
2. Add `content/songs/deep-reads/{slug}.md` (frontmatter + body)
3. Add `content/songs/raw-lyrics/{slug}.txt` when lyrics available
4. Keep `albumSlug` / `songSlugs` / timeline links consistent
5. Run `npm run gate:content` / `npm run audit:content` after bulk changes

**New recommendation algorithm:**
- Implementation: `lib/recommend/{name}.ts` (pure functions)
- Optional API: `app/api/recommend/{name}/route.ts`
- UI: `components/common/` or page-level
- Tests required under `tests/recommend/`

**New AI capability:**
- Client transport: extend `lib/ai/client.ts`
- Config: `lib/ai/config.ts` (env only; never commit secrets)
- Prompts/context: `lib/ai/context-builders.ts` or `lib/ai/prompts.ts`
- Surface via new or existing `app/api/ask/**` + panel component

**Utilities:**
- Shared helpers: `lib/utils/` (currently empty — prefer this over ad-hoc copies)
- Search helpers: `lib/search/` when implementing server-side search beyond client `SongSearchList`
- Script-only helpers: `scripts/lib/`

**Content quality / one-off jobs:**
- Scripts: `scripts/*.mjs`
- Audit outputs: `docs/` (JSON for gates, MD for human review)
- Do not put maintenance scripts under `app/` or `lib/`

## Special Directories

**`content/`:**
- Purpose: Source of truth for all catalog and editorial text
- Generated: No (hand-authored; scripts may scaffold)
- Committed: Yes

**`out/`:**
- Purpose: Static export / build artifact snapshot
- Generated: Yes
- Committed: Typically no (present in workspace as build output)

**`.vercel/` / `.next/` / `node_modules/`:**
- Purpose: Framework build caches and dependencies
- Generated: Yes
- Committed: No

**`docs/`:**
- Purpose: Human ops docs + machine-readable audit results for gates
- Generated: Partially (audit scripts write JSON/MD)
- Committed: Yes (gates depend on checked-in audit JSON)

**`scripts/`:**
- Purpose: Offline maintenance, not served
- Generated: No
- Committed: Yes

**`log/`:**
- Purpose: External log dumps
- Generated: Yes
- Committed: Prefer no secrets; treat as operational noise

**`.planning/`:**
- Purpose: GSD planning and codebase maps
- Generated: Partially (agent-written maps)
- Committed: Yes (project workflow)

**`public/`:**
- Purpose: Browser-static assets
- Generated: No
- Committed: Yes when assets are added

**Empty placeholders:**
- `lib/search/`, `lib/utils/`: reserved; put new shared search/util code here rather than inventing new top-level folders

## Quick Placement Cheatsheet

| Change | Put it here |
|--------|-------------|
| New route/page | `app/.../page.tsx` |
| New API | `app/api/.../route.ts` |
| New UI widget | `components/{domain}/` |
| Content load / sanitize | `lib/content/` |
| AI call / prompt | `lib/ai/` |
| Ranking / recommend | `lib/recommend/` |
| Theme / client context | `lib/context/` |
| Domain type | `types/content.ts` |
| Song deep-read | `content/songs/deep-reads/{slug}.md` |
| Lyrics | `content/songs/raw-lyrics/{slug}.txt` |
| Catalog metadata | `content/songs/index.json` or `content/albums/index.json` |
| Unit test | `tests/**/*.test.ts` |
| Content audit script | `scripts/*.mjs` |
| Design / audit writeup | `docs/` |

---

*Structure analysis: 2026-07-17*
