import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

/**
 * 导航栏组件
 */
export function Navbar() {
    const { t } = useTranslation();

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background flex justify-center">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="font-bold text-xl">{t('common:siteName')}</span>
                    </Link>
                    <nav className="hidden md:flex gap-6 ml-6">
                        <Link to="/blog" className="text-sm font-medium transition-colors hover:text-primary">
                            {t('common:nav.blog')}
                        </Link>
                        <Link to="/projects" className="text-sm font-medium transition-colors hover:text-primary">
                            {t('common:nav.projects')}
                        </Link>
                        <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
                            {t('common:nav.about')}
                        </Link>
                        <Link to="/contact" className="text-sm font-medium transition-colors hover:text-primary">
                            {t('common:nav.contact')}
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <LanguageSwitcher />
                </div>
            </div>
        </header>
    );
}