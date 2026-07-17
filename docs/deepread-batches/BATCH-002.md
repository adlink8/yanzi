# Deep-read DEPTH upgrade BATCH-002

## Role
加深已有 editorial 解读：更细、更贴这首歌，禁止回退成模板。

## Spec
`docs/DEEPREAD-EDITORIAL-SPEC.md`

## Working directory
`/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads`

## Songs ONLY
1. `di-liu-gan` — 第六感 (fav=medium, body=249, interp=5)
2. `kuai-feng-le` — 快疯了 (fav=medium, body=253, interp=6)
3. `kong-kou-yan` — 空口言 (fav=medium, body=257, interp=6)
4. `liao-jie` — 了解 (fav=medium, body=258, interp=5)
5. `shi-jie-zhong-jie-qian-yi-tian` — 世界终结前一天 (fav=medium, body=259, interp=5)
6. `cuo-jue` — 错觉 (fav=medium, body=260, interp=5)

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
npm run verify:deepread-batch -- --batch 2
```
Also ensure each body is ≥280 chars.

## Return
## Batch BATCH-002 Complete
- slugs: ...
- verify: pass/fail
- notes: ...

