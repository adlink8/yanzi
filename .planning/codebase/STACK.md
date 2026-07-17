# Technology Stack

**Analysis Date:** 2026-07-17

## Languages

**Primary:**
- TypeScript 5.8.2 (`typescript` in `package.json`) — App Router pages, API routes, domain logic under `app/`, `components/`, `lib/`, `types/`
- Strict mode enabled in `tsconfig.json` (`"strict": true`, target `ES2017`, module `esnext`, path alias `@/*`)

**Secondary:**
- Markdown + YAML front matter — deep-read content in `content/songs/deep-reads/*.md` (parsed via `gray-matter` in `lib/content/index.ts` and audit scripts)
- JSON — catalog metadata: `content/songs/index.json`, `content/albums/index.json`, `content/tags/index.json`, `content/timeline/index.json`
- Plain text (UTF-8) — full lyrics in `content/songs/raw-lyrics/*.txt`
- JavaScript (ESM `.mjs`) — maintenance/audit scripts in `scripts/` (Node, no TypeScript compile step)

## Runtime

**Environment:**
- Node.js 22.x (observed local: v22.14.0 on WSL Ubuntu-D)
- Dev/build always run inside WSL (`docs/SETUP.md`, `PROJECT.md` constraint)
- Edge Runtime for API routes: every handler under `app/api/**/route.ts` exports `runtime = 'edge'` for Cloudflare Pages compatibility

**Package Manager:**
- npm 10.x (observed local: 10.9.2)
- Lockfile: `package-lock.json` present (lockfileVersion 3)
- Use `npm install` / `npm ci` only — do not introduce yarn/pnpm without updating docs and CI assumptions

## Frameworks

**Core:**
- Next.js 15.2.4 — App Router full-stack app (`app/`), Server Components for pages, Route Handlers for APIs
- React 19.0.0 + `react-dom` 19.0.0 — UI
- Typed routes experimental flag: `experimental.typedRoutes: true` in `next.config.mjs`

**Styling:**
- Tailwind CSS 3.4.17 — utility-first UI (`tailwind.config.ts`, `app/globals.css`)
- PostCSS 8.5.3 + Autoprefixer 10.4.20 — `postcss.config.mjs`
- Custom theme tokens (`ink`, `paper`, `muted`, `line`, era-based CSS variables in `app/globals.css`)
- Font stacks: Inter / system-ui body; `"Noto Serif SC"` for headings (declared in `tailwind.config.ts` and `app/globals.css` — ensure font availability in deploy or fall back to serif)

**Testing:**
- Vitest ^4.1.4 — unit/API tests (`vitest.config.ts`, Node environment, `tests/**/*.test.ts`)
- Cover any change in `lib/recommend/*` and `app/api/*` (see `AGENTS.md`)

**Build/Dev:**
- Next.js built-in bundler (webpack via `next build` / `next dev`)
- `@cloudflare/next-on-pages` ^1.13.16 — adapts Next output for Cloudflare Pages (`npm run build:cf`)
- Wrangler config: `wrangler.jsonc` (project name `yanzi`, `nodejs_compat`, output dir pinned)

**Not present (despite README/docs mentions):**
- No Framer Motion dependency in `package.json` — do not assume motion library
- No shadcn/ui installed — `docs/TECH-DESIGN.md` lists it as optional only
- `marked` 15.0.7 is listed in dependencies but has no in-repo import; prefer `gray-matter` + existing markdown pipeline until deliberately wired

## Key Dependencies

**Critical:**
- `next` 15.2.4 — SSR/SSG pages, API routes, production server
- `react` / `react-dom` 19.0.0 — component model
- `gray-matter` 4.0.3 — front-matter parsing for deep-read Markdown (`lib/content/index.ts`, content scripts)
- `@cloudflare/next-on-pages` ^1.13.16 — production CF adapter + `getRequestContext` for R2 bindings in feedback API

**Infrastructure:**
- Tailwind / PostCSS / Autoprefixer — CSS pipeline
- `@types/node` 22.13.10, `@types/react` 19.0.10, `@types/react-dom` 19.0.4 — TypeScript types
- Native `fetch` only for AI and GitHub — no OpenAI official SDK

**Domain (first-party, not npm):**
- `lib/ai/*` — OpenAI-compatible chat client and prompts
- `lib/content/*` — filesystem content loader (Node) + static JSON import client (Edge)
- `lib/recommend/*` — mood/daily/related recommendation (pure TS, no external API)
- `types/content.ts` — shared content models

## Configuration

**Environment:**
- Secrets and overrides live in `.env.local` (gitignored; file may exist locally — never commit)
- Template/example: `.env.example` may exist — treat as names documentation only
- AI defaults documented in `docs/SETUP.md`; code defaults in `lib/ai/config.ts`:
  - Code fallback base URL: `https://api.openai.com/v1`
  - Code fallback model: `gpt-4o-mini`
  - Local private-use defaults: Ollama at `http://127.0.0.1:11434/v1`, key `ollama`, model `gemma4:e4b`
- AI enabled only when `OPENAI_API_KEY` is non-empty (`getAiConfig().enabled`)
- Content gate thresholds: `GATE_MAX_ARCHIVE`, `GATE_MAX_MV_MISSING` (optional, `scripts/validate-content-gate.mjs`)

**Build:**
- `next.config.mjs` — minimal Next config (typed routes)
- `tsconfig.json` — strict TS, `@/*` paths
- `wrangler.jsonc` — Cloudflare Pages; **must** keep `"pages_build_output_dir": ".vercel/output/static"`
- `vitest.config.ts` — alias `@` → cwd
- `tailwind.config.ts` / `postcss.config.mjs` — styling
- No ESLint config file in repo root; `npm run lint` still invokes `next lint`

**Scripts (from `package.json`):**
| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server port **3008** |
| `npm run build` / `start` | Production Next build/serve (port 3008) |
| `npm run build:cf` | Cloudflare Pages adapter build |
| `npm test` / `test:watch` | Vitest |
| `npm run gate:content` | Content quality gate |
| `npm run audit:content` / `audit:catalog` / `audit:style` | Editorial audits |
| `npm run remediate:mv` / `worklist:album` | Content maintenance |

## Platform Requirements

**Development:**
- WSL Ubuntu-D; project root `/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads`
- Node 22+ and npm 10+
- Optional: local Ollama for AI Q&A without cloud keys
- Port 3008 free for `next dev`
- Content edits under `content/` only (JSON/Markdown/TXT); keep song slugs kebab-case pinyin across index, lyrics, and deep-reads

**Production:**
- Target: **Cloudflare Pages** via `@cloudflare/next-on-pages`
- Build command: `npm run build:cf`
- Output directory: `.vercel/output` (static worker bundle under `.vercel/output/static` per `wrangler.jsonc`)
- Compatibility: `nodejs_compat` flag; API routes must stay Edge-safe
- Edge constraint: use `lib/content/static-client.ts` (bundled JSON imports) in API routes — **never** HTTP-fetch `/content/*.json` at runtime (not exposed on Pages)
- Node filesystem loader `lib/content/index.ts` is for local/Node contexts and content scripts, not CF Edge handlers
- Private self-use; no multi-tenant auth stack required

**Content / data model constraint:**
- File-first only — no application database in this phase (`PROJECT.md`, `docs/TECH-DESIGN.md`)
- Do not introduce ORM/DB migrations unless a new milestone explicitly requires it

---

*Stack analysis: 2026-07-17*
