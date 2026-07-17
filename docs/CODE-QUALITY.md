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
| Deep-read quality report | `npm run report:deepread-quality` | optional local |
| Full local CI mirror | `npm run ci` | — |

GitHub Actions: `.github/workflows/ci.yml` on push/PR.

## Content quality (deep-reads)

| Metric | Status |
|--------|--------|
| editorial | **184 / 184** |
| scaffold | **0** |
| passable | **0** |
| Spec | `docs/DEEPREAD-EDITORIAL-SPEC.md` |
| Batches | `docs/deepread-batches/` |

```bash
npm run report:deepread-quality
npm run prepare:deepread-batches -- --size 6 --limit 48
npm run prepare:deepread-depth -- --size 6 --limit 48
npm run verify:deepread-batch -- --batch 1
```

## Coverage map (tests)

| Area | Files |
|------|--------|
| Recommend | `tests/recommend/{mood,related,daily}.test.ts` |
| Content helpers | `tests/content/{sanitize,static-client,catalog-integrity,lyrics-fallback}.test.ts` |
| AI | `tests/ai/{config,client,context-builders,prompts}.test.ts` |
| API | `tests/api/{recommend-mood,ask-song,ask-album,feedback}-route*.test.ts` |

## Review findings

### Fixed
- Constrained AI system prompts wired into context builders
- Catalog integrity tests for albumSlug / songSlugs
- CI + typecheck/lint formalized
- Catalog-wide non-template deep-reads (editorial)

### Remaining
- Edge ask routes still omit deep-read body context
- Verified MV coverage sparse (~179 missing)
- Content gate still uses checked-in audit JSON thresholds
- No Playwright E2E yet (Phase 6)
- `@cloudflare/next-on-pages` deprecation path

## How to run before PR

```bash
npm run ci
npm run report:deepread-quality
```
