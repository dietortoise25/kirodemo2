import { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminMobileNav } from './AdminMobileNav';
import { Outlet, useLocation } from 'react-router-dom';

export function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // 当路由变化时，在移动端自动关闭侧边栏
    useEffect(() => {
        setSidebarOpen(false);
    }, [location]);

    // 监听窗口大小变化，在大屏幕上始终显示侧边栏
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) { // md breakpoint
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex flex-col h-screen bg-background">
            <AdminMobileNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

            {/* 遮罩层 - 仅在移动端侧边栏打开时显示 */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
} 