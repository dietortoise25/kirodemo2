import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

/**
 * 404页面组件
 */
export function NotFoundPage() {
    const { t } = useTranslation();

    return (
        <div className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-6">{t("notFound.title")}</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
                {t("notFound.description")}
            </p>
            <Button asChild>
                <Link to="/">{t("notFound.backHome")}</Link>
            </Button>
        </div>
    );
}