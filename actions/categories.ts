"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { categorySchema, type CategoryFormValues } from "@/lib/validators/taxonomy";
import { slugify } from "@/lib/utils";

export async function saveCategoryAction(payload: CategoryFormValues) {
  await requireStaff();
  const values = categorySchema.parse({
    ...payload,
    slug: slugify(payload.slug || payload.name),
  });

  const supabase = createSupabaseServerClient();
  const mutation = values.id
    ? supabase
        .from("categories")
        .update({
          name: values.name,
          slug: values.slug,
          description: values.description || null,
        })
        .eq("id", values.id)
    : supabase.from("categories").insert({
        name: values.name,
        slug: values.slug,
        description: values.description || null,
      });

  const { error } = await mutation;

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/categories");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireStaff();
  const id = String(formData.get("id"));
  const supabase = createSupabaseServerClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/categories");
}

