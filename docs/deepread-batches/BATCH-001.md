# Deep-read DEPTH upgrade BATCH-001

## Role
加深已有 editorial 解读：更细、更贴这首歌，禁止回退成模板。

## Spec
`docs/DEEPREAD-EDITORIAL-SPEC.md`

## Working directory
`/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads`

## Songs ONLY
1. `shi-shi-hou` — 是时候 (fav=high, body=298, interp=6)
2. `tian-hei-hei` — 天黑黑 (fav=high, body=298, interp=6)
3. `e-lover` — E Lover (fav=medium, body=232, interp=5)
4. `fei-pu-er-xia` — 飞瀑而下 (fav=medium, body=236, interp=5)
5. `ji-mei` — 极美 (fav=medium, body=246, interp=6)
6. `shen-qi` — 神奇 (fav=medium, body=248, interp=5)

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
npm run verify:deepread-batch -- --batch 1
```
Also ensure each body is ≥280 chars.

## Return
## Batch BATCH-001 Complete
- slugs: ...
- verify: pass/fail
- notes: ...

