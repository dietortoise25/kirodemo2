// 检查是否在服务器环境中运行
if (typeof window !== 'undefined') {
  throw new Error('Prisma Client cannot be used in the browser environment');
}

import { PrismaClient } from '../../generated/prisma';

// 创建一个全局的Prisma实例
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // 在开发环境中避免创建多个实例
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export default prisma;