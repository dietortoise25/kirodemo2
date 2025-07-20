import { useTranslation } from "react-i18next";

/**
 * 页脚组件
 */
export function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-background">
            <div className="container flex flex-col md:flex-row items-center justify-between py-8">
                <div className="text-sm text-muted-foreground">
                    &copy; {currentYear} {t('common:siteName')}. {t('common:footer.rights')}
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        {t('common:footer.privacy')}
                    </a>
                    <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        {t('common:footer.terms')}
                    </a>
                    <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        {t('common:footer.contact')}
                    </a>
                </div>
            </div>
        </footer>
    );
}