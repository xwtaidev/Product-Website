# Personal Showcase

一个用于展示个人产品能力的多页面网站，聚焦：
- 代表项目（Work）
- 方法与复盘文章（Blog）
- 服务介绍与联系方式（Home）

仓库地址：[xwtaidev/Product-Website](https://github.com/xwtaidev/Product-Website)  
作者 GitHub：[xwtaidev](https://github.com/xwtaidev)  
作者 X：[xwtaidev](https://x.com/xwtaidev)  
联系邮箱：`xwtaidev@gmail.com`

## 当前网站结构

### 页面地图
- `/`：首页（个人介绍、精选项目、精选文章、服务与联系）
- `/work`：项目列表页
- `/projects/[slug]`：项目详情页
- `/blog`：文章列表页
- `/blog/[slug]`：文章详情页

### 关键体验
- Header 导航支持当前页高亮
- Work / Blog 列表页提供「返回首页」
- 支持浅色 / 深色主题切换（本地持久化）
- 页面内容采用静态数据驱动，适合持续迭代维护

## 技术栈

- Next.js 16（App Router）
- React 19
- TypeScript 5
- Tailwind CSS 4
- ESLint 9

## 项目目录

```text
src/
  app/
    page.tsx                # 首页
    work/page.tsx           # Work 列表页
    projects/[slug]/page.tsx
    blog/page.tsx           # Blog 列表页
    blog/[slug]/page.tsx
    layout.tsx              # 全局 Metadata / 主题初始化
    globals.css
  components/
    site-header.tsx         # 顶部导航
    theme-toggle.tsx        # 深浅色切换
  lib/
    projects.ts             # 项目数据源
    blog-posts.ts           # 博客数据源
```

## 本地开发

### 1) 安装依赖
```bash
npm install
```

### 2) 启动开发环境
```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)

### 3) 常用命令
```bash
npm run lint      # 代码检查
npm run build     # 生产构建（静态导出）
npm run start     # 启动生产服务（仅在非静态托管场景使用）
```

## 内容维护指南

### 更新项目内容
- 编辑 `src/lib/projects.ts`
- 字段包含：标题、简介、封面、标签、挑战、方案、结果等

### 更新博客内容
- 编辑 `src/lib/blog-posts.ts`
- 详情页正文在 `src/app/blog/[slug]/page.tsx` 的 `articleBodies`

### 更新个人信息与对外链接
- 首页联系方式：`src/app/page.tsx`
- 全局站点标题与 SEO：`src/app/layout.tsx`

## 部署说明（Cloudflare Pages）

项目已启用静态导出配置：
- `next.config.ts` 中 `output: "export"`
- 构建产物目录：`out`

推荐 Cloudflare Pages 配置：
- Build command: `npm run build`
- Output directory: `out`
- Production branch: `main`

详细步骤见：`docs/DEPLOY_CLOUDFLARE_PAGES_v-0.1.0.md`

## 版本与分支建议

- `main`：生产分支
- `v-*` 或 feature 分支：开发 / 预览分支

每次改动建议包含：
1. 代码或内容更新
2. `npm run lint` 通过
3. 提交信息清晰说明变更目的
