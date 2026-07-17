# Deep-read DEPTH upgrade BATCH-006

## Role
加深已有 editorial 解读：更细、更贴这首歌，禁止回退成模板。

## Spec
`docs/DEEPREAD-EDITORIAL-SPEC.md`

## Working directory
`/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads`

## Songs ONLY
1. `tian-yue-liang-ye-yue-hei-2` — 天越亮，夜越黑（版本二） (fav=low, body=261, interp=5)
2. `wei-zhi-de-jing-cai-2` — 未知的精采（版本二） (fav=low, body=262, interp=5)
3. `hai-pa-start-concert` — 害怕（Start演唱会） (fav=low, body=264, interp=5)
4. `ai-qing-zheng-shu-start-concert` — 爱情证书（Start演唱会） (fav=low, body=265, interp=5)
5. `tian-yue-liang-ye-yue-hei` — 天越亮，夜越黑 (fav=low, body=266, interp=5)
6. `xue-hui` — 学会 (fav=low, body=268, interp=5)

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
npm run verify:deepread-batch -- --batch 6
```
Also ensure each body is ≥280 chars.

## Return
## Batch BATCH-006 Complete
- slugs: ...
- verify: pass/fail
- notes: ...

