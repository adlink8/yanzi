# Stefanie Sun Deep Reads

## What This Is

一个私有自用的孙燕姿作品图书馆与深度解读站点。
以可检索的歌曲/专辑/时间线内容为核心，通过 **OpenAI-compatible 云端 API** 提供问答与导览（本地 Ollama 仅可选）。
**深读内容已完成全库按曲定制（184 editorial）**；后续重心为可靠性、MV 与少数真歌词补录。

## Core Value

用户可以稳定地按歌曲、专辑、时间线访问完整内容，并得到可读、可信的深度解读。

## Requirements

### Validated

- ✓ 184 首索引可浏览；17 专辑结构稳定（含 `start-live`）
- ✓ 无 archive-group 依赖；`songSlugs` ↔ `albumSlug` 对齐
- ✓ Deep-read **184/184 editorial**（`npm run report:deepread-quality`）
- ✓ 按曲定制规范与分批流水线（`docs/DEEPREAD-EDITORIAL-SPEC.md`、`prepare:*` / `verify:*`）
- ✓ 占位歌词不伪完整展示（READ-03）
- ✓ AI Edge 兼容 + Cloudflare Pages 构建链路
- ✓ Vitest 52 + GitHub Actions CI（分支）

### Active

- [ ] 核实并补齐 MV 链接（当前大量 missing）
- [ ] `shang-bu-liao` 真歌词 UTF-8 入库
- [ ] Phase 6 形式化：smoke/E2E、构建门禁文档化
- [ ] 部署环境 `OPENAI_*` / 域名回归

### Out of Scope

- 公开运营 SEO/增长
- 声音克隆或艺人角色扮演
- 数据库/多租户后端

## Context

- 仓库：WSL `/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads`
- 栈：Next.js 15 + TypeScript + Tailwind + Vitest
- 分支工作流：`chore/ci-and-full-tests` → PR #4
- 质量报告：`docs/DEEPREAD-QUALITY-REPORT.md`

## Constraints

- **Runtime**: WSL Ubuntu-D
- **Scope**: Private self-use
- **Data Model**: JSON/Markdown/TXT first
- **AI Provider**: Cloud-first OpenAI-compatible

## Key Decisions

| Decision | Outcome |
|----------|---------|
| 单仓 Next.js 全栈 | ✓ |
| 文件系统内容源 | ✓ |
| albumSlug 为专辑归属真源 | ✓ |
| AI 不以本地模型为中心 | ✓ |
| 深读必须按曲定制 + 机器验收 | ✓ 184 editorial |

---
*Last updated: 2026-07-17 — Phase 5 catalog editorial complete*
