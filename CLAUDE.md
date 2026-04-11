<!-- GSD:project-start source:PROJECT.md -->
## Project

**Stefanie Sun Deep Reads**

一个私有自用的孙燕姿作品图书馆与深度解读站点。
项目以可检索的歌曲/专辑/时间线内容为核心，并在本地模型上提供问答与导览。
当前进入“全量覆盖后精修”阶段，重点从补齐转向质量提升与结构归档。

**Core Value:** 用户可以稳定地按歌曲、专辑、时间线访问完整内容，并得到可读、可信的深度解读。

### Constraints

- **Runtime**: WSL Ubuntu-D — 依赖、构建与运行统一在 WSL 里执行
- **Scope**: Private self-use — 功能优先服务个人知识与解读工作流
- **Data Model**: JSON/Markdown/TXT first — 当前阶段不引入数据库迁移成本
- **AI Provider**: Local-first (Ollama) — 默认本地推理可用，云端仅可选
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
