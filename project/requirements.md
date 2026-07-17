# 项目需求文档（project/requirements.md）

## 1. 项目概述

- **项目名称**：Stefanie Sun Deep Reads
- **目标**：以可检索内容与深度解读为核心，提供稳定的歌曲/专辑/时间线浏览与 AI 导览问答。
- **目标用户**：项目维护者本人（private self-use）。

## 2. 范围（Scope）

### 2.1 当前范围

- 歌曲、专辑、时间线页面稳定可访问。
- 支持歌曲页与专辑页 AI 提问（**OpenAI-compatible 云端 API**；本地 Ollama 仅可选）。
- 支持 Cloudflare Pages 部署，产物由 `npm run build:cf` 生成。
- 内容源使用文件系统（`content/**/*.json|.md|.txt`）。

### 2.2 排除范围

- 公网增长运营（SEO、投放、社区）。
- 重型数据库与多租户后端重构。
- 艺人角色扮演类对话能力。
- 以本地模型为默认依赖。

## 3. 功能需求

1. 内容浏览
- 可按歌曲、专辑、时间线导航。
- 歌曲页展示 deep-read 与结构化解读内容。

2. AI 问答
- 歌曲问答：`POST /api/ask/song`
- 专辑问答：`POST /api/ask/album`
- 失败时前端需显示后端真实错误信息。
- 配置见 `docs/SETUP.md` / `.env.example`（`OPENAI_*`）。

3. 反馈与推荐
- 反馈提交：`POST /api/feedback`
- 情绪推荐：`POST /api/recommend/mood`

## 4. 非功能需求

- 可用性：`npm run build`、`npm run build:cf` 必须通过。
- 部署一致性：`wrangler.jsonc` 的 `pages_build_output_dir` 固定为 `.vercel/output/static`。
- 可观测性：关键失败应在前端可见真实错误。

## 5. 环境与配置要求

- 必需（启用 AI 时）：
  - `OPENAI_BASE_URL`（默认 `https://api.openai.com/v1`）
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL`（默认 `gpt-4o-mini`）
- 可选：
  - `NEXT_PUBLIC_FEEDBACK_WEBHOOK_URL`
  - `GITHUB_FEEDBACK_TOKEN` / `GITHUB_FEEDBACK_OWNER` / `GITHUB_FEEDBACK_REPO`

## 6. 当前验收标准

- 首页、歌曲页、专辑页可正常访问；专辑映射无 orphan。
- 配置云端 API Key 后，歌曲/专辑 AI 提问可返回流式结果。
- Cloudflare 部署可从目标域名访问（运维核对）。

---
Last updated: 2026-07-17
