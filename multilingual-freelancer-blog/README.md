# 多语言自由职业者博客

一个支持多语言的自由职业者博客和作品集网站，使用 React、TypeScript、Vite、TailwindCSS 和 i18next 构建。

## 功能特点

- 🌐 多语言支持（中文、英文等）
- 🎨 暗黑模式支持
- 📝 Markdown 博客文章
- 🖼️ 作品集展示
- 📊 管理后台
- 🔒 用户认证系统
- 📱 响应式设计

## 技术栈

- **前端框架**: React
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: TailwindCSS + shadcn/ui
- **国际化**: i18next
- **路由**: React Router
- **认证**: JWT (使用 jose 库)
- **Markdown**: react-markdown

## 本地开发

### 前提条件

- Node.js 18+
- pnpm

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

## 部署

本项目可以轻松部署到 Vercel：

1. 在 Vercel 上创建新项目
2. 导入 GitHub 仓库
3. 配置环境变量（如需）
4. 部署

## 项目结构

```
multilingual-freelancer-blog/
├── public/                  # 静态资源
│   └── locales/             # 翻译文件
├── src/
│   ├── api/                 # API 调用
│   ├── assets/              # 资源文件
│   ├── components/          # 组件
│   ├── contexts/            # React 上下文
│   ├── hooks/               # 自定义 hooks
│   ├── layouts/             # 布局组件
│   ├── lib/                 # 工具库
│   ├── pages/               # 页面组件
│   ├── services/            # 服务
│   ├── styles/              # 样式
│   ├── types/               # TypeScript 类型
│   └── utils/               # 工具函数
├── .gitignore
├── components.json          # shadcn/ui 配置
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 环境变量

创建 `.env` 文件并配置以下环境变量：

```
VITE_API_URL=your_api_url
VITE_JWT_SECRET=your_jwt_secret
```

## 许可证

MIT
