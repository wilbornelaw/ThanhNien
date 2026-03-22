import Image from "next/image";
import Link from "next/link";

import { CategoryBadge } from "@/components/site/category-badge";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

export function EditorialFeaturedStory({
  post,
  compact = false,
}: {
  post: Post;
  compact?: boolean;
}) {
  return (
    <article
      className={`grid gap-0 border-b border-border pb-6 ${
        compact ? "grid-cols-[120px_1fr] gap-4 border-t border-border pt-5" : "lg:grid-cols-[1.25fr_0.95fr]"
      }`}
    >
      {post.featured_image ? (
        <Link
          href={`/news/${post.slug}`}
          className={`relative overflow-hidden bg-muted ${compact ? "min-h-[108px]" : "min-h-[420px]"}`}
        >
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-contain transition duration-700 hover:scale-[1.01]"
          />
        </Link>
      ) : (
        <div className={`bg-newsroom ${compact ? "min-h-[108px]" : "min-h-[420px]"}`} />
      )}
      <div className={compact ? "pt-0" : "flex flex-col justify-between border border-l-0 border-border px-6 py-7 sm:px-8"}>
        <div>
          <div className="flex items-center justify-between gap-4">
            <CategoryBadge category={post.category} />
            <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {formatDate(post.published_at)}
            </span>
          </div>
          <Link href={`/news/${post.slug}`}>
            <h2
              className={`${compact ? "mt-3 text-[1.45rem]" : "mt-5 text-4xl sm:text-[3.35rem]"} story-link font-serif font-black leading-[1.02]`}
            >
              {post.title}
            </h2>
          </Link>
          {!compact ? (
            <p className="mt-4 max-w-[58ch] text-lg leading-8 text-muted-foreground">{post.excerpt}</p>
          ) : null}
        </div>
        <div className="meta-row mt-5">
          <span>{post.author?.full_name || "Thanh Nien Desk"}</span>
          <span>&bull;</span>
          <span>{post.reading_time} min read</span>
          {post.is_breaking ? (
            <>
              <span>&bull;</span>
              <span className="font-semibold uppercase tracking-[0.18em] text-secondary">Breaking</span>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}
