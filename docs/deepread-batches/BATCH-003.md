# Deep-read DEPTH upgrade BATCH-003

## Role
加深已有 editorial 解读：更细、更贴这首歌，禁止回退成模板。

## Spec
`docs/DEEPREAD-EDITORIAL-SPEC.md`

## Working directory
`/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads`

## Songs ONLY
1. `gu-ji-gu-ji` — 咕叽咕叽 (fav=medium, body=262, interp=6)
2. `ling-yi-zhang-lian` — 另一张脸 (fav=medium, body=262, interp=5)
3. `nan-de-yi-jian` — 难得一见 (fav=medium, body=266, interp=5)
4. `tao-wang` — 逃亡 (fav=medium, body=266, interp=5)
5. `sui-tang-ce-yan` — 随堂测验 (fav=medium, body=267, interp=5)
6. `shou-hu-yong-heng-de-ai` — 守护永恒的爱 (fav=medium, body=268, interp=5)

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
npm run verify:deepread-batch -- --batch 3
```
Also ensure each body is ≥280 chars.

## Return
## Batch BATCH-003 Complete
- slugs: ...
- verify: pass/fail
- notes: ...

