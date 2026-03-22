import { z } from "zod";

export const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Category name is required."),
  slug: z.string().min(2, "Slug is required."),
  description: z.string().max(300).optional().or(z.literal("")),
});

export const tagSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Tag name is required."),
  slug: z.string().min(2, "Slug is required."),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
export type TagFormValues = z.infer<typeof tagSchema>;

