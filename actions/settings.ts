"use server";

import { revalidatePath } from "next/cache";

import { requireAdminRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { settingsSchema, type SettingsFormValues } from "@/lib/validators/settings";

export async function saveSettingsAction(payload: SettingsFormValues) {
  await requireAdminRole();
  const values = settingsSchema.parse(payload);
  const supabase = createSupabaseServerClient();

  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const record = {
    site_name: values.site_name,
    logo_url: values.logo_url || null,
    favicon_url: values.favicon_url || null,
    footer_text: values.footer_text || null,
    contact_email: values.contact_email || null,
    social_links: {
      twitter: values.twitter || "",
      facebook: values.facebook || "",
      instagram: values.instagram || "",
      linkedin: values.linkedin || "",
      youtube: values.youtube || "",
    },
    default_seo_title: values.default_seo_title || null,
    default_seo_description: values.default_seo_description || null,
  };

  const mutation = existing?.id
    ? supabase.from("site_settings").update(record).eq("id", existing.id)
    : supabase.from("site_settings").insert(record);

  const { error } = await mutation;

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

