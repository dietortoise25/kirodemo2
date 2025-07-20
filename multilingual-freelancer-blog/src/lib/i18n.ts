import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

// 支持的语言列表
export const supportedLanguages = [
  { code: "zh", name: "中文" },
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
];

// 初始化 i18next
i18n
  // 加载翻译文件的后端
  .use(Backend)
  // 自动检测用户语言
  .use(LanguageDetector)
  // 将 i18n 实例传递给 react-i18next
  .use(initReactI18next)
  // 初始化 i18next
  .init({
    // 默认语言
    fallbackLng: "zh",
    // 调试模式
    debug: import.meta.env.DEV,
    // 检测用户语言的选项
    detection: {
      // 检测顺序
      order: ["localStorage", "navigator"],
      // 缓存用户语言
      caches: ["localStorage"],
      // 将zh-CN映射到zh
      lookupFromPathIndex: 0,
    },
    // 语言映射
    load: "languageOnly",
    // 翻译文件的路径
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    // 命名空间
    ns: ["common", "home", "blog", "projects", "about", "contact", "admin"],
    defaultNS: "common",
    // 插值选项
    interpolation: {
      // 不需要在 React 中转义，因为 React 已经处理了
      escapeValue: false,
    },
  });

export default i18n;
