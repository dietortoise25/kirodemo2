import { useState, useEffect, useCallback } from "react";
import type {
  Content,
  ContentTranslation,
  Language,
  SeoMetadata,
} from "../types";
import { ContentApi } from "../api/content-api";
import { useLanguageContext } from "./useLanguageContext";

/**
 * 使用内容的钩子
 * 提供与内容相关的状态和方法
 */
export function useContent() {
  const { language } = useLanguageContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [currentContent, setCurrentContent] = useState<Content | null>(null);
  const [currentTranslation, setCurrentTranslation] =
    useState<ContentTranslation | null>(null);
  const [relatedContents, setRelatedContents] = useState<Content[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  /**
   * 加载所有已发布的内容
   * @param lang 可选的语言过滤
   */
  const loadAllContents = useCallback(
    async (lang?: Language) => {
      setLoading(true);
      setError(null);
      try {
        const result = await ContentApi.getAllPublishedContents(
          lang || language
        );
        setContents(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载内容失败");
      } finally {
        setLoading(false);
      }
    },
    [language]
  );

  /**
   * 分页加载内容
   * @param page 页码
   * @param pageSize 每页大小
   * @param lang 可选的语言过滤
   */
  const loadPaginatedContents = useCallback(
    async (page: number, pageSize: number, lang?: Language) => {
      setLoading(true);
      setError(null);
      try {
        const result = await ContentApi.getPaginatedContents(
          page,
          pageSize,
          lang
        );
        setContents(result.contents);
        setPagination({
          page: result.page,
          pageSize: result.pageSize,
          total: result.total,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载内容失败");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * 根据ID加载内容
   * @param id 内容ID
   */
  const loadContentById = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const content = await ContentApi.getContentById(id);
        setCurrentContent(content);

        if (content) {
          // 加载当前语言的翻译
          const translation = await ContentApi.getContentTranslation(
            content.id,
            language
          );
          setCurrentTranslation(translation);

          // 加载相关内容
          const related = await ContentApi.getRelatedContents(
            content.id,
            language
          );
          setRelatedContents(related);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载内容失败");
      } finally {
        setLoading(false);
      }
    },
    [language]
  );

  /**
   * 根据slug加载内容
   * @param slug 内容slug
   */
  const loadContentBySlug = useCallback(
    async (slug: string) => {
      setLoading(true);
      setError(null);
      try {
        const content = await ContentApi.getContentBySlug(slug);
        setCurrentContent(content);

        if (content) {
          // 加载当前语言的翻译
          const translation = await ContentApi.getContentTranslation(
            content.id,
            language
          );
          setCurrentTranslation(translation);

          // 加载相关内容
          const related = await ContentApi.getRelatedContents(
            content.id,
            language
          );
          setRelatedContents(related);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载内容失败");
      } finally {
        setLoading(false);
      }
    },
    [language]
  );

  /**
   * 切换内容语言
   * @param lang 目标语言
   */
  const switchContentLanguage = useCallback(
    async (lang: Language) => {
      if (!currentContent) return;

      setLoading(true);
      setError(null);
      try {
        const translation = await ContentApi.getContentTranslation(
          currentContent.id,
          lang
        );
        setCurrentTranslation(translation);

        // 更新相关内容
        const related = await ContentApi.getRelatedContents(
          currentContent.id,
          lang
        );
        setRelatedContents(related);
      } catch (err) {
        setError(err instanceof Error ? err.message : "切换语言失败");
      } finally {
        setLoading(false);
      }
    },
    [currentContent]
  );

  /**
   * 创建新内容
   * @param userId 用户ID
   * @param slug 内容slug
   * @param defaultLanguage 默认语言
   * @param title 标题
   * @param content 内容
   * @param seoMetadata SEO元数据
   * @param published 是否发布
   */
  const createContent = useCallback(
    async (
      userId: string,
      slug: string,
      defaultLanguage: Language,
      title: string,
      content: string,
      seoMetadata: SeoMetadata,
      published: boolean = false
    ) => {
      setLoading(true);
      setError(null);
      try {
        // 创建内容
        const newContent = await ContentApi.createContent(
          userId,
          slug,
          defaultLanguage,
          published
        );

        // 创建默认语言的翻译
        await ContentApi.createContentTranslation(
          newContent.id,
          defaultLanguage,
          title,
          content,
          seoMetadata
        );

        return newContent;
      } catch (err) {
        setError(err instanceof Error ? err.message : "创建内容失败");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * 更新内容
   * @param id 内容ID
   * @param data 更新数据
   */
  const updateContent = useCallback(
    async (
      id: string,
      data: {
        slug?: string;
        defaultLanguage?: Language;
        published?: boolean;
      }
    ) => {
      setLoading(true);
      setError(null);
      try {
        const updatedContent = await ContentApi.updateContent(id, data);
        if (updatedContent && currentContent?.id === id) {
          setCurrentContent(updatedContent);
        }
        return updatedContent;
      } catch (err) {
        setError(err instanceof Error ? err.message : "更新内容失败");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentContent]
  );

  /**
   * 更新内容翻译
   * @param id 翻译ID
   * @param data 更新数据
   */
  const updateContentTranslation = useCallback(
    async (
      id: string,
      data: {
        title?: string;
        content?: string;
        seoMetadata?: SeoMetadata;
      }
    ) => {
      setLoading(true);
      setError(null);
      try {
        const updatedTranslation = await ContentApi.updateContentTranslation(
          id,
          data
        );
        if (updatedTranslation && currentTranslation?.id === id) {
          setCurrentTranslation(updatedTranslation);
        }
        return updatedTranslation;
      } catch (err) {
        setError(err instanceof Error ? err.message : "更新内容翻译失败");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentTranslation]
  );

  /**
   * 删除内容
   * @param id 内容ID
   * @returns 是否删除成功
   */
  const deleteContent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await ContentApi.deleteContent(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "删除内容失败");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 当语言变化时，如果有当前内容，重新加载翻译
  useEffect(() => {
    if (currentContent) {
      switchContentLanguage(language);
    }
  }, [language, currentContent, switchContentLanguage]);

  return {
    loading,
    error,
    contents,
    currentContent,
    currentTranslation,
    relatedContents,
    pagination,
    loadAllContents,
    loadPaginatedContents,
    loadContentById,
    loadContentBySlug,
    switchContentLanguage,
    createContent,
    updateContent,
    updateContentTranslation,
    deleteContent,
  };
}
