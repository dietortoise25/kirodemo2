import prisma from '../lib/prisma';
import type { Content, ContentTranslation, Language, SeoMetadata } from "../types";

// 数据库服务类
export class PrismaService {
  // 获取所有已发布内容
  public async getAllPublishedContents(language?: Language) {
    const contents = await prisma.content.findMany({
      where: {
        published: true,
      },
      include: {
        translations: {
          where: language ? { language } : undefined,
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    // 转换为应用类型
    return contents.map(content => ({
      id: content.id,
      userId: content.userId,
      slug: content.slug,
      defaultLanguage: content.defaultLanguage as Language,
      published: content.published,
      publishedAt: content.publishedAt?.toISOString() || null,
      createdAt: content.createdAt.toISOString(),
      updatedAt: content.updatedAt.toISOString(),
      translations: content.translations.map(translation => ({
        id: translation.id,
        contentId: translation.contentId,
        language: translation.language as Language,
        title: translation.title,
        content: translation.content,
        seoMetadata: {
          title: translation.seoTitle,
          description: translation.seoDesc,
          keywords: translation.seoKeywords.split(','),
          ogImage: translation.ogImage || undefined,
        },
        createdAt: translation.createdAt.toISOString(),
        updatedAt: translation.updatedAt.toISOString(),
      })),
    }));
  }

  // 获取分页内容
  public async getPaginatedContents(page: number, limit: number, language?: Language) {
    const skip = (page - 1) * limit;

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where: {
          published: true,
        },
        include: {
          translations: {
            where: language ? { language } : undefined,
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.content.count({
        where: {
          published: true,
        },
      }),
    ]);

    // 转换为应用类型
    const formattedContents = contents.map(content => ({
      id: content.id,
      userId: content.userId,
      slug: content.slug,
      defaultLanguage: content.defaultLanguage as Language,
      published: content.published,
      publishedAt: content.publishedAt?.toISOString() || null,
      createdAt: content.createdAt.toISOString(),
      updatedAt: content.updatedAt.toISOString(),
      translations: content.translations.map(translation => ({
        id: translation.id,
        contentId: translation.contentId,
        language: translation.language as Language,
        title: translation.title,
        content: translation.content,
        seoMetadata: {
          title: translation.seoTitle,
          description: translation.seoDesc,
          keywords: translation.seoKeywords.split(','),
          ogImage: translation.ogImage || undefined,
        },
        createdAt: translation.createdAt.toISOString(),
        updatedAt: translation.updatedAt.toISOString(),
      })),
    }));

    return {
      contents: formattedContents,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 根据ID获取内容
  public async getContentById(id: string) {
    const content = await prisma.content.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!content) return undefined;

    // 转换为应用类型
    return {
      id: content.id,
      userId: content.userId,
      slug: content.slug,
      defaultLanguage: content.defaultLanguage as Language,
      published: content.published,
      publishedAt: content.publishedAt?.toISOString() || null,
      createdAt: content.createdAt.toISOString(),
      updatedAt: content.updatedAt.toISOString(),
      translations: content.translations.map(translation => ({
        id: translation.id,
        contentId: translation.contentId,
        language: translation.language as Language,
        title: translation.title,
        content: translation.content,
        seoMetadata: {
          title: translation.seoTitle,
          description: translation.seoDesc,
          keywords: translation.seoKeywords.split(','),
          ogImage: translation.ogImage || undefined,
        },
        createdAt: translation.createdAt.toISOString(),
        updatedAt: translation.updatedAt.toISOString(),
      })),
    };
  }

  // 根据slug获取内容
  public async getContentBySlug(slug: string) {
    const content = await prisma.content.findUnique({
      where: { slug },
      include: {
        translations: true,
      },
    });

    if (!content) return undefined;

    // 转换为应用类型
    return {
      id: content.id,
      userId: content.userId,
      slug: content.slug,
      defaultLanguage: content.defaultLanguage as Language,
      published: content.published,
      publishedAt: content.publishedAt?.toISOString() || null,
      createdAt: content.createdAt.toISOString(),
      updatedAt: content.updatedAt.toISOString(),
      translations: content.translations.map(translation => ({
        id: translation.id,
        contentId: translation.contentId,
        language: translation.language as Language,
        title: translation.title,
        content: translation.content,
        seoMetadata: {
          title: translation.seoTitle,
          description: translation.seoDesc,
          keywords: translation.seoKeywords.split(','),
          ogImage: translation.ogImage || undefined,
        },
        createdAt: translation.createdAt.toISOString(),
        updatedAt: translation.updatedAt.toISOString(),
      })),
    };
  }

  // 创建内容
  public async createContent(data: {
    userId: string;
    slug: string;
    defaultLanguage: Language;
    published?: boolean;
    publishedAt?: string | null;
  }) {
    const content = await prisma.content.create({
      data: {
        userId: data.userId,
        slug: data.slug,
        defaultLanguage: data.defaultLanguage,
        published: data.published || false,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      },
    });

    // 转换为应用类型
    return {
      id: content.id,
      userId: content.userId,
      slug: content.slug,
      defaultLanguage: content.defaultLanguage as Language,
      published: content.published,
      publishedAt: content.publishedAt?.toISOString() || null,
      createdAt: content.createdAt.toISOString(),
      updatedAt: content.updatedAt.toISOString(),
      translations: [],
    };
  }

  // 更新内容
  public async updateContent(id: string, data: {
    slug?: string;
    defaultLanguage?: Language;
    published?: boolean;
    publishedAt?: string | null;
  }) {
    const content = await prisma.content.update({
      where: { id },
      data: {
        slug: data.slug,
        defaultLanguage: data.defaultLanguage,
        published: data.published,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
      },
      include: {
        translations: true,
      },
    });

    // 转换为应用类型
    return {
      id: content.id,
      userId: content.userId,
      slug: content.slug,
      defaultLanguage: content.defaultLanguage as Language,
      published: content.published,
      publishedAt: content.publishedAt?.toISOString() || null,
      createdAt: content.createdAt.toISOString(),
      updatedAt: content.updatedAt.toISOString(),
      translations: content.translations.map(translation => ({
        id: translation.id,
        contentId: translation.contentId,
        language: translation.language as Language,
        title: translation.title,
        content: translation.content,
        seoMetadata: {
          title: translation.seoTitle,
          description: translation.seoDesc,
          keywords: translation.seoKeywords.split(','),
          ogImage: translation.ogImage || undefined,
        },
        createdAt: translation.createdAt.toISOString(),
        updatedAt: translation.updatedAt.toISOString(),
      })),
    };
  }

  // 删除内容
  public async deleteContent(id: string) {
    await prisma.content.delete({
      where: { id },
    });
    return true;
  }

  // 创建内容翻译
  public async createContentTranslation(data: {
    contentId: string;
    language: Language;
    title: string;
    content: string;
    seoMetadata: {
      title: string;
      description: string;
      keywords: string[];
      ogImage?: string;
    };
  }) {
    const translation = await prisma.contentTranslation.create({
      data: {
        contentId: data.contentId,
        language: data.language,
        title: data.title,
        content: data.content,
        seoTitle: data.seoMetadata.title,
        seoDesc: data.seoMetadata.description,
        seoKeywords: data.seoMetadata.keywords.join(','),
        ogImage: data.seoMetadata.ogImage,
      },
    });

    // 转换为应用类型
    return {
      id: translation.id,
      contentId: translation.contentId,
      language: translation.language as Language,
      title: translation.title,
      content: translation.content,
      seoMetadata: {
        title: translation.seoTitle,
        description: translation.seoDesc,
        keywords: translation.seoKeywords.split(','),
        ogImage: translation.ogImage || undefined,
      },
      createdAt: translation.createdAt.toISOString(),
      updatedAt: translation.updatedAt.toISOString(),
    };
  }

  // 更新内容翻译
  public async updateContentTranslation(id: string, data: {
    title?: string;
    content?: string;
    seoMetadata?: {
      title?: string;
      description?: string;
      keywords?: string[];
      ogImage?: string;
    };
  }) {
    const translation = await prisma.contentTranslation.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        seoTitle: data.seoMetadata?.title,
        seoDesc: data.seoMetadata?.description,
        seoKeywords: data.seoMetadata?.keywords?.join(','),
        ogImage: data.seoMetadata?.ogImage,
      },
    });

    // 转换为应用类型
    return {
      id: translation.id,
      contentId: translation.contentId,
      language: translation.language as Language,
      title: translation.title,
      content: translation.content,
      seoMetadata: {
        title: translation.seoTitle,
        description: translation.seoDesc,
        keywords: translation.seoKeywords.split(','),
        ogImage: translation.ogImage || undefined,
      },
      createdAt: translation.createdAt.toISOString(),
      updatedAt: translation.updatedAt.toISOString(),
    };
  }

  // 删除内容翻译
  public async deleteContentTranslation(id: string) {
    await prisma.contentTranslation.delete({
      where: { id },
    });
    return true;
  }

  // 初始化示例数据
  public async seedData() {
    // 创建用户
    const user = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: '$2a$10$GQf8SKqYuHxkQF9OlVK9qeqIgKwl1Yx5S0WrYQyf.nG.7qqJEr9om', // 'password123'
        language: 'zh',
        theme: 'system',
      },
    });

