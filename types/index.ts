export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "admin" | "editor" | "author";
export type PostStatus = "draft" | "published" | "scheduled";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  footer_text: string | null;
  contact_email: string | null;
  social_links: Record<string, string>;
  default_seo_title: string | null;
  default_seo_description: string | null;
  updated_at: string;
}

export interface PostTag {
  id: string;
  post_id: string;
  tag_id: string;
  tag?: Tag;
}

export interface AuthorSummary {
  id: string;
  full_name: string | null;
  email?: string | null;
  avatar_url: string | null;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author_id: string | null;
  category_id: string | null;
  status: PostStatus;
  is_featured: boolean;
  is_breaking: boolean;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  reading_time: number;
  view_count: number;
  category?: Category | null;
  author?: AuthorSummary | null;
  post_tags?: PostTag[];
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  scheduledPosts: number;
  categoriesCount: number;
  tagsCount: number;
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface SelectOption {
  label: string;
  value: string;
}
