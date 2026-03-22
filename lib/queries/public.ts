import type { Category, PaginationResult, Post, SiteSettings, Tag } from "@/types";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import {
  absoluteUrl,
  buildPageRange,
  parsePageParam,
  stripHtml,
} from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

const postSelect = `
  *,
  category:categories(*),
  author:profiles(id, full_name, avatar_url),
  post_tags(
    id,
    tag:tags(*)
  )
`;

export async function getSiteSettings() {
  if (!isConfigured()) {
    return {
      site_name: "Thanh Nien Newspaper",
      logo_url: null,
      favicon_url: null,
      footer_text: "Thanh Nien Newspaper. Global reporting with editorial clarity.",
      contact_email: "info@thanhniennewspaper.com",
      social_links: {},
      default_seo_title: "Thanh Nien Newspaper",
      default_seo_description:
        "Premium digital coverage across world affairs, business, politics, and culture.",
    } as SiteSettings;
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    (data as SiteSettings | null) ?? {
      id: "default",
      site_name: "Thanh Nien Newspaper",
      logo_url: null,
      favicon_url: null,
      footer_text: "Thanh Nien Newspaper. Global reporting with editorial clarity.",
      contact_email: "info@thanhniennewspaper.com",
      social_links: {},
      default_seo_title: "Thanh Nien Newspaper",
      default_seo_description:
        "Premium digital coverage across world affairs, business, politics, and culture.",
      updated_at: new Date().toISOString(),
    }
  );
}

export async function getHomepageData() {
  if (!isConfigured()) {
    return {
      heroPost: null,
      secondaryFeatured: [] as Post[],
      breaking: [] as Post[],
      latest: [] as Post[],
      popular: [] as Post[],
      categorySpotlights: [] as Array<{ category: Category; posts: Post[] }>,
    };
  }

  const supabase = createSupabaseServerClient();
  const now = new Date().toISOString();

  const [featuredResult, latestResult, popularResult, categoryResult] =
    await Promise.all([
      supabase
        .from("posts")
        .select(postSelect)
        .in("status", ["published", "scheduled"])
        .lte("published_at", now)
        .order("is_featured", { ascending: false })
        .order("published_at", { ascending: false })
        .limit(5),
      supabase
        .from("posts")
        .select(postSelect)
        .in("status", ["published", "scheduled"])
        .lte("published_at", now)
        .order("published_at", { ascending: false })
        .limit(12),
      supabase
        .from("posts")
        .select(postSelect)
        .in("status", ["published", "scheduled"])
        .lte("published_at", now)
        .order("view_count", { ascending: false })
        .order("published_at", { ascending: false })
        .limit(6),
      supabase.from("categories").select("*").order("name", { ascending: true }),
    ]);

  const featuredPosts = (featuredResult.data ?? []) as Post[];
  const categories = (categoryResult.data ?? []) as Category[];
  const spotlightCategories = categories.slice(0, 4);

  const categorySpotlights = await Promise.all(
    spotlightCategories.map(async (category) => {
      const { data } = await supabase
        .from("posts")
        .select(postSelect)
        .eq("category_id", category.id)
        .in("status", ["published", "scheduled"])
        .lte("published_at", now)
        .order("published_at", { ascending: false })
        .limit(3);

      return {
        category,
        posts: (data ?? []) as Post[],
      };
    }),
  );

  return {
    heroPost: featuredPosts[0] ?? null,
    secondaryFeatured: featuredPosts.slice(1, 5),
    breaking: featuredPosts.filter((post) => post.is_breaking).slice(0, 6),
    latest: ((latestResult.data ?? []) as Post[]).slice(0, 9),
    popular: (popularResult.data ?? []) as Post[],
    categorySpotlights: categorySpotlights.filter((item) => item.posts.length > 0),
  };
}

export async function getArticleBySlug(slug: string, preview = false) {
  if (!isConfigured()) {
    return null;
  }

  const supabase = createSupabaseServerClient();
  let query = supabase.from("posts").select(postSelect).eq("slug", slug);

  if (!preview) {
    query = query
      .in("status", ["published", "scheduled"])
      .lte("published_at", new Date().toISOString());
  }

  const { data } = await query.maybeSingle();
  return (data as Post | null) ?? null;
}

