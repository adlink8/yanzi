# Roadmap: Stefanie Sun Deep Reads

## Overview

本路线图已对齐既有文档（`PROJECT-BRIEF`、`PROGRESS-SNAPSHOT`、`ARCHIVE-BATCHES`、`ISSUES-LOG`）。
原始 Phase 1-3 视为历史已完成里程碑，当前工作从 Phase 4 开始，聚焦精修与稳定性。

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Historical delivered phases
- Integer phases (4, 5, 6): Current refinement milestone
- Decimal phases (4.1, 5.1): Urgent insertions (INSERTED)

- [x] **Phase 1: Foundation & Modeling** - 技术方案、数据模型、项目骨架（已完成）
- [x] **Phase 2: Core Product Pages** - 首页/歌曲/专辑/时间线主路径（已完成）
- [x] **Phase 3: Full Catalog Ingestion** - 全量索引与首轮 deep-read 覆盖（已完成）
- [ ] **Phase 4: Catalog Normalization** - 归档歌曲回填与专辑映射规范化
- [ ] **Phase 5: Deep Read Quality Upgrade** - 深读内容与元数据质量提升
- [ ] **Phase 6: Reliability Hardening** - 测试、反馈链路与构建稳定性增强

## Phase Details

### Phase 1: Foundation & Modeling
**Goal**: 完成技术路径、内容结构与骨架工程
**Depends on**: Nothing (first phase)
**Requirements**: Historical baseline
**Success Criteria** (what must be TRUE):
  1. 项目可在 WSL 本地启动
  2. 歌曲/专辑/时间线基础数据模型可读写
  3. 初始页面骨架可渲染
**Plans**: Completed (historical)

### Phase 2: Core Product Pages
**Goal**: 交付核心浏览页面与基础交互
**Depends on**: Phase 1
**Requirements**: Historical baseline
**Success Criteria** (what must be TRUE):
  1. 用户可访问首页、歌曲页、专辑页、时间线页
  2. 歌曲详情与专辑详情具备基础内容展示
  3. 页面导航路径完整可用
**Plans**: Completed (historical)

### Phase 3: Full Catalog Ingestion
**Goal**: 完成全量目录录入与首轮内容覆盖
**Depends on**: Phase 2
**Requirements**: Historical baseline
**Success Criteria** (what must be TRUE):
  1. 索引歌曲全量可见且可访问
  2. deep-read 首轮覆盖完成
  3. 当前阶段从“补齐”切换为“精修”
**Plans**: Completed (historical)

### Phase 4: Catalog Normalization
**Goal**: 将 archive-group 临时归类收敛到正式专辑结构，建立稳定目录基线
**Depends on**: Phase 3
**Requirements**: CATA-01, CATA-02, CATA-03, META-01
**Success Criteria** (what must be TRUE):
  1. 用户在专辑页只能看到正式专辑结构，不再依赖临时 archive-group 浏览
  2. 歌曲索引中的 `albumSlug` 与专辑索引条目一一对应
  3. 至少一轮归档批次回填完成并写入文档记录
**Plans**: 2 plans

Plans:
- [x] 04-01: 目录一致性审计基线（脚本+报告）
- [ ] 04-02: 专辑摘要与代表曲基线补齐

### Phase 5: Deep Read Quality Upgrade
**Goal**: 提升 deep-read 与歌词/标签一致性，使歌曲页内容可长期维护
**Depends on**: Phase 4
**Requirements**: META-02, META-03, READ-01, READ-02, READ-03
**Success Criteria** (what must be TRUE):
  1. 用户打开重点歌曲时可看到结构化段落解读，不再只有粗粒度说明
  2. 缺失歌词案例可在歌曲页直接展示，不出现空白或异常占位
  3. deep-read 字段（MV、songDesign、interpretations）在页面可稳定渲染
**Plans**: 2 plans

Plans:
- [ ] 05-01: deep-read 结构化精修与标签一致性校准
- [ ] 05-02: 歌词回退链路与缺失项修复

### Phase 6: Reliability Hardening
**Goal**: 建立内容工程最小可靠性防线，确保后续持续迭代可验证
**Depends on**: Phase 5
**Requirements**: QA-01, QA-02, QA-03
**Success Criteria** (what must be TRUE):
  1. `npm test` 在当前内容集上稳定通过并覆盖关键推荐/API 路径
  2. 关键页面与反馈流具备可重复执行的 smoke 或集成检查
  3. `npm run build` 无阻断错误，可作为交付前门禁
**Plans**: 2 plans

Plans:
- [ ] 06-01: 测试覆盖扩展与数据完整性校验
- [ ] 06-02: 构建/反馈链路 smoke 门禁固化

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Modeling | historical | Complete | 2026-04-09 |
| 2. Core Product Pages | historical | Complete | 2026-04-09 |
| 3. Full Catalog Ingestion | historical | Complete | 2026-04-09 |
| 4. Catalog Normalization | 1/2 | In progress | - |
| 5. Deep Read Quality Upgrade | 0/2 | Not started | - |
| 6. Reliability Hardening | 0/2 | Not started | - |

