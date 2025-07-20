// 检查是否在服务器环境中运行
if (typeof window !== 'undefined') {
  throw new Error('Prisma Client cannot be used in the browser environment');
}

import { PrismaClient } from '../../generated/prisma';

// 声明process类型
declare const process: {
  env: {
    NODE_ENV?: string;
  };
};

// 创建一个全局的Prisma实例
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // 在开发环境中避免创建多个实例
  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
  };
  
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;