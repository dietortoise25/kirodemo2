/**
 * SQLite到PostgreSQL迁移脚本
 * 
 * 此脚本帮助将本地SQLite数据库迁移到PostgreSQL数据库
 * 用于Vercel部署准备
 */

import { PrismaClient as SQLitePrismaClient } from '../generated/prisma';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

// 创建临时的.env文件路径
const tempEnvPath = path.join(process.cwd(), '.env.postgres');

// 主函数
async function migrateToPostgres() {
  console.log('开始迁移数据从SQLite到PostgreSQL...');
  
  // 1. 获取PostgreSQL连接字符串
  const postgresUrl = await promptForPostgresUrl();
  if (!postgresUrl) {
    console.error('错误: 未提供PostgreSQL连接字符串');
    process.exit(1);
  }
  
  // 2. 备份当前的.env文件
  await backupEnvFile();
  
  try {
    // 3. 从SQLite导出数据
    console.log('从SQLite数据库导出数据...');
    const sqliteClient = new SQLitePrismaClient();
    const data = await exportDataFromSQLite(sqliteClient);
    await sqliteClient.$disconnect();
    
    // 4. 创建临时.env文件使用PostgreSQL
    await createTempEnvFile(postgresUrl);
    
    // 5. 更新schema.prisma文件
    await updatePrismaSchema();
    
    // 6. 运行Prisma迁移
    console.log('创建PostgreSQL数据库结构...');
    await runPrismaMigrate();
    
    // 7. 导入数据到PostgreSQL
    console.log('导入数据到PostgreSQL...');
    await importDataToPostgres(data);
    
    console.log('\n✅ 迁移完成!');
    console.log('\n请更新您的.env文件，将DATABASE_URL设置为:');
    console.log(`DATABASE_URL="${postgresUrl}"`);
    console.log('\n并将prisma/schema.prisma中的provider更改为"postgresql"');
  } catch (error) {
    console.error('迁移过程中出错:', error);
  } finally {
    // 8. 清理临时文件
    await cleanupTempFiles();
  }
}

// 提示用户输入PostgreSQL连接字符串
async function promptForPostgresUrl(): Promise<string> {
  // 在实际实现中，您可能需要使用readline或其他库来获取用户输入
  // 这里我们假设从环境变量或命令行参数获取
  const url = process.env.POSTGRES_URL || process.argv[2];
  
  if (!url) {
    console.log('请提供PostgreSQL连接字符串:');
    console.log('使用方式: pnpm tsx scripts/migrate-to-postgres.ts "postgresql://username:password@hostname:port/database"');
    return '';
  }
  
  return url;
}

// 备份当前的.env文件
async function backupEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  const backupPath = path.join(process.cwd(), '.env.sqlite.backup');
  
  if (fs.existsSync(envPath)) {
    fs.copyFileSync(envPath, backupPath);
    console.log(`当前.env文件已备份为 ${backupPath}`);
  }
}

// 从SQLite导出所有数据
async function exportDataFromSQLite(client: SQLitePrismaClient) {
  // 获取所有模型的数据
  // 注意: 您需要根据实际的数据模型调整这里的代码
  const users = await client.user.findMany();
  const contents = await client.content.findMany();
  const contentTranslations = await client.contentTranslation.findMany();
  const projects = await client.project.findMany();
  const projectTranslations = await client.projectTranslation.findMany();
  const media = await client.media.findMany();
  const skills = await client.skill.findMany();
  const profileTranslations = await client.profileTranslation.findMany();
  
  return {
    users,
    contents,
    contentTranslations,
    projects,
    projectTranslations,
    media,
    skills,
    profileTranslations
  };
}

// 创建使用PostgreSQL的临时.env文件
async function createTempEnvFile(postgresUrl: string) {
  const content = `DATABASE_URL="${postgresUrl}"
`;
  fs.writeFileSync(tempEnvPath, content);
  
  // 临时替换.env文件
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    fs.renameSync(envPath, path.join(process.cwd(), '.env.temp'));
  }
  fs.renameSync(tempEnvPath, envPath);
}

