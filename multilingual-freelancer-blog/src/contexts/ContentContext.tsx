import { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useLanguageContext } from '../hooks/useLanguageContext';
import { ContentApi } from '../api/content-api';
import type { Content, ContentTranslation, Language } from '../types';

interface ContentContextType {
    loading: boolean;
    error: string | null;
    contents: Content[];
    currentContent: Content | null;
    currentTranslation: ContentTranslation | null;
    relatedContents: Content[];
    pagination: {
        page: number;
        pageSize: number;
        totalPages: number;
        totalItems: number;
    };
    loadContentBySlug: (slug: string) => Promise<void>;
    loadPaginatedContents: (page?: number, pageSize?: number, lang?: Language) => Promise<void>;
    switchContentLanguage: (language: Language) => Promise<void>;
    createContent: (data: ContentCreationData) => Promise<Content | null>;
    updateContent: (id: string, data: ContentUpdateData) => Promise<Content | null>;
    deleteContent: (id: string) => Promise<boolean>;
}

// 定义创建内容所需的数据类型
interface ContentCreationData {
    userId: string;
    slug: string;
    defaultLanguage: Language;
    title: string;
    content: string;
    seoMetadata: {
        title: string;
        description: string;
        keywords: string[];
    };
    published?: boolean;
}

// 定义更新内容所需的数据类型
interface ContentUpdateData {
    slug?: string;
    defaultLanguage?: Language;
    published?: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

interface ContentProviderProps {
    children: ReactNode;
}

export function ContentProvider({ children }: ContentProviderProps) {
    const { language } = useLanguageContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [contents, setContents] = useState<Content[]>([]);
    const [currentContent, setCurrentContent] = useState<Content | null>(null);
    const [currentTranslation, setCurrentTranslation] = useState<ContentTranslation | null>(null);
    const [relatedContents, setRelatedContents] = useState<Content[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        totalPages: 0,
        totalItems: 0
    });

    // 加载内容列表（分页）
    const loadPaginatedContents = useCallback(async (page: number = 1, pageSize: number = 10, lang?: Language) => {
        setLoading(true);
        setError(null);
        try {
            const result = await ContentApi.getPaginatedContents(page, pageSize, lang || language);
            setContents(result.contents);
            setPagination({
                page: result.page,
                pageSize: result.pageSize,
                totalPages: Math.ceil(result.total / result.pageSize),
                totalItems: result.total
            });
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [language]);

    // 通过 slug 加载内容
    const loadContentBySlug = useCallback(async (slug: string) => {
        setLoading(true);
        setError(null);
        try {
            const content = await ContentApi.getContentBySlug(slug);
            if (content) {
                setCurrentContent(content);

                // 设置当前语言的翻译
                const translation = await ContentApi.getContentTranslation(content.id, language);
                setCurrentTranslation(translation);

                // 加载相关内容
                const related = await ContentApi.getRelatedContents(content.id, language);
                setRelatedContents(related);
            } else {
                setError("Content not found");
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [language]);

    // 切换内容语言
    const switchContentLanguage = useCallback(async (newLanguage: Language) => {
        if (!currentContent) return;

        setLoading(true);
        setError(null);
        try {
            const translation = await ContentApi.getContentTranslation(currentContent.id, newLanguage);
            setCurrentTranslation(translation);

            // 更新相关内容
            const related = await ContentApi.getRelatedContents(currentContent.id, newLanguage);
            setRelatedContents(related);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [currentContent]);

    // 创建新内容
    const createNewContent = useCallback(async (data: ContentCreationData) => {
        setLoading(true);
        setError(null);
        try {
            // 创建内容
            const newContent = await ContentApi.createContent(
                data.userId,
                data.slug,
                data.defaultLanguage,
                data.published
            );

            // 创建默认语言的翻译
            await ContentApi.createContentTranslation(
                newContent.id,
                data.defaultLanguage,
                data.title,
                data.content,
                data.seoMetadata
            );

            return newContent;
        } catch (err) {
            setError((err as Error).message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // 更新内容
    const updateExistingContent = useCallback(async (id: string, data: ContentUpdateData) => {
        setLoading(true);
        setError(null);
        try {
            const content = await ContentApi.updateContent(id, data);
            return content;
        } catch (err) {
            setError((err as Error).message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // 删除内容
    const deleteContent = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const success = await ContentApi.deleteContent(id);
            return success;
        } catch (err) {
            setError((err as Error).message);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const contentHook = {
        loading,
        error,
        contents,
        currentContent,
        currentTranslation,
        relatedContents,
        pagination,
        loadContentBySlug,
        loadPaginatedContents,
        switchContentLanguage,
        createContent: createNewContent,
        updateContent: updateExistingContent,
        deleteContent
    };

    return (
        <ContentContext.Provider value={contentHook}>
            {children}
        </ContentContext.Provider>
    );
}

export { ContentContext };