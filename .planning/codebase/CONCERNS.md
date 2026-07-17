# Codebase Concerns

**Analysis Date:** 2026-07-17

## Tech Debt

**Dual content loaders (Node FS vs Edge JSON imports):**
- Issue: Pages use `lib/content/index.ts` (Node `fs` + `gray-matter` for deep-reads/lyrics). Edge API routes use `lib/content/static-client.ts` (bundled `content/songs/index.json` + `content/albums/index.json` only). Deep-read Markdown and raw lyrics never reach AI routes.
- Files: `lib/content/index.ts`, `lib/content/static-client.ts`, `app/api/ask/song/route.ts`, `app/api/ask/album/route.ts`
- Impact: Song/album AI answers cannot cite 站内 deep-read or full lyrics; product copy claims “仅基于站内资料” while the model only sees card metadata (title/summary/tags).
- Fix approach: Bundle or precompile a slim per-slug context JSON for edge (summary + lyrics excerpt + deep-read body), or switch ask routes off pure edge if local Node is acceptable for private use. Wire `buildSongContext(..., deepRead)` instead of hardcoding `null`.

**Unused constrained AI prompts:**
- Issue: `lib/ai/prompts.ts` defines anti-hallucination system prompts (“只能基于站内资料…不要编造”), but nothing imports them. Live prompts in `lib/ai/context-builders.ts` are looser (“你熟悉她的每一张专辑、每一首歌…”) and omit deep-read context.
- Files: `lib/ai/prompts.ts`, `lib/ai/context-builders.ts`
- Impact: Higher hallucination risk; dead code drift.
- Fix approach: Route builders should call `buildSongSystemPrompt` / `buildAlbumSystemPrompt`; delete or re-export single source of truth.

**`buildSongPrompt` always drops deep-read:**
- Issue: `buildSongPrompt(song, album, question)` calls `buildSongContext(song, album, null)`.
- Files: `lib/ai/context-builders.ts` (around the `buildSongPrompt` function)
- Impact: Even if Node runtime could load MD, prompts still omit interpretations/lyrics.
- Fix approach: Pass loaded `SongDeepRead | null` and truncate body for token limits.

**Album `songSlugs` out of sync with song `albumSlug`:**
- Issue: Live catalog has systematic drift between `content/albums/index.json` `songSlugs` and songs that point at each album via `albumSlug`. Measured 2026-07-17: ~14 listed-but-not-indexed extras and ~99 albumSlug songs missing from their album’s `songSlugs` (e.g. `official-singles-collection` lists 4, actual ~64; `start` / `leave` list slugs assigned elsewhere).
- Files: `content/albums/index.json`, `content/songs/index.json`, `types/content.ts`, `app/albums/[slug]/page.tsx`
- Impact: Album **page** uses `getSongsByAlbum` (song index filter) so UI mostly works; `songSlugs` is still trusted metadata for audits, AI album context counts, and future tooling. Misleading for curation and CATA/META work.
- Fix approach: Single source of truth script: derive `songSlugs` from songs, or fail `gate:content` when mismatch ≠ 0. Prefer regenerating `songSlugs` after every remap.

**Album type vs runtime fields:**
- Issue: JSON albums include `isOfficial` but `Album` in `types/content.ts` does not.
- Files: `types/content.ts`, `content/albums/index.json`
- Impact: Type-blind catalog flags; silent field loss if typed round-trips are added.
- Fix approach: Extend `Album` (and any sanitize path) with optional `isOfficial?: boolean`.

**Unused dependency `marked`:**
- Issue: Listed in `package.json` but no app/lib import; deep-read body is rendered as plain `whitespace-pre-wrap` text, not Markdown HTML.
- Files: `package.json`, `app/songs/[slug]/page.tsx`, `lib/content/index.ts`
- Impact: Dead dependency weight; README/style expectations may assume MD rendering.
- Fix approach: Either render Markdown safely with `marked` + sanitization, or remove the dependency.

**Empty / stub modules:**
- Issue: `lib/search/` and `lib/utils/` are empty directories; search lives only in `components/song/song-search-list.tsx`. `content/albums/notes/` is empty.
- Files: `lib/search/`, `lib/utils/`, `content/albums/notes/`, `components/song/song-search-list.tsx`
- Impact: Structure implies unfinished modularization.
- Fix approach: Extract shared search/normalize helpers when needed, or remove empty dirs from mental model.

