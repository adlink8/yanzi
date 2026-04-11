# Stefanie Sun Deep Reads (孙燕姿作品深度解读站)

一个由粉丝长期维护的孙燕姿作品图书馆与 AI 解读助手。本站旨在通过极具艺术感的视觉呈现与深度的人文剖析，记录孙燕姿音乐生涯的每一个重要瞬间。

## 🌟 Pro Max 级视觉特性

本站采用了最新的 **UI/UX Pro Max** 设计准则，致力于打造叙事性的沉浸式阅读空间：

- **Aurora UI (极光背景)**：基于网格渐变（Mesh Gradient）的动态流动背景，色彩随音乐时期自动流转。
- **Glassmorphism (磨砂玻璃)**：全站卡片采用高阶模糊（backdrop-blur-2xl）与微弱高光边框，模拟高级玻璃质感。
- **Subtle Grain (微粒噪声)**：覆盖 3% 透明度的胶片质感噪声，消除数字界面的塑料感，增加高级艺术纸质感。
- **时空氛围系统 (Atmospheric System)**：
  - **背景模式**：支持“纯净”、“人物”、“专辑”三种模式自由切换。
  - **时期动效**：如《风筝》的灵动线条、《克卜勒》的呼吸星场、《跳舞的梵谷》的癫狂笔触等。

## 📚 内容补完现状 (Coverage)

- **官方 15 张作品**：已完成从《孙燕姿》到《跳舞的梵谷》全 15 张录音室专辑及重要精选辑的深度重构。
- **史诗级神作补完**：全站 33 首核心曲目已实现《天黑黑》级的深度解读，包含：
  - **官方高清 MV 链接**
  - **逐句细读 (Line-by-line)**：挖掘文学隐喻与情感锚点。
  - **设计分析 (Song Design)**：剖析编曲、唱腔演进与录音室轶事。
- **全生命周期时间线**：整理了 2000-2026 跨越 26 年的音乐历程叙事。

## 🛠️ 技术栈与部署

### 核心架构
- **框架**：Next.js 15 (App Router) + TypeScript
- **样式**：Tailwind CSS + Framer Motion
- **部署**：适配 Cloudflare Pages (Edge Runtime)
- **AI 助手**：支持 OpenAI 兼容 API 的流式响应（Streaming）。

### 环境变量配置 (Cloudflare / Vercel)
在部署环境中请确保配置以下变量以启用 AI 功能：
- `OPENAI_API_KEY`: 您的 API Key (必填)
- `OPENAI_BASE_URL`: API 代理地址 (选填)
- `OPENAI_MODEL`: 模型名称 (如 `gpt-4o-mini`, `deepseek-chat`)
- `GITHUB_FEEDBACK_TOKEN`: 启用档案库共建功能所需

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器 (默认端口: 3008)
npm run dev
```
访问地址：`http://localhost:3008`

### Cloudflare 部署构建命令
针对 Cloudflare Pages 的 25MB 上传限制，本站提供了专用构建脚本：
**Build command**: `npm run build:cf`
**Output directory**: `.vercel/output`

## 🤝 燕姿档案库 (Contribution Hub)

欢迎广大歌迷通过 **/feedback** 页面参与共建。
- 支持上传高清专辑扫描图、访谈文档等。
- 附件将安全存储于 Cloudflare R2（需配置）或记录于 GitHub Issue。

## 📁 目录规范

- `content/songs/index.json`: 歌曲元数据与推荐逻辑。
- `content/albums/index.json`: 官方 15 张专辑的核心定位。
- `content/songs/deep-reads/`: 深度解读 Markdown 文件。
- `content/songs/raw-lyrics/`: 纯净歌词文本。

---
*愿这份解读，能让你在每一道绿光中，重新遇见那个尚好的青春。*
