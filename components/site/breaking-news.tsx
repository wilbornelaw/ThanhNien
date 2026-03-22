import Link from "next/link";

import type { Post } from "@/types";

export function BreakingNews({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;

  return (
    <section className="border-y border-border bg-muted/40">
      <div className="flex flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        <div className="shrink-0 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
          Breaking
        </div>
        <div className="grid flex-1 gap-3 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/news/${post.slug}`} className="story-link text-sm font-semibold leading-6">
              {post.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
