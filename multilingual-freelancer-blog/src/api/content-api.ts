import type {
  Content,
  ContentTranslation,
  Language,
  SeoMetadata,
} from "../types";
import prismaService from "../services/prisma-service";

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
    try {
      return await prismaService.getAllPublishedContents(language);
    } catch (error) {
      console.error('获取内容列表失败:', error);
      throw new Error('获取内容列表失败');
    }
  }

  /**
   * 根据ID获取内容
   * @param id 内容ID
   * @returns Promise<Content | null> 内容对象或null
   */
  public static async getContentById(id: string): Promise<Content | null> {
    try {
      const content = await prismaService.getContentById(id);
      return content || null;
    } catch (error) {
      console.error(`获取内容失败 (ID: ${id}):`, error);
      throw new Error('获取内容失败');
    }
  }

  /**
   * 根据slug获取内容
   * @param slug 内容slug
   * @returns Promise<Content | null> 内容对象或null
   */
  public static async getContentBySlug(slug: string): Promise<Content | null> {
    try {
      const content = await prismaService.getContentBySlug(slug);
      return content || null;
    } catch (error) {
      console.error(`获取内容失败 (Slug: ${slug}):`, error);
      throw new Error('获取内容失败');
    }
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
    try {
      return await prismaService.createContent({
        userId,
        slug,
        defaultLanguage,
        published,
        publishedAt: published ? new Date().toISOString() : null
      });
    } catch (error) {
      console.error('创建内容失败:', error);
      throw new Error('创建内容失败');
    }
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
    try {
      // 如果状态从未发布变为已发布，添加发布时间
      const updateData: any = { ...data };
      if (data.published) {
        const currentContent = await prismaService.getContentById(id);
        if (currentContent && !currentContent.published) {
          updateData.publishedAt = new Date().toISOString();
        }
      }
      
      return await prismaService.updateContent(id, updateData);
    } catch (error) {
      console.error(`更新内容失败 (ID: ${id}):`, error);
      throw new Error('更新内容失败');
    }
  }

  /**
   * 删除内容
   * @param id 内容ID
   * @returns Promise<boolean> 是否删除成功
   */
  public static async deleteContent(id: string): Promise<boolean> {
    try {
      return await prismaService.deleteContent(id);
    } catch (error) {
      console.error(`删除内容失败 (ID: ${id}):`, error);
      throw new Error('删除内容失败');
    }
  }

  /**
   * 获取内容的所有翻译
   * @param contentId 内容ID
   * @returns Promise<ContentTranslation[]> 翻译列表
   */
  public static async getContentTranslations(
    contentId: string
  ): Promise<ContentTranslation[]> {
    try {
      // 获取所有语言的翻译
      const content = await prismaService.getContentById(contentId);
      return content?.translations || [];
    } catch (error) {
      console.error(`获取内容翻译失败 (ContentID: ${contentId}):`, error);
      throw new Error('获取内容翻译失败');
    }
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
    try {
      return await prismaService.getContentTranslation(contentId, language);
    } catch (error) {
      console.error(`获取内容翻译失败 (ContentID: ${contentId}, Language: ${language}):`, error);
      throw new Error('获取内容翻译失败');
    }
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
    data: {
      title: string;
      content: string;
      seoMetadata?: SeoMetadata;
    }
  ): Promise<ContentTranslation> {
    try {
      return await prismaService.createContentTranslation({
        contentId,
        language,
        title: data.title,
        content: data.content,
        seoMetadata: data.seoMetadata || {
          title: data.title,
          description: '',
          keywords: [],
        },
      });
    } catch (error) {
      console.error(`创建内容翻译失败 (ContentID: ${contentId}, Language: ${language}):`, error);
      throw new Error('创建内容翻译失败');
    }
  }

  /**
   * 更新内容翻译
   * @param contentId 内容ID
   * @param language 语言
   * @param data 更新数据
   * @returns Promise<ContentTranslation | null> 更新后的翻译对象或null
   */
  public static async updateContentTranslation(
    contentId: string,
    language: Language,
    data: {
      title?: string;
      content?: string;
      seoMetadata?: SeoMetadata;
    }
  ): Promise<ContentTranslation | null> {
    try {
      // 先获取现有的翻译
      const existingTranslation = await prismaService.getContentTranslation(contentId, language);
      if (!existingTranslation) {
        throw new Error('Translation not found');
      }
      return await prismaService.updateContentTranslation(existingTranslation.id, data);
    } catch (error) {
      console.error(`更新内容翻译失败 (ContentID: ${contentId}, Language: ${language}):`, error);
      throw new Error('更新内容翻译失败');
    }
  }

  /**
   * 删除内容翻译
   * @param contentId 内容ID
   * @param language 语言
   * @returns Promise<boolean> 是否删除成功
   */
  public static async deleteContentTranslation(contentId: string, language: Language): Promise<boolean> {
    try {
      // 先获取现有的翻译
      const existingTranslation = await prismaService.getContentTranslation(contentId, language);
      if (!existingTranslation) {
        throw new Error('Translation not found');
      }
      return await prismaService.deleteContentTranslation(existingTranslation.id);
    } catch (error) {
      console.error(`删除内容翻译失败 (ContentID: ${contentId}, Language: ${language}):`, error);
      throw new Error('删除内容翻译失败');
    }
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
    try {
      return await prismaService.getRelatedContents(contentId, language, limit);
    } catch (error) {
      console.error(`获取相关内容失败 (ContentID: ${contentId}, Language: ${language}):`, error);
      throw new Error('获取相关内容失败');
    }
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
    try {
      return await prismaService.getPaginatedContents(page, pageSize, language);
    } catch (error) {
      console.error(`获取分页内容失败 (Page: ${page}, PageSize: ${pageSize}):`, error);
      throw new Error('获取分页内容失败');
    }
  }
}
