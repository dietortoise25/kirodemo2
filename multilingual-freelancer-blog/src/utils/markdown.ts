import { marked } from "marked";

/**
 * 将 Markdown 转换为 HTML
 * @param markdown Markdown 文本
 * @returns 转换后的 HTML
 */
export const markdownToHtml = (markdown: string): string => {
  // 配置 marked 选项
  marked.setOptions({
    gfm: true, // 启用 GitHub 风格的 Markdown
    breaks: true, // 将换行符转换为 <br>
  });

  // 处理异步情况，确保返回字符串
  const result = marked.parse(markdown);
  return typeof result === "string" ? result : "";
};

/**
 * 从 Markdown 中提取摘要
 * @param markdown Markdown 文本
 * @param maxLength 最大长度
 * @returns 提取的摘要
 */
export const extractExcerpt = (
  markdown: string,
  maxLength: number = 200
): string => {
  // 移除 Markdown 标记
  const text = markdown
    .replace(/#+\s+(.*)/g, "$1") // 移除标题标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // 移除链接，保留链接文本
    .replace(/[*_~`]/g, "") // 移除强调标记
    .replace(/\n+/g, " ") // 将换行符替换为空格
    .replace(/\s+/g, " ") // 将多个空格替换为一个空格
    .trim();

  // 截断文本
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

/**
 * 从 Markdown 中提取第一张图片的 URL
 * @param markdown Markdown 文本
 * @returns 图片 URL 或 undefined
 */
export const extractFirstImageUrl = (markdown: string): string | undefined => {
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = markdown.match(imageRegex);
  return match ? match[1] : undefined;
};

/**
 * 从 Markdown 中提取所有图片的 URL
 * @param markdown Markdown 文本
 * @returns 图片 URL 数组
 */
export const extractAllImageUrls = (markdown: string): string[] => {
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  const urls: string[] = [];
  let match;

  while ((match = imageRegex.exec(markdown)) !== null) {
    urls.push(match[1]);
  }

  return urls;
};

/**
 * 从 Markdown 中提取标题
 * @param markdown Markdown 文本
 * @returns 标题数组，每个元素包含级别和文本
 */
export const extractHeadings = (
  markdown: string
): { level: number; text: string }[] => {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: { level: number; text: string }[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
    });
  }

  return headings;
};
