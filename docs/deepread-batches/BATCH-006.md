# Deep-read editorial batch BATCH-006

## Role
你是内容执行子代理。把下列歌曲的 deep-read 从模板改为 **按曲定制** 解读。

## Working directory
`/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads`

## Spec (must follow)
Read and obey: `docs/DEEPREAD-EDITORIAL-SPEC.md`

## Songs in this batch ONLY
1. `bu-shi-zhen-de-ai-wo` — 不是真的爱我 (favorite=low, was scaffold)
2. `bu-tong` — 不同 (favorite=low, was scaffold)
3. `chao-kuai-gan-start-concert` — 超快感（Start演唱会） (favorite=low, was scaffold)
4. `chao-ren-lei` — 超人类 (favorite=low, was scaffold)
5. `dang-dong-ye-jian-nuan` — 当冬夜渐暖 (favorite=low, was scaffold)
6. `dream-a-little-dream-of-me` — Dream A Little Dream Of Me (favorite=low, was scaffold)

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
npm run verify:deepread-batch -- --batch 6
npm run report:deepread-quality
```
All songs in this batch must be `editorial`.

## Return (confirmation only)
## Batch BATCH-006 Complete
- slugs upgraded: ...
- verify: pass/fail
- notes: ...

