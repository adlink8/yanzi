# Roadmap: Stefanie Sun Deep Reads

## Overview

本路线图对齐既有文档与 2026-07-17 目录收口结果。
Phase 1–3 为历史交付；Phase 4 目录规范化已关闭；当前进入 Phase 5 深读质量精修。

## Phases

- [x] **Phase 1: Foundation & Modeling** - 技术方案、数据模型、项目骨架
- [x] **Phase 2: Core Product Pages** - 首页/歌曲/专辑/时间线主路径
- [x] **Phase 3: Full Catalog Ingestion** - 全量索引与首轮 deep-read 覆盖
- [x] **Phase 4: Catalog Normalization** - 归档回填与专辑映射规范化
- [x] **Phase 5: Deep Read Quality Upgrade** - 深读内容与元数据质量提升（wave-1：高优先 8 首 + 歌词回退）
- [ ] **Phase 6: Reliability Hardening** - 测试、反馈链路与构建稳定性增强

## Phase Details

### Phase 1–3 (Historical)
已完成。见 `docs/PROGRESS-SNAPSHOT.md` 与 git 历史。

### Phase 4: Catalog Normalization — COMPLETE
**Goal**: 将 archive-group 临时归类收敛到正式专辑结构，建立稳定目录基线  
**Requirements**: CATA-01, CATA-02, CATA-03, META-01  
**Completed**: 2026-07-17

**Success Criteria:**
1. ✓ 专辑页为正式结构，不再依赖 archive-group 浏览
2. ✓ 歌曲 `albumSlug` 均能对应专辑索引条目（含 `start-live`）
3. ✓ 归档批次回填有文档记录；`songSlugs` 由歌曲侧派生对齐

**Plans:**
- [x] 04-01: 目录一致性审计基线（脚本+报告）
- [x] 04-02: 批次执行 + 映射收口（含 start-live 恢复与 songSlugs 同步）

### Phase 5: Deep Read Quality Upgrade — WAVE-1 COMPLETE
**Goal**: 提升 deep-read 与歌词/标签一致性，使歌曲页内容可长期维护  
**Depends on**: Phase 4  
**Requirements**: META-02 (partial), META-03 (partial), READ-01 (high-fav), READ-02 (partial), READ-03  
**Completed (wave-1)**: 2026-07-17

**Success Criteria:**
1. ✓ 高优先（favorite=high）8 首为 editorial 结构化解读
2. ~ 占位歌词不再伪完整展示；`shang-bu-liao` 真实歌词仍待补录
3. ✓ 字段可渲染；假 MV 已清理；多数曲仍缺 verified MV

**Plans:**
- [x] 05-01: deep-read 结构化精修与标签一致性校准
- [x] 05-02: 歌词回退链路与缺失项修复

**Follow-up (optional batch-2):** 中优先级 scaffold 分批精修、MV 补链、真实歌词补录

### Phase 6: Reliability Hardening
**Goal**: 内容工程最小可靠性防线  
**Depends on**: Phase 5  
**Requirements**: QA-01, QA-02, QA-03  
**Success Criteria:**
1. `npm test` 覆盖关键推荐/API 路径并稳定通过
2. 关键页面与反馈流具备 smoke/集成检查
3. `npm run build` / `build:cf` 无阻断错误

**Plans:**
- [ ] 06-01: 测试覆盖扩展与数据完整性校验
- [ ] 06-02: 构建/反馈链路 smoke 门禁固化

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Modeling | historical | Complete | 2026-04-09 |
| 2. Core Product Pages | historical | Complete | 2026-04-09 |
| 3. Full Catalog Ingestion | historical | Complete | 2026-04-09 |
| 4. Catalog Normalization | 2/2 | Complete | 2026-07-17 |
| 5. Deep Read Quality Upgrade | 2/2 | Complete (wave-1) | 2026-07-17 |
| 6. Reliability Hardening | 0/2 | Partial (CI on branch) | - |
