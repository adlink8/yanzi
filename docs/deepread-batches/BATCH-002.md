# Deep-read editorial batch BATCH-002

## Role
你是内容执行子代理。把下列歌曲的 deep-read 从模板改为 **按曲定制** 解读。

## Working directory
`/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads`

## Spec (must follow)
Read and obey: `docs/DEEPREAD-EDITORIAL-SPEC.md`

## Songs in this batch ONLY
1. `cuo-jue` — 错觉 (favorite=medium, was scaffold)
2. `di-liu-gan` — 第六感 (favorite=medium, was scaffold)
3. `di-yi-tian` — 第一天 (favorite=medium, was scaffold)
4. `e-lover` — E Lover (favorite=medium, was scaffold)
5. `fei-pu-er-xia` — 飞瀑而下 (favorite=medium, was scaffold)
6. `gu-ji-gu-ji` — 咕叽咕叽 (favorite=medium, was scaffold)

Do **not** edit songs outside this list.

## Per-song workflow
For each slug:
1. Read `content/songs/raw-lyrics/{slug}.txt` (if placeholder-only, still write song-specific overview from card summary; skip fake lyricText stubs).
2. Read current `content/songs/deep-reads/{slug}.md` and index card in `content/songs/index.json`.
3. Rewrite deep-read YAML + body:
   - body overview: song-specific, ≥160 Chinese chars, no scaffold phrases
   - lyricInterpretations: 4–6 units, each anchored to **real lyric lines**
   - each interpretation unique (no copy-paste across units or songs)
   - songDesign specific to this track
   - keep verified mvUrl only; delete known-fake mass URLs; never invent
   - updatedAt: today's date; status: ready
4. Lightly align index summary/moodTags/themeTags only if clearly wrong.

## Forbidden
- Template language listed in the spec
- Inventing lyrics, MV links, or interview facts
- Changing other songs / album structure

## Verify before finish
```bash
npm run verify:deepread-batch -- --batch 2
npm run report:deepread-quality
```
All songs in this batch must be `editorial`.

## Return (confirmation only)
## Batch BATCH-002 Complete
- slugs upgraded: ...
- verify: pass/fail
- notes: ...

