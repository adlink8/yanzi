# Tech Design

## Architecture

- 采用单仓全栈模式
- 当前不做前后端分离
- 页面渲染、接口处理、内容读取与 AI 调用统一放在一个 Next.js 项目中

## Frontend

- Framework: `Next.js`
- Language: `TypeScript`
- Styling: `Tailwind CSS`
- UI Components: optional `shadcn/ui`

## Backend

- Runtime: `Next.js` built-in server capabilities
- API: `Route Handlers`
- Server Logic: `Server Components` + `Server Actions`

## Content Storage

- Metadata: `JSON`
- Deep reads: `Markdown`
- Full lyrics: local `TXT` files maintained manually
- Phase 1 不引入独立数据库

## Recommended Structure

```text
stefanie-sun-deep-reads/
├─ app/
├─ components/
├─ content/
│  ├─ songs/
│  │  ├─ index.json
│  │  ├─ deep-reads/
│  │  │  ├─ _template.md
│  │  │  └─ <song-slug>.md
│  │  └─ raw-lyrics/
│  │     └─ <song-slug>.txt
│  ├─ albums/
│  │  └─ index.json
│  ├─ timeline/
│  │  └─ index.json
│  └─ tags/
│     └─ index.json
├─ lib/
│  ├─ content/
│  ├─ ai/
│  ├─ recommend/
│  └─ utils/
├─ types/
├─ public/
└─ docs/
```

## Song Content Model

A song currently uses three layers:

1. `index.json`
   - title
   - tags
   - summary
   - relationship metadata
2. `raw-lyrics/{slug}.txt`
   - full lyrics text
3. `deep-reads/{slug}.md`
   - overall interpretation
   - lyric interpretations
   - song design analysis
   - MV link

## Design Note

For private use, the project is now structured to support full lyrics recording and display.
The UI is designed so that long lyric content can be collapsed by default.