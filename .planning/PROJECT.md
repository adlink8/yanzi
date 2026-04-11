# Stefanie Sun Deep Reads

## What This Is

一个私有自用的孙燕姿作品图书馆与深度解读站点。
项目以可检索的歌曲/专辑/时间线内容为核心，并在本地模型上提供问答与导览。
当前进入“全量覆盖后精修”阶段，重点从补齐转向质量提升与结构归档。

## Core Value

用户可以稳定地按歌曲、专辑、时间线访问完整内容，并得到可读、可信的深度解读。

## Requirements

### Validated

- ✓ 歌曲目录可完整浏览（indexed songs 全量可见） — 现状已达成
- ✓ 每首已索引歌曲具备 deep-read 文件并标记 ready — 现状已达成
- ✓ 歌曲页支持本地 AI 问答（Ollama/OpenAI-compatible） — 现状已达成
- ✓ 首页与歌曲页核心推荐能力可用（含情绪推荐 API） — 现状已达成
- ✓ 基础自动化测试与构建流程可运行（Vitest + Next build） — 现状已达成

### Active

- [ ] 归档歌曲批次回填到正式专辑并完成映射修正
- [ ] 提升 archive-group 元数据与专辑摘要质量
- [ ] 将首轮 deep-read 提升为可复用的高质量解读结构
- [ ] 修复剩余 raw-lyrics 边缘缺失项并做一致性校验
- [ ] 扩展自动化测试覆盖关键页面、反馈链路与内容完整性

### Out of Scope

- 公开站点运营（SEO、增长、社区互动）— 当前为私有自用
- 声音克隆或“艺人角色扮演聊天”能力 — 与项目边界冲突
- 生产级分布式后端与独立数据库重构 — 当前阶段 JSON/Markdown/TXT 足够

## Context

- 代码仓库位于 WSL：`/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads`
- 技术栈：Next.js 15 + TypeScript + Tailwind + Vitest
- 内容层：`content/songs/index.json` + `deep-reads/*.md` + `raw-lyrics/*.txt`
- 最新快照（2026-04-09）显示：184 首歌曲已索引，首轮 deep-read 已全量覆盖，当前阶段为精修与归档规范化

## Constraints

- **Runtime**: WSL Ubuntu-D — 依赖、构建与运行统一在 WSL 里执行
- **Scope**: Private self-use — 功能优先服务个人知识与解读工作流
- **Data Model**: JSON/Markdown/TXT first — 当前阶段不引入数据库迁移成本
- **AI Provider**: Local-first (Ollama) — 默认本地推理可用，云端仅可选

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 单仓 Next.js 全栈架构 | 降低维护复杂度，便于快速迭代内容与页面 | ✓ Good |
| 内容以文件系统为源（JSON/MD/TXT） | 私有站点数据规模可控、编辑与审计成本低 | ✓ Good |
| 当前里程碑聚焦“精修与归档规范化” | 全量覆盖已完成，下一步收益来自质量提升 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition**:
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone**:
1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-10 after gsd new-project style initialization*
