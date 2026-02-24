# Cloudflare Pages 绑定部署说明（GitHub 集成）

适用仓库：`xwtaidev/Product-Website`
分支建议：
- 生产：`main`
- 预览：`v-0.1.0`（以及后续 feature 分支）

## 1) 前置状态（已处理）

本项目已改为静态导出，适合 Cloudflare Pages GitHub 绑定：
- `next.config.ts`
  - `output: "export"`
  - `images.unoptimized: true`

构建后产物目录：`out`

---

## 2) 在 Cloudflare Pages 绑定 GitHub

1. 打开 Cloudflare Dashboard → **Workers & Pages** → **Create application** → **Pages**
2. 选择 **Connect to Git**
3. 授权并选择仓库：`xwtaidev/Product-Website`
4. 选择分支：
   - Production branch: `main`
5. Build 配置填写：
   - Framework preset: `Next.js`（或 `None` 也可）
   - Build command: `npm run build`
   - Build output directory: `out`
   - Root directory: `/`（留空默认）
6. 点击 **Save and Deploy**

---

## 3) 预览站点策略

采用 GitHub 绑定后：
- 所有非生产分支推送会自动生成预览 URL（`*.pages.dev`）
- 可以直接推送 `v-0.1.0` 触发一版预览

建议流程：
1. 在 `v-0.1.0` 上开发并 push
2. Cloudflare 自动生成 Preview Deployment
3. 评审通过后合并到 `main` 发布正式站

---

## 4) 常见问题

1. 如果构建时报图片优化相关错误：
   - 确认 `images.unoptimized = true`

2. 如果 404：
   - 确认输出目录为 `out`

3. 如果预览没触发：
   - 检查分支是否 push 到远程
   - 检查 Cloudflare 项目是否已绑定该仓库
