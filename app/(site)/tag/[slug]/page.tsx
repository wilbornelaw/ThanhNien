import { notFound } from "next/navigation";

import { EditorialArticleCard } from "@/components/site/editorial-article-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { PaginationNav } from "@/components/site/pagination-nav";
import { buildMetadata } from "@/lib/metadata";
import { getTagPageData } from "@/lib/queries/public";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getTagPageData(slug);

  return buildMetadata({
    title: data.tag ? `${data.tag.name} | Thanh Nien Newspaper` : "Tag | Thanh Nien Newspaper",
    description: data.tag
      ? `Articles tagged ${data.tag.name} on Thanh Nien Newspaper.`
      : "Browse tagged reporting from Thanh Nien Newspaper.",
    path: `/tag/${slug}`,
    noIndex: !data.tag,
  });
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const data = await getTagPageData(slug, query.page);

  if (!data.tag || !data.posts) {
    notFound();
  }

  return (
    <main className="container-shell py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: `Tag: ${data.tag.name}` },
        ]}
      />
      <section className="mt-6 rounded-[2rem] border border-border/70 bg-card p-8 shadow-editorial">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">Tag</p>
        <h1 className="mt-4 text-5xl font-black">{data.tag.name}</h1>
      </section>
      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.posts.items.map((post) => (
          <EditorialArticleCard key={post.id} post={post} />
        ))}
      </section>
      <PaginationNav page={data.posts.page} pageCount={data.posts.pageCount} basePath={`/tag/${slug}`} />
    </main>
  );
}
