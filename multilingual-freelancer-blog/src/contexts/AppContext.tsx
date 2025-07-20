import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useThemeContext } from '../hooks/useThemeContext';
import { useLanguageContext } from '../hooks/useLanguageContext';

interface AppContextType {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    isInitialized: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const { theme } = useThemeContext();
    const { language } = useLanguageContext();

    // 初始化应用
    useEffect(() => {
        // 这里可以添加全局初始化逻辑
        // 例如：加载用户配置、检查认证状态等
        setIsInitialized(true);
    }, []);

    // 监听主题和语言变化
    useEffect(() => {
        // 这里可以添加主题和语言变化后的逻辑
        // 例如：更新UI、重新获取数据等
    }, [theme, language]);

    return (
        <AppContext.Provider value={{ isLoading, setIsLoading, isInitialized }}>
            {children}
        </AppContext.Provider>
    );
}

export { AppContext };