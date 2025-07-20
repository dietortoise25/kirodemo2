// 语言类型
export type Language = "zh" | "en" | "ja" | "es" | "fr";

// 主题类型
export type Theme = "light" | "dark" | "system";

// 用户类型
export interface User {
  id: string;
  email: string;
  settings: UserSettings;
  createdAt: string;
  updatedAt: string;
}

// 用户设置类型
export interface UserSettings {
  language: Language;
  theme: Theme;
}

// 内容类型
export interface Content {
  id: string;
  userId: string;
  slug: string;
  defaultLanguage: Language;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  translations: ContentTranslation[];
}

// 内容翻译类型
export interface ContentTranslation {
  id: string;
  contentId: string;
  language: Language;
  title: string;
  content: string;
  seoMetadata: SeoMetadata;
  createdAt: string;
  updatedAt: string;
}

// SEO 元数据类型
export interface SeoMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

// 项目类型
export interface Project {
  id: string;
  userId: string;
  slug: string;
  defaultLanguage: Language;
  githubUrl?: string;
  liveUrl?: string;
  completionDate?: string;
  createdAt: string;
  updatedAt: string;
  translations: ProjectTranslation[];
  media: Media[];
}

// 项目翻译类型
export interface ProjectTranslation {
  id: string;
  projectId: string;
  language: Language;
  title: string;
  description: string;
  seoMetadata: SeoMetadata;
  createdAt: string;
  updatedAt: string;
}

// 媒体类型
export interface Media {
  id: string;
  projectId: string;
  type: "image" | "video";
  url: string;
  altText: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// 技能类型
export interface Skill {
  id: string;
  userId: string;
  name: string;
  level: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// 个人资料翻译类型
export interface ProfileTranslation {
  id: string;
  userId: string;
  language: Language;
  title: string;
  bio: string;
  services: string;
  seoMetadata: SeoMetadata;
  createdAt: string;
  updatedAt: string;
}

// 消息类型
export interface Message {
  id: string;
  userId: string;
  senderName: string;
  senderEmail: string;
  language: Language;
  subject: string;
  content: string;
  isJobInquiry: boolean;
  status: "unread" | "read" | "replied" | "archived";
  createdAt: string;
  updatedAt: string;
}

// 分类类型
export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// 认证上下文类型
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
