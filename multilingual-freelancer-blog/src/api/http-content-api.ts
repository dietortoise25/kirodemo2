import type { Content, ContentTranslation, Language, SeoMetadata } from '../types';

/**
 * HTTP-based Content API Client
 * 用于前端调用后端API的客户端
 */
export class HttpContentApi {
  private static baseUrl = '/api';

  /**
   * 获取所有已发布的内容
   */
  static async getAllPublishedContents(language?: Language): Promise<Content[]> {
    const url = new URL(`${this.baseUrl}/contents`, window.location.origin);
    if (language) {
      url.searchParams.set('language', language);
    }
    url.searchParams.set('published', 'true');

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch contents: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * 分页获取内容
   */
  static async getPaginatedContents(
    page: number,
    pageSize: number,
    language?: Language
  ): Promise<{
    contents: Content[];
    page: number;
    pageSize: number;
    total: number;
  }> {
    const url = new URL(`${this.baseUrl}/contents`, window.location.origin);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('pageSize', pageSize.toString());
    if (language) {
      url.searchParams.set('language', language);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch paginated contents: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * 根据ID获取内容
   */
  static async getContentById(id: string): Promise<Content | null> {
    const response = await fetch(`${this.baseUrl}/contents/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * 根据slug获取内容
   */
  static async getContentBySlug(slug: string): Promise<Content | null> {
    const response = await fetch(`${this.baseUrl}/contents/slug/${slug}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * 获取内容翻译
   */
  static async getContentTranslation(
    contentId: string,
    language: Language
  ): Promise<ContentTranslation | null> {
    const response = await fetch(
      `${this.baseUrl}/contents/${contentId}/translations/${language}`
    );
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch content translation: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * 获取相关内容
   */
  static async getRelatedContents(
    contentId: string,
    language: Language,
    limit: number = 5
  ): Promise<Content[]> {
    const url = new URL(
      `${this.baseUrl}/contents/${contentId}/related`,
      window.location.origin
    );
    url.searchParams.set('language', language);
    url.searchParams.set('limit', limit.toString());

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch related contents: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * 创建内容
   */
  static async createContent(
    userId: string,
    slug: string,
    defaultLanguage: Language,
    published: boolean = false
  ): Promise<Content> {
    const response = await fetch(`${this.baseUrl}/contents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        slug,
        defaultLanguage,
        published,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create content: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * 创建内容翻译
   */
  static async createContentTranslation(
    contentId: string,
    language: Language,
    data: {
      title: string;
      content: string;
      seoMetadata?: SeoMetadata;
    }
  ): Promise<ContentTranslation> {
    const response = await fetch(
      `${this.baseUrl}/contents/${contentId}/translations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          title: data.title,
          content: data.content,
          seoMetadata: data.seoMetadata,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create content translation: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * 更新内容
   */
  static async updateContent(
    id: string,
    data: {
      slug?: string;
      defaultLanguage?: Language;
      published?: boolean;
    }
  ): Promise<Content> {
    const response = await fetch(`${this.baseUrl}/contents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update content: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * 更新内容翻译
   */
  static async updateContentTranslation(
    id: string,
    data: {
      title?: string;
      content?: string;
      seoMetadata?: SeoMetadata;
    }
  ): Promise<ContentTranslation> {
    const response = await fetch(
      `${this.baseUrl}/translations/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update content translation: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * 删除内容
   */
  static async deleteContent(id: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/contents/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete content: ${response.statusText}`);
    }
    return true;
  }

  /**
   * 删除内容翻译
   */
  static async deleteContentTranslation(
    contentId: string,
    language: Language
  ): Promise<boolean> {
    const response = await fetch(
      `${this.baseUrl}/contents/${contentId}/translations/${language}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete content translation: ${response.statusText}`);
    }
    return true;
  }
}