    // 创建示例内容
    const content1 = await prisma.content.upsert({
      where: { slug: 'getting-started-with-react' },
      update: {},
      create: {
        userId: user.id,
        slug: 'getting-started-with-react',
        defaultLanguage: 'zh',
        published: true,
        publishedAt: new Date(),
      },
    });

    // 创建内容翻译
    await prisma.contentTranslation.upsert({
      where: { contentId_language: { contentId: content1.id, language: 'zh' } },
      update: {},
      create: {
        contentId: content1.id,
        language: 'zh',
        title: 'React 入门指南',
        content: '# React 入门指南\n\n这是一篇关于 React 的入门指南，帮助你快速上手 React 开发。\n\n## 什么是 React？\n\nReact 是一个用于构建用户界面的 JavaScript 库。它由 Facebook 开发并维护，被广泛用于构建单页应用程序。\n\n## 为什么选择 React？\n\n- **组件化开发**：React 采用组件化的开发方式，使得代码更加模块化和可复用。\n- **虚拟 DOM**：React 使用虚拟 DOM 来提高性能，减少实际 DOM 操作。\n- **单向数据流**：React 的单向数据流使得应用的状态管理更加可预测。\n- **丰富的生态系统**：React 拥有丰富的生态系统，包括 Redux、React Router 等。\n\n## 开始使用 React\n\n### 安装\n\n使用 Create React App 可以快速创建一个 React 项目：\n\n```bash\nnpx create-react-app my-app\ncd my-app\nnpm start\n```\n\n### 创建第一个组件\n\n```jsx\nimport React from \'react\';\n\nfunction HelloWorld() {\n  return <h1>Hello, World!</h1>;\n}\n\nexport default HelloWorld;\n```\n\n### 使用 Props\n\n```jsx\nimport React from \'react\';\n\nfunction Greeting(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n\nexport default Greeting;\n```\n\n### 使用 State\n\n```jsx\nimport React, { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n\nexport default Counter;\n```\n\n## 结论\n\nReact 是一个强大而灵活的 JavaScript 库，适用于构建现代化的用户界面。通过本指南，你已经了解了 React 的基础知识，可以开始你的 React 开发之旅了！',
        seoTitle: 'React 入门指南 - 快速上手 React 开发',
        seoDesc: '这篇指南将帮助你快速了解 React 的基础知识，包括组件、Props、State 等核心概念，以及如何开始使用 React 进行开发。',
        seoKeywords: 'React,JavaScript,前端开发,组件,虚拟DOM,入门指南',
      },
    });

