# 数据库设置指南

本文档提供了如何设置和使用项目数据库的详细说明。

## 数据库配置

项目使用 PostgreSQL 数据库和 Prisma ORM 进行数据库操作。

### 环境变量

数据库连接通过环境变量 `DATABASE_URL` 配置，该变量在 `.env` 文件中定义：

```
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=..."
```

如果需要连接到不同的数据库，请更新此环境变量。

## Prisma 命令

项目提供了多个 Prisma 相关的命令，可以通过 npm/yarn/pnpm 运行：

### 生成 Prisma 客户端

```bash
pnpm prisma:generate
```

此命令会根据 `prisma/schema.prisma` 文件生成 TypeScript 类型和 Prisma 客户端代码。在修改 schema 后需要运行此命令。

### 创建数据库迁移

```bash
pnpm prisma:migrate
```

此命令会创建一个新的迁移文件，并应用到数据库。在修改 schema 后需要运行此命令来更新数据库结构。

### 部署迁移

```bash
pnpm prisma:deploy
```

此命令用于在生产环境中应用迁移，不会创建新的迁移文件。

### 启动 Prisma Studio

```bash
pnpm prisma:studio
```

此命令会启动 Prisma Studio，一个可视化的数据库管理工具，可以在浏览器中查看和编辑数据。

### 初始化种子数据

```bash
pnpm prisma:seed
```

此命令会初始化数据库中的示例数据，包括用户、博客文章等。

### 测试数据库连接

```bash
pnpm db:test
```

此命令会测试数据库连接是否正常工作。

## 数据模型

项目使用以下数据模型：

- **User**: 用户信息
- **Content**: 博客内容
- **ContentTranslation**: 博客内容的多语言翻译
- **Project**: 项目/作品集
- **ProjectTranslation**: 项目的多语言翻译
- **Media**: 媒体文件（图片、视频）
- **Skill**: 技能
- **ProfileTranslation**: 个人资料的多语言翻译
- **Message**: 联系消息
- **Category**: 内容分类

详细的数据模型定义可以在 `prisma/schema.prisma` 文件中查看。

## 在代码中使用数据库

项目提供了 `PrismaService` 类，封装了常用的数据库操作。示例用法：

```typescript
import prismaService from '../services/prisma-service';

// 获取所有已发布的博客文章
const articles = await prismaService.getAllPublishedContents();

// 获取特定语言的博客文章
const chineseArticles = await prismaService.getAllPublishedContents('zh');

// 获取分页内容
const { contents, pagination } = await prismaService.getPaginatedContents(1, 10, 'en');

// 根据 slug 获取文章
const article = await prismaService.getContentBySlug('getting-started-with-react');
```

## 故障排除

### 连接问题

如果遇到数据库连接问题，请检查：

1. `.env` 文件中的 `DATABASE_URL` 是否正确
2. 数据库服务是否正在运行
3. 网络连接是否正常
4. 防火墙设置是否允许数据库连接

可以使用 `pnpm db:test` 命令测试连接。

### 迁移问题

如果迁移失败，可以尝试：

1. 检查 `prisma/migrations` 目录中的迁移文件
2. 使用 `prisma migrate reset` 重置数据库（注意：这会删除所有数据）
3. 检查 schema 文件是否有语法错误

## 生产环境部署

在生产环境中部署数据库时，请确保：

1. 使用安全的数据库连接字符串，不要在代码中硬编码
2. 使用 `pnpm prisma:deploy` 而不是 `pnpm prisma:migrate` 应用迁移
3. 考虑使用数据库连接池优化性能
4. 定期备份数据库