**Content quality gates too loose and report-stale:**
- Issue: `scripts/validate-content-gate.mjs` defaults `GATE_MAX_ARCHIVE=85` and `GATE_MAX_MV_MISSING=180`, so current `mvMissing≈150–180` still PASSes. Gate reads **checked-in** `docs/*-AUDIT.json` rather than re-scanning live content. Audits dated 2026-04-10/11 disagree with live album count (docs: 23–29 albums; live: 16).
- Files: `scripts/validate-content-gate.mjs`, `docs/CONTENT-ISSUES-AUDIT.json`, `docs/CATALOG-NORMALIZATION-AUDIT.json`, `docs/DEEPREAD-STYLE-AUDIT.md`
- Impact: False confidence; CI/local gate does not catch scaffold spam or songSlugs drift.
- Fix approach: Gate should invoke audit scripts (or share scanners), fail on template markers, lower MV/archive thresholds over time, and refresh reports on each run.

**Scaffolded deep-reads treated as “ready”:**
- Issue: ~137/184 deep-reads contain auto-scaffold phrases such as `自动补充的第`; ~125 contain `情绪结构样本`. Style audit (2026-04-10) flagged 166/184. Content issue audit’s “generic phrase” rules miss these scaffolds (zero `deepReadLikelyAIGeneric` / `deepReadTooShort` while files remain thin templates). Example: `content/songs/deep-reads/tian-hei-hei.md` repeats the same interpretation boilerplate per unit; `content/songs/deep-reads/shang-bu-liao.md` uses placeholder lyric units.
- Files: `content/songs/deep-reads/*.md`, `scripts/generate-line-by-line-scaffolds.mjs`, `scripts/config/audit-rules.mjs`, `scripts/audit-content-issues.mjs`, `scripts/audit-deepread-style.mjs`
- Impact: Product core value (“可读、可信的深度解读”) is not met for most catalog; UI can still show “逐段细读” for templated units that pass `isPlaceholderLikeText` filters.
- Fix approach: Expand PLACEHOLDER/scaffold markers; add uniqueness scoring; track per-song quality tiers (`scaffold` | `passable` | `editorial`); prioritize Phase 5 editorial rewrite of high-favorite songs first.

**Docs/UI drift vs catalog state:**
- Issue: Home copy still says archive backfill is next; README claims high-quality line-by-line + official MV coverage that metrics do not support. `.planning/STATE.md` still shows Phase 4 “in progress” with stale blockers (`archiveAlbumAssignments = 0` already true; `mvMissing = 180` slightly outdated).
- Files: `app/page.tsx`, `README.md`, `.planning/STATE.md`, `docs/PROGRESS-SNAPSHOT.md`, `docs/ISSUES-LOG.md`
- Impact: Planning and onboarding mislead maintainers.
- Fix approach: Refresh STATE after Phase 4 closeout; tone down README claims; keep ISSUES-LOG as source of open content bugs.

**Committed build logs and docs churn:**
- Issue: `log/yanzi.*.log` Cloudflare build logs are in-repo and not gitignored. `docs/` holds large numbers of one-off reclassify JSON/MD artifacts (32+ JSON files).
- Files: `log/`, `.gitignore`, `docs/ALBUM-RECLASSIFY-*`, `docs/ARCHIVE-*`
- Impact: Noise in git history; potential environment details in logs; harder to find living docs.
- Fix approach: Add `log/` to `.gitignore`; archive batch artifacts under `docs/archive/` or delete after milestone ship.

**Deprecated Cloudflare adapter path:**
- Issue: `@cloudflare/next-on-pages@1.13.16` is deprecated (build logs recommend OpenNext Cloudflare adapter). `build:cf` shells `npx @cloudflare/next-on-pages@1`.
- Files: `package.json`, `wrangler.jsonc`, `log/*.log`
- Impact: Future CF Pages builds may break or lose support; migration cost grows.
- Fix approach: Plan Phase 6 migration to `@opennextjs/cloudflare` (or current recommended adapter); lock versions; document exact `pages_build_output_dir`.

---

## Known Bugs

