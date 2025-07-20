import { useState, useRef, useEffect } from 'react';
import { useLanguageContext } from '../hooks/useLanguageContext';
import { Button } from './ui/button';
import type { Language } from '../types';

/**
 * 语言切换组件
 */
export function LanguageSwitcher() {
    const { language, setLanguage, supportedLanguages, isLanguageSupported } = useLanguageContext();
    const [isOpen, setIsOpen] = useState(false);
    const [isChanging, setIsChanging] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 处理点击外部关闭下拉菜单
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // 切换下拉菜单
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // 选择语言
    const selectLanguage = async (lang: string) => {
        if (lang === language || !isLanguageSupported(lang)) return;

        setIsChanging(true);
        setLanguage(lang as Language);
        setIsOpen(false);

        // 模拟语言切换的短暂延迟，以便显示加载状态
        setTimeout(() => {
            setIsChanging(false);
        }, 300);
    };

    // 获取当前语言名称
    const getCurrentLanguageName = () => {
        const lang = supportedLanguages.find((l) => l.code === language);
        return lang ? lang.name : '中文';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="outline"
                size="sm"
                onClick={toggleDropdown}
                className="flex items-center gap-1"
                disabled={isChanging}
            >
                <GlobeIcon className="h-4 w-4 mr-1" />
                {isChanging ? (
                    <span className="flex items-center">
                        <span className="mr-2">切换中</span>
                        <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></span>
                    </span>
                ) : (
                    getCurrentLanguageName()
                )}
            </Button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-background border z-50">
                    <div className="py-1">
                        {supportedLanguages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => selectLanguage(lang.code)}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-accent ${language === lang.code ? 'bg-accent' : ''
                                    }`}
                                disabled={isChanging}
                            >
                                {lang.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// 地球图标
function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
            />
        </svg>
    );
}