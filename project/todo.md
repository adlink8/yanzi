# 项目待办（project/todo.md）

## 高优先级（P0）— 对齐 GSD Phase 5

- [ ] (sd-030) 深读质量升级：优先高收藏/常听曲去 scaffold
  - module: content/songs/deep-reads
  - acceptance: 重点曲目有可信结构化 `lyricInterpretations`，非模板句

- [ ] (sd-031) 补齐 `shang-bu-liao` 真实歌词
  - module: content/songs/raw-lyrics
  - acceptance: 移除待补录占位，歌曲页展示完整歌词

- [ ] (sd-032) MV / 关键 deep-read 字段补全（分批）
  - module: content
  - acceptance: 高优先曲目 `mvUrl` 与 songDesign 可渲染

## 中优先级（P1）— 运维与 Phase 6 预备

- [ ] (sd-001) 稳定线上域名可达性
  - module: ops
  - acceptance: 目标域名 HTTPS 正常、根路径非 404

- [ ] (sd-002) 完成 AI 线上端到端回归（云端 Key）
  - module: app/api + components
  - acceptance: 歌曲页/专辑页提问返回有效流；错误可观测

- [ ] (sd-003) 保持 AI provider 模板与 `docs/SETUP.md` 同步
  - module: docs + env
  - acceptance: OpenAI / DeepSeek / 智谱示例可直接替换

- [ ] (sd-020) 增加 AI 路由与内容完整性测试
  - module: tests
  - acceptance: 关键 API 与 catalog 一致性有自动化覆盖

## 低优先级（P2）

- [ ] (sd-011) 补充部署排障手册
  - module: docs
  - deps: [sd-001]

---
Last updated: 2026-07-17
