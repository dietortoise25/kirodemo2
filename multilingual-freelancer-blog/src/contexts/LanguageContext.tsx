import { createContext, useState, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language } from '../types';
import { supportedLanguages } from '../lib/i18n';

// 本地存储键
const LANGUAGE_STORAGE_KEY = 'app_language_preference';

interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    supportedLanguages: { code: string; name: string }[];
    isLanguageSupported: (language: string) => boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    const { i18n } = useTranslation();
    const [language, setLanguageState] = useState<Language>('zh');

    // 检查语言是否受支持
    const isLanguageSupported = (lang: string): boolean => {
        return supportedLanguages.some((supported) => supported.code === lang);
    };

    // 初始化语言
    useEffect(() => {
        // 尝试从本地存储获取语言偏好
        const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

        if (storedLanguage && isLanguageSupported(storedLanguage)) {
            // 如果本地存储中有有效的语言偏好，使用它
            setLanguageState(storedLanguage as Language);
            i18n.changeLanguage(storedLanguage);
        } else {
            // 否则尝试使用浏览器语言或 i18next 检测到的语言
            const detectedLang = i18n.language.split('-')[0];

            if (isLanguageSupported(detectedLang)) {
                setLanguageState(detectedLang as Language);
            } else {
                // 如果检测到的语言不受支持，使用默认语言
                setLanguageState('zh');
                i18n.changeLanguage('zh');
                localStorage.setItem(LANGUAGE_STORAGE_KEY, 'zh');
            }
        }
    }, [i18n]);

    // 监听 i18next 语言变化
    useEffect(() => {
        const handleLanguageChanged = (lng: string) => {
            const simpleLang = lng.split('-')[0];
            if (isLanguageSupported(simpleLang) && simpleLang !== language) {
                setLanguageState(simpleLang as Language);
                localStorage.setItem(LANGUAGE_STORAGE_KEY, simpleLang);
            }
        };

        // 添加语言变更事件监听
        i18n.on('languageChanged', handleLanguageChanged);

        // 清理函数
        return () => {
            i18n.off('languageChanged', handleLanguageChanged);
        };
    }, [i18n, language]);

    // 设置语言
    const setLanguage = (newLanguage: Language) => {
        if (isLanguageSupported(newLanguage)) {
            i18n.changeLanguage(newLanguage);
            setLanguageState(newLanguage);
            localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
        }
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                supportedLanguages,
                isLanguageSupported
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

// 导出 Context 供 hook 使用
export { LanguageContext };