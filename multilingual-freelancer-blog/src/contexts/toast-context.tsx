import React, { createContext, useState, useCallback, useContext } from 'react';
import { createPortal } from 'react-dom';
import { Toast } from '../components/ui/toast';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
    id: string;
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

interface ToastContextType {
    showToast: (props: Omit<ToastProps, 'id' | 'onClose'>) => string;
    hideToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastContainerProps {
    children: React.ReactNode;
}

function ToastContainer({ children }: ToastContainerProps) {
    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

    React.useEffect(() => {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2';
            document.body.appendChild(container);
        }
        setPortalContainer(container);

        return () => {
            if (container && container.childNodes.length === 0) {
                document.body.removeChild(container);
            }
        };
    }, []);

    if (!portalContainer) return null;
    return createPortal(children, portalContainer);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const showToast = useCallback((props: Omit<ToastProps, 'id' | 'onClose'>) => {
        const id = Date.now().toString();
        const toast: ToastProps = {
            ...props,
            id,
            onClose: (toastId) => {
                setToasts((prev) => prev.filter((t) => t.id !== toastId));
            },
        };
        setToasts((prev) => [...prev, toast]);
        return id;
    }, []);

    const hideToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <ToastContainer>
                {toasts.map((toast) => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
} 