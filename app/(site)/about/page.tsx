import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "About | Thanh Nien Newspaper",
  description:
    "Learn about Thanh Nien Newspaper, its editorial mission, newsroom standards, and digital publishing approach.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="container-shell py-12">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-border/70 bg-card p-8 shadow-editorial sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-secondary">About</p>
        <h1 className="mt-4 text-5xl font-black">A modern editorial product built for daily readership.</h1>
        <div className="prose-news mt-8">
          <p>
            Thanh Nien Newspaper is designed as a premium digital newsroom with a clear editorial
            hierarchy, fast scanning patterns, and structured reporting across public affairs,
            business, technology, culture, and social issues.
          </p>
          <p>
            The platform combines traditional newspaper strengths such as trust, clarity, and
            rigorous categorisation with modern publishing workflows for SEO, scheduling, and
            responsive reading across every device size.
          </p>
          <p>
            This implementation includes a dedicated admin system, structured metadata, role-based
            permissions, media management, and a flexible article architecture ready for future
            scaling.
          </p>
        </div>
      </section>
    </main>
  );
}
