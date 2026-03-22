import { z } from "zod";

export const settingsSchema = z.object({
  site_name: z.string().min(2),
  logo_url: z.string().url().optional().or(z.literal("")),
  favicon_url: z.string().url().optional().or(z.literal("")),
  footer_text: z.string().max(200).optional().or(z.literal("")),
  contact_email: z.string().email().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  facebook: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  youtube: z.string().url().optional().or(z.literal("")),
  default_seo_title: z.string().max(70).optional().or(z.literal("")),
  default_seo_description: z.string().max(160).optional().or(z.literal("")),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

