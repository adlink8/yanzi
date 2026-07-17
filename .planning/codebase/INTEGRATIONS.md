# External Integrations

**Analysis Date:** 2026-07-17

## APIs & External Services

**AI (OpenAI-compatible chat completions):**
- OpenAI-compatible HTTP API used for song/album Q&A streaming
  - Client: first-party `lib/ai/client.ts` via native `fetch` to `{baseUrl}/chat/completions`
  - Config: `lib/ai/config.ts` (`getAiConfig`)
  - Auth: `Authorization: Bearer ${OPENAI_API_KEY}`
  - Env: `OPENAI_BASE_URL`, `OPENAI_API_KEY`, `OPENAI_MODEL`
  - **Default path (cloud-first):** `https://api.openai.com/v1` + `gpt-4o-mini` when env unset (`lib/ai/config.ts`); AI enabled only if `OPENAI_API_KEY` is set
  - Optional local path: Ollama OpenAI-compatible endpoint via env override (`http://127.0.0.1:11434/v1`) — not the product default; unusable on Cloudflare Pages
  - Other cloud providers: DeepSeek, 智谱 GLM, etc. by overriding the three env vars
  - Consumers: `app/api/ask/song/route.ts`, `app/api/ask/album/route.ts` → `createChatStream`
  - Response mode: SSE-style stream (`text/event-stream`); non-stream helper `createChatCompletion` also available
  - Use pattern: keep prompts in `lib/ai/prompts.ts` and context assembly in `lib/ai/context-builders.ts`; do not hardcode provider SDKs

**GitHub Issues API (feedback / contribution hub):**
- Creates issues for user feedback and archive contributions
  - Endpoint: `POST https://api.github.com/repos/{owner}/{repo}/issues`
  - Implementation: `app/api/feedback/route.ts`
  - Auth: `GITHUB_FEEDBACK_TOKEN` (Bearer)
  - Target repo: `GITHUB_FEEDBACK_OWNER` + `GITHUB_FEEDBACK_REPO`
  - Labels applied: `contribution`, `r2-pending`
  - Required for success path; missing config returns HTTP 503

**Optional client webhook (feedback fallback):**
- Browser may POST payload to a public webhook if `/api/feedback` fails
  - Env: `NEXT_PUBLIC_FEEDBACK_WEBHOOK_URL` (client-visible)
  - Implementation: `components/common/feedback-form.tsx`
  - Use only as backup channel; primary path remains `/api/feedback`

**Static third-party asset:**
- Noise texture: `https://grainy-gradients.vercel.app/noise.svg` referenced in `components/layout/background-layer.tsx`
  - No auth; decorative only — tolerate offline failure (pure CSS still works)

**Not integrated:**
- No Stripe/payment, email (SendGrid/etc.), analytics (GA/Plausible), or official OpenAI/Anthropic SDKs

## Data Storage

**Databases:**
- None — no Postgres/MySQL/SQLite/ORM
  - Do not add a database for catalog data in the current phase

**File Storage:**
- **Local filesystem (primary content):** `content/**` (JSON catalogs, Markdown deep-reads, TXT lyrics)
  - Loaded at build/runtime via `lib/content/index.ts` (Node `fs`) or bundled imports via `lib/content/static-client.ts` (Edge)
- **Cloudflare R2 (optional attachments):**
  - Binding name expected: `CONTRIBUTIONS` on Pages/Worker env
  - Access pattern: `getRequestContext()` from `@cloudflare/next-on-pages` in `app/api/feedback/route.ts`
  - Object keys: `uploads/{recordId}/{timestamp}-{filename}`
  - If binding absent, attachments are skipped and listed as pending in the GitHub issue body
  - Note: `wrangler.jsonc` does **not** declare R2 bindings yet — configure binding in Cloudflare dashboard / wrangler when enabling uploads
- **Local feedback log path:** `content/feedback/` may hold operational JSONL (gitignored patterns vary); not a production store

**Caching:**
- None dedicated (no Redis, no Cloudflare KV usage in app code)
- AI requests use `cache: 'no-store'`
- Recommendation endpoints compute in-memory from bundled song JSON

## Authentication & Identity

