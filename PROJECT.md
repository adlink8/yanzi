# Stefanie Sun Deep Reads

## What This Is

一个私有自用的孙燕姿作品图书馆与深度解读站点。
技术形态：Next.js 全栈 + Cloudflare Pages；内容源 JSON/Markdown/TXT；AI 为 **OpenAI-compatible 云端优先**。

## Core Value

用户可以稳定地按歌曲、专辑、时间线访问完整内容，并获得可读、可信的深度解读与问答结果。

## Requirements

### Validated

- 歌曲/专辑/时间线基础浏览链路可用。
- 目录规范化收口：无 archive-group 依赖；`start-live` 已登记；`songSlugs` 与 `albumSlug` 对齐。
- AI 路由 Edge 兼容修复完成；Cloudflare `pages_build_output_dir` 固定为 `.vercel/output/static`。
- `build` 与 `build:cf` 可稳定执行。

### Active

- 深读质量精修（scaffold → 可信结构化解读）。
- 占位歌词与 MV 覆盖补齐。
- 线上域名 / 环境变量运营核对。
- 测试与内容门禁加厚。

### Out of Scope

- 公共增长运营；重型数据库；艺人角色扮演式对话。
- 以本地 LLM 为默认运行时（Ollama 仅开发机可选）。

## Constraints

- Runtime: WSL Ubuntu-D + Node.js
- Deploy: Cloudflare Pages + `@cloudflare/next-on-pages`
- Data model: File-first (`content/**`)
- AI adapter: OpenAI-compatible cloud-first

## Next Milestones

1. Phase 5：deep-read 质量升级（优先高价值曲目）
2. Phase 6：测试 / smoke / 构建门禁
3. 线上域名与 AI 配置回归（部署时）

---
Last updated: 2026-07-17