// 更新schema.prisma文件使用PostgreSQL
async function updatePrismaSchema() {
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  let schema = fs.readFileSync(schemaPath, 'utf8');
  
  // 将provider从sqlite更改为postgresql
  schema = schema.replace(
    'provider = "sqlite"',
    'provider = "postgresql"'
  );
  
  // 恢复@db.Text注解
  schema = schema.replace(/content\s+String/g, 'content String @db.Text');
  schema = schema.replace(/description\s+String/g, 'description String @db.Text');
  schema = schema.replace(/bio\s+String/g, 'bio String @db.Text');
  schema = schema.replace(/services\s+String/g, 'services String @db.Text');
  
  fs.writeFileSync(schemaPath, schema);
  console.log('已更新schema.prisma文件使用PostgreSQL');
}

// 运行Prisma迁移
async function runPrismaMigrate() {
  try {
    await execAsync('pnpm prisma:generate');
    await execAsync('pnpm prisma:migrate');
  } catch (error) {
    console.error('运行Prisma迁移时出错:', error);
    throw error;
  }
}

// 导入数据到PostgreSQL
async function importDataToPostgres(data: any) {
  // 使用新的PostgreSQL连接
  // 注意: 这里需要重新导入PrismaClient，因为schema已经更改
  const { PrismaClient } = await import('@prisma/client');
  const postgresClient = new PrismaClient();
  
  try {
    // 按照依赖关系顺序导入数据
    console.log(`导入${data.users.length}个用户...`);
    for (const user of data.users) {
      await postgresClient.user.create({
        data: {
          ...user,
          // 确保日期字段正确转换
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt)
        }
      });
    }
    
    console.log(`导入${data.contents.length}个内容...`);
    for (const content of data.contents) {
      await postgresClient.content.create({
        data: {
          ...content,
          publishedAt: content.publishedAt ? new Date(content.publishedAt) : null,
          createdAt: new Date(content.createdAt),
          updatedAt: new Date(content.updatedAt)
        }
      });
    }
    
    console.log(`导入${data.contentTranslations.length}个内容翻译...`);
    for (const translation of data.contentTranslations) {
      await postgresClient.contentTranslation.create({
        data: {
          ...translation,
          createdAt: new Date(translation.createdAt),
          updatedAt: new Date(translation.updatedAt)
        }
      });
    }
    
    console.log(`导入${data.projects.length}个项目...`);
    for (const project of data.projects) {
      await postgresClient.project.create({
        data: {
          ...project,
          completionDate: project.completionDate ? new Date(project.completionDate) : null,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt)
        }
      });
    }
    
    console.log(`导入${data.projectTranslations.length}个项目翻译...`);
    for (const translation of data.projectTranslations) {
      await postgresClient.projectTranslation.create({
        data: {
          ...translation,
          createdAt: new Date(translation.createdAt),
          updatedAt: new Date(translation.updatedAt)
        }
      });
    }
    
    console.log(`导入${data.media.length}个媒体...`);
    for (const item of data.media) {
      await postgresClient.media.create({
        data: {
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt)
        }
      });
    }
    
    console.log(`导入${data.skills.length}个技能...`);
    for (const skill of data.skills) {
      await postgresClient.skill.create({
        data: {
          ...skill,
          createdAt: new Date(skill.createdAt),
          updatedAt: new Date(skill.updatedAt)
        }
      });
    }
    
    console.log(`导入${data.profileTranslations.length}个个人资料翻译...`);
    for (const translation of data.profileTranslations) {
      await postgresClient.profileTranslation.create({
        data: {
          ...translation,
          createdAt: new Date(translation.createdAt),
          updatedAt: new Date(translation.updatedAt)
        }
      });
    }
    
  } catch (error) {
    console.error('导入数据到PostgreSQL时出错:', error);
    throw error;
  } finally {
    await postgresClient.$disconnect();
  }
}

// 清理临时文件
async function cleanupTempFiles() {
  // 恢复原始.env文件
  const tempEnvPath = path.join(process.cwd(), '.env.temp');
  if (fs.existsSync(tempEnvPath)) {
    fs.renameSync(tempEnvPath, path.join(process.cwd(), '.env'));
  }
}

// 运行迁移
migrateToPostgres().catch(console.error);