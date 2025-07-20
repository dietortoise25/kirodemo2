import type { Language, Theme } from "../types";

/**
 * 从浏览器设置中检测用户首选语言
 * @returns 检测到的语言代码
 */
export const detectUserLanguage = (): Language => {
  const browserLang = navigator.language.split("-")[0];

  // 检查是否是我们支持的语言
  if (["zh", "en", "ja", "es", "fr"].includes(browserLang)) {
    return browserLang as Language;
  }

  // 默认返回中文
  return "zh";
};

/**
 * 从浏览器设置中检测用户首选主题
 * @returns 检测到的主题
 */
export const detectUserTheme = (): Theme => {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

/**
 * 格式化日期
 * @param dateString 日期字符串
 * @param locale 地区设置
 * @returns 格式化后的日期字符串
 */
export const formatDate = (
  dateString: string,
  locale: string = "zh-CN"
): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

/**
 * 截断文本
 * @param text 原始文本
 * @param maxLength 最大长度
 * @returns 截断后的文本
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

/**
 * 生成 slug
 * @param text 原始文本
 * @returns 生成的 slug
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[\s\W-]+/g, "-") // 将空格和非单词字符替换为连字符
    .replace(/^-+|-+$/g, "") // 移除开头和结尾的连字符
    .normalize("NFD") // 分解带有变音符号的字符
    .replace(/[\u0300-\u036f]/g, ""); // 移除变音符号
};

/**
 * 获取语言名称
 * @param language 语言代码
 * @returns 语言名称
 */
export function getLanguageName(language: Language): string {
  switch (language) {
    case "zh":
      return "中文";
    case "en":
      return "English";
    case "ja":
      return "日本語";
    case "es":
      return "Español";
    case "fr":
      return "Français";
    default:
      return language;
  }
}

/**
 * 获取主题名称
 * @param theme 主题类型
 * @returns 主题名称
 */
export function getThemeName(theme: Theme): string {
  switch (theme) {
    case "light":
      return "浅色模式";
    case "dark":
      return "深色模式";
    case "system":
      return "跟随系统";
    default:
      return theme;
  }
}

/**
 * 获取语言的区域设置
 * @param language 语言代码
 * @returns 区域设置
 */
export const getLocaleFromLanguage = (language: Language): string => {
  const localeMap: Record<Language, string> = {
    zh: "zh-CN",
    en: "en-US",
    ja: "ja-JP",
    es: "es-ES",
    fr: "fr-FR",
  };
  return localeMap[language] || "en-US";
};
