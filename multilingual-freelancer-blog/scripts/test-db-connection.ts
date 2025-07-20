import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // 尝试连接数据库
    console.log('正在测试数据库连接...');
    
    // 执行一个简单的查询
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    
    console.log('数据库连接成功！', result);
    return true;
  } catch (error) {
    console.error('数据库连接失败：', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

testConnection()
  .then((success) => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('执行测试时发生错误：', error);
    process.exit(1);
  });