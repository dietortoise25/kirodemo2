import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

/**
 * 使用主题的钩子
 * @returns 主题上下文
 */
export function useTheme() {
  const { theme, setTheme } = useContext(ThemeContext)!;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return { theme, setTheme, toggleTheme };
}
