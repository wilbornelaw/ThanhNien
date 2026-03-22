import Link from "next/link";

import { EditorialArticleCard } from "@/components/site/editorial-article-card";
import type { Category, Post } from "@/types";

export function CategorySection({
  category,
  posts,
}: {
  category: Category;
  posts: Post[];
}) {
  if (!posts.length) return null;

  const [lead, ...rest] = posts;

  return (
    <section className="grid gap-6 border-t border-border pt-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Section</p>
          <h2 className="mt-2 text-3xl font-black">{category.name}</h2>
        </div>
        <Link href={`/category/${category.slug}`} className="story-link text-sm font-semibold hover:text-foreground">
          View all
        </Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <EditorialArticleCard post={lead} size="feature" />
        <div className="grid gap-5">
          {rest.map((post) => (
            <EditorialArticleCard key={post.id} post={post} size="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
