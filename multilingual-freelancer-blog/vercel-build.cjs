// Vercel构建脚本
const { execSync } = require("child_process");
const fs = require("fs");

// 检查环境变量
console.log("检查环境变量...");
const requiredEnvVars = [
  "VITE_JWT_SECRET",
  "VITE_DEFAULT_LANGUAGE",
  "VITE_AVAILABLE_LANGUAGES",
  "VITE_SITE_NAME",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.warn(`警告: 缺少以下环境变量: ${missingEnvVars.join(", ")}`);
  console.log("将使用默认值...");

  // 创建临时.env文件用于构建
  const envContent = `
VITE_JWT_SECRET=${process.env.VITE_JWT_SECRET || "development_jwt_secret"}
VITE_DEFAULT_LANGUAGE=${process.env.VITE_DEFAULT_LANGUAGE || "zh"}
VITE_AVAILABLE_LANGUAGES=${process.env.VITE_AVAILABLE_LANGUAGES || "zh,en"}
VITE_SITE_NAME=${process.env.VITE_SITE_NAME || "Multilingual Freelancer Blog"}
  `.trim();

  fs.writeFileSync(".env.production", envContent);
  console.log("已创建临时环境变量文件");
}

// 执行构建
try {
  console.log("开始构建...");
  console.log("执行 tsc -b && vite build");

  // 执行TypeScript编译和Vite构建
  execSync("npx tsc -b", { stdio: "inherit" });
  execSync("npx vite build", { stdio: "inherit" });

  console.log("构建完成!");
} catch (error) {
  console.error("构建失败:", error);
  process.exit(1);
} finally {
  // 清理临时文件
  if (fs.existsSync(".env.production")) {
    fs.unlinkSync(".env.production");
    console.log("已清理临时环境变量文件");
  }
}
