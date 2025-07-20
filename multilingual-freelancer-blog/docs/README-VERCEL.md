# Vercel部署指南

## 概述

本文档提供了将多语言自由职业者博客部署到Vercel的详细步骤。由于我们目前使用的是SQLite数据库，而Vercel的无服务器环境不支持SQLite的持久化存储，因此需要进行一些额外的配置。

## 快速开始

1. **查看详细文档**：
   - [Vercel部署指南（使用SQLite数据库）](./vercel-deployment-guide.md) - 详细说明了SQLite与Vercel的兼容性问题及解决方案

2. **环境变量模板**：
   - [Vercel环境变量模板](./env-template-for-vercel.txt) - 包含了在Vercel上部署时需要设置的环境变量

3. **数据库迁移**：
   - 如果您计划在生产环境中使用，建议将SQLite数据库迁移到PostgreSQL
   - 使用提供的迁移脚本：`pnpm db:migrate-to-postgres "your-postgres-connection-string"`

## 部署选项

### 选项1：使用PostgreSQL（推荐用于生产环境）

1. 在Vercel兼容的数据库服务上创建PostgreSQL数据库（如Vercel Postgres、Supabase、Railway等）
2. 使用迁移脚本将数据从SQLite迁移到PostgreSQL
3. 更新环境变量和Prisma配置
4. 部署到Vercel

### 选项2：使用只读SQLite（仅适用于演示）

1. 提交预填充的SQLite数据库到Git仓库
2. 确保应用程序代码不尝试写入数据库
3. 部署到Vercel

## 部署步骤

详细的部署步骤请参考[Vercel部署指南（使用SQLite数据库）](./vercel-deployment-guide.md)文档。

## 常见问题

### SQLite数据库在Vercel上不工作

Vercel的无服务器环境不支持SQLite的持久化存储。每次函数调用都在临时环境中运行，任何写入文件系统的更改在函数执行完成后都会丢失。

### 如何在Vercel上使用数据库？

建议使用Vercel兼容的数据库服务，如：
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)
- [Neon](https://neon.tech/)

### 如何迁移现有数据？

使用项目中提供的迁移脚本：
```bash
pnpm db:migrate-to-postgres "your-postgres-connection-string"
```

## 相关资源

- [Vercel文档](https://vercel.com/docs)
- [Prisma与Vercel集成](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Vercel Postgres文档](https://vercel.com/docs/storage/vercel-postgres)