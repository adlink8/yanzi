---
phase: "04"
name: "catalog-normalization"
created: 2026-04-10
updated: 2026-04-10
---

# Phase 4: catalog-normalization — Context

## Scope Boundary

本阶段只处理目录规范化与专辑映射一致性，不做大规模文案重写。
优先把“结构正确”建立为可验证基线，再进入后续深读精修。

## Planning Sources

- `docs/PROGRESS-SNAPSHOT.md`（next phase: refinement and normalization）
- `docs/ARCHIVE-BATCHES.md`（batch 26-29 的归档迁移记录）
- `docs/ISSUES-LOG.md`（已修复项与仍 open 项）
- `.planning/REQUIREMENTS.md`（CATA-01..03, META-01）

## Locked Decisions

1. 先做自动化审计，输出当前目录一致性事实清单，再据此修复。
2. 审计结果必须落盘为文档（`docs/CATALOG-NORMALIZATION-AUDIT.*`），不能只在终端输出。
3. 先处理结构性问题（slug 映射、文件缺失、引用不存在），语义优化放在后续阶段。

## Discretion Areas

- 审计维度可以按代码现状扩展（例如 duplicate slug、未使用专辑、缺失 deep-read/raw-lyrics）。
- 报告格式可调整，但必须同时提供 machine-readable（JSON）和 human-readable（Markdown）。

## Deferred Ideas

- 对所有 deep-read 文案进行统一风格重写（Phase 5）
- 引入更细粒度的数据质量评分体系（Phase 6+）
