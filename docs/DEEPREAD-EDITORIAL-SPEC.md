# Deep-read 按曲定制写作规范

目标：每首歌的解读必须是 **这首歌自己的**，禁止跨曲套模板。

## 禁止（模板化）

下列任一出现即视为不合格 scaffold：

- `自动补充的第` / `情绪结构样本` / `待补充` / `待补录` / `基础深读`
- `这一段的关键词是“…”` + 同一套 whyItMatters 复读
- `这一句的价值在于“先立气质”` 等万能句
- 多首歌共用同一段落骨架，只替换歌名
- 虚构 MV 链接 / 无法核实的访谈八卦
- `lyricText` 为 `开场句` / `中段句` 等占位

## 必须（按曲定制）

1. **先读** `content/songs/raw-lyrics/{slug}.txt` 与 `content/songs/index.json` 中该曲卡片。
2. **整体解读（body）**：写这首歌独特的听感、意象、时期位置；**验收下限 ≥160 字**；深度加厚目标 **≥280 字**；不得复用“铺垫-推进-转折-收束”万能结构当正文。
3. **lyricInterpretations ≥ 3 段**（建议 **5–6**；深度加厚强制 5–6）：
   - `lyricText` / `reference` 必须是歌词里真实出现的句子或短语
   - 每段 `interpretation` 解释 **这句在这首歌里** 的功能，彼此不得高度雷同
   - `whyItMatters` 点出对本曲情绪或叙事的作用，避免口号
4. **songDesign**：结构 / 情绪曲线 / 写法观察必须具体到本曲（编曲、副歌、人称、时间线等）。
5. **MV**：仅保留已核实链接；没有就留空，禁止编造。
6. **frontmatter**：`updatedAt` 用当天日期；`status: ready`；`slug`/`title` 与索引一致。

## 质量档位（验收）

| tier | 含义 |
|------|------|
| scaffold | 模板/弱解读 |
| passable | 可用但不够独特 |
| editorial | 按曲定制，过 `npm run report:deepread-quality` |

验收命令：

```bash
npm run report:deepread-quality
npm run verify:deepread-batch -- --batch N
# 或
npm run verify:deepread-batch -- --slugs slug-a,slug-b
```

目标：批次内每首 `tier === editorial`，且无 scaffold markers。  
深度加厚批次另用 `npm run prepare:deepread-depth`（body≥280、5–6 段）。

## 子代理分批约定

1. 编排者运行：
   - `npm run prepare:deepread-batches` — 处理 scaffold/passable
   - `npm run prepare:deepread-depth` — 已有 editorial 的加厚
2. 生成物在 `docs/deepread-batches/BATCH-*.md`（可直接当子代理 prompt）
3. 每个 BATCH 分给一个子代理，**只改该文件列出的 slug**
4. 子代理完成后运行 `verify:deepread-batch`；失败则改到过线
5. 编排者汇总、再跑全量 report、提交

## 全库状态（2026-07-17）

- `editorial=184` / `scaffold=0` / `passable=0`（见 `docs/DEEPREAD-QUALITY-REPORT.md`）
- 后续重点：verified MV、真歌词补录，而非再扫模板
