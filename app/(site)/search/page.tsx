import { EditorialArticleCard } from "@/components/site/editorial-article-card";
import { PaginationNav } from "@/components/site/pagination-nav";
import { SearchBar } from "@/components/site/search-bar";
import { buildMetadata } from "@/lib/metadata";
import { searchPublishedPosts } from "@/lib/queries/public";

export const metadata = buildMetadata({
  title: "Search | Thanh Nien Newspaper",
  description: "Search the Thanh Nien Newspaper archive and latest reporting.",
  path: "/search",
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const result = await searchPublishedPosts(params.q, params.page);

  return (
    <main className="container-shell py-10">
      <section className="rounded-[2rem] border border-border/70 bg-card p-8 shadow-editorial">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">Search</p>
        <h1 className="mt-4 text-4xl font-black">Find stories, analyses, and features.</h1>
        <SearchBar defaultValue={params.q} className="mt-6 max-w-2xl" />
      </section>

      <section className="mt-8">
        <p className="mb-6 text-sm uppercase tracking-[0.2em] text-muted-foreground">
          {result.posts.total} result(s){result.query ? ` for "${result.query}"` : ""}
        </p>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {result.posts.items.map((post) => (
            <EditorialArticleCard key={post.id} post={post} />
          ))}
        </div>
        <PaginationNav
          page={result.posts.page}
          pageCount={result.posts.pageCount}
          basePath="/search"
          query={params.q ? { q: params.q } : undefined}
        />
      </section>
    </main>
  );
}
