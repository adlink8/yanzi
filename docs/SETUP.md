# Setup

## Environment

- Runtime: WSL `Ubuntu-D`
- Project Root: `/home/li/projects/repos/products/fandom/stefanie-sun-deep-reads`
- Package Manager: `npm`
- Default AI Provider: local `Ollama`
- Default Model: `gemma4:e4b`

## First Run

```bash
cd /home/li/projects/repos/products/fandom/stefanie-sun-deep-reads
npm install
npm run dev
```

## Default AI Behavior

项目默认使用本地 Ollama，不填任何云端配置也可以先跑起来。

默认值如下：

- `OPENAI_BASE_URL=http://127.0.0.1:11434/v1`
- `OPENAI_API_KEY=ollama`
- `OPENAI_MODEL=gemma4:e4b`

只要 WSL 中的 Ollama 服务已经启动，并且本地存在 `gemma4:e4b` 模型，歌曲页和专辑页的 AI 解读助手就可以直接工作。

## Lyrics Directory and File Rules

### Directories

Lyrics-related content uses these locations:

- `content/songs/raw-lyrics/`
- `content/songs/deep-reads/`
- `content/songs/index.json`

### Full Lyrics Files

Put user-maintained full lyrics text into:

- `content/songs/raw-lyrics/{slug}.txt`

Example:

- `content/songs/raw-lyrics/tian-hei-hei.txt`

Formatting requirements:

- UTF-8 text
- preserve line breaks
- blank lines allowed between sections
- lyrics text only
- no analysis mixed into this file
- the app loads this file automatically and shows it on the song page

### Deep Read Files

Put analysis into:

- `content/songs/deep-reads/{slug}.md`

Suggested responsibilities:

- overall interpretation
- MV link
- lyric-by-lyric or section-by-section interpretation
- whole-song design analysis

### Slug Rule

Use the same slug in all three places:

- `content/songs/index.json`
- `content/songs/raw-lyrics/{slug}.txt`
- `content/songs/deep-reads/{slug}.md`

## Custom Provider

如果你之后想切换到别的 OpenAI-compatible 服务，再在 `.env.local` 中覆盖：

- `OPENAI_BASE_URL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

## Current Scope

- Phase 1 includes:
  - local content reading
  - song and album AI Q&A
  - mood-based recommendation
  - song deep-read structure
  - automatic loading of manually maintained full lyrics files