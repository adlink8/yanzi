# Deep-read DEPTH upgrade BATCH-005

## Role
加深已有 editorial 解读：更细、更贴这首歌，禁止回退成模板。

## Spec
`docs/DEEPREAD-EDITORIAL-SPEC.md`

## Working directory
`/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads`

## Songs ONLY
1. `yan-shen` — 眼神 (fav=low, body=249, interp=5)
2. `tian-kong` — 天空 (fav=low, body=251, interp=5)
3. `wei-rao` — 围绕 (fav=low, body=252, interp=5)
4. `xu-yao-ni` — 需要你 (fav=low, body=253, interp=5)
5. `up2u` — Up2u (fav=low, body=256, interp=5)
6. `ai-cong-ling-kai-shi` — 爱从零开始 (fav=low, body=259, interp=5)

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
npm run verify:deepread-batch -- --batch 5
```
Also ensure each body is ≥280 chars.

## Return
## Batch BATCH-005 Complete
- slugs: ...
- verify: pass/fail
- notes: ...

