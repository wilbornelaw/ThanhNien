import Image from "next/image";
import Link from "next/link";

import { CategoryBadge } from "@/components/site/category-badge";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

export function FeaturedArticleCard({
  post,
  compact = false,
}: {
  post: Post;
  compact?: boolean;
}) {
  return (
    <article
      className={`grid overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-editorial ${
        compact ? "gap-0" : "lg:grid-cols-[1.4fr_1fr]"
      }`}
    >
      {post.featured_image ? (
        <Link href={`/news/${post.slug}`} className="relative min-h-[260px]">
          <Image src={post.featured_image} alt={post.title} fill className="object-cover" />
        </Link>
      ) : (
        <div className="min-h-[260px] bg-newsroom" />
      )}
      <div className="flex flex-col justify-between p-6 sm:p-8">
        <div>
          <div className="flex items-center justify-between gap-4">
            <CategoryBadge category={post.category} />
            <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {formatDate(post.published_at)}
            </span>
          </div>
          <Link href={`/news/${post.slug}`}>
            <h2 className={`${compact ? "mt-5 text-2xl" : "mt-5 text-4xl"} font-black leading-tight`}>
              {post.title}
            </h2>
          </Link>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
        </div>
        <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
          <span>{post.author?.full_name || "Thanh Nien Desk"}</span>
          <span>•</span>
          <span>{post.reading_time} min read</span>
          {post.is_breaking ? (
            <>
              <span>•</span>
              <span className="font-semibold uppercase tracking-[0.18em] text-secondary">
                Breaking
              </span>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}

