"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { tagSchema, type TagFormValues } from "@/lib/validators/taxonomy";
import { slugify } from "@/lib/utils";

export async function saveTagAction(payload: TagFormValues) {
  await requireStaff();
  const values = tagSchema.parse({
    ...payload,
    slug: slugify(payload.slug || payload.name),
  });

  const supabase = createSupabaseServerClient();
  const mutation = values.id
    ? supabase
        .from("tags")
        .update({
          name: values.name,
          slug: values.slug,
        })
        .eq("id", values.id)
    : supabase.from("tags").insert({
        name: values.name,
        slug: values.slug,
      });

  const { error } = await mutation;

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/tags");
}

export async function deleteTagAction(formData: FormData) {
  await requireStaff();
  const id = String(formData.get("id"));
  const supabase = createSupabaseServerClient();
  await supabase.from("post_tags").delete().eq("tag_id", id);
  await supabase.from("tags").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/tags");
}

