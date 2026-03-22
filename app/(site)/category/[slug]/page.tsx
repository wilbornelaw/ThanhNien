import { notFound } from "next/navigation";

import { EditorialArticleCard } from "@/components/site/editorial-article-card";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { PaginationNav } from "@/components/site/pagination-nav";
import { buildMetadata } from "@/lib/metadata";
import { getCategoryPageData } from "@/lib/queries/public";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCategoryPageData(slug);

  if (!data.category) {
    return buildMetadata({
      title: "Category | Thanh Nien Newspaper",
      description: "Browse category coverage from Thanh Nien Newspaper.",
      path: `/category/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${data.category.name} | Thanh Nien Newspaper`,
    description:
      data.category.description ||
      `Latest ${data.category.name.toLowerCase()} coverage from Thanh Nien Newspaper.`,
    path: `/category/${slug}`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const data = await getCategoryPageData(slug, query.page);

  if (!data.category || !data.posts) {
    notFound();
  }

  return (
    <main className="container-shell py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: data.category.name },
        ]}
      />
      <section className="mt-6 rounded-[2rem] border border-border/70 bg-card p-8 shadow-editorial">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">Category</p>
        <h1 className="mt-4 text-5xl font-black">{data.category.name}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{data.category.description}</p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.posts.items.map((post) => (
          <EditorialArticleCard key={post.id} post={post} />
        ))}
      </section>

      <PaginationNav
        page={data.posts.page}
        pageCount={data.posts.pageCount}
        basePath={`/category/${slug}`}
      />
    </main>
  );
}
