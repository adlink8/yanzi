# Stefanie Sun Deep Reads

## What This Is

一个私有自用的孙燕姿作品图书馆与深度解读站点。  
技术形态：Next.js 全栈 + Cloudflare Pages；内容源 JSON/Markdown/TXT；AI 为 **OpenAI-compatible 云端优先**。

## Core Value

用户可以稳定地按歌曲、专辑、时间线访问完整内容，并获得可读、可信的深度解读与问答结果。

## Requirements

### Validated

- 歌曲/专辑/时间线浏览与目录规范化（Phase 4）已收口。
- **全库 184 首 deep-read 均为按曲定制 editorial**（`npm run report:deepread-quality`）。
- 占位歌词不伪完整展示；假/批量 MV ID 已清理。
- Vitest 52 + GitHub Actions CI（`chore/ci-and-full-tests`）。
- Cloudflare `pages_build_output_dir` 固定；AI Edge 兼容修复完成。

### Active

- 核实并补齐官方/可信 MV 链接。
- `shang-bu-liao` 真歌词补录。
- Phase 6：smoke/E2E、部署与环境变量回归。

### Out of Scope

- 公共增长运营；重型数据库；艺人角色扮演式对话。
- 以本地 LLM 为默认运行时。

## Constraints

- Runtime: WSL Ubuntu-D + Node.js  
- Deploy: Cloudflare Pages + `@cloudflare/next-on-pages`  
- Data model: File-first (`content/**`)  
- AI adapter: OpenAI-compatible cloud-first  

## Content quality commands

```bash
npm run report:deepread-quality
npm run prepare:deepread-batches   # scaffold/passable → 子代理批次
npm run prepare:deepread-depth     # editorial 加厚批次
npm run verify:deepread-batch -- --batch N
npm run ci
```

## Next Milestones

1. Phase 6 reliability formalization  
2. MV remediation batches  
3. Merge PR / deploy verification  

---
Last updated: 2026-07-17
