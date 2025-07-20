import { ContentApi } from './content-api';
import type { Language } from '../types';

/**
 * API路由处理器
 * 处理来自前端的HTTP请求并调用相应的服务
 */
export class ApiRoutes {
  /**
   * 处理内容相关的API请求
   */
  static async handleContentRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    
    // 移除 'api' 前缀
    if (pathSegments[0] === 'api') {
      pathSegments.shift();
    }

    try {
      // GET /api/contents
      if (request.method === 'GET' && pathSegments[0] === 'contents' && pathSegments.length === 1) {
        return await this.handleGetContents(url.searchParams);
      }

      // GET /api/contents/:id
      if (request.method === 'GET' && pathSegments[0] === 'contents' && pathSegments.length === 2) {
        return await this.handleGetContentById(pathSegments[1]);
      }

      // GET /api/contents/slug/:slug
      if (request.method === 'GET' && pathSegments[0] === 'contents' && pathSegments[1] === 'slug' && pathSegments.length === 3) {
        return await this.handleGetContentBySlug(pathSegments[2]);
      }

      // GET /api/contents/:id/translations/:language
      if (request.method === 'GET' && pathSegments[0] === 'contents' && pathSegments[2] === 'translations' && pathSegments.length === 4) {
        return await this.handleGetContentTranslation(pathSegments[1], pathSegments[3] as Language);
      }

      // GET /api/contents/:id/related
      if (request.method === 'GET' && pathSegments[0] === 'contents' && pathSegments[2] === 'related' && pathSegments.length === 3) {
        return await this.handleGetRelatedContents(pathSegments[1], url.searchParams);
      }

      // POST /api/contents
      if (request.method === 'POST' && pathSegments[0] === 'contents' && pathSegments.length === 1) {
        return await this.handleCreateContent(request);
      }

      // POST /api/contents/:id/translations
      if (request.method === 'POST' && pathSegments[0] === 'contents' && pathSegments[2] === 'translations' && pathSegments.length === 3) {
        return await this.handleCreateContentTranslation(pathSegments[1], request);
      }

      // PUT /api/contents/:id
      if (request.method === 'PUT' && pathSegments[0] === 'contents' && pathSegments.length === 2) {
        return await this.handleUpdateContent(pathSegments[1], request);
      }

      // PUT /api/contents/:id/translations/:language
      if (request.method === 'PUT' && pathSegments[0] === 'contents' && pathSegments[2] === 'translations' && pathSegments.length === 4) {
        return await this.handleUpdateContentTranslation(pathSegments[1], pathSegments[3] as Language, request);
      }

      // DELETE /api/contents/:id
      if (request.method === 'DELETE' && pathSegments[0] === 'contents' && pathSegments.length === 2) {
        return await this.handleDeleteContent(pathSegments[1]);
      }

      // DELETE /api/contents/:id/translations/:language
      if (request.method === 'DELETE' && pathSegments[0] === 'contents' && pathSegments[2] === 'translations' && pathSegments.length === 4) {
        return await this.handleDeleteContentTranslation(pathSegments[1], pathSegments[3] as Language);
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('API Error:', error);
      return new Response(
        JSON.stringify({ error: error instanceof Error ? error.message : 'Internal Server Error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  private static async handleGetContents(searchParams: URLSearchParams): Promise<Response> {
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const language = searchParams.get('language') as Language;
    const published = searchParams.get('published') === 'true';

    if (published) {
      const contents = await ContentApi.getAllPublishedContents(language);
      return new Response(JSON.stringify(contents), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      const result = await ContentApi.getPaginatedContents(page, pageSize, language);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  private static async handleGetContentById(id: string): Promise<Response> {
    const content = await ContentApi.getContentById(id);
    if (!content) {
      return new Response('Content not found', { status: 404 });
    }
    return new Response(JSON.stringify(content), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private static async handleGetContentBySlug(slug: string): Promise<Response> {
    const content = await ContentApi.getContentBySlug(slug);
    if (!content) {
      return new Response('Content not found', { status: 404 });
    }
    return new Response(JSON.stringify(content), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private static async handleGetContentTranslation(contentId: string, language: Language): Promise<Response> {
    const translation = await ContentApi.getContentTranslation(contentId, language);
    if (!translation) {
      return new Response('Translation not found', { status: 404 });
    }
    return new Response(JSON.stringify(translation), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private static async handleGetRelatedContents(contentId: string, searchParams: URLSearchParams): Promise<Response> {
    const language = searchParams.get('language') as Language;
    const limit = parseInt(searchParams.get('limit') || '5');
    
    const contents = await ContentApi.getRelatedContents(contentId, language, limit);
    return new Response(JSON.stringify(contents), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private static async handleCreateContent(request: Request): Promise<Response> {
    const data = await request.json();
    const content = await ContentApi.createContent(
      data.userId,
      data.slug,
      data.defaultLanguage,
      data.published
    );
    return new Response(JSON.stringify(content), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private static async handleCreateContentTranslation(contentId: string, request: Request): Promise<Response> {
    const data = await request.json();
    const translation = await ContentApi.createContentTranslation(
      contentId,
      data.language,
      data.title,
      data.content,
      data.seoMetadata
    );
    return new Response(JSON.stringify(translation), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private static async handleUpdateContent(id: string, request: Request): Promise<Response> {
    const data = await request.json();
    const content = await ContentApi.updateContent(id, data);
    return new Response(JSON.stringify(content), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private static async handleUpdateContentTranslation(contentId: string, language: Language, request: Request): Promise<Response> {
    const data = await request.json();
    const translation = await ContentApi.updateContentTranslation(contentId, language, data);
    return new Response(JSON.stringify(translation), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private static async handleDeleteContent(id: string): Promise<Response> {
    const success = await ContentApi.deleteContent(id);
    return new Response(JSON.stringify({ success }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private static async handleDeleteContentTranslation(contentId: string, language: Language): Promise<Response> {
    const success = await ContentApi.deleteContentTranslation(contentId, language);
    return new Response(JSON.stringify({ success }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}