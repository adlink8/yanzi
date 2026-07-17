# Requirements: Stefanie Sun Deep Reads

**Defined:** 2026-04-10  
**Last updated:** 2026-07-17  
**Core Value:** 用户可以稳定地按歌曲、专辑、时间线访问完整内容，并得到可读、可信的深度解读。

## Historical Baseline (Already Delivered)

- H-01: 基础技术架构与本地运行链路（Next.js + TS + Tailwind + WSL）
- H-02: 首页、歌曲页、专辑页、时间线页主路径可用
- H-03: 歌曲目录全量索引，首轮 deep-read 全量覆盖
- H-04: 情绪推荐 API 与基础测试/构建链路可运行
- H-05: OpenAI-compatible AI 问答（云端优先配置）
- H-06: 目录规范化 + 全库 deep-read 按曲定制（editorial）

## v1 Requirements (Current Refinement Milestone)

### Catalog Normalization

- [x] **CATA-01**: 归档批次歌曲可回填到明确的官方/正式专辑条目
- [x] **CATA-02**: 每首歌曲的 `albumSlug` 与专辑目录保持一致（含 `start-live`）
- [x] **CATA-03**: 歌曲索引与页面展示不再出现 archive-group 占位归类

### Content Quality

- [x] **META-01**: 所有专辑条目具备可读摘要与代表曲列表
- [x] **META-02**: 全库 editorial 后 summary/tags 已按批对齐（持续可人工微调）
- [~] **META-03**: 占位歌词不再伪完整；`shang-bu-liao` **真歌词仍待补录**

### Deep Read Enrichment

- [x] **READ-01**: 全库 184 首 deep-read 为按曲结构化解读（`lyricInterpretations`，非 scaffold 模板）
- [~] **READ-02**: 字段可渲染；**verified MV** 仍大量缺失（~179 无 mvUrl）
- [x] **READ-03**: raw-lyrics 回退正确；占位文档不展示为完整歌词

### Reliability & QA

- [~] **QA-01**: Vitest 覆盖 recommend / content / AI / API（52 tests）；可再扩展
- [ ] **QA-02**: 关键页面与反馈流程 smoke / E2E
- [~] **QA-03**: 本地 build 链路可用；CI 已配置（`chore/ci-and-full-tests`）

## v2 Requirements

### Product Expansion

- **EXP-01**: 私有模式到公开模式的能力分层与开关策略
- **EXP-02**: 更细粒度的时间线-歌曲-专辑双向关联可视化
- **EXP-03**: AI 导览从单轮问答升级为主题会话流

## Out of Scope

| Feature | Reason |
|---------|--------|
| 声音克隆与拟真人设聊天 | 超出项目定位，伦理/合规风险 |
| 生产级多租户后台系统 | 与私有自用不匹配 |
| 跨平台独立 App | 优先 Web 与内容质量 |
| 默认强制本地 LLM | 云端 OpenAI-compatible 为准；Ollama 仅可选 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CATA-01 | Phase 4 | Done |
| CATA-02 | Phase 4 | Done |
| CATA-03 | Phase 4 | Done |
| META-01 | Phase 4 | Done |
| META-02 | Phase 5 | Done |
| META-03 | Phase 5 | Partial |
| READ-01 | Phase 5 | Done |
| READ-02 | Phase 5 | Partial (MV) |
| READ-03 | Phase 5 | Done |
| QA-01 | Phase 6 | Partial |
| QA-02 | Phase 6 | Pending |
| QA-03 | Phase 6 | Partial |

**Coverage:**
- v1: 12 total
- Done: 8
- Partial: META-03, READ-02, QA-01, QA-03
- Open: QA-02

---
*Requirements updated: 2026-07-17 — full-catalog editorial complete*
