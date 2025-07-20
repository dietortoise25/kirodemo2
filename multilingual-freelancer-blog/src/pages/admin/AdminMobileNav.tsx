import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/button';
import { Menu } from 'lucide-react';

interface AdminMobileNavProps {
    onMenuToggle: () => void;
    title?: string;
}

export const AdminMobileNav: React.FC<AdminMobileNavProps> = ({
    onMenuToggle,
    title = 'Admin'
}) => {
    const { t } = useTranslation('admin');

    return (
        <div className="flex items-center justify-between p-4 border-b md:hidden">
            <Button
                variant="ghost"
                size="icon"
                onClick={onMenuToggle}
                aria-label={t('toggleMenu')}
            >
                <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-medium">{title || t('dashboard')}</h1>
            <div className="w-8" /> {/* Spacer for alignment */}
        </div>
    );
}; 