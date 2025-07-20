import { PrismaClient } from '../generated/prisma';
import prismaService from '../src/services/prisma-service';

const prisma = new PrismaClient();

async function main() {
  console.log('开始初始化数据...');
  
  try {
    // 使用 prismaService 的 seedData 方法初始化数据
    await prismaService.seedData();
    console.log('数据初始化成功！');
  } catch (error) {
    console.error('数据初始化失败：', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();