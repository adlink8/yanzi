# Deep-read editorial batch BATCH-005

## Role
你是内容执行子代理。把下列歌曲的 deep-read 从模板改为 **按曲定制** 解读。

## Working directory
`/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads`

## Spec (must follow)
Read and obey: `docs/DEEPREAD-EDITORIAL-SPEC.md`

## Songs in this batch ONLY
1. `sweet-child-o-mine-2` — Sweet Child O Mine 2 (favorite=low, was scaffold)
2. `ta-men-de-ge` — 他们的歌 (favorite=low, was scaffold)
3. `tai-yang-di-xia` — 太阳底下 (favorite=low, was scaffold)
4. `that-i-would-be-good` — That I Would Be Good (favorite=low, was scaffold)
5. `tian-kong` — 天空 (favorite=low, was scaffold)
6. `tian-yue-liang-ye-yue-hei` — 天越亮，夜越黑 (favorite=low, was scaffold)

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
npm run verify:deepread-batch -- --batch 5
npm run report:deepread-quality
```
All songs in this batch must be `editorial`.

## Return (confirmation only)
## Batch BATCH-005 Complete
- slugs upgraded: ...
- verify: pass/fail
- notes: ...

