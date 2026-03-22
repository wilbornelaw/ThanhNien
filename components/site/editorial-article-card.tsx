import Image from "next/image";
import Link from "next/link";

import { CategoryBadge } from "@/components/site/category-badge";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

export function EditorialArticleCard({
  post,
  size = "default",
}: {
  post: Post;
  size?: "feature" | "default" | "compact";
}) {
  const showImage = size !== "compact";

  return (
    <article className="group border-t border-border pt-5">
      {showImage && post.featured_image ? (
        <Link href={`/news/${post.slug}`} className="block">
          <div className="overflow-hidden border border-border bg-muted">
            <Image
              src={post.featured_image}
              alt={post.title}
              width={1600}
              height={900}
              className="h-auto w-full object-contain transition duration-500 group-hover:scale-[1.01]"
            />
          </div>
        </Link>
      ) : null}

      <div className={showImage ? "pt-4" : ""}>
        <div className="mb-3 flex items-center justify-between gap-4">
          <CategoryBadge category={post.category} />
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {formatDate(post.published_at)}
          </span>
        </div>
        <Link href={`/news/${post.slug}`} className="block">
          <h3
            className={`story-link font-serif font-black leading-tight text-foreground ${
              size === "feature"
                ? "text-3xl sm:text-[2.15rem]"
                : size === "compact"
                  ? "text-xl"
                  : "text-[1.72rem]"
            }`}
          >
            {post.title}
          </h3>
        </Link>
        {size !== "compact" ? (
          <p className="mt-3 max-w-[62ch] text-[1.02rem] leading-7 text-muted-foreground">
            {post.excerpt || "Read the latest reporting from the Thanh Nien newsroom."}
          </p>
        ) : null}
        <div className="meta-row mt-4">
          <span>{post.author?.full_name || "Thanh Nien Desk"}</span>
          <span>&bull;</span>
          <span>{post.reading_time} min read</span>
        </div>
      </div>
    </article>
  );
}
