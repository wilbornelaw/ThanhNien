import type { Category, DashboardStats, Post, Profile, SiteSettings, Tag } from "@/types";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";

const adminPostSelect = `
  *,
  category:categories(*),
  author:profiles(id, email, full_name, avatar_url),
  post_tags(
    id,
    tag:tags(*)
  )
`;

export async function getDashboardStats() {
  const supabase = createSupabaseServerClient();

  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    scheduledPosts,
    categoriesCount,
    tagsCount,
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "scheduled"),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("tags").select("*", { count: "exact", head: true }),
  ]);

  return {
    totalPosts: totalPosts.count ?? 0,
    publishedPosts: publishedPosts.count ?? 0,
    draftPosts: draftPosts.count ?? 0,
    scheduledPosts: scheduledPosts.count ?? 0,
    categoriesCount: categoriesCount.count ?? 0,
    tagsCount: tagsCount.count ?? 0,
  } satisfies DashboardStats;
}

export async function getRecentPosts(limit = 6) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("posts")
    .select(adminPostSelect)
    .order("updated_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as Post[];
}

export async function getAdminPosts(search?: string, status?: string) {
  const supabase = createSupabaseServerClient();
  let query = supabase
    .from("posts")
    .select(adminPostSelect)
    .order("updated_at", { ascending: false });

  if (search) {
    query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%`);
  }

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data } = await query;
  return (data ?? []) as Post[];
}

export async function getAdminPostById(id: string) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("posts")
    .select(adminPostSelect)
    .eq("id", id)
    .maybeSingle();

  return (data as Post | null) ?? null;
}

export async function getAllCategories() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  return (data ?? []) as Category[];
}

export async function getAllTags() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("tags").select("*").order("name", { ascending: true });
  return (data ?? []) as Tag[];
}

export async function getAllAuthors() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .in("role", ["admin", "editor", "author"])
    .order("full_name", { ascending: true });

  return (data ?? []) as Profile[];
}

export async function getAdminSiteSettings() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data as SiteSettings | null;
}

export async function getMediaLibrary() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }

  const serviceClient = createSupabaseServiceClient();
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "news-media";
  const { data } = await serviceClient.storage.from(bucket).list("", {
    limit: 100,
    sortBy: { column: "created_at", order: "desc" },
  });

  return (data ?? []).map((item) => ({
    name: item.name,
    path: item.name,
    publicUrl: serviceClient.storage.from(bucket).getPublicUrl(item.name).data.publicUrl,
    createdAt: item.created_at ?? "",
  }));
}

