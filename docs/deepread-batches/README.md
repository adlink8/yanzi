# Deep-read editorial batches

Generated: 2026-07-17T01:24:35.950Z

Candidates: **78** · Batches: **13** · size=6

Filters: `tiers=scaffold,passable` favorite=`all`

Spec: `docs/DEEPREAD-EDITORIAL-SPEC.md`

| Batch | Songs | Prompt |
|-------|------:|--------|
| BATCH-001 | 6 | [`docs/deepread-batches/BATCH-001.md`](./BATCH-001.md) |
| BATCH-002 | 6 | [`docs/deepread-batches/BATCH-002.md`](./BATCH-002.md) |
| BATCH-003 | 6 | [`docs/deepread-batches/BATCH-003.md`](./BATCH-003.md) |
| BATCH-004 | 6 | [`docs/deepread-batches/BATCH-004.md`](./BATCH-004.md) |
| BATCH-005 | 6 | [`docs/deepread-batches/BATCH-005.md`](./BATCH-005.md) |
| BATCH-006 | 6 | [`docs/deepread-batches/BATCH-006.md`](./BATCH-006.md) |
| BATCH-007 | 6 | [`docs/deepread-batches/BATCH-007.md`](./BATCH-007.md) |
| BATCH-008 | 6 | [`docs/deepread-batches/BATCH-008.md`](./BATCH-008.md) |
| BATCH-009 | 6 | [`docs/deepread-batches/BATCH-009.md`](./BATCH-009.md) |
| BATCH-010 | 6 | [`docs/deepread-batches/BATCH-010.md`](./BATCH-010.md) |
| BATCH-011 | 6 | [`docs/deepread-batches/BATCH-011.md`](./BATCH-011.md) |
| BATCH-012 | 6 | [`docs/deepread-batches/BATCH-012.md`](./BATCH-012.md) |
| BATCH-013 | 6 | [`docs/deepread-batches/BATCH-013.md`](./BATCH-013.md) |

## Dispatch

Assign **one subagent per BATCH-*.md**. Each agent upgrades only its slugs to `editorial`.

```bash
npm run prepare:deepread-batches -- --size 6 --favorite medium --limit 24
npm run verify:deepread-batch -- --batch 1
```

