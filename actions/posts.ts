"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { postSchema, type PostFormValues } from "@/lib/validators/post";
import { calculateReadingTime, slugify } from "@/lib/utils";

export async function savePostAction(payload: PostFormValues) {
  const profile = await requireStaff();
  const values = postSchema.parse({
    ...payload,
    slug: slugify(payload.slug || payload.title),
  });

  const supabase = createSupabaseServerClient();
  const postData = {
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt || null,
    content: values.content,
    featured_image: values.featured_image || null,
    category_id: values.category_id || null,
    author_id: values.author_id || profile.id,
    status: values.status,
    is_featured: values.is_featured,
    is_breaking: values.is_breaking,
    seo_title: values.seo_title || null,
    seo_description: values.seo_description || null,
    canonical_url: values.canonical_url || null,
    published_at:
      values.status === "draft"
        ? null
        : values.published_at || new Date().toISOString(),
    reading_time: calculateReadingTime(values.content),
  };

  const mutation = values.id
    ? supabase.from("posts").update(postData).eq("id", values.id).select("id").single()
    : supabase.from("posts").insert(postData).select("id").single();

  const { data, error } = await mutation;

  if (error) {
    throw new Error(error.message);
  }

  if (data?.id) {
    await supabase.from("post_tags").delete().eq("post_id", data.id);

    if (values.tag_ids.length > 0) {
      await supabase.from("post_tags").insert(
        values.tag_ids.map((tagId) => ({
          post_id: data.id,
          tag_id: tagId,
        })),
      );
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath(`/news/${values.slug}`);

  return {
    success: true,
    postId: data?.id,
    slug: values.slug,
  };
}

export async function deletePostAction(formData: FormData) {
  await requireStaff();
  const id = String(formData.get("id"));
  const slug = String(formData.get("slug"));
  const supabase = createSupabaseServerClient();

  await supabase.from("post_tags").delete().eq("post_id", id);
  await supabase.from("posts").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/posts");
  revalidatePath(`/news/${slug}`);
}

export async function incrementPostViewsAction(postId: string) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("posts")
    .select("view_count")
    .eq("id", postId)
    .single();

  const currentCount = Number(data?.view_count ?? 0);

  await supabase
    .from("posts")
    .update({ view_count: currentCount + 1 })
    .eq("id", postId);
}
