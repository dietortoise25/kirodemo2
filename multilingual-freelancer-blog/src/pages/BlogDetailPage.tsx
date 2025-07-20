import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useContentContext } from "../hooks/useContentContext";
import { useLanguageContext } from "../hooks/useLanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { MarkdownRenderer } from "../components/markdown-renderer";
import { extractExcerpt, extractHeadings } from "../utils/markdown";
import type { Language } from "../types";
import "../styles/blog-detail.css";

/**
 * 博客详情页面
 */
export function BlogDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const { t } = useTranslation('blog');
    const { language, setLanguage } = useLanguageContext();
    const {
        loading,
        currentContent,
        currentTranslation,
        relatedContents,
        loadContentBySlug,
        switchContentLanguage
    } = useContentContext();

    const [showTableOfContents, setShowTableOfContents] = useState(false);
    const [headings, setHeadings] = useState<{ level: number; text: string; id: string }[]>([]);
    const [readingProgress, setReadingProgress] = useState(0);
    const [switchingLanguage, setSwitchingLanguage] = useState(false);

    useEffect(() => {
        if (slug) {
            loadContentBySlug(slug);
        }
    }, [slug, loadContentBySlug]);

    // 提取文章标题并生成目录
    useEffect(() => {
        if (currentTranslation?.content) {
            const extractedHeadings = extractHeadings(currentTranslation.content);
            const headingsWithIds = extractedHeadings.map((heading, index) => ({
                ...heading,
                id: `heading-${index}-${heading.text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`
            }));
            setHeadings(headingsWithIds);
            setShowTableOfContents(headingsWithIds.length > 2);
        }
    }, [currentTranslation?.content]);

    // 更新页面标题和SEO元数据
    useEffect(() => {
        if (currentTranslation) {
            document.title = currentTranslation.seoMetadata.title;

            // 更新meta描述
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', currentTranslation.seoMetadata.description);
            } else {
                const meta = document.createElement('meta');
                meta.name = 'description';
                meta.content = currentTranslation.seoMetadata.description;
                document.head.appendChild(meta);
            }

            // 更新meta关键词
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
                metaKeywords.setAttribute('content', currentTranslation.seoMetadata.keywords.join(', '));
            } else {
                const meta = document.createElement('meta');
                meta.name = 'keywords';
                meta.content = currentTranslation.seoMetadata.keywords.join(', ');
                document.head.appendChild(meta);
            }
        }

        // 清理函数：重置标题
        return () => {
            document.title = t('common:siteName');
        };
    }, [currentTranslation, t]);

    // 阅读进度跟踪
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            setReadingProgress(Math.min(100, Math.max(0, progress)));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 处理语言切换
    const handleLanguageSwitch = async (newLanguage: Language) => {
        if (currentContent && newLanguage !== language) {
            // 检查是否有该语言的翻译
            const hasTranslation = currentContent.translations.some(t => t.language === newLanguage);

            if (!hasTranslation) {
                return;
            }

            setSwitchingLanguage(true);
            setLanguage(newLanguage);
            await switchContentLanguage(newLanguage);
            setSwitchingLanguage(false);
        }
    };

    // 获取可用的语言版本
    const getAvailableLanguages = () => {
        if (!currentContent) return [];
        return currentContent.translations.map(t => t.language);
    };

    // 格式化发布日期
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // 复制链接到剪贴板
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            // 这里可以添加一个toast通知
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    // 分享到社交媒体
    const shareToSocial = (platform: string) => {
        if (!currentTranslation) return;

        const url = window.location.href;
        const title = currentTranslation.title;

        let shareUrl = '';

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case 'copy':
                copyToClipboard(`${title}\n${url}`);
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };

    if (loading) {
        return (
            <div className="container py-8">
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (!currentContent || !currentTranslation) {
        return (
            <div className="container py-8">
                <div className="text-center py-12">
                    <h1 className="text-3xl font-bold">{t('noContent')}</h1>
                    <p className="text-muted-foreground mt-2">找不到请求的博客文章</p>
                    <Link to="/blog" className="mt-4 inline-block">
                        <Button variant="outline">{t('backToBlog')}</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const availableLanguages = getAvailableLanguages();

    return (
        <>
            {/* 阅读进度条 */}
            <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
                <div
                    className="h-full bg-primary transition-all duration-150 ease-out"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            <div className="container py-8">
                <div className="max-w-4xl mx-auto">
                    {/* 返回博客按钮 */}
                    <div className="mb-6">
                        <Link to="/blog">
                            <Button variant="ghost" className="mb-4">
                                ← {t('backToBlog')}
                            </Button>
                        </Link>
                    </div>

                    {/* 文章头部 */}
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold mb-4">{currentTranslation.title}</h1>

                        {/* 文章元信息 */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                            {currentContent.publishedAt && (
                                <span>
                                    {t('publishedOn')} {formatDate(currentContent.publishedAt)}
                                </span>
                            )}
                            <span>
                                {t('readingTime')}: {Math.ceil(currentTranslation.content.length / 1000)} {t('minutes')}
                            </span>
                        </div>

                        {/* 语言切换 */}
                        {availableLanguages.length > 1 && (
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                <span className="text-sm text-muted-foreground">{t('availableIn')}:</span>
                                {availableLanguages.map((lang) => (
                                    <Button
                                        key={lang}
                                        variant={lang === language ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleLanguageSwitch(lang)}
                                        disabled={switchingLanguage}
                                        className="text-xs"
                                    >
                                        {t(`common:languages.${lang}`)}
                                    </Button>
                                ))}
                            </div>
                        )}

                        {/* 文章标签 */}
                        {currentTranslation.seoMetadata.keywords && currentTranslation.seoMetadata.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {currentTranslation.seoMetadata.keywords.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    {/* 目录 */}
                    {showTableOfContents && (
                        <div className="mb-8 p-4 border rounded-lg bg-muted/30">
                            <h2 className="text-lg font-semibold mb-2">{t('tableOfContents')}</h2>
                            <nav>
                                <ul className="space-y-1">
                                    {headings.map((heading) => (
                                        <li
                                            key={heading.id}
                                            className="ml-4"
                                            style={{ marginLeft: `${(heading.level - 1) * 16}px` }}
                                        >
                                            <a
                                                href={`#${heading.id}`}
                                                className="text-sm hover:underline text-muted-foreground hover:text-foreground"
                                            >
                                                {heading.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    )}

                    {/* 文章内容 */}
                    <article className="mb-12 blog-content">
                        <MarkdownRenderer content={currentTranslation.content} />
                    </article>

                    {/* 分享按钮 */}
                    <div className="border-t pt-6 mb-12">
                        <h3 className="text-lg font-medium mb-4">{t('shareArticle')}</h3>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => shareToSocial('twitter')}>
                                Twitter
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => shareToSocial('facebook')}>
                                Facebook
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => shareToSocial('linkedin')}>
                                LinkedIn
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => shareToSocial('copy')}>
                                {t('copyLink')}
                            </Button>
                        </div>
                    </div>

                    {/* 相关文章 */}
                    {relatedContents.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-2xl font-bold mb-6">{t('relatedPosts')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {relatedContents.map((content) => {
                                    const translation = content.translations.find(t => t.language === language) ||
                                        content.translations[0];
                                    return (
                                        <Card key={content.id}>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg">
                                                    <Link
                                                        to={`/blog/${content.slug}`}
                                                        className="hover:underline"
                                                    >
                                                        {translation.title}
                                                    </Link>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground">
                                                    {extractExcerpt(translation.content, 120)}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}