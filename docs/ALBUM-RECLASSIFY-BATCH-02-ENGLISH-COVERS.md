# Album Reclassify Batch 02 - English Covers

Generated: 2026-04-10

## Scope: 13 songs

- Source bucket: `english-cover-archive`
- Source of truth: `docs/ALBUM-RECLASSIFY-WORKLIST.json`
- Proposal artifact: `docs/ALBUM-RECLASSIFY-BATCH-02-PROPOSALS.json`
- Goal: resolve English/covers grouping with consistent album strategy.

## Exact 13-Song Scope Reference

Filter rule:

- `currentAlbumSlug === "english-cover-archive"`

Resolved slugs (13):

1. `dream-a-little-dream-of-me`
2. `hey-jude`
3. `my-story-your-song`
4. `opening`
5. `radio`
6. `silent-all-these-years`
7. `someone`
8. `sometimes-love-just-aint-enough`
9. `sparking-diamonds`
10. `stefanie`
11. `that-i-would-be-good`
12. `up2u`
13. `venus`

## Inputs

- `content/songs/index.json`
- `content/albums/index.json`
- `docs/ALBUM-RECLASSIFY-WORKLIST.json`
- `docs/ALBUM-RECLASSIFY-BATCH-02-PROPOSALS.json`

## Processing Order

1. Validate scope before any edits:
   - `docs/ALBUM-RECLASSIFY-BATCH-02-PROPOSALS.json` must contain `"scope": 13`.
   - Worklist filter count for `english-cover-archive` must be 13.
2. Apply `highConfidence` proposals first:
   - Move only songs listed in `highConfidence`.
   - Keep a per-song reason note from the proposals file.
3. Review `mediumConfidence` proposals:
   - Apply only if album evidence is confirmed during execution.
   - Otherwise defer to `manualRequired`.
4. Defer all `manualRequired` entries:
   - Do not migrate these in the first pass.
   - Keep them in `english-cover-archive` and track follow-up research.
5. Keep all `keepInArchiveRecommended` slugs in archive until new evidence appears.

## Execution Steps

1. Filter entries where `currentAlbumSlug === "english-cover-archive"`.
2. Load `docs/ALBUM-RECLASSIFY-BATCH-02-PROPOSALS.json`.
3. Execute high-confidence moves first; skip manual-required entries.
4. Normalize `era` and `albumSlug` in `content/songs/index.json` only for applied moves.
5. Ensure target album has readable summary and representative songs in `content/albums/index.json` only for applied moves.

## Quick Commands

```bash
# Count current batch size (must be 13 before execution)
node -e "const w=require('./docs/ALBUM-RECLASSIFY-WORKLIST.json');console.log(w.entries.filter(e=>e.currentAlbumSlug==='english-cover-archive').length)"

# Verify proposal scope is also 13
node -e "const p=require('./docs/ALBUM-RECLASSIFY-BATCH-02-PROPOSALS.json');console.log(p.scope)"

npm run audit:content
npm run audit:catalog
npm run gate:content
```

## Acceptance

- Scope verification passes at 13 before execution.
- High-confidence items are applied first (if any).
- Manual-required items are explicitly deferred.
- All changed songs still resolve to existing album slugs.
- `npm run gate:content` passes.

## Risk Controls

- Keep this batch independent from Batch 01 and Batch 03 commits.
- Verify title language and era consistency for each migrated song.
