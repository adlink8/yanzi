# Stefanie Sun Deep Reads

## What This Is

一个私有自用的孙燕姿作品图书馆与深度解读站点。
项目以可检索的歌曲/专辑/时间线内容为核心，并通过 **OpenAI-compatible 云端 API** 提供问答与导览（本地 Ollama 仅可选）。
当前处于“目录规范化已收口、深读质量精修”阶段。

## Core Value

用户可以稳定地按歌曲、专辑、时间线访问完整内容，并得到可读、可信的深度解读。

## Requirements

### Validated

- ✓ 歌曲目录可完整浏览（184 首已索引）— Phase 1–3
- ✓ 每首已索引歌曲具备 deep-read 文件 — Phase 3（质量待升）
- ✓ 主路径页面可用（首页/歌曲/专辑/时间线/搜索/情绪推荐）— Phase 2
- ✓ 归档歌曲回填到正式专辑结构，无 archive-group 占位 — Phase 4
- ✓ 专辑条目具备摘要与代表曲；`songSlugs` 与 `albumSlug` 对齐 — Phase 4
- ✓ AI 走 OpenAI-compatible 流式接口（Edge API）— 基线能力
- ✓ Cloudflare Pages 构建链路（`build:cf`）可运行 — 运维修复

### Active

- [ ] 将 scaffold 级 deep-read 提升为可读、可信的结构化解读（Phase 5）
- [ ] 补齐真实歌词缺失/占位（如 `shang-bu-liao`）与 MV 字段（Phase 5）
- [ ] 标签与 deep-read 语义一致性（Phase 5）
- [ ] 扩展测试、smoke 与内容门禁（Phase 6）

### Out of Scope

- 公开站点运营（SEO、增长、社区互动）
- 声音克隆或“艺人角色扮演聊天”
- 生产级多租户后台 / 独立数据库（当前 JSON/MD/TXT 足够）

## Context

- 仓库：WSL `/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads`
- 栈：Next.js 15 + TypeScript + Tailwind + Vitest
- 内容：`content/songs|albums|tags|timeline` + deep-reads + raw-lyrics
- 现状（2026-07-17）：184 歌曲、17 专辑（含 `start-live`）、catalog 孤儿映射已清零
- AI：云端 OpenAI-compatible 优先；见 `docs/SETUP.md`、`.env.example`

## Constraints

- **Runtime**: WSL Ubuntu-D — 依赖、构建与运行统一在 WSL
- **Scope**: Private self-use
- **Data Model**: JSON/Markdown/TXT first — 暂不引入数据库
- **AI Provider**: OpenAI-compatible cloud-first；本地 Ollama 可选、非默认

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 单仓 Next.js 全栈 | 降低维护复杂度 | ✓ Good |
| 文件系统内容源 | 私有规模可控、易审计 | ✓ Good |
| 精修里程碑从目录规范化开始 | 全量覆盖后收益在质量 | ✓ Phase 4 closed |
| `albumSlug` 为专辑归属真源 | 避免 songSlugs 漂移 | ✓ Good |
| AI 不以本地模型为中心 | 部署与质量更依赖云端兼容 API | ✓ Adopted 2026-07-17 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

---
*Last updated: 2026-07-17 — Phase 4 closeout + AI positioning*