    await prisma.contentTranslation.upsert({
      where: { contentId_language: { contentId: content1.id, language: 'en' } },
      update: {},
      create: {
        contentId: content1.id,
        language: 'en',
        title: 'Getting Started with React',
        content: '# Getting Started with React\n\nThis is a beginner\'s guide to React, helping you quickly get started with React development.\n\n## What is React?\n\nReact is a JavaScript library for building user interfaces. It was developed and is maintained by Facebook, and is widely used for building single-page applications.\n\n## Why Choose React?\n\n- **Component-Based Development**: React adopts a component-based development approach, making code more modular and reusable.\n- **Virtual DOM**: React uses a virtual DOM to improve performance by reducing actual DOM operations.\n- **One-Way Data Flow**: React\'s one-way data flow makes application state management more predictable.\n- **Rich Ecosystem**: React has a rich ecosystem, including Redux, React Router, and more.\n\n## Getting Started with React\n\n### Installation\n\nUse Create React App to quickly create a React project:\n\n```bash\nnpx create-react-app my-app\ncd my-app\nnpm start\n```\n\n### Creating Your First Component\n\n```jsx\nimport React from \'react\';\n\nfunction HelloWorld() {\n  return <h1>Hello, World!</h1>;\n}\n\nexport default HelloWorld;\n```\n\n### Using Props\n\n```jsx\nimport React from \'react\';\n\nfunction Greeting(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n\nexport default Greeting;\n```\n\n### Using State\n\n```jsx\nimport React, { useState } from \'react\';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n\nexport default Counter;\n```\n\n## Conclusion\n\nReact is a powerful and flexible JavaScript library suitable for building modern user interfaces. With this guide, you\'ve learned the basics of React and can start your React development journey!',
        seoTitle: 'Getting Started with React - Quick Start Guide',
        seoDesc: 'This guide will help you quickly understand the basics of React, including components, props, state, and other core concepts, as well as how to start developing with React.',
        seoKeywords: 'React,JavaScript,Frontend Development,Components,Virtual DOM,Beginner Guide',
      },
    });

