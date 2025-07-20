import type { Content, ContentTranslation, Language } from "../types";

// 模拟数据库存储
class Database {
  private contents: Map<string, Content> = new Map();
  private contentTranslations: Map<string, ContentTranslation> = new Map();

  // 生成唯一ID
  private generateId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  // 获取所有内容
  public getAllContents(): Content[] {
    return Array.from(this.contents.values());
  }

  // 根据ID获取内容
  public getContentById(id: string): Content | undefined {
    return this.contents.get(id);
  }

  // 根据slug获取内容
  public getContentBySlug(slug: string): Content | undefined {
    return Array.from(this.contents.values()).find(
      (content) => content.slug === slug
    );
  }

  // 创建内容
  public createContent(
    data: Omit<Content, "id" | "createdAt" | "updatedAt" | "translations">
  ): Content {
    const id = this.generateId();
    const now = new Date().toISOString();

    const content: Content = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
      translations: [],
    };

    this.contents.set(id, content);
    return content;
  }

  // 更新内容
  public updateContent(
    id: string,
    data: Partial<
      Omit<Content, "id" | "createdAt" | "updatedAt" | "translations">
    > & { publishedAt?: string | null }
  ): Content | undefined {
    const content = this.contents.get(id);
    if (!content) return undefined;

    const updatedContent: Content = {
      ...content,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.contents.set(id, updatedContent);
    return updatedContent;
  }

  // 删除内容
  public deleteContent(id: string): boolean {
    // 删除相关的翻译
    const content = this.contents.get(id);
    if (content) {
      content.translations.forEach((translation) => {
        this.contentTranslations.delete(translation.id);
      });
    }

    return this.contents.delete(id);
  }

  // 获取内容的所有翻译
  public getContentTranslations(contentId: string): ContentTranslation[] {
    return Array.from(this.contentTranslations.values()).filter(
      (translation) => translation.contentId === contentId
    );
  }

  // 获取内容的特定语言翻译
  public getContentTranslation(
    contentId: string,
    language: Language
  ): ContentTranslation | undefined {
    return Array.from(this.contentTranslations.values()).find(
      (translation) =>
        translation.contentId === contentId && translation.language === language
    );
  }

  // 创建内容翻译
  public createContentTranslation(
    data: Omit<ContentTranslation, "id" | "createdAt" | "updatedAt">
  ): ContentTranslation {
    const id = this.generateId();
    const now = new Date().toISOString();

    const translation: ContentTranslation = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    this.contentTranslations.set(id, translation);

    // 更新内容的翻译列表
    const content = this.contents.get(data.contentId);
    if (content) {
      content.translations.push(translation);
      this.contents.set(content.id, content);
    }

    return translation;
  }

  // 更新内容翻译
  public updateContentTranslation(
    id: string,
    data: Partial<
      Omit<ContentTranslation, "id" | "contentId" | "createdAt" | "updatedAt">
    >
  ): ContentTranslation | undefined {
    const translation = this.contentTranslations.get(id);
    if (!translation) return undefined;

    const updatedTranslation: ContentTranslation = {
      ...translation,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.contentTranslations.set(id, updatedTranslation);

    // 更新内容的翻译列表
    const content = this.contents.get(translation.contentId);
    if (content) {
      const index = content.translations.findIndex((t) => t.id === id);
      if (index !== -1) {
        content.translations[index] = updatedTranslation;
        this.contents.set(content.id, content);
      }
    }

    return updatedTranslation;
  }

  // 删除内容翻译
  public deleteContentTranslation(id: string): boolean {
    const translation = this.contentTranslations.get(id);
    if (!translation) return false;

    // 从内容的翻译列表中移除
    const content = this.contents.get(translation.contentId);
    if (content) {
      content.translations = content.translations.filter((t) => t.id !== id);
      this.contents.set(content.id, content);
    }

    return this.contentTranslations.delete(id);
  }

  // 添加一些示例数据
  public seedData() {
    // 创建示例内容
    const content1 = this.createContent({
      userId: "user1",
      slug: "getting-started-with-react",
      defaultLanguage: "zh",
      published: true,
      publishedAt: new Date().toISOString(),
    });

    const content2 = this.createContent({
      userId: "user1",
      slug: "typescript-best-practices",
      defaultLanguage: "zh",
      published: true,
      publishedAt: new Date().toISOString(),
    });

    const content3 = this.createContent({
      userId: "user1",
      slug: "multilingual-website-development",
      defaultLanguage: "zh",
      published: true,
      publishedAt: new Date().toISOString(),
    });

    // 为内容1添加翻译
    this.createContentTranslation({
      contentId: content1.id,
      language: "zh",
      title: "React 入门指南",
      content:
        "# React 入门指南\n\n这是一篇关于 React 的入门教程，介绍了 React 的基本概念和使用方法。\n\n## 什么是 React？\n\nReact 是一个用于构建用户界面的 JavaScript 库。它由 Facebook 开发和维护，并被用于构建单页应用程序。\n\n## 为什么使用 React？\n\nReact 使用组件化的方式构建用户界面，这使得代码更加模块化和可重用。它还使用虚拟 DOM 来提高性能。",
      seoMetadata: {
        title: "React 入门指南 - 多语言自由职业者博客",
        description: "学习 React 的基本概念和使用方法，快速入门 React 开发。",
        keywords: ["React", "前端开发", "JavaScript", "教程"],
      },
    });

    this.createContentTranslation({
      contentId: content1.id,
      language: "en",
      title: "Getting Started with React",
      content:
        "# Getting Started with React\n\nThis is a beginner's guide to React, introducing the basic concepts and usage of React.\n\n## What is React?\n\nReact is a JavaScript library for building user interfaces. It is developed and maintained by Facebook and is used for building single-page applications.\n\n## Why use React?\n\nReact uses a component-based approach to building user interfaces, which makes the code more modular and reusable. It also uses a virtual DOM to improve performance.",
      seoMetadata: {
        title: "Getting Started with React - Multilingual Freelancer Blog",
        description:
          "Learn the basic concepts and usage of React to quickly get started with React development.",
        keywords: ["React", "Frontend Development", "JavaScript", "Tutorial"],
      },
    });

    // 为内容2添加翻译
    this.createContentTranslation({
      contentId: content2.id,
      language: "zh",
      title: "TypeScript 最佳实践",
      content:
        "# TypeScript 最佳实践\n\n这篇文章介绍了一些 TypeScript 的最佳实践，帮助你写出更好的 TypeScript 代码。\n\n## 使用接口定义对象结构\n\nTypeScript 的接口是定义对象结构的强大工具。它们可以帮助你确保对象具有预期的属性和方法。\n\n## 利用泛型增强代码复用性\n\n泛型允许你创建可重用的组件，这些组件可以与多种类型一起工作，而不仅仅是单一类型。",
      seoMetadata: {
        title: "TypeScript 最佳实践 - 多语言自由职业者博客",
        description: "学习 TypeScript 的最佳实践，提高代码质量和开发效率。",
        keywords: ["TypeScript", "最佳实践", "前端开发", "JavaScript"],
      },
    });

    // 为内容3添加翻译
    this.createContentTranslation({
      contentId: content3.id,
      language: "zh",
      title: "多语言网站开发指南",
      content:
        "# 多语言网站开发指南\n\n这篇文章介绍了如何开发支持多种语言的网站，包括国际化和本地化的最佳实践。\n\n## 使用 i18next 进行国际化\n\ni18next 是一个强大的国际化框架，它提供了丰富的功能来处理翻译、复数形式、格式化等。\n\n## 设计多语言数据模型\n\n在设计数据库模型时，需要考虑如何存储和管理多语言内容。一种常见的方法是使用单独的翻译表。",
      seoMetadata: {
        title: "多语言网站开发指南 - 多语言自由职业者博客",
        description:
          "学习如何开发支持多种语言的网站，掌握国际化和本地化的最佳实践。",
        keywords: ["多语言", "国际化", "i18n", "本地化", "网站开发"],
      },
    });
  }
}

// 创建数据库实例
export const db = new Database();

// 初始化示例数据
db.seedData();
