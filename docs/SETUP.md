# Setup

## Environment

- Runtime: WSL `Ubuntu-D`
- Project Root: `/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads`
- Package Manager: `npm`
- AI: OpenAI-compatible HTTP API（云端优先；本地 Ollama 仅可选）

## First Run

```bash
cd /home/li/projects/repos/products/fandom/stefanie-sun-deep-reads
npm install
cp .env.example .env.local
# 编辑 .env.local：填入 OPENAI_API_KEY，并按需调整 BASE_URL / MODEL
npm run dev
```

开发服务器默认端口：`3008`。

## AI 配置（云端优先）

AI 问答依赖 **OpenAI-compatible** 的 Chat Completions 接口（流式）。

代码默认（见 `lib/ai/config.ts`）：

| 变量 | 默认 | 说明 |
|------|------|------|
| `OPENAI_BASE_URL` | `https://api.openai.com/v1` | 任意兼容端点 |
| `OPENAI_API_KEY` | （空） | **必填**；未设置时 AI 功能关闭 |
| `OPENAI_MODEL` | `gpt-4o-mini` | 模型名 |

在 `.env.local`（本地）或 Cloudflare Pages 环境变量（部署）中配置即可启用歌曲页 / 专辑页 AI 助手。

### 常见云端示例

**OpenAI**

```bash
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

**DeepSeek**

```bash
OPENAI_BASE_URL=https://api.deepseek.com/v1
OPENAI_API_KEY=...
OPENAI_MODEL=deepseek-chat
```

**智谱 GLM（OpenAI 兼容代理）**

```bash
OPENAI_BASE_URL=https://open.bigmodel.cn/api/paas/v4
OPENAI_API_KEY=...
OPENAI_MODEL=glm-4-flash
```

### 可选：本地 Ollama

不作为默认路径。仅在需要离线调试时覆盖：

```bash
OPENAI_BASE_URL=http://127.0.0.1:11434/v1
OPENAI_API_KEY=ollama
OPENAI_MODEL=你的本地模型名
```

注意：Cloudflare Pages 部署环境 **无法** 访问你本机的 `127.0.0.1`；线上必须使用可公网访问的云端或自建兼容端点。

## Lyrics Directory and File Rules

### Directories

- `content/songs/raw-lyrics/`
- `content/songs/deep-reads/`
- `content/songs/index.json`

### Full Lyrics Files

- Path: `content/songs/raw-lyrics/{slug}.txt`
- UTF-8, preserve line breaks, lyrics text only (no analysis)

### Deep Read Files

- Path: `content/songs/deep-reads/{slug}.md`
- Overall interpretation, MV, section interpretations, song design

### Slug Rule

Same kebab-case pinyin slug in:

- `content/songs/index.json`
- `content/songs/raw-lyrics/{slug}.txt`
- `content/songs/deep-reads/{slug}.md`

## Useful Commands

```bash
npm run dev          # 开发 :3008
npm test             # Vitest
npm run build        # Next 生产构建
npm run build:cf     # Cloudflare Pages 构建
npm run gate:content # 内容质量门禁
npm run audit:catalog
npm run audit:content
```

## Current Focus

- Catalog normalization closed（正式专辑结构 + `songSlugs` 与 `albumSlug` 对齐）
- Next: deep-read 质量精修（Phase 5）与可靠性（Phase 6）
