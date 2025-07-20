import { Button } from "./ui/button";
import { useThemeContext } from "../hooks/useThemeContext";
import { Moon, Sun } from "lucide-react";

/**
 * 主题切换按钮组件
 */
export function ThemeToggle() {
    const { theme, setTheme } = useThemeContext();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="切换主题"
        >
            {theme === "dark" ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </Button>
    );
}