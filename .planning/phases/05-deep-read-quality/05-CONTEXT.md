---
phase: "05"
name: "deep-read-quality"
created: 2026-07-17
updated: 2026-07-17
---

# Phase 5: deep-read-quality — Context

## Scope Boundary

本阶段聚焦 **可读、可信的深读质量** 与 **歌词展示正确性**，不做全站 184 首一次性重写。

优先：

1. 可重复的质量度量（scaffold 识别、质量档位）
2. 高价值曲目（`favoriteLevel=high`）结构化精修
3. 歌词回退链路：raw-lyrics 占位不可再伪装成“完整歌词”
4. META-03：`shang-bu-liao` 占位歌词闭环（真实歌词或明确“待补录”UI，禁止伪完整）

不做：

- 全量 MV 补链（可分批工具化，本 phase 只保证字段可渲染与优先曲）
- Phase 6 构建/E2E（已有 CI 测试基线，本 phase 只补歌词/内容相关测试）

## Requirements

- META-02, META-03
- READ-01, READ-02, READ-03

## Locked Decisions

1. `song.albumSlug` 仍为目录真源（Phase 4 已收口，本 phase 不改专辑结构）。
2. 质量真源：deep-read YAML + body + raw-lyrics；UI 必须过滤 scaffold/placeholder。
3. AI 保持 cloud-first；本 phase 不改 provider 默认。
4. 精修批：先 `favoriteLevel=high` 的 8 首，再视时间扩展。

## High-priority song set (seed)

| slug | title |
|------|-------|
| tian-hei-hei | 天黑黑 |
| yu-jian | 遇见 |
| wo-huai-nian-de | 我怀念的 |
| ni-guang | 逆光 |
| shang-hao-de-qing-chun | 尚好的青春 |
| ke-bu-le | 克卜勒 |
| shi-shi-hou | 是时候 |
| tiao-wu-de-fan-gu | 跳舞的梵谷 |

## Deferred

- 全库 scaffold 文案人工重写
- Playwright E2E
- Edge AI 注入 deep-read 正文（架构债，可另开 phase）