**`shang-bu-liao` lyrics still placeholder:**
- Symptoms: Song page shows placeholder/instruction text instead of real lyrics; deep-read lyric units are fake (“开场句 / 语句 5”).
- Files: `content/songs/raw-lyrics/shang-bu-liao.txt`, `content/songs/deep-reads/shang-bu-liao.md`, `docs/ISSUES-LOG.md`
- Trigger: Open `/songs/shang-bu-liao` → 完整歌词 section.
- Workaround: File exists so “missing file” audits pass, but content is `[待补录]` boilerplate (META-03 still open).

**Album `songSlugs` vs live membership (data bug):**
- Symptoms: Tools/docs that trust `album.songSlugs` undercount or invent tracklists; AI album context uses `songs.length` from index filter (OK) while `representativeSongs` may list titles not linked.
- Files: `content/albums/index.json`, `content/songs/index.json`
- Trigger: Diff `album.songSlugs` against songs with matching `albumSlug` (see metrics above).
- Workaround: UI uses `getSongsByAlbum`; do not use `songSlugs` for rendering until repaired.

**AI streaming client may drop partial SSE chunks:**
- Symptoms: Occasional missing characters or stalled answers if JSON is split across TCP chunks; parse errors silently ignored.
- Files: `components/song/song-ai-panel.tsx`, `components/album/album-ai-panel.tsx`
- Trigger: Long streaming responses with multi-byte UTF-8 or split `data:` lines.
- Workaround: Retry question; fix by buffering incomplete lines before `JSON.parse`.

**AI unusable on Cloudflare with local-Ollama defaults:**
- Symptoms: Production ask routes fail when `OPENAI_BASE_URL` points at `127.0.0.1:11434` (edge cannot reach maintainer laptop) or when `OPENAI_API_KEY` is empty (`enabled: false` → `AI_NOT_CONFIGURED`).
- Files: `lib/ai/config.ts`, `docs/SETUP.md`, `app/api/ask/*/route.ts`
- Trigger: Deploy without cloud-compatible base URL/key (project todos `sd-001`/`sd-002`).
- Workaround: Configure remote OpenAI-compatible provider in CF env; keep Ollama for WSL `npm run dev` only.

**Historical encoding corruption risk (fixed, residual process debt):**
- Symptoms: Past `????` / mojibake in UI and JSON (documented fixed in `docs/ISSUES-LOG.md`).
- Files: `docs/ISSUES-LOG.md`, `lib/content/sanitize.ts`, `scripts/repair-corrupted-content.mjs`
- Trigger: Non-UTF-8 rewrites of Chinese content.
- Workaround: Keep sanitize + gate checks; always write UTF-8; run build after batch content edits.

---

## Security Considerations

**Unauthenticated AI proxy (cost / abuse):**
- Risk: Public `POST /api/ask/song` and `/api/ask/album` forward arbitrary questions to the configured provider with no auth, rate limit, or question length cap. If a paid cloud key is set on CF, third parties can burn quota.
- Files: `app/api/ask/song/route.ts`, `app/api/ask/album/route.ts`, `lib/ai/client.ts`, `lib/ai/config.ts`
- Current mitigation: Private self-use intent; AI disabled when API key empty; no user PII required.
- Recommendations: Shared-secret header or CF Access; per-IP rate limit; max question length; provider spend caps; optional kill-switch env.

**Feedback endpoint + GitHub token + attachments:**
- Risk: `POST /api/feedback` creates GitHub issues with a long-lived token; accepts Base64 attachments without server-side size/type enforcement (client claims 5MB but API does not verify). Large payloads can stress edge worker memory. Contact/name land in GitHub issues.
- Files: `app/api/feedback/route.ts`, `components/common/feedback-form.tsx`
- Current mitigation: Honeypot field `website`; suggestion min length 5 / max 2000; R2 only if `CONTRIBUTIONS` binding exists; 503 if GitHub env missing.
- Recommendations: Enforce max attachment count/bytes and MIME allowlist server-side; least-privilege fine-grained PAT; rate limit; do not echo secrets in error bodies.

**Client-exposed feedback webhook:**
- Risk: `NEXT_PUBLIC_FEEDBACK_WEBHOOK_URL` is embedded in the client bundle as a fallback when `/api/feedback` fails.
- Files: `components/common/feedback-form.tsx`, `project/requirements.md`
- Current mitigation: Optional; primary path is server route.
- Recommendations: Prefer server-only webhook; if public, use a write-only endpoint with its own rate limits.