**Auth Provider:**
- None for end users — private self-use site; no login, sessions, or OAuth for readers
- Service credentials only:
  - AI API key (`OPENAI_API_KEY`)
  - GitHub PAT for issue creation (`GITHUB_FEEDBACK_TOKEN`)
- Feedback anti-spam: honeypot field `website` in `app/api/feedback/route.ts` (silent success if filled)

**Implementation guidance:**
- Do not introduce user auth unless a future milestone requires multi-user contributions
- Keep secrets server-side; never expose `GITHUB_FEEDBACK_TOKEN` or cloud AI keys to the client

## Monitoring & Observability

**Error Tracking:**
- None (no Sentry, Datadog, etc.)

**Logs:**
- `console.error` / `console.log` in API routes and some client components
- Ad-hoc local log files under `log/` (not a managed platform)
- Requirement from `PROJECT.md`: surface real backend errors to the frontend for AI failures — preserve this when changing ask routes

**Metrics / APM:**
- None

## CI/CD & Deployment

**Hosting:**
- Cloudflare Pages
  - Project wrangler name: `yanzi` (`wrangler.jsonc`)
  - Adapter: `@cloudflare/next-on-pages`
  - Build: `npm run build:cf`
  - Output: `.vercel/output` (static dir must remain `.vercel/output/static`)
  - Compatibility date/flags: `2026-04-09`, `nodejs_compat`

**CI Pipeline:**
- No `.github/workflows` present — no automated GitHub Actions CI detected
- Local gates: `npm test`, `npm run build`, `npm run build:cf`, content audits via npm scripts

**Deployment notes:**
- Edge API routes must export `runtime = 'edge'`
- Edge content access must use `lib/content/static-client.ts` (bundled JSON), not runtime HTTP to `/content/*`
- Custom domain / `pages.dev` routing issues tracked as active work in `PROJECT.md` — not an app-code integration

## Environment Configuration

**Required env vars (AI features):**
- `OPENAI_API_KEY` — enables AI (`getAiConfig().enabled`)
- `OPENAI_BASE_URL` — provider base (optional; code default `https://api.openai.com/v1`)
- `OPENAI_MODEL` — model id (optional; code default `gpt-4o-mini`)

**Required env vars (feedback GitHub path):**
- `GITHUB_FEEDBACK_TOKEN`
- `GITHUB_FEEDBACK_OWNER`
- `GITHUB_FEEDBACK_REPO`

**Optional env vars:**
- `NEXT_PUBLIC_FEEDBACK_WEBHOOK_URL` — client-side webhook fallback
- `GATE_MAX_ARCHIVE` — content gate threshold override
- `GATE_MAX_MV_MISSING` — content gate threshold override

**Cloudflare bindings (not env strings; platform config):**
- `CONTRIBUTIONS` — R2 bucket binding for feedback uploads (optional)

**Secrets location:**
- Local: `.env.local` (gitignored; do not commit; do not read secrets into docs)
- Example template: `.env.example` may exist for variable names only
- Production: Cloudflare Pages environment variables / secrets dashboard
- Never commit tokens or keys; rotate if leaked

## Webhooks & Callbacks

**Incoming:**
- None dedicated (no signed webhook receivers)
- App-owned endpoints (not third-party callbacks):
  - `POST /api/ask/song` — song AI Q&A (stream)
  - `POST /api/ask/album` — album AI Q&A (stream)
  - `POST /api/recommend/mood` — mood recommendation (JSON; no external network)
  - `POST /api/feedback` — contribution/feedback intake

**Outgoing:**
- OpenAI-compatible chat completions (`lib/ai/client.ts`)
- GitHub Issues create (`app/api/feedback/route.ts`)
- Optional browser POST to `NEXT_PUBLIC_FEEDBACK_WEBHOOK_URL`
- Optional R2 `put` via Cloudflare binding

**Client → API pattern:**
- Use relative paths from the browser (`/api/...`) as in `components/song/song-ai-panel.tsx`, `components/album/album-ai-panel.tsx`, `components/common/mood-recommender.tsx`, `components/common/feedback-form.tsx`
- Do not hardcode production origins in client fetch calls

---

*Integration audit: 2026-07-17*
