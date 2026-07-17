# Deep-read DEPTH upgrade BATCH-007

## Role
加深已有 editorial 解读：更细、更贴这首歌，禁止回退成模板。

## Spec
`docs/DEEPREAD-EDITORIAL-SPEC.md`

## Working directory
`/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads`

## Songs ONLY
1. `ni-ming-wan-sui` — 匿名万岁 (fav=low, body=270, interp=6)
2. `xuan-wo` — 漩涡 (fav=low, body=272, interp=5)
3. `liu-lang-di-tu` — 流浪地图 (fav=low, body=273, interp=5)
4. `ta-men-de-ge` — 他们的歌 (fav=low, body=276, interp=5)
5. `ting-jian` — 听见 (fav=low, body=276, interp=5)
6. `ke` — 渴 (fav=low, body=277, interp=5)

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
npm run verify:deepread-batch -- --batch 7
```
Also ensure each body is ≥280 chars.

## Return
## Batch BATCH-007 Complete
- slugs: ...
- verify: pass/fail
- notes: ...

