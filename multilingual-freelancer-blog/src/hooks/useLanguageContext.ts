import { useContext } from "react";
import { LanguageContext } from "../contexts/LanguageContext";

/**
 * 使用语言上下文的钩子
 * @returns 语言上下文
 */
export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error(
      "useLanguageContext must be used within a LanguageProvider"
    );
  }
  return context;
}
