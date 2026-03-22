import Image from "next/image";
import Link from "next/link";

import { CategoryBadge } from "@/components/site/category-badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

export function ArticleCard({ post }: { post: Post }) {
  return (
    <Card className="overflow-hidden border-none bg-card/90 shadow-none ring-1 ring-border/70 transition hover:-translate-y-0.5 hover:shadow-editorial">
      {post.featured_image ? (
        <Link href={`/news/${post.slug}`} className="block">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover transition duration-500 hover:scale-105"
            />
          </div>
        </Link>
      ) : null}
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <CategoryBadge category={post.category} />
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {formatDate(post.published_at)}
          </span>
        </div>
        <Link href={`/news/${post.slug}`} className="block">
          <h3 className="text-2xl font-black leading-tight hover:text-secondary">
            {post.title}
          </h3>
        </Link>
        <p className="mt-3 text-base text-muted-foreground">
          {post.excerpt || "Read the latest reporting from the Thanh Nien newsroom."}
        </p>
        <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
          <span>{post.author?.full_name || "Thanh Nien Desk"}</span>
          <span>•</span>
          <span>{post.reading_time} min read</span>
        </div>
      </CardContent>
    </Card>
  );
}

