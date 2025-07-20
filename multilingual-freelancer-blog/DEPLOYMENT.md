# 部署指南

本文档提供了将多语言自由职业者博客部署到 Vercel 的详细步骤。

## 前提条件

- [GitHub](https://github.com/) 账号
- [Vercel](https://vercel.com/) 账号
- 本项目的代码库

## 部署步骤

### 1. 准备项目

确保项目已经准备好部署：

- 所有代码已提交到 GitHub 仓库
- 项目可以在本地成功构建 (`pnpm build`)
- 项目包含必要的配置文件（vercel.json）

### 2. 在 Vercel 上创建新项目

1. 登录到 [Vercel](https://vercel.com/)
2. 点击 "New Project" 按钮
3. 从 GitHub 导入你的仓库
4. 如果没有看到你的仓库，你可能需要配置 GitHub 权限

### 3. 配置项目

在 Vercel 项目设置页面：

1. **项目名称**：输入一个合适的项目名称，如 "multilingual-freelancer-blog"
2. **框架预设**：选择 "Vite"
3. **构建命令**：确认为 `pnpm build` 或 `npm run build`
4. **输出目录**：确认为 `dist`
5. **安装命令**：设置为 `pnpm install`

### 4. 环境变量配置

在项目设置的 "Environment Variables" 部分，添加以下环境变量：

```
VITE_API_URL=https://api.example.com (或你的实际API URL)
VITE_JWT_SECRET=your_secure_jwt_secret
VITE_DEFAULT_LANGUAGE=zh
VITE_AVAILABLE_LANGUAGES=zh,en
VITE_SITE_NAME=Multilingual Freelancer Blog
```

### 5. 部署设置

1. **构建缓存**：保持启用以加快后续部署
2. **自动部署**：默认情况下，每次推送到主分支都会触发新的部署

### 6. 触发部署

点击 "Deploy" 按钮开始部署过程。

### 7. 自定义域名（可选）

部署成功后，你可以在项目设置的 "Domains" 部分添加自定义域名：

1. 点击 "Add" 按钮
2. 输入你的域名
3. 按照 Vercel 提供的说明配置 DNS 记录

## 持续部署

Vercel 会自动监控你的 GitHub 仓库，每当有新的提交推送到主分支时，它会自动构建和部署最新版本。

## 部署预览

Vercel 还为每个 Pull Request 创建预览部署，这使你可以在合并代码之前查看更改的效果。

## 回滚部署

如果新部署出现问题，你可以在 Vercel 仪表板中快速回滚到之前的成功部署：

1. 进入项目的 "Deployments" 部分
2. 找到你想要回滚到的部署
3. 点击 "..." 菜单
4. 选择 "Promote to Production"

## 监控和分析

部署后，你可以使用 Vercel 提供的分析工具监控你的应用程序性能：

1. 访问项目的 "Analytics" 部分
2. 查看页面加载性能、访问量和其他指标

## 故障排除

如果部署失败，请检查：

1. 构建日志中的错误信息
2. 确保所有必要的环境变量已正确设置
3. 验证项目在本地可以成功构建
4. 确认 package.json 中的构建脚本正确无误

如果问题仍然存在，可以参考 [Vercel 帮助文档](https://vercel.com/docs) 或联系 Vercel 支持。
