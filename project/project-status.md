# 项目状态（project/project-status.md）

> 本文件分为两部分：
> - **AUTOGEN 快照**：可由脚本自动更新（只读）。
> - **手写状态**：维护当前事实、风险与阶段目标。

<!-- AUTOGEN:PROJECT_SNAPSHOT:START -->
_Generated at: 2026-07-17 (manual sync)_

- Git branch: `chore/ci-and-full-tests` (PR toward main)
- Phase (GSD): **5 complete** → **6** next
- Deep-read: **184/184 editorial**
- Deployment target: Cloudflare Pages
- AI: OpenAI-compatible **cloud-first**
<!-- AUTOGEN:PROJECT_SNAPSHOT:END -->

---

## 1. 基本信息

- **项目名称**：stefanie-sun-deep-reads
- **项目类型**：私有自用的孙燕姿作品资料库与深度解读站点
- **主要模块**：
  - `app/`：页面与 API 路由
  - `lib/`：内容读取、推荐、AI 客户端
  - `content/`：歌曲/专辑/时间线 JSON + deep-read Markdown + raw-lyrics TXT
  - `components/`：前端展示与交互组件
  - `scripts/`：审计、质量报告、分批精修工具

## 2. 模块状态概览

| 模块 | 位置 | 状态 | 说明 |
|------|------|------|------|
| 内容浏览链路 | `app/songs` 等 | ✅ | 可稳定访问 |
| 目录规范化 | `content/albums` + songs | ✅ | Phase 4 收口 |
| 深读内容 | `content/songs/deep-reads` | ✅ | **184 editorial**，非模板全库覆盖 |
| 歌词回退 | `lib/content` + song page | ✅ | 占位不伪完整 |
| AI 问答 | `app/api/ask/*` | 🟡 | 云端配置；Edge 上下文仍偏卡片元数据 |
| 测试/CI | `tests/` + `.github/workflows` | ✅ | 52 tests + Actions（分支） |
| Cloudflare 构建 | `build:cf` | ✅ | 输出目录已固定 |

## 3. 进行中的工作

- Phase 6：可靠性形式化、可选 E2E
- MV 核实补链
- `shang-bu-liao` 真歌词补录
- PR #4 合并与部署核对

## 4. 风险与问题

- 大量曲目仍无 verified `mvUrl`（约 179）
- `shang-bu-liao` raw-lyrics 仍为占位
- 线上域名/AI 环境变量依赖运维配置

## 5. 更新记录

| 日期 | 变更内容 |
|------|----------|
| 2026-04-13 | 新建 project/ 管理文档；CF/AI Edge 修复 |
| 2026-07-17 | Phase 4 收口；AI 云端优先 |
| 2026-07-17 | Phase 5 全库 editorial + 深度加厚；文档同步 |
