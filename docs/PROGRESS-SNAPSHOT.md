# Progress Snapshot

Updated: 2026-07-17

## Current Status

- Project mode: private self-use
- Main workflow: 时间线 → 专辑 → 歌曲
- Current phase: **Phase 5 — Deep Read Quality Upgrade**（Phase 4 catalog normalization closed）
- AI: OpenAI-compatible **cloud-first**（local Ollama optional only）
- Build: `npm run build` / `npm run build:cf` expected green on clean tree

## Current Totals

- Indexed songs: **184**
- Deep-read files: **185**
- Raw lyrics files: **184**（`shang-bu-liao` 仍为待补录占位正文）
- Album entries: **17**（15 录音室/正式主线 + `official-singles-collection` + `start-live`）
- Archive-group album assignments: **0**
- `albumSlug` orphans: **0**
- `songSlugs` drift vs `albumSlug`: **0**

## Milestone: Catalog Normalization Closed

- Temporary archive buckets cleared
- `start-live` album restored for 17 Start 演唱会 tracks
- Album `songSlugs` regenerated from song `albumSlug`
- META-01（专辑摘要 + 代表曲）满足

## Open Quality Gaps (Phase 5+)

1. Majority of deep-reads still scaffold/template-like
2. Real lyrics still needed where placeholders remain
3. MV links sparse
4. Test coverage still mostly mood-recommend only

## Recently Completed (2026-07-17)

1. Planning docs sync (STATE / ROADMAP / REQUIREMENTS / PROJECT)
2. Phase 4 data closeout (`start-live` + songSlugs)
3. AI docs & `.env.example` shifted off local-model-centric defaults
4. Codebase map under `.planning/codebase/`

## Next Phase

1. Plan/execute Phase 5 deep-read quality upgrade
2. Prioritize high-favorite songs + real lyric fixes
3. Then Phase 6 reliability hardening

## Related Docs

- `.planning/STATE.md`
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/codebase/CONCERNS.md`
- `docs/SETUP.md`
- `docs/ISSUES-LOG.md`
