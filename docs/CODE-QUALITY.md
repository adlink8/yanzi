# Code Quality Snapshot

Updated: 2026-07-17  
Branch context: `chore/ci-and-full-tests`

## Automated checks

| Check | Command | CI |
|-------|---------|----|
| TypeScript | `npm run typecheck` | yes |
| ESLint (Next core-web-vitals) | `npm run lint` | yes |
| Vitest | `npm test` | yes |
| Catalog audit | `npm run audit:catalog` | yes |
| Content gate | `npm run gate:content` | yes |
| Full local CI mirror | `npm run ci` | — |

GitHub Actions: `.github/workflows/ci.yml` on push/PR.

## Coverage map (tests)

| Area | Files |
|------|--------|
| Recommend | `tests/recommend/{mood,related,daily}.test.ts` |
| Content helpers | `tests/content/{sanitize,static-client,catalog-integrity}.test.ts` |
| AI | `tests/ai/{config,client,context-builders,prompts}.test.ts` |
| API | `tests/api/{recommend-mood,ask-song,ask-album,feedback}-route.test.ts` |

## Review findings (this pass)

### Fixed now
- AI prompts: `buildSongPrompt` / `buildAlbumPrompt` now use constrained builders in `lib/ai/prompts.ts` (anti-hallucination, was dead code).
- Catalog integrity regression tests lock `albumSlug` / `songSlugs` consistency.
- CI + typecheck/lint scripts formalized.

### Remaining (not blocking CI)
- Edge ask routes still pass `deepRead = null` — AI cannot cite full lyrics/deep-read until context packaging for Edge.
- Most deep-read bodies are scaffold-quality (content Phase 5).
- Content gate still reads checked-in audit JSON with loose MV thresholds — consider live scan later.
- No E2E browser suite yet (Playwright optional for Phase 6).
- `@cloudflare/next-on-pages` deprecation path remains for deploy workstream.

### Conventions to keep
- 2-space, single quotes, no semicolons
- Path alias `@/`
- API routes: small handlers, explicit status codes, `runtime = 'edge'`
- Tests: behavior-focused status/payload/ranking assertions

## How to run before PR

```bash
npm run ci
```
