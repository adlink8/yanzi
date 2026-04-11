# Album Reclassify Batch 01 - Mainline

Generated: 2026-04-10

## Scope: 67 songs

- Source bucket: `archive-unassigned-mainline`
- Source of truth: `docs/ALBUM-RECLASSIFY-WORKLIST.json`
- Proposal artifact: `docs/ALBUM-RECLASSIFY-BATCH-01-PROPOSALS.json`
- Goal: move songs from temporary archive bucket to formal album slugs with explicit decision trace.

## Inputs

- `content/songs/index.json`
- `content/albums/index.json`
- `docs/ALBUM-RECLASSIFY-WORKLIST.json`
- `docs/ALBUM-RECLASSIFY-BATCH-01-PROPOSALS.json`
- `docs/CONTENT-ISSUES-AUDIT.json`

## Exact Slug Scope References

- Canonical full list (67): `docs/ALBUM-RECLASSIFY-BATCH-01-PROPOSALS.json -> manualRequired[*].slug`
- Confidence buckets: `highConfidence[*]` and `mediumConfidence[*]` are intentionally empty for this batch (no strong evidence in worklist).
- Execution shards (exact slug arrays): `subBatches[*].slugs`

```text
mainline-manual-01: 180-du, ai-cong-ling-kai-shi, bu-neng-he-ni-yi-qi, bu-shi-zhen-de-ai-wo, bu-tong, chao-ren-lei, dang-dong-ye-jian-nuan, dong-shi, fan-guo-lai-zou-zou, guan-yu, he-ping, jiu-shi-zhe-yang
mainline-manual-02: ke, lan-de-qu-guan, lei-zhui, lets-vino, lian-xi, liu-lang-di-tu, mei-shi-jian, meng-bu-luo, meng-xiang-tian-kong, ming-tian-de-ji-yi, ming-tian-qing-tian
mainline-manual-03: ni-hao-bu-hao, ni-ming-wan-sui, nian-qing-wu-xian, nong-mei-mao, on-the-road, one-united-people, ping-ri-kuai-le, qin-guang, quan-xin-quan-yi, ren-zhi, rise
mainline-manual-04: shi-guang-xiao-tou, sweet-child-o-mine, ta-men-de-ge, tai-yang-di-xia, tian-kong, tian-yue-liang-ye-yue-hei, ting-jian, tong-yao-1987, we-will-get-there, wei-rao, wen-rou-mayday-blue-20th
mainline-manual-05: wo-bu-ai, wo-hen-wo-ai-ni, wo-shi-wo, wo-wei-shen-me-na-me-ai-ni, wo-xiang, wo-yao-kuai-le, wu-xian-da, xing-qi-yi-tian-qi-qing-wo-li-kai-ni, xu-yao-ni, xuan-wo, xue-hui
mainline-manual-06: yan-shen, yang-zi, yi-qi-zou-dao, yi-yang-de-xia-tian, yong-gan, yong-yuan, zai-ye-bu-jian, zhong-jian-di-dai, zhong-yu, zhui, zuo-zhan
```

## Sub-Batch Execution Order

1. `mainline-manual-01` (size: 12)
2. `mainline-manual-02` (size: 11)
3. `mainline-manual-03` (size: 11)
4. `mainline-manual-04` (size: 11)
5. `mainline-manual-05` (size: 11)
6. `mainline-manual-06` (size: 11)

## Execution Steps

1. Confirm scope and slug set from `docs/ALBUM-RECLASSIFY-BATCH-01-PROPOSALS.json` (`scope === 67`, `manualRequired[*].slug`).
2. Execute manual decisions in `subBatches` order; assign one explicit target album slug per song.
3. Update `content/songs/index.json` fields: `albumSlug`, `era`.
4. If target album metadata is weak, patch album summary and representative songs in `content/albums/index.json`.
5. Keep a decision trail: `slug -> targetAlbumSlug -> evidence` in commit message or review notes.