**Next.js security advisory on pinned version:**
- Risk: Build logs warn `next@15.2.4` is deprecated due to a known vulnerability (CVE-2025-66478 referenced in install logs). `npm` reported multiple high/critical advisories in the tree at last CF build.
- Files: `package.json`, `package-lock.json`, `log/yanzi.33af6f62-f20b-48a0-9388-406be7e9b39e.log`
- Current mitigation: Private site reduces exposure; still should not ignore RCE-class framework CVEs.
- Recommendations: Upgrade Next to patched 15.x; re-run `npm run build` / `build:cf` / tests; schedule dependency audit in Phase 6.

**Error detail leakage from AI routes:**
- Risk: Catch blocks return `error.message` to clients (`error: any`).
- Files: `app/api/ask/song/route.ts`, `app/api/ask/album/route.ts`
- Current mitigation: Useful for private debugging (project requirement for real errors).
- Recommendations: Map known codes (`AI_NOT_CONFIGURED`, upstream 4xx/5xx) to stable messages; log full detail server-side only when public.

**Secrets hygiene:**
- Risk: `.env.local` exists locally (gitignored). `.env.example` shows token placeholder patterns. Never commit real `GITHUB_FEEDBACK_TOKEN` / cloud keys.
- Files: `.env.example`, `.gitignore` (`.env`, `.env.local`)
- Current mitigation: Env files ignored; no secrets read during this audit.
- Recommendations: Rotate any token ever pasted into logs/issues; use CF encrypted env vars only.

---

## Performance Bottlenecks

**Full catalog JSON embedded in edge workers:**
- Problem: Mood and ask routes import entire `content/songs/index.json` (~104KB source; larger when bundled) into the edge bundle.
- Files: `lib/content/static-client.ts`, `app/api/recommend/mood/route.ts`, `app/api/ask/*/route.ts`
- Cause: Edge cannot use Node `fs`; static import is the current CF-compatible path.
- Improvement path: Split indexes (slug→metadata map), tree-shake recommend fields, or generate compact JSON at build time. Fine at ~184 songs; revisit if catalog grows 10×.

**Repeated full-file reads in Node content layer:**
- Problem: `getSong` / `getSongsByAlbum` each call `getSongs()` which re-reads and sanitizes the full index.
- Files: `lib/content/index.ts`
- Cause: No in-request memoization (acceptable for static generation).
- Improvement path: Module-level cache during build, or pass arrays down from page loaders (already partly done on song detail).

**Feedback Base64 upload path:**
- Problem: Attachments are read as data URLs client-side and posted as JSON Base64 (~33% overhead).
- Files: `components/common/feedback-form.tsx`, `app/api/feedback/route.ts`
- Cause: Simple edge-compatible design without multipart/R2 direct upload.
- Improvement path: Direct-to-R2 upload URLs; strict size caps; skip Base64 for multi-MB files.

**Client-side song search:**
- Problem: Entire song list is serialized into the songs page client component for filtering.
- Files: `app/songs/page.tsx`, `components/song/song-search-list.tsx`
- Cause: Simple client filter over ~184 records.
- Improvement path: Acceptable now; add server search or virtualization only if catalog/UI lag appears.

---

## Fragile Areas

**Cloudflare Pages output directory:**
- Files: `wrangler.jsonc`, `package.json` (`build:cf`), `project/requirements.md`, historical `log/*.log`
- Why fragile: `pages_build_output_dir` **must** stay `.vercel/output/static` for next-on-pages. Older logs show mis-set `.vercel/output` → successful builds that 404 at runtime. README still says output `.vercel/output` (wrong for current wrangler).
- Safe modification: Change adapter only with a documented end-to-end deploy smoke; never “simplify” the path without verifying custom domain.
- Test coverage: No automated deploy smoke (Phase 6 gap; project todo `sd-001`).

**Static generation + Edge APIs split:**
- Files: `app/songs/[slug]/page.tsx` (`force-static`, `dynamicParams = false`), `app/albums/[slug]/page.tsx`, all `app/api/**/route.ts` (`runtime = 'edge'`)
- Why fragile: New songs require rebuild for SSG routes; edge cannot call Node content APIs; content changes without rebuild leave AI metadata stale on CF.
- Safe modification: Always rebuild after content batches; keep generateStaticParams driven by index.
- Test coverage: No SSG/content regression tests.

