# Roadmap: Stefanie Sun Deep Reads

## Overview

路线图对齐 2026-07-17 状态：Phase 1–4 交付完成；Phase 5 深读 **全库按曲定制（editorial）** 完成；当前焦点 Phase 6 可靠性与 MV/真歌词补齐。

## Phases

- [x] **Phase 1: Foundation & Modeling** - 技术方案、数据模型、项目骨架
- [x] **Phase 2: Core Product Pages** - 首页/歌曲/专辑/时间线主路径
- [x] **Phase 3: Full Catalog Ingestion** - 全量索引与首轮 deep-read 覆盖
- [x] **Phase 4: Catalog Normalization** - 归档回填与专辑映射规范化
- [x] **Phase 5: Deep Read Quality Upgrade** - 按曲定制解读 + 歌词回退 + 全库 editorial
- [ ] **Phase 6: Reliability Hardening** - 测试/CI 收口、smoke、构建稳定性；MV/运维

## Phase Details

### Phase 1–3 (Historical)
已完成。见 `docs/PROGRESS-SNAPSHOT.md` 与 git 历史。

### Phase 4: Catalog Normalization — COMPLETE
**Completed:** 2026-07-17  
**Requirements:** CATA-01, CATA-02, CATA-03, META-01  

- 无 archive-group 浏览依赖
- `start-live` 登记；`songSlugs` 由 `albumSlug` 派生对齐
- Plans: 04-01 / 04-02 完成

### Phase 5: Deep Read Quality Upgrade — COMPLETE
**Completed:** 2026-07-17  
**Requirements:** META-02 (improved), META-03 (partial), READ-01, READ-02 (partial), READ-03  

**Delivered:**
1. ✓ 规范 `docs/DEEPREAD-EDITORIAL-SPEC.md`（禁止跨曲模板）
2. ✓ 流水线：`report:deepread-quality` / `prepare:deepread-batches` / `prepare:deepread-depth` / `verify:deepread-batch`
3. ✓ **184/184** deep-read `tier=editorial`（scaffold=0, passable=0）
4. ✓ 高优先 8 首 + 全库分批子代理精修 + 深度加厚（body≥280、5–6 段真歌词锚点）
5. ✓ 歌词回退：占位 raw-lyrics 不展示为完整歌词；假 MV 批量 ID 已清理
6. ~ `shang-bu-liao` 真歌词仍待人工补录；多数曲缺 verified MV

**Plans:**
- [x] 05-01: deep-read 结构化精修与质量报告
- [x] 05-02: 歌词回退与占位伪完整修复
- [x] Catalog editorial batches + depth-upgrade waves（文档化于 `docs/deepread-batches/`）

### Phase 6: Reliability Hardening
**Goal:** 内容工程与部署最小可靠性防线  
**Depends on:** Phase 5  
**Requirements:** QA-01, QA-02, QA-03（+ 可选 MV 覆盖）  

**Already on branch (partial):**
- Vitest **52** tests（recommend / content / AI / API）
- GitHub Actions CI（typecheck / lint / test / catalog audit / content gate）

**Plans:**
- [ ] 06-01: 测试覆盖扩展与数据完整性校验（形式化收口 + 可选 E2E）
- [ ] 06-02: 构建/反馈链路 smoke 门禁固化
- [ ] Optional: verified MV 分批补链；`shang-bu-liao` 真歌词入库

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Modeling | historical | Complete | 2026-04-09 |
| 2. Core Product Pages | historical | Complete | 2026-04-09 |
| 3. Full Catalog Ingestion | historical | Complete | 2026-04-09 |
| 4. Catalog Normalization | 2/2 | Complete | 2026-07-17 |
| 5. Deep Read Quality Upgrade | 2/2 + catalog | **Complete** | 2026-07-17 |
| 6. Reliability Hardening | 0/2 formal | Partial (CI/tests) | - |
