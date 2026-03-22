import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bookmark, Facebook, Linkedin, Twitter } from "lucide-react";

import { ArticleViewTracker } from "@/components/site/article-view-tracker";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CategoryBadge } from "@/components/site/category-badge";
import { EditorialArticleCard } from "@/components/site/editorial-article-card";
import { ReadingProgress } from "@/components/site/reading-progress";
import { TagBadge } from "@/components/site/tag-badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import {
  extractSeoDescription,
  getArticleBySlug,
  getRelatedPosts,
  resolveCanonicalUrl,
} from "@/lib/queries/public";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getArticleBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: "Article Not Found | Thanh Nien Newspaper",
      description: "The requested article could not be found.",
      path: `/news/${slug}`,
      noIndex: true,
    });
  }

  return {
    ...buildMetadata({
      title: post.seo_title || post.title,
      description: extractSeoDescription(post),
      path: `/news/${slug}`,
      image: post.featured_image,
    }),
    alternates: {
      canonical: resolveCanonicalUrl(post),
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getArticleBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post);

  return (
    <main className="container-shell py-10">
      <ReadingProgress />
      <ArticleViewTracker postId={post.id} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          post.category ? { label: post.category.name, href: `/category/${post.category.slug}` } : { label: "News" },
          { label: post.title },
        ]}
      />

      <article className="mx-auto mt-6 max-w-[1220px]">
        <header className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
          <div className="max-w-4xl">
            <CategoryBadge category={post.category} />
            <h1 className="article-headline mt-5">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-6 max-w-[60ch] text-xl leading-8 text-muted-foreground">{post.excerpt}</p>
            ) : null}

            <div className="meta-row mt-8 text-[11px]">
              <span className="font-semibold text-foreground">{post.author?.full_name || "Thanh Nien Desk"}</span>
              <span>&bull;</span>
              <span>{formatDate(post.published_at, "MMMM dd, yyyy • HH:mm")}</span>
              <span>&bull;</span>
              <span>{post.reading_time} min read</span>
              <span>&bull;</span>
              <span>{post.view_count} views</span>
            </div>
          </div>

          <aside className="grid gap-4 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div>
              <p className="eyebrow">Share</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild variant="outline" size="icon">
                  <Link
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(resolveCanonicalUrl(post))}`}
                    target="_blank"
                  >
                    <Twitter className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="icon">
                  <Link
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(resolveCanonicalUrl(post))}`}
                    target="_blank"
                  >
                    <Facebook className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="icon">
                  <Link
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(resolveCanonicalUrl(post))}`}
                    target="_blank"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Link>
                </Button>
                <Button type="button" variant="ghost" size="icon" aria-label="Save article">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="border-t border-border pt-4 text-sm leading-7 text-muted-foreground">
              Clean reading mode with a restrained, typography-first article layout for long-form consumption.
            </div>
          </aside>
        </header>

        {post.featured_image ? (
          <div className="mt-8 overflow-hidden border border-border bg-muted">
            <Image
              src={post.featured_image}
              alt={post.title}
              width={1800}
              height={1100}
              className="h-auto w-full object-contain"
            />
          </div>
        ) : null}

        <div className="mt-10 grid gap-10 lg:grid-cols-[80px_minmax(0,760px)_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-3">
              <p className="eyebrow">Share</p>
              <Button asChild variant="ghost" size="icon">
                <Link
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(resolveCanonicalUrl(post))}`}
                  target="_blank"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <Link
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(resolveCanonicalUrl(post))}`}
                  target="_blank"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <Link
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(resolveCanonicalUrl(post))}`}
                  target="_blank"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </aside>

          <div>
            <div
              className="prose-news"
              dangerouslySetInnerHTML={{
                __html: post.content,
              }}
            />

            {post.post_tags?.length ? (
              <div className="mt-12 flex flex-wrap gap-3 border-t border-border pt-8">
                {post.post_tags
                  .map((item) => item.tag)
                  .filter(Boolean)
                  .map((tag) => (
                    <TagBadge key={tag!.id} tag={tag!} />
                  ))}
              </div>
            ) : null}
          </div>

          <aside className="grid content-start gap-6">
            <div className="border-t border-border pt-5">
              <p className="eyebrow">Article Notes</p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                <p>Published from the Thanh Nien editorial desk with search-friendly metadata and structured reading flow.</p>
                <p>Optimized for large-screen reading while preserving mobile legibility and clean hierarchy.</p>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {relatedPosts.length ? (
        <section className="mt-16 border-t border-border pt-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Related</p>
              <h2 className="news-divider mt-2 text-3xl font-black">More in this section</h2>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {relatedPosts.map((item) => (
              <EditorialArticleCard key={item.id} post={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