**Sanitize filters vs scaffold content:**
- Files: `lib/content/sanitize.ts`, song detail page quality flags in `app/songs/[slug]/page.tsx`
- Why fragile: Placeholder detection only knows `待补充` / `基础深读版本整理` and corruption patterns; scaffold prose still renders as “real” fine-read.
- Safe modification: Extend markers before bulk scaffold generation; prefer status fields over phrase heuristics alone.
- Test coverage: No unit tests for `sanitize.ts` or deep-read parsing.

**Mood recommender substring matching:**
- Files: `lib/recommend/mood.ts`
- Why fragile: Bidirectional `includes` can over-match short terms; fallback returns favorite/ready songs with score 0.5 even when mood is nonsense.
- Safe modification: Add tests for Chinese short tags before changing scoring weights.
- Test coverage: Partial (`tests/recommend/mood.test.ts`, `tests/api/recommend-mood-route.test.ts` only).

**Content encoding / bulk script rewrites:**
- Files: `scripts/repair-corrupted-content.mjs`, `scripts/apply-title-map.mjs`, various audit/remediation scripts
- Why fragile: History of mojibake from bulk edits; scripts can rewrite hundreds of MD/JSON files.
- Safe modification: Dry-run + UTF-8 verification + `npm run build` after each batch; update ISSUES-LOG first for open defects.
- Test coverage: Scripts untested; rely on manual gates.

---

## Scaling Limits

**Filesystem catalog (JSON/MD/TXT):**
- Current capacity: ~184 songs, ~16 albums, ~184 deep-reads (~1.4MB), ~184 lyrics (~0.75MB), timeline 16 events, tags 10.
- Limit: Human editorial throughput and review quality, not Node/Next serving. Edge bundle size and cold-start grow with full index embeds; CF Pages upload limits already motivated `build:cf` comments in README.
- Scaling path: Stay filesystem until multi-editor concurrency appears; then consider build-time index shards or a light DB. Prioritize quality tiers over raw song count.

**AI provider:**
- Current capacity: Single streaming completion per user action; local Ollama for dev; optional cloud for deploy.
- Limit: No queue, no caching, no multi-turn session store; concurrent public users would hit provider rate/cost limits first.
- Scaling path: Cache frequent Q&A, session memory only if product expands (v2 EXP-03); keep private auth.

**Feedback / R2 / GitHub Issues:**
- Current capacity: Issue-per-submission model; optional R2 binding `CONTRIBUTIONS`.
- Limit: GitHub API abuse limits; issue spam; R2 cost if attachments unrestricted.
- Scaling path: Rate limits + moderation labels; batch local JSONL only for private mode (`content/feedback/suggestions.jsonl` already gitignored).

---

## Dependencies at Risk

**`next@15.2.4`:**
- Risk: Known security vulnerability per install/build warnings (CVE-2025-66478 class advisory); outdated patch line.
- Impact: Framework risk on any exposed deployment; may block security-conscious hosting.
- Migration plan: Upgrade to current patched 15.x; fix any App Router / typedRoutes breakages; re-verify `build` + `build:cf`.

**`@cloudflare/next-on-pages@^1.13.16`:**
- Risk: Package deprecated in favor of OpenNext Cloudflare adapter.
- Impact: Future CF compatibility and support; surprise build failures.
- Migration plan: Track OpenNext CF docs; pilot `build:cf` replacement on a branch; keep `wrangler.jsonc` output dir contract explicit.

**`marked@15.0.7` (unused):**
- Risk: Unmaintained usage path / unnecessary audit surface.
- Impact: Noise in `npm audit`; confusion about Markdown rendering.
- Migration plan: Use it properly for deep-read HTML, or remove.

**React 19 + Next 15 stack:**
- Risk: Relatively new major combo; ecosystem examples still mid-migration.
- Impact: Occasional type/`params: Promise<>` churn already visible in pages.
- Migration plan: Prefer official Next patterns; keep upgrades deliberate with smoke tests.

---

## Missing Critical Features

**Editorial-quality deep-reads at scale:**
- Problem: Coverage is “file exists + ready flag,” not trustworthy line-by-line reading. Scaffold markers dominate.
- Blocks: Core value of the site; Phase 5 success criteria READ-01/READ-02.

