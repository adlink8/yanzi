# Progress Snapshot

Updated: 2026-07-17

## Current Status

- Project mode: private self-use
- Main workflow: 时间线 → 专辑 → 歌曲 → 按曲 deep-read
- **Phase 5 COMPLETE** — 全库 deep-read `editorial`（0 scaffold / 0 passable）
- **Next:** Phase 6 reliability；MV 补链；真歌词补录
- AI: OpenAI-compatible **cloud-first**
- Branch: `chore/ci-and-full-tests`（含 CI + 内容）

## Current Totals

| Item | Count / status |
|------|----------------|
| Indexed songs | **184** |
| Deep-read files | **184+**（与索引对齐） |
| Deep-read tier editorial | **184** |
| Deep-read tier scaffold | **0** |
| Deep-read tier passable | **0** |
| Raw lyrics files | **184**（`shang-bu-liao` 仍为待补录占位） |
| Albums | **17**（含 `start-live`、`official-singles-collection`） |
| Archive-group assignments | **0** |
| albumSlug orphans | **0** |
| songSlugs drift | **0** |
| Missing verified mvUrl | **~179** |
| Vitest tests | **52** |

## Milestones Reached

### Catalog Normalization (Phase 4)
- Archive buckets cleared；`start-live` restored
- `songSlugs` derived from `albumSlug`

### Deep Read Quality (Phase 5)
- Spec: `docs/DEEPREAD-EDITORIAL-SPEC.md`
- Pipeline: report → prepare batches → subagent rewrite → verify
- Catalog-wide **per-song** editorial (not template scaffolds)
- Depth upgrade waves: body ≥280 chars, 5–6 lyric-anchored units for polished set
- Lyrics fallback: placeholder raw-lyrics never shown as full lyrics

## Open Gaps (Phase 6+)

1. Verified **MV** coverage still sparse
2. **`shang-bu-liao`** real lyrics still pending
3. Optional smoke/E2E for pages/feedback
4. Edge AI still limited catalog metadata (deep-read body not fully in edge context)

## How to re-check quality

```bash
npm run report:deepread-quality
npm run verify:deepread-batch -- --slugs tian-hei-hei,yu-jian
npm run ci
```

## Related Docs

- `.planning/STATE.md` / `ROADMAP.md` / `REQUIREMENTS.md`
- `docs/DEEPREAD-EDITORIAL-SPEC.md`
- `docs/DEEPREAD-QUALITY-REPORT.md`
- `docs/deepread-batches/`
- `docs/SETUP.md`
- `docs/ISSUES-LOG.md`
- `docs/CODE-QUALITY.md`