## Quick Commands

```bash
# Count current batch size (must be 67 before execution)
node -e "const w=require('./docs/ALBUM-RECLASSIFY-WORKLIST.json');console.log(w.entries.filter(e=>e.currentAlbumSlug==='archive-unassigned-mainline').length)"

# Verify proposals scope and sub-batch total
node -e "const p=require('./docs/ALBUM-RECLASSIFY-BATCH-01-PROPOSALS.json');console.log(p.scope,p.subBatches.reduce((n,b)=>n+b.size,0))"

# Re-run audits after batch
npm run audit:content
npm run audit:catalog
npm run gate:content
```

## Acceptance

- `archive-unassigned-mainline` count decreases from 67.
- No new `missingAlbumSlug` or `albumSlugNotFound`.
- `npm run gate:content` passes.

## Execution Log

- 2026-04-10: Executed sub-batch `mainline-manual-01` (12 songs).
- Result artifact: `docs/ALBUM-RECLASSIFY-BATCH-01-SUBBATCH-01-RESULT.json`.
- Next: continue `mainline-manual-02` (11 songs).
## Risk Controls

- Commit in small chunks (10-15 songs per commit).
- Never mix this batch with English/alternate buckets in one commit.
- If uncertain on a song, keep it in a formal archive bucket but record rationale.


- 2026-04-10: Executed sub-batch `mainline-manual-02` (11 songs).
- Result artifact: `docs/ALBUM-RECLASSIFY-BATCH-01-SUBBATCH-02-RESULT.json`.
- Execution mode: two subagents (`part-a` + `part-b`) merged by main thread.
- Next: continue `mainline-manual-03` (11 songs).


- 2026-04-10: Executed sub-batch `mainline-manual-03` (11 songs, 3 high-confidence remaps).
- Result artifact: `docs/ALBUM-RECLASSIFY-BATCH-01-SUBBATCH-03-RESULT.json`.
- Execution mode: two subagents (`part-a` + `part-b`) merged by main thread.
- Remaining unresolved in this sub-batch: 8 songs.


- 2026-04-10: Executed unresolved follow-up with 3 subagents (A/B/C).
- Added single album slugs: `ni-ming-wan-sui-single`, `one-united-people-single`, `qin-guang-single`.
- Result artifact: `docs/ALBUM-RECLASSIFY-UNRESOLVED-MERGED-RESULT.json`.
- Remaining manual unresolved: 5 songs.


- 2026-04-10: Executed final unresolved pass (no subagents) for remaining 5 songs.
- Added single album slugs: `ni-hao-bu-hao-single`, `on-the-road-single`, `quan-xin-quan-yi-single`, `ren-zhi-single`, `rise-single`.
- Result artifact: `docs/ALBUM-RECLASSIFY-UNRESOLVED-FINAL-RESULT.json`.
- Mainline archive bucket reduced to 33 songs.


- 2026-04-10: Executed sub-batch `mainline-manual-04` via 3 subagents (A/B/C) and main-thread merge.
- Result artifact: `docs/ALBUM-RECLASSIFY-BATCH-01-SUBBATCH-04-RESULT.json`.
- Added 11 single slugs for this sub-batch and remapped all 11 songs.
- Mainline archive bucket reduced to 22 songs.


- 2026-04-10: Executed mainline remaining finalize pass (22 songs).
- Result artifact: `docs/ALBUM-RECLASSIFY-MAINLINE-REMAINING-RESULT.json`.
- Added 22 single slugs and remapped all remaining mainline archive songs.
- `archive-unassigned-mainline` reduced to 0.


- 2026-04-10: Simultaneous handling completed for remaining buckets (`english-cover-archive` + `alternate-versions-archive`).
- Result artifact: `docs/ALBUM-RECLASSIFY-REMAINING-BUCKETS-RESULT.json`.
- Added 13 single slugs and remapped 16 songs.
- All archive buckets reduced to 0.

