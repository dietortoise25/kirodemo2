import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Theme } from '../types';
import { useThemeEffect } from '../hooks/useThemeEffect';

// 本地存储键
const THEME_STORAGE_KEY = 'app_theme_preference';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>('system');

    // 应用主题效果
    useThemeEffect(theme);

    // 初始化主题
    useEffect(() => {
        // 尝试从本地存储获取主题偏好
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;

        if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
            setThemeState(storedTheme);
        } else {
            // 如果没有存储的主题偏好，使用系统主题
            setThemeState('system');
            localStorage.setItem(THEME_STORAGE_KEY, 'system');
        }
    }, []);

    // 设置主题
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// 导出 Context 供 hook 使用
export { ThemeContext };