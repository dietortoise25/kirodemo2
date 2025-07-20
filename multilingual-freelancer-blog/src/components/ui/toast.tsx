import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';
import type { ToastProps } from '../../types/toast';

export function Toast({
    id,
    type,
    title,
    message,
    duration = 5000,
    onClose,
}: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(100);

    const handleClose = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300); // 等待淡出动画完成
    }, [id, onClose]);

    // 自动关闭
    useEffect(() => {
        if (duration === 0) return;

        const startTime = Date.now();
        const endTime = startTime + duration;

        const timer = setInterval(() => {
            const now = Date.now();
            const remaining = endTime - now;
            const newProgress = (remaining / duration) * 100;

            if (remaining <= 0) {
                clearInterval(timer);
                handleClose();
            } else {
                setProgress(newProgress);
            }
        }, 100);

        return () => clearInterval(timer);
    }, [duration, handleClose]);

    const getTypeStyles = (): { bg: string; icon: React.ReactNode } => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-100 dark:bg-green-900/30 border-green-500',
                    icon: (
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    ),
                };
            case 'error':
                return {
                    bg: 'bg-red-100 dark:bg-red-900/30 border-red-500',
                    icon: (
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                    ),
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500',
                    icon: (
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                    ),
                };
            case 'info':
            default:
                return {
                    bg: 'bg-blue-100 dark:bg-blue-900/30 border-blue-500',
                    icon: (
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                        </div>
                    ),
                };
        }
    };

    const { bg, icon } = getTypeStyles();

    return (
        <div
            className={cn(
                'fixed bottom-4 right-4 w-full max-w-sm p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300',
                bg,
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            )}
            role="alert"
        >
            <div className="flex items-start">
                {icon}
                <div className="ml-3 flex-1">
                    {title && <h3 className="font-medium">{title}</h3>}
                    <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
                </div>
                <button
                    type="button"
                    className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8"
                    onClick={handleClose}
                    aria-label="关闭"
                >
                    <X size={16} />
                </button>
            </div>
            {duration > 0 && (
                <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 mt-2 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-current transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
} 