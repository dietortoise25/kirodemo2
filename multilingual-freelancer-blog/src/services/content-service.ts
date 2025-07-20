import type {
  Content,
  ContentTranslation,
  Language,
  SeoMetadata,
} from "../types";
import { db } from "./db";

/**
 * 内容服务类
 * 提供博客文章内容的增删改查功能
 */
export class ContentService {
  /**
   * 获取所有已发布的内容
   * @param language 可选的语言过滤
   * @returns 内容列表
   */
  public static getAllPublishedContents(language?: Language): Content[] {
    const contents = db.getAllContents().filter((content) => content.published);

    if (language) {
      // 如果指定了语言，只返回有该语言翻译的内容
      return contents.filter((content) =>
        content.translations.some(
          (translation) => translation.language === language
        )
      );
    }

    return contents;
  }

  /**
   * 根据ID获取内容
   * @param id 内容ID
   * @returns 内容对象或undefined
   */
  public static getContentById(id: string): Content | undefined {
    return db.getContentById(id);
  }

  /**
   * 根据slug获取内容
   * @param slug 内容slug
   * @returns 内容对象或undefined
   */
  public static getContentBySlug(slug: string): Content | undefined {
    return db.getContentBySlug(slug);
  }

  /**
   * 创建新内容
   * @param userId 用户ID
   * @param slug 内容slug
   * @param defaultLanguage 默认语言
   * @param published 是否发布
   * @returns 创建的内容对象
   */
  public static createContent(
    userId: string,
    slug: string,
    defaultLanguage: Language,
    published: boolean = false
  ): Content {
    return db.createContent({
      userId,
      slug,
      defaultLanguage,
      published,
      publishedAt: published ? new Date().toISOString() : null,
    });
  }

  /**
   * 更新内容
   * @param id 内容ID
   * @param data 更新数据
   * @returns 更新后的内容对象或undefined
   */
  public static updateContent(
    id: string,
    data: {
      slug?: string;
      defaultLanguage?: Language;
      published?: boolean;
    }
  ): Content | undefined {
    const content = db.getContentById(id);
    if (!content) return undefined;

    // 如果更新了发布状态，更新发布时间
    const updatedData = { ...data };
    if (data.published !== undefined && data.published !== content.published) {
      // 创建一个新的对象，包含发布时间
      return db.updateContent(id, {
        ...data,
        publishedAt: data.published ? new Date().toISOString() : null,
      });
    }

    return db.updateContent(id, updatedData);
  }

  /**
   * 删除内容
   * @param id 内容ID
   * @returns 是否删除成功
   */
  public static deleteContent(id: string): boolean {
    return db.deleteContent(id);
  }

  /**
   * 获取内容的所有翻译
   * @param contentId 内容ID
   * @returns 翻译列表
   */
  public static getContentTranslations(
    contentId: string
  ): ContentTranslation[] {
    return db.getContentTranslations(contentId);
  }

  /**
   * 获取内容的特定语言翻译
   * @param contentId 内容ID
   * @param language 语言
   * @returns 翻译对象或undefined
   */
  public static getContentTranslation(
    contentId: string,
    language: Language
  ): ContentTranslation | undefined {
    return db.getContentTranslation(contentId, language);
  }

  /**
   * 创建内容翻译
   * @param contentId 内容ID
   * @param language 语言
   * @param title 标题
   * @param content 内容
   * @param seoMetadata SEO元数据
   * @returns 创建的翻译对象
   */
  public static createContentTranslation(
    contentId: string,
    language: Language,
    title: string,
    content: string,
    seoMetadata: SeoMetadata
  ): ContentTranslation {
    return db.createContentTranslation({
      contentId,
      language,
      title,
      content,
      seoMetadata,
    });
  }

  /**
   * 更新内容翻译
   * @param id 翻译ID
   * @param data 更新数据
   * @returns 更新后的翻译对象或undefined
   */
  public static updateContentTranslation(
    id: string,
    data: {
      title?: string;
      content?: string;
      seoMetadata?: SeoMetadata;
    }
  ): ContentTranslation | undefined {
    return db.updateContentTranslation(id, data);
  }

  /**
   * 删除内容翻译
   * @param id 翻译ID
   * @returns 是否删除成功
   */
  public static deleteContentTranslation(id: string): boolean {
    return db.deleteContentTranslation(id);
  }

  /**
   * 获取相关内容
   * 根据内容的语言和标题关键词查找相关内容
   * @param contentId 当前内容ID
   * @param language 语言
   * @param limit 限制数量
   * @returns 相关内容列表
   */
  public static getRelatedContents(
    contentId: string,
    language: Language,
    limit: number = 3
  ): Content[] {
    const currentContent = db.getContentById(contentId);
    if (!currentContent) return [];

    const currentTranslation = currentContent.translations.find(
      (t) => t.language === language
    );
    if (!currentTranslation) return [];

    // 获取所有已发布的内容（排除当前内容）
    const allContents = db
      .getAllContents()
      .filter((content) => content.published && content.id !== contentId);

    // 根据标题相似度排序
    const relatedContents = allContents
      .filter((content) =>
        content.translations.some((t) => t.language === language)
      )
      .map((content) => {
        const translation = content.translations.find(
          (t) => t.language === language
        );
        if (!translation) return { content, relevance: 0 };

        // 简单的相关性计算：标题中共同单词的数量
        const currentWords = currentTranslation.title
          .toLowerCase()
          .split(/\s+/);
        const otherWords = translation.title.toLowerCase().split(/\s+/);
        const commonWords = currentWords.filter((word) =>
          otherWords.includes(word)
        ).length;

        return { content, relevance: commonWords };
      })
      .filter((item) => item.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .map((item) => item.content)
      .slice(0, limit);

    return relatedContents.length > 0
      ? relatedContents
      : allContents.slice(0, limit);
  }
}
