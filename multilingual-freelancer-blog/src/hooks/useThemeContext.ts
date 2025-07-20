import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

/**
 * 使用主题上下文的钩子
 * @returns 主题上下文
 */
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
