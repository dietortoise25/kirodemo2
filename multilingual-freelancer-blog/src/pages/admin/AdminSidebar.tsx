import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import { X } from 'lucide-react';

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const { t } = useTranslation('admin');
    const { logout } = useAuth();

    const navItems = [
        { to: '/admin', label: 'dashboard', exact: true },
        { to: '/admin/content', label: 'content' },
        { to: '/admin/projects', label: 'projects' },
        { to: '/admin/messages', label: 'messages' },
        { to: '/admin/settings', label: 'settings' },
    ];

    const baseClasses = "flex items-center px-4 py-2 text-sm font-medium rounded-md";
    const inactiveClasses = "hover:bg-accent hover:text-accent-foreground";
    const activeClasses = "bg-primary text-primary-foreground";

    // 在移动设备上，侧边栏是一个浮动的抽屉
    const sidebarClasses = cn(
        "bg-background flex flex-col border-r transition-all duration-300",
        // 桌面端样式
        "hidden md:flex md:w-64 md:flex-shrink-0",
        // 移动端样式
        isOpen ? "fixed inset-y-0 left-0 z-50 w-64 shadow-lg" : ""
    );

    return (
        <aside className={sidebarClasses}>
            <div className="flex items-center justify-between p-4">
                <h2 className="text-2xl font-bold">{t('common:siteName')}</h2>
                {/* 仅在移动端显示关闭按钮 */}
                {isOpen && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
                        <X className="h-5 w-5" />
                        <span className="sr-only">{t('closeMenu')}</span>
                    </Button>
                )}
            </div>
            <p className="px-4 text-sm text-muted-foreground">{t('subtitle')}</p>

            <nav className="flex-1 px-2 py-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.to}
                        end={item.exact}
                        className={({ isActive }) =>
                            cn(baseClasses, isActive ? activeClasses : inactiveClasses)
                        }
                    >
                        {/* 在这里可以添加图标 */}
                        {t(`nav.${item.label}`)}
                    </NavLink>
                ))}
            </nav>
            <div className="p-2 border-t">
                <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                    {t('nav.logout')}
                </Button>
            </div>
        </aside>
    );
} 