# Deep-read DEPTH upgrade BATCH-008

## Role
加深已有 editorial 解读：更细、更贴这首歌，禁止回退成模板。

## Spec
`docs/DEEPREAD-EDITORIAL-SPEC.md`

## Working directory
`/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads`

## Songs ONLY
1. `wei-wan-cheng` — 未完成 (fav=low, body=277, interp=5)
2. `wen-rou-mayday-blue-20th` — 温柔（五月天 BLUE 20th） (fav=low, body=277, interp=5)
3. `lei-zhui` — 泪坠 (fav=low, body=278, interp=5)
4. `wo-hen-wo-ai-ni` — 我恨我爱你 (fav=low, body=278, interp=5)
5. `yong-yuan` — 永远 (fav=low, body=278, interp=5)

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
npm run verify:deepread-batch -- --batch 8
```
Also ensure each body is ≥280 chars.

## Return
## Batch BATCH-008 Complete
- slugs: ...
- verify: pass/fail
- notes: ...

