# Deep-read editorial batches

Generated: 2026-07-17T01:14:34.993Z

Candidates: **24** · Batches: **4** · size=6

Filters: `tiers=scaffold,passable` favorite=`medium`

Spec: `docs/DEEPREAD-EDITORIAL-SPEC.md`

| Batch | Songs | Prompt |
|-------|------:|--------|
| BATCH-001 | 6 | [`docs/deepread-batches/BATCH-001.md`](./BATCH-001.md) |
| BATCH-002 | 6 | [`docs/deepread-batches/BATCH-002.md`](./BATCH-002.md) |
| BATCH-003 | 6 | [`docs/deepread-batches/BATCH-003.md`](./BATCH-003.md) |
| BATCH-004 | 6 | [`docs/deepread-batches/BATCH-004.md`](./BATCH-004.md) |

## Dispatch

Assign **one subagent per BATCH-*.md**. Each agent upgrades only its slugs to `editorial`.

```bash
npm run prepare:deepread-batches -- --size 6 --favorite medium --limit 24
npm run verify:deepread-batch -- --batch 1
```

