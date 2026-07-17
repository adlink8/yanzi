# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router pages and API routes (`app/api/**/route.ts`).
- `components/`: reusable UI components.
- `lib/`: domain logic (`content`, `ai`, `recommend`, shared context).
- `content/`: source data and editorial content (`songs/index.json`, `albums/index.json`, `tags/index.json`, `timeline/index.json`, `songs/deep-reads/*.md`, `songs/raw-lyrics/*.txt`).
- `tests/`: Vitest suites (`tests/**/*.test.ts`) for recommendation logic and API handlers.
- `docs/` and `scripts/`: operational docs and one-off maintenance/audit scripts.

## Build, Test, and Development Commands
- `npm run dev`: start local dev server on port `3008`.
- `npm run build`: production Next.js build.
- `npm run start`: serve the built app on port `3008`.
- `npm test`: run all Vitest tests once.
- `npm run test:watch`: run tests in watch mode.
- `npm run typecheck`: TypeScript `--noEmit`.
- `npm run ci`: local mirror of GitHub Actions (typecheck + lint + tests + catalog audit + content gate).
- `npm run build:cf`: Cloudflare Pages build via `@cloudflare/next-on-pages`.
- Content quality checks: `npm run gate:content`, `npm run audit:content`, `npm run audit:catalog`.

## Coding Style & Naming Conventions
- Language: TypeScript with `strict` mode enabled.
- Follow existing style: 2-space indentation, single quotes, no semicolons.
- Use path alias imports with `@/` (configured in `tsconfig.json`).
- Keep route handlers small and explicit; return typed JSON payloads where possible.
- Song/album slugs must use kebab-case pinyin consistently across JSON/Markdown/TXT filenames.

## Testing Guidelines
- Framework: Vitest (`vitest.config.ts`), Node environment.
- Test file pattern: `tests/**/*.test.ts`.
- Add tests for any change in `lib/recommend/*`, `lib/ai/*`, `lib/content/*`, and `app/api/*` behavior.
- Prefer behavior-focused assertions (status codes, payload shape, ranking order) over implementation details.
- Run `npm run ci` before opening a PR (or at least `npm test` + `npm run typecheck`).

## Commit & Pull Request Guidelines
- Use Conventional Commit style seen in history: `feat:`, `fix:`, `build:`, `chore:`, `content:`.
- Keep commits focused (one concern per commit) and reference affected area in subject.
- PRs should include what changed and why, local verification (`npm run build`, `npm test`, and `npm run build:cf` when deployment-related), and screenshots/GIFs for UI changes.

## Security & Configuration Tips
- Do not commit secrets; keep local values in `.env.local`.
- For Cloudflare compatibility, non-static API routes should export `runtime = 'edge'` when required by deployment flow.