**MV link coverage:**
- Problem: Live count ~34 deep-reads with `mvUrl` HTTP links vs ~150 without (audit snapshot previously 180). Remediation script last run remediated 0.
- Blocks: READ-02 completeness; song-page MV CTA empty for most tracks.
- Files: `docs/CONTENT-ISSUES-AUDIT.md`, `docs/MV-LINK-REMEDIATION.md`, `scripts/remediate-mv-links.mjs`

**AI grounded on deep-read + lyrics:**
- Problem: Edge + prompt wiring omit the richest content layer.
- Blocks: Credible AI 导览; sd-002 end-to-end quality.

**Production reliability tooling:**
- Problem: No middleware, no deploy smoke, thin tests, domain stability still a P0 todo (`yanzi.shuoyan.me`).
- Blocks: Phase 6 QA-01–03; safe public exposure.

**Rate limiting / access control for mutating & paid APIs:**
- Problem: Feedback and AI are open POST endpoints.
- Blocks: Safe non-private deployment (v2 EXP-01).

**Album tracklist integrity automation:**
- Problem: No gate fails on `songSlugs` ↔ `albumSlug` drift.
- Blocks: Trustworthy catalog normalization closure (CATA/META).

---

## Test Coverage Gaps

**AI ask routes and client stream parsing:**
- What's not tested: `POST /api/ask/song`, `POST /api/ask/album`, SSE parsing, `AI_NOT_CONFIGURED`, missing slug/question, upstream failures.
- Files: `app/api/ask/song/route.ts`, `app/api/ask/album/route.ts`, `components/song/song-ai-panel.tsx`, `components/album/album-ai-panel.tsx`, `lib/ai/*`
- Risk: Production AI regressions only found manually (sd-002/sd-020).
- Priority: High

**Feedback route:**
- What's not tested: Honeypot, validation, missing GitHub env 503, attachment handling, GitHub error 502.
- Files: `app/api/feedback/route.ts`, `components/common/feedback-form.tsx`
- Risk: Silent contribution loss; token misconfig unnoticed.
- Priority: High

**Content loaders & sanitize:**
- What's not tested: `getSongDeepRead` frontmatter parse, lyrics fallback TXT → frontmatter, corruption/placeholder filtering, interpretation unit dropping.
- Files: `lib/content/index.ts`, `lib/content/sanitize.ts`, `lib/content/static-client.ts`
- Risk: Silent empty sections on song pages after content batch edits.
- Priority: High

**Related songs & daily pick:**
- What's not tested: `lib/recommend/related.ts`, `lib/recommend/daily.ts`
- Files: above + song detail / home usage
- Risk: Broken related rail or daily song edge cases.
- Priority: Medium

**Catalog integrity automation:**
- What's not tested: songSlugs consistency, placeholder lyrics detection, scaffold-phrase counts, MV host rules as unit tests (scripts exist but are manual/report-based).
- Files: `scripts/audit-*.mjs`, `scripts/validate-content-gate.mjs`
- Risk: Gate green while quality collapses.
- Priority: High (for content-heavy phases)

**Page / deploy smoke:**
- What's not tested: Home/songs/albums/timeline/feedback HTML render; `npm run build:cf` artifact presence; custom domain.
- Files: `app/**`, `wrangler.jsonc`
- Risk: 404-after-green-build class failures recur.
- Priority: Medium (private) / High (public domain)

**Current baseline:**
- Only `tests/recommend/mood.test.ts` and `tests/api/recommend-mood-route.test.ts` (4 tests). Matches PROGRESS-SNAPSHOT; insufficient for Phase 6.

---

## Open planning / ops concerns (cross-check)

| Concern | Evidence | Suggested phase |
|--------|----------|-----------------|
| Close Phase 4 data consistency (`songSlugs`, album summaries) | Live album/song mismatch metrics | Phase 4 tail / 04-02 |
| Deep-read quality upgrade | 137 scaffold files; style audit 166 flagged | Phase 5 |
| Fix `shang-bu-liao` real lyrics | ISSUES-LOG open; placeholder TXT | Phase 5 META-03 |
| MV backfill | ~150 missing | Phase 5 READ-02 |
| AI grounding + provider templates | prompts unused; edge no MD; sd-003 | Phase 5–6 |
| Expand tests + content gate truthfulness | 2 test files; loose gate thresholds | Phase 6 |
| Next CVE + next-on-pages deprecation | package.json + build logs | Phase 6 |
| Domain / deploy smoke | project/todo.md sd-001 | Phase 6 |

---

*Concerns audit: 2026-07-17*
