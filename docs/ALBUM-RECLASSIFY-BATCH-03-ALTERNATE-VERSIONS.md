# Album Reclassify Batch 03 - Alternate Versions

Generated: 2026-04-10

## Scope: 5 songs

- Source bucket: `alternate-versions-archive`
- Rule applied: `canonicalSlug = slug` with trailing `-2` removed.
- Remap condition: canonical song exists and canonical `albumSlug` does not contain `archive`.

## Outcome Summary

- Remapped: 2
- Unchanged: 3
- Scope check: `5` (pass)

## Remapped

1. `e-lover-2`
   - album: `alternate-versions-archive` -> `yanzi`
   - era: `9999 时期` -> `出道起点`
   - reason: `canonical_slug_match_non_archive_album`
2. `wei-zhi-de-jing-cai-2`
   - album: `alternate-versions-archive` -> `stefanie-self-titled`
   - era: `9999 时期` -> `自我整合`
   - reason: `canonical_slug_match_non_archive_album`

## Unchanged

1. `sweet-child-o-mine-2`
   - reason: canonical `sweet-child-o-mine` is in `archive-unassigned-mainline`.
   - next step: reclassify canonical `sweet-child-o-mine` to a non-archive album first, then rerun Batch 03 rule.
2. `tian-yue-liang-ye-yue-hei-2`
   - reason: canonical `tian-yue-liang-ye-yue-hei` is in `archive-unassigned-mainline`.
   - next step: resolve canonical album placement before remapping this alternate version.
3. `zhong-yu-2`
   - reason: canonical `zhong-yu` is in `archive-unassigned-mainline`.
   - next step: move canonical `zhong-yu` out of archive bucket, then rerun this mapping rule.

## Artifacts

- `docs/ALBUM-RECLASSIFY-BATCH-03-RESULT.json`
- `content/songs/index.json`
