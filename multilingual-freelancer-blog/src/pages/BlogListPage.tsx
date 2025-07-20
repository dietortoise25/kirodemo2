import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useContentContext } from "../hooks/useContentContext";
import { useLanguageContext } from "../hooks/useLanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { extractExcerpt } from "../utils/markdown";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * 博客列表页面
 */
export function BlogListPage() {
    const { t } = useTranslation('blog');
    const { language } = useLanguageContext();
    const { contents, pagination, loading, loadPaginatedContents } = useContentContext();
    const [currentPage, setCurrentPage] = useState(1);

    // 加载内容
    useEffect(() => {
        loadPaginatedContents(currentPage, 6, language);
    }, [currentPage, language, loadPaginatedContents]);

    // 切换页码
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // 生成分页按钮
    const renderPagination = useCallback(() => {
        const totalPages = Math.ceil(pagination.totalItems / pagination.pageSize);

        if (totalPages <= 1) return null;

        const pageButtons = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // 上一页按钮
        pageButtons.push(
            <Button
                key="prev"
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label={t('previousPage')}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
        );

        // 第一页按钮
        if (startPage > 1) {
            pageButtons.push(
                <Button
                    key="1"
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="icon"
                    onClick={() => handlePageChange(1)}
                >
                    1
                </Button>
            );

            // 省略号
            if (startPage > 2) {
                pageButtons.push(
                    <Button key="ellipsis1" variant="outline" size="icon" disabled>
                        ...
                    </Button>
                );
            }
        }

        // 页码按钮
        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="icon"
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Button>
            );
        }

        // 最后一页按钮
        if (endPage < totalPages) {
            // 省略号
            if (endPage < totalPages - 1) {
                pageButtons.push(
                    <Button key="ellipsis2" variant="outline" size="icon" disabled>
                        ...
                    </Button>
                );
            }

            pageButtons.push(
                <Button
                    key={totalPages}
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="icon"
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </Button>
            );
        }

        // 下一页按钮
        pageButtons.push(
            <Button
                key="next"
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label={t('nextPage')}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        );

        return (
            <div className="flex justify-center gap-2 mt-8">
                {pageButtons}
            </div>
        );
    }, [currentPage, pagination.totalItems, pagination.pageSize, handlePageChange, t]);

    return (
        <div className="container py-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">{t('blogTitle')}</h1>
                    <p className="text-muted-foreground">{t('blogDescription')}</p>
                </header>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : contents.length > 0 ? (
                    <>
                        <div className="grid gap-6 md:grid-cols-2">
                            {contents.map((content) => {
                                const translation = content.translations.find(
                                    (t) => t.language === language
                                ) || content.translations[0];

                                if (!translation) return null;

                                const excerpt = extractExcerpt(translation.content, 150);

                                return (
                                    <Card key={content.id} className="h-full flex flex-col">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-xl">
                                                <Link
                                                    to={`/blog/${content.slug}`}
                                                    className="hover:underline"
                                                >
                                                    {translation.title}
                                                </Link>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col">
                                            <p className="text-muted-foreground mb-4 flex-1">
                                                {excerpt}
                                            </p>
                                            {content.publishedAt && (
                                                <p className="text-xs text-muted-foreground mt-auto">
                                                    {new Date(content.publishedAt).toLocaleDateString(
                                                        language === 'zh' ? 'zh-CN' : 'en-US',
                                                        {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        }
                                                    )}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                        {renderPagination()}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">{t('noPostsFound')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}