# Deep-read DEPTH upgrade BATCH-004

## Role
加深已有 editorial 解读：更细、更贴这首歌，禁止回退成模板。

## Spec
`docs/DEEPREAD-EDITORIAL-SPEC.md`

## Working directory
`/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads`

## Songs ONLY
1. `yu-e` — 余额 (fav=medium, body=274, interp=5)
2. `ling-que-dian` — 零缺点 (fav=medium, body=276, interp=5)
3. `honey-honey` — Honey Honey (fav=medium, body=277, interp=6)
4. `jie-xia-lai` — 接下来 (fav=medium, body=279, interp=6)
5. `fan-guo-lai-zou-zou` — 反过来走走 (fav=low, body=226, interp=5)
6. `he-ping` — 和平 (fav=low, body=244, interp=5)

## Depth requirements (stricter)
For each slug:
1. Read `raw-lyrics/{slug}.txt`, current deep-read, and index card
2. Expand **body overview to ≥280 Chinese characters** — unique imagery/era/mechanism for THIS song
3. Ensure **5–6 lyricInterpretations**, each on a **different real lyric line**, unique prose
4. Enrich songDesign (structure / emotionCurve / craftNotes) with concrete devices of THIS track
5. Keep verified mvUrl only; never invent URLs
6. `updatedAt` today; `status: ready`
7. Lightly fix index summary/tags if still generic

## Forbidden
Scaffold phrases; cross-song copy-paste; inventing lyrics/MV; fake 开场句 lyricText

## Verify
```bash
npm run verify:deepread-batch -- --batch 4
```
Also ensure each body is ≥280 chars.

## Return
## Batch BATCH-004 Complete
- slugs: ...
- verify: pass/fail
- notes: ...

