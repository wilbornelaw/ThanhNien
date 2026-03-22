import Link from "next/link";

import { BreakingNews } from "@/components/site/breaking-news";
import { CategorySection } from "@/components/site/category-section";
import { EditorialArticleCard } from "@/components/site/editorial-article-card";
import { EditorialFeaturedStory } from "@/components/site/editorial-featured-story";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { SearchBar } from "@/components/site/search-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHomepageData } from "@/lib/queries/public";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

export default async function HomePage() {
  const data = await getHomepageData();
  const latestLead = data.latest[0];
  const latestGrid = data.latest.slice(1, 7);
  const latestRail = data.latest.slice(7, 10);

  return (
    <main className="container-shell py-6 sm:py-8">
      <div className="grid gap-10">
        <BreakingNews posts={data.breaking} />

        <section className="grid gap-8 border-b border-border pb-10 lg:grid-cols-[1.55fr_0.9fr]">
          <div>
            {data.heroPost ? (
              <EditorialFeaturedStory post={data.heroPost} />
            ) : (
              <Card className="bg-newsroom">
                <CardContent className="p-10">
                  <p className="eyebrow">Front Page</p>
                  <h1 className="mt-3 text-4xl font-black sm:text-6xl">The newsroom is ready for publication.</h1>
                  <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
                    Connect Supabase, run the included schema and seed scripts, and the homepage
                    will populate with live editorial content.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid gap-5">
            {data.secondaryFeatured.map((post) => (
              <EditorialFeaturedStory key={post.id} post={post} compact />
            ))}

            <Card className="border-t-2 border-t-foreground">
              <CardHeader>
                <p className="eyebrow">
                  Search the newsroom
                </p>
                <CardTitle className="text-2xl">Find coverage by headline, topic, or angle.</CardTitle>
              </CardHeader>
              <CardContent>
                <SearchBar className="space-y-0" />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.45fr_0.85fr]">
          <div className="grid gap-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Today</p>
                <h2 className="news-divider mt-2 text-3xl font-black">Latest News</h2>
              </div>
              <Link href="/search" className="story-link text-sm font-semibold hover:text-foreground">
                Browse all
              </Link>
            </div>

            {latestLead ? <EditorialArticleCard post={latestLead} size="feature" /> : null}

            <div className="grid gap-x-8 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
              {latestGrid.map((post) => (
                <EditorialArticleCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          <aside className="grid gap-6 lg:sticky lg:top-32 lg:self-start">
            <Card>
              <CardHeader>
                <p className="eyebrow">
                  Popular
                </p>
                <CardTitle className="text-2xl">Trending reads</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {data.popular.map((post, index) => (
                  <article key={post.id} className="grid gap-2 border-b border-border pb-5 last:border-none">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-serif text-3xl font-black text-foreground/25">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {formatDate(post.published_at)}
                      </span>
                    </div>
                    <Link href={`/news/${post.slug}`} className="story-link text-lg font-bold leading-tight hover:text-foreground">
                      {post.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  </article>
                ))}
              </CardContent>
            </Card>

            <Card className="border-t-2 border-t-secondary">
              <CardHeader>
                <p className="eyebrow">
                  Newsletter
                </p>
                <CardTitle className="text-2xl">Start each morning informed.</CardTitle>
              </CardHeader>
              <CardContent>
                <NewsletterForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <p className="eyebrow">Newswire</p>
                <CardTitle className="text-2xl">More headlines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {latestRail.map((post) => (
                  <Link key={post.id} href={`/news/${post.slug}`} className="story-link block border-t border-border pt-4 font-semibold leading-6">
                    {post.title}
                  </Link>
                ))}
              </CardContent>
            </Card>
          </aside>
        </section>

        <div className="grid gap-10">
          {data.categorySpotlights.map((block) => (
            <CategorySection
              key={block.category.id}
              category={block.category}
              posts={block.posts}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