    // 创建更多示例内容
    const content2 = await prisma.content.upsert({
      where: { slug: 'typescript-best-practices' },
      update: {},
      create: {
        userId: user.id,
        slug: 'typescript-best-practices',
        defaultLanguage: 'zh',
        published: true,
        publishedAt: new Date(Date.now() - 86400000), // 昨天
      },
    });

    await prisma.contentTranslation.upsert({
      where: { contentId_language: { contentId: content2.id, language: 'zh' } },
      update: {},
      create: {
        contentId: content2.id,
        language: 'zh',
        title: 'TypeScript 最佳实践',
        content: '# TypeScript 最佳实践\n\n本文将介绍一些 TypeScript 的最佳实践，帮助你更好地使用 TypeScript 进行开发。\n\n## 为什么使用 TypeScript？\n\nTypeScript 是 JavaScript 的超集，它添加了静态类型检查和其他功能，使得代码更加健壮和可维护。使用 TypeScript 可以：\n\n- 在编译时捕获错误，而不是在运行时\n- 提供更好的代码补全和导航\n- 使重构更加安全和容易\n- 提高代码的可读性和可维护性\n\n## 类型定义最佳实践\n\n### 使用接口定义对象结构\n\n```typescript\n// 好的做法\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  age?: number; // 可选属性\n}\n\nfunction getUserInfo(user: User) {\n  console.log(`${user.name}: ${user.email}`);\n}\n```\n\n### 使用类型别名组合类型\n\n```typescript\n// 使用类型别名组合类型\ntype ID = string | number;\n\ntype UserWithID = {\n  id: ID;\n  name: string;\n};\n```\n\n### 使用泛型增强代码复用性\n\n```typescript\n// 使用泛型\nfunction getFirstElement<T>(array: T[]): T | undefined {\n  return array[0];\n}\n\nconst numbers = [1, 2, 3];\nconst firstNumber = getFirstElement(numbers); // 类型为 number | undefined\n\nconst strings = [\'a\', \'b\', \'c\'];\nconst firstString = getFirstElement(strings); // 类型为 string | undefined\n```\n\n## 函数类型最佳实践\n\n### 明确定义函数参数和返回类型\n\n```typescript\n// 好的做法\nfunction calculateTotal(items: { price: number; quantity: number }[]): number {\n  return items.reduce((total, item) => total + item.price * item.quantity, 0);\n}\n```\n\n### 使用函数重载处理多种输入类型\n\n```typescript\n// 函数重载\nfunction process(x: number): number;\nfunction process(x: string): string;\nfunction process(x: number | string): number | string {\n  if (typeof x === \'number\') {\n    return x * 2;\n  } else {\n    return x.repeat(2);\n  }\n}\n```\n\n## 错误处理最佳实践\n\n### 使用自定义错误类型\n\n```typescript\n// 自定义错误类型\nclass ValidationError extends Error {\n  constructor(message: string) {\n    super(message);\n    this.name = \'ValidationError\';\n  }\n}\n\nfunction validateUser(user: User) {\n  if (!user.email) {\n    throw new ValidationError(\'Email is required\');\n  }\n}\n```\n\n### 使用类型守卫进行错误检查\n\n```typescript\n// 类型守卫\nfunction isValidationError(error: unknown): error is ValidationError {\n  return error instanceof Error && error.name === \'ValidationError\';\n}\n\ntry {\n  validateUser({ id: 1, name: \'John\', email: \'\'});\n} catch (error) {\n  if (isValidationError(error)) {\n    console.error(`Validation error: ${error.message}`);\n  } else {\n    console.error(\'An unknown error occurred\');\n  }\n}\n```\n\n## 结论\n\n遵循这些 TypeScript 最佳实践可以帮助你编写更加健壮、可维护的代码。随着项目的增长，这些实践将变得越来越重要，帮助你避免常见的错误和陷阱。',
        seoTitle: 'TypeScript 最佳实践 - 提高代码质量的技巧',
        seoDesc: '本文介绍了 TypeScript 的最佳实践，包括类型定义、函数类型和错误处理等方面的技巧，帮助你编写更加健壮、可维护的代码。',
        seoKeywords: 'TypeScript,JavaScript,最佳实践,类型定义,函数类型,错误处理',
      },
    });

