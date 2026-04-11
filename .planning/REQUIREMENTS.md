# Requirements: Stefanie Sun Deep Reads

**Defined:** 2026-04-10
**Core Value:** 用户可以稳定地按歌曲、专辑、时间线访问完整内容，并得到可读、可信的深度解读。

## Historical Baseline (Already Delivered)

以下能力已在既有计划与执行中完成，作为当前里程碑的基础：

- H-01: 基础技术架构与本地运行链路建立（Next.js + TS + Tailwind + WSL）
- H-02: 首页、歌曲页、专辑页、时间线页主路径可用
- H-03: 歌曲目录全量索引，首轮 deep-read 全量覆盖
- H-04: 情绪推荐 API 与基础测试/构建链路可运行

## v1 Requirements (Current Refinement Milestone)

### Catalog Normalization

- [ ] **CATA-01**: 归档批次歌曲可回填到明确的官方专辑条目
- [ ] **CATA-02**: 每首歌曲的 `albumSlug`、`era` 与专辑目录保持一致
- [ ] **CATA-03**: 歌曲索引与页面展示不再出现 archive-group 占位归类

### Content Quality

- [ ] **META-01**: 所有专辑条目具备可读摘要与代表曲列表
- [ ] **META-02**: 歌曲 `summary`、`moodTags`、`themeTags` 与 deep-read 内容语义一致
- [ ] **META-03**: 关键缺失歌词案例（如 `shang-bu-liao`）被补齐并可在歌曲页显示

### Deep Read Enrichment

- [ ] **READ-01**: 高优先歌曲 deep-read 包含结构化段落解读（`lyricInterpretations`）
- [ ] **READ-02**: deep-read 文件的 MV 信息、整体解读、歌曲设计分析字段完整可渲染
- [ ] **READ-03**: 歌曲详情页在无 `fullLyrics` frontmatter 时可稳定回退 `raw-lyrics/*.txt`

### Reliability & QA

- [ ] **QA-01**: `npm test` 覆盖内容推荐与关键 API 路径并保持通过
- [ ] **QA-02**: 为关键页面加载与反馈流程补充可执行测试或 smoke 检查
- [ ] **QA-03**: `npm run build` 在当前内容集下稳定通过且无阻断错误

## v2 Requirements

### Product Expansion

- **EXP-01**: 私有模式到公开模式的能力分层与开关策略
- **EXP-02**: 更细粒度的时间线-歌曲-专辑双向关联可视化
- **EXP-03**: AI 导览从单轮问答升级为主题会话流

## Out of Scope

| Feature | Reason |
|---------|--------|
| 声音克隆与拟真人设聊天 | 超出项目定位，且存在伦理/合规风险 |
| 生产级多租户后台系统 | 与私有自用模式不匹配，收益低于成本 |
| 跨平台客户端（移动端独立 App） | 当前目标优先保障 Web 体验与内容质量 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CATA-01 | Phase 4 | Pending |
| CATA-02 | Phase 4 | Pending |
| CATA-03 | Phase 4 | Pending |
| META-01 | Phase 4 | Pending |
| META-02 | Phase 5 | Pending |
| META-03 | Phase 5 | Pending |
| READ-01 | Phase 5 | Pending |
| READ-02 | Phase 5 | Pending |
| READ-03 | Phase 5 | Pending |
| QA-01 | Phase 6 | Pending |
| QA-02 | Phase 6 | Pending |
| QA-03 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-10*
*Last updated: 2026-04-10 after plan consolidation with existing docs*
