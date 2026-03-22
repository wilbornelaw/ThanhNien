import { z } from "zod";

export const postSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(5, "Title must be at least 5 characters."),
  slug: z.string().min(3, "Slug must be at least 3 characters."),
  excerpt: z.string().max(320).optional().or(z.literal("")),
  content: z.string().min(30, "Content must be at least 30 characters."),
  featured_image: z.string().url().optional().or(z.literal("")),
  category_id: z.string().uuid().optional().or(z.literal("")),
  author_id: z.string().uuid().optional().or(z.literal("")),
  tag_ids: z.array(z.string().uuid()).default([]),
  seo_title: z.string().max(70).optional().or(z.literal("")),
  seo_description: z.string().max(160).optional().or(z.literal("")),
  canonical_url: z.string().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published", "scheduled"]),
  is_featured: z.boolean().default(false),
  is_breaking: z.boolean().default(false),
  published_at: z.string().optional().or(z.literal("")),
});

export type PostFormValues = z.infer<typeof postSchema>;

