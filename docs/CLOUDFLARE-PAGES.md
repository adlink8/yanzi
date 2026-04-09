# Cloudflare Pages Deployment

本项目是 Next.js 应用，推荐使用 Cloudflare Pages 的 Git 集成自动发布。

## 1) 连接仓库

在 Cloudflare Dashboard 中创建 Pages 项目并连接 GitHub：

- Repository: `adlink8/yanzi`
- Production branch: `main`（或你希望作为生产发布的分支）

## 2) 构建配置

在 Pages 项目设置中使用以下构建参数：

- Framework preset: `Next.js`
- Build command: `npx @cloudflare/next-on-pages@1`
- Build output directory: `.vercel/output/static`

## 3) 环境变量（Production / Preview 都要配）

必须在 Pages 的 Production 和 Preview 环境都配置：

- `OPENAI_BASE_URL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

> 注意：仓库默认值是本地 Ollama（`127.0.0.1`），仅适用于本地开发。  
> 部署到 Cloudflare 后，请使用可公网访问的 OpenAI-compatible 服务地址与密钥。

## 4) 首次部署

完成设置后触发首次 Deploy，等待构建完成并获取 `*.pages.dev` 预览域名。

## 5) 绑定自定义域名（可选）

在 Pages 的 **Custom domains** 添加域名，按提示完成 Cloudflare DNS 记录配置并等待生效。

## 6) 自动发布

后续每次 push 到生产分支，Cloudflare Pages 会自动重新构建并发布。
