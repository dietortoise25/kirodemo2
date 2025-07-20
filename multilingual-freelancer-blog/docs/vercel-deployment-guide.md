# Vercel部署指南（使用SQLite数据库）

本文档提供了将多语言自由职业者博客部署到Vercel的详细步骤，特别关注如何处理SQLite数据库。

## SQLite与Vercel的兼容性

需要注意的是，**Vercel的无服务器环境不支持SQLite的持久化存储**。这是因为：

1. Vercel的函数在每次调用时都在临时的、隔离的环境中运行
2. 任何写入文件系统的更改在函数执行完成后都会丢失
3. SQLite依赖于本地文件系统进行数据存储

## 部署选项

### 选项1：迁移到PostgreSQL（推荐）

对于生产环境，建议使用Vercel兼容的数据库服务，如：

- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)
- [Neon](https://neon.tech/)

#### 迁移步骤：

1. 在选定的数据库服务上创建PostgreSQL数据库
2. 更新`.env`文件中的`DATABASE_URL`为新的PostgreSQL连接字符串
3. 修改`prisma/schema.prisma`文件，将数据库提供商从`sqlite`改回`postgresql`
4. 删除所有`@db.Text`注解的修改（PostgreSQL支持这些类型）
5. 运行`pnpm prisma:migrate`创建新的迁移
6. 运行`pnpm prisma:seed`初始化数据

### 选项2：使用只读SQLite（仅适用于演示）

如果您只需要一个演示网站，可以使用预填充的SQLite数据库作为只读数据源：

1. 在本地开发环境中设置和填充SQLite数据库
2. 将`dev.db`文件提交到Git仓库（通常不推荐，但在这种特殊情况下可以考虑）
3. 修改应用程序代码，确保不尝试写入数据库

**注意**：此方法不适合生产环境，因为：
- 数据库是只读的，无法添加或修改数据
- 每次部署都会重置为提交的数据库状态

## Vercel部署步骤

### 1. 准备项目

确保项目已经准备好部署：

- 所有代码已提交到GitHub仓库
- 项目可以在本地成功构建(`pnpm build`)
- 已选择并配置好适合Vercel的数据库解决方案

### 2. 在Vercel上创建新项目

1. 登录到[Vercel](https://vercel.com/)
2. 点击"New Project"按钮
3. 从GitHub导入你的仓库
4. 如果没有看到你的仓库，你可能需要配置GitHub权限

### 3. 配置项目

在Vercel项目设置页面：

1. **项目名称**：输入一个合适的项目名称，如"multilingual-freelancer-blog"
2. **框架预设**：选择"Vite"
3. **构建命令**：确认为`pnpm build`
4. **输出目录**：确认为`dist`
5. **安装命令**：设置为`pnpm install`

### 4. 环境变量配置

在项目设置的"Environment Variables"部分，添加以下环境变量：

```
DATABASE_URL=your_postgres_connection_string
VITE_DEFAULT_LANGUAGE=zh
VITE_AVAILABLE_LANGUAGES=zh,en
VITE_SITE_NAME=Multilingual Freelancer Blog
```

### 5. 部署设置

1. **构建缓存**：保持启用以加快后续部署
2. **自动部署**：默认情况下，每次推送到主分支都会触发新的部署

### 6. 触发部署

点击"Deploy"按钮开始部署过程。

## 数据库迁移和种子数据

对于PostgreSQL数据库，您需要在每次部署后运行迁移和种子脚本：

1. 在Vercel项目设置中，转到"Settings" > "General" > "Build & Development Settings"
2. 在"Build Command"字段中，将命令更改为：
   ```
   pnpm prisma:generate && pnpm build && pnpm prisma:deploy && pnpm prisma:seed
   ```

## 故障排除

如果部署失败，请检查：

1. 构建日志中的错误信息
2. 确保所有必要的环境变量已正确设置
3. 验证数据库连接字符串是否正确
4. 确认Prisma配置与所选数据库类型匹配

如果问题仍然存在，可以参考[Vercel帮助文档](https://vercel.com/docs)或联系Vercel支持。