    const content3 = await prisma.content.upsert({
      where: { slug: 'multilingual-website-development-guide' },
      update: {},
      create: {
        userId: user.id,
        slug: 'multilingual-website-development-guide',
        defaultLanguage: 'zh',
        published: true,
        publishedAt: new Date(Date.now() - 172800000), // 前天
      },
    });

    await prisma.contentTranslation.upsert({
      where: { contentId_language: { contentId: content3.id, language: 'zh' } },
      update: {},
      create: {
        contentId: content3.id,
        language: 'zh',
        title: '多语言网站开发指南',
        content: '# 多语言网站开发指南\n\n本文将介绍如何开发一个支持多语言的网站，包括技术选择、架构设计和最佳实践。\n\n## 为什么需要多语言支持？\n\n在全球化的今天，为网站添加多语言支持可以：\n\n- 扩大用户群体，覆盖更多地区的用户\n- 提高用户体验，让用户使用自己熟悉的语言\n- 增强品牌的国际形象\n- 提高搜索引擎优化 (SEO) 效果\n\n## 技术选择\n\n### 前端国际化库\n\n对于前端应用，有几个流行的国际化库：\n\n- **React-Intl**：适用于 React 应用\n- **i18next**：框架无关的国际化解决方案\n- **Vue-I18n**：适用于 Vue.js 应用\n- **Angular i18n**：Angular 的内置国际化支持\n\n### 后端国际化\n\n后端也需要处理国际化，特别是对于：\n\n- 电子邮件模板\n- API 响应消息\n- 数据库内容\n\n## 架构设计\n\n### 内容存储模型\n\n有几种常见的多语言内容存储模型：\n\n1. **单表模型**：在同一个表中存储所有语言的内容\n   ```\n   {\n     "title_en": "Hello",\n     "title_fr": "Bonjour",\n     "content_en": "Welcome to our site",\n     "content_fr": "Bienvenue sur notre site"\n   }\n   ```\n\n2. **关联表模型**：使用主表和翻译表\n   ```\n   // 主表\n   {\n     "id": 1,\n     "created_at": "2023-01-01"\n   }\n   \n   // 翻译表\n   {\n     "content_id": 1,\n     "language": "en",\n     "title": "Hello",\n     "content": "Welcome to our site"\n   },\n   {\n     "content_id": 1,\n     "language": "fr",\n     "title": "Bonjour",\n     "content": "Bienvenue sur notre site"\n   }\n   ```\n\n### URL 结构\n\n多语言网站的 URL 结构通常有以下几种：\n\n1. **子域名**：`en.example.com`, `fr.example.com`\n2. **路径前缀**：`example.com/en/`, `example.com/fr/`\n3. **查询参数**：`example.com?lang=en`, `example.com?lang=fr`\n\n推荐使用路径前缀方式，它兼顾了 SEO 友好性和实现简便性。\n\n## 实现步骤\n\n### 1. 设置语言检测和切换\n\n```javascript\n// 使用 i18next 和 i18next-browser-languagedetector\nimport i18n from \'i18next\';\nimport LanguageDetector from \'i18next-browser-languagedetector\';\n\ni18n\n  .use(LanguageDetector)\n  .init({\n    fallbackLng: \'en\',\n    detection: {\n      order: [\'path\', \'cookie\', \'navigator\'],\n      lookupFromPathIndex: 0,\n    },\n    resources: {\n      en: { translation: require(\'./locales/en.json\') },\n      fr: { translation: require(\'./locales/fr.json\') },\n    }\n  });\n```\n\n### 2. 创建语言切换组件\n\n```jsx\nfunction LanguageSwitcher() {\n  const { i18n } = useTranslation();\n  \n  const changeLanguage = (lng) => {\n    i18n.changeLanguage(lng);\n  };\n  \n  return (\n    <div>\n      <button onClick={() => changeLanguage(\'en\')}>English</button>\n      <button onClick={() => changeLanguage(\'fr\')}>Français</button>\n    </div>\n  );\n}\n```\n\n### 3. 实现内容翻译\n\n```jsx\nfunction BlogPost({ id }) {\n  const { i18n } = useTranslation();\n  const [post, setPost] = useState(null);\n  \n  useEffect(() => {\n    // 获取当前语言的博客文章\n    fetchPost(id, i18n.language).then(setPost);\n  }, [id, i18n.language]);\n  \n  if (!post) return <Loading />;\n  \n  return (\n    <article>\n      <h1>{post.title}</h1>\n      <div>{post.content}</div>\n    </article>\n  );\n}\n```\n\n## SEO 最佳实践\n\n### 1. 使用 hreflang 标签\n\n```html\n<link rel="alternate" hreflang="en" href="https://example.com/en/page" />\n<link rel="alternate" hreflang="fr" href="https://example.com/fr/page" />\n<link rel="alternate" hreflang="x-default" href="https://example.com/en/page" />\n```\n\n### 2. 本地化元数据\n\n```jsx\nfunction SEOMetadata({ title, description }) {\n  const { i18n } = useTranslation();\n  \n  return (\n    <Helmet>\n      <html lang={i18n.language} />\n      <title>{title}</title>\n      <meta name="description" content={description} />\n    </Helmet>\n  );\n}\n```\n\n## 常见挑战和解决方案\n\n### 1. 内容长度变化\n\n不同语言的文本长度可能差异很大，设计时需要考虑这一点：\n\n- 使用弹性布局\n- 避免固定宽度的容器\n- 测试极端情况（如德语通常比英语长）\n\n### 2. 日期和数字格式\n\n使用专门的库处理不同地区的日期和数字格式：\n\n```javascript\n// 使用 Intl API 格式化日期\nconst date = new Date();\nconst formatter = new Intl.DateTimeFormat(i18n.language, {\n  year: \'numeric\',\n  month: \'long\',\n  day: \'numeric\'\n});\n\nconst formattedDate = formatter.format(date);\n```\n\n### 3. 图片和媒体内容\n\n某些图片可能需要针对不同语言或文化进行调整：\n\n- 为不同语言准备不同版本的图片\n- 使用 CSS 根据语言选择性显示图片\n- 考虑文化差异，避免使用可能在某些文化中不适当的图片\n\n## 结论\n\n开发多语言网站需要仔细规划和设计，但回报是显著的。通过选择合适的技术和遵循最佳实践，可以创建一个真正全球化的网站，为来自世界各地的用户提供优质的体验。',
        seoTitle: '多语言网站开发指南 - 从技术选择到实现',
        seoDesc: '本文介绍了如何开发支持多语言的网站，包括技术选择、架构设计、实现步骤和SEO最佳实践，帮助你创建一个真正全球化的网站。',
        seoKeywords: '多语言,国际化,i18n,网站开发,前端开发,SEO,React,Vue',
      },
    });

    return true;
  }
}

// 创建单例实例
const prismaService = new PrismaService();

export default prismaService;