export async function getRelatedPosts(post: Post) {
  if (!isConfigured() || !post.category_id) {
    return [] as Post[];
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("posts")
    .select(postSelect)
    .eq("category_id", post.category_id)
    .neq("id", post.id)
    .in("status", ["published", "scheduled"])
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(3);

  return (data ?? []) as Post[];
}

export async function getCategoryPageData(slug: string, pageParam?: string) {
  if (!isConfigured()) {
    return {
      category: null,
      posts: { items: [], total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE, pageCount: 1 },
    };
  }

  const supabase = createSupabaseServerClient();
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!category) {
    return { category: null, posts: null };
  }

  const page = parsePageParam(pageParam);
  const { count } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("category_id", category.id)
    .in("status", ["published", "scheduled"])
    .lte("published_at", new Date().toISOString());

  const { start, end, pageCount } = buildPageRange(count ?? 0, page, DEFAULT_PAGE_SIZE);

  const { data: posts } = await supabase
    .from("posts")
    .select(postSelect)
    .eq("category_id", category.id)
    .in("status", ["published", "scheduled"])
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .range(start, end);

  return {
    category: category as Category,
    posts: {
      items: (posts ?? []) as Post[],
      total: count ?? 0,
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      pageCount,
    } satisfies PaginationResult<Post>,
  };
}

export async function getTagPageData(slug: string, pageParam?: string) {
  if (!isConfigured()) {
    return {
      tag: null,
      posts: { items: [], total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE, pageCount: 1 },
    };
  }

  const supabase = createSupabaseServerClient();
  const { data: tag } = await supabase
    .from("tags")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!tag) {
    return { tag: null, posts: null };
  }

  const page = parsePageParam(pageParam);
  const { count } = await supabase
    .from("post_tags")
    .select("id", { count: "exact", head: true })
    .eq("tag_id", tag.id);

  const { start, end, pageCount } = buildPageRange(count ?? 0, page, DEFAULT_PAGE_SIZE);

  const { data } = await supabase
    .from("post_tags")
    .select(
      `
      id,
      post:posts(
        ${postSelect}
      )
    `,
    )
    .eq("tag_id", tag.id)
    .range(start, end);

  const items = ((data ?? []) as Array<{ post: Post | Post[] | null }>)
    .map((item) => (Array.isArray(item.post) ? item.post[0] : item.post))
    .filter((post): post is Post => Boolean(post))
    .filter((post) =>
      ["published", "scheduled"].includes(post.status) &&
      (!post.published_at || new Date(post.published_at) <= new Date()),
    );

  return {
    tag: tag as Tag,
    posts: {
      items,
      total: count ?? 0,
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      pageCount,
    } satisfies PaginationResult<Post>,
  };
}

export async function searchPublishedPosts(queryText?: string, pageParam?: string) {
  if (!isConfigured() || !queryText) {
    return {
      query: queryText ?? "",
      posts: { items: [], total: 0, page: 1, pageSize: DEFAULT_PAGE_SIZE, pageCount: 1 },
    };
  }

  const supabase = createSupabaseServerClient();
  const page = parsePageParam(pageParam);
  const filter = `title.ilike.%${queryText}%,excerpt.ilike.%${queryText}%`;

  const { count } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .or(filter)
    .in("status", ["published", "scheduled"])
    .lte("published_at", new Date().toISOString());

  const { start, end, pageCount } = buildPageRange(count ?? 0, page, DEFAULT_PAGE_SIZE);

  const { data } = await supabase
    .from("posts")
    .select(postSelect)
    .or(filter)
    .in("status", ["published", "scheduled"])
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .range(start, end);

  return {
    query: queryText,
    posts: {
      items: (data ?? []) as Post[],
      total: count ?? 0,
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      pageCount,
    } satisfies PaginationResult<Post>,
  };
}

export async function getAllPublishedPaths() {
  if (!isConfigured()) {
    return [] as string[];
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("posts")
    .select("slug")
    .in("status", ["published", "scheduled"])
    .lte("published_at", new Date().toISOString());

  return (data ?? []).map((item) => `/news/${item.slug}`);
}

export async function getAllCategoryPaths() {
  if (!isConfigured()) {
    return [] as string[];
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("categories").select("slug");
  return (data ?? []).map((item) => `/category/${item.slug}`);
}

export async function getAllTagPaths() {
  if (!isConfigured()) {
    return [] as string[];
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("tags").select("slug");
  return (data ?? []).map((item) => `/tag/${item.slug}`);
}

export function extractSeoDescription(post: Post) {
  return post.seo_description || post.excerpt || stripHtml(post.content).slice(0, 150);
}

export function resolveCanonicalUrl(post: Post) {
  return post.canonical_url || absoluteUrl(`/news/${post.slug}`);
}
