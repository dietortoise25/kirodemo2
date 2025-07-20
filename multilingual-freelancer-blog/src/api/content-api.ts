import type {
  Content,
  ContentTranslation,
  Language,
  SeoMetadata,
} from "../types";
import { ContentService } from "../services/content-service";

/**
 * 内容 API 类
 * 提供与内容相关的 API 方法
 */
export class ContentApi {
  /**
   * 获取所有已发布的内容
   * @param language 可选的语言过滤
   * @returns Promise<Content[]> 内容列表
   */
  public static async getAllPublishedContents(
    language?: Language
  ): Promise<Content[]> {
    // 模拟异步 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const contents = ContentService.getAllPublishedContents(language);
        resolve(contents);
      }, 100);
    });
  }

  /**
   * 根据ID获取内容
   * @param id 内容ID
   * @returns Promise<Content | null> 内容对象或null
   */
  public static async getContentById(id: string): Promise<Content | null> {
    // 模拟异步 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const content = ContentService.getContentById(id);
        resolve(content || null);
      }, 100);
    });
  }

  /**
   * 根据slug获取内容
   * @param slug 内容slug
   * @returns Promise<Content | null> 内容对象或null
   */
  public static async getContentBySlug(slug: string): Promise<Content | null> {
    // 模拟异步 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const content = ContentService.getContentBySlug(slug);
        resolve(content || null);
      }, 100);
    });
  }

  /**
   * 创建新内容
   * @param userId 用户ID
   * @param slug 内容slug
   * @param defaultLanguage 默认语言
   * @param published 是否发布
   * @returns Promise<Content> 创建的内容对象
   */
  public static async createContent(
    userId: string,
    slug: string,
    defaultLanguage: Language,
    published: boolean = false
  ): Promise<Content> {
    // 模拟异步 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const content = ContentService.createContent(
          userId,
          slug,
          defaultLanguage,
          published
        );
        resolve(content);
      }, 100);
    });
  }

  /**
   * 更新内容
   * @param id 内容ID
   * @param data 更新数据
   * @returns Promise<Content | null> 更新后的内容对象或null
   */
  public static async updateContent(
    id: string,
    data: {
      slug?: string;
      defaultLanguage?: Language;
      published?: boolean;
    }
  ): Promise<Content | null> {
    // 模拟异步 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const content = ContentService.updateContent(id, data);
        resolve(content || null);
      }, 100);
    });
  }

  /**
   * 删除内容
   * @param id 内容ID
   * @returns Promise<boolean> 是否删除成功
   */
  public static async deleteContent(id: string): Promise<boolean> {
    // 模拟异步 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = ContentService.deleteContent(id);
        resolve(result);
      }, 100);
    });
  }

  /**
   * 获取内容的所有翻译
   * @param contentId 内容ID
   * @returns Promise<ContentTranslation[]> 翻译列表
   */
  public static async getContentTranslations(
    contentId: string
  ): Promise<ContentTranslation[]> {
    // 模拟异步 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const translations = ContentService.getContentTranslations(contentId);
        resolve(translations);
      }, 100);
    });
  }

  /**
   * 获取内容的特定语言翻译
   * @param contentId 内容ID
   * @param language 语言
   * @returns Promise<ContentTranslation | null> 翻译对象或null
   */
  public static async getContentTranslation(
    contentId: string,
    language: Language
  ): Promise<ContentTranslation | null> {
    // 模拟异步 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const translation = ContentService.getContentTranslation(
          contentId,
          language
        );
        resolve(translation || null);
      }, 100);
    });
  }

  /**
   * 创建内容翻译
   * @param contentId 内容ID
   * @param language 语言
   * @param title 标题
   * @param content 内容
   * @param seoMetadata SEO元数据
   * @returns Promise<ContentTranslation> 创建的翻译对象
   */
  public static async createContentTranslation(
    contentId: string,
    language: Language,
    title: string,
    content: string,
    seoMetadata: SeoMetadata
  ): Promise<ContentTranslation> {
    // 模拟异步 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const translation = ContentService.createContentTranslation(
          contentId,
          language,
          title,
          content,
          seoMetadata
        );
        resolve(translation);
      }, 100);
    });
  }

  /**
   * 更新内容翻译
   * @param id 翻译ID
   * @param data 更新数据
   * @returns Promise<ContentTranslation | null> 更新后的翻译对象或null
   */
  public static async updateContentTranslation(
    id: string,
    data: {
      title?: string;
      content?: string;
      seoMetadata?: SeoMetadata;
    }
  ): Promise<ContentTranslation | null> {
    // 模拟异步 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const translation = ContentService.updateContentTranslation(id, data);
        resolve(translation || null);
      }, 100);
    });
  }

  /**
   * 删除内容翻译
   * @param id 翻译ID
   * @returns Promise<boolean> 是否删除成功
   */
  public static async deleteContentTranslation(id: string): Promise<boolean> {
    // 模拟异步 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = ContentService.deleteContentTranslation(id);
        resolve(result);
      }, 100);
    });
  }

  /**
   * 获取相关内容
   * @param contentId 当前内容ID
   * @param language 语言
   * @param limit 限制数量
   * @returns Promise<Content[]> 相关内容列表
   */
  public static async getRelatedContents(
    contentId: string,
    language: Language,
    limit: number = 3
  ): Promise<Content[]> {
    // 模拟异步 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const relatedContents = ContentService.getRelatedContents(
          contentId,
          language,
          limit
        );
        resolve(relatedContents);
      }, 100);
    });
  }

  /**
   * 分页获取内容
   * @param page 页码
   * @param pageSize 每页大小
   * @param language 可选的语言过滤
   * @returns Promise<{contents: Content[], total: number, page: number, pageSize: number}> 分页结果
   */
  public static async getPaginatedContents(
    page: number = 1,
    pageSize: number = 10,
    language?: Language
  ): Promise<{
    contents: Content[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    // 模拟异步 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const allContents = ContentService.getAllPublishedContents(language);
        const total = allContents.length;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const contents = allContents.slice(start, end);

        resolve({
          contents,
          total,
          page,
          pageSize,
        });
      }, 100);
    });
  }
}
