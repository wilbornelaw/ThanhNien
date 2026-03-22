import { Mail, MapPin, Phone } from "lucide-react";

import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Contact | Thanh Nien Newspaper",
  description: "Contact the Thanh Nien Newspaper newsroom, editorial desk, and digital publishing team.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="container-shell py-12">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-border/70 bg-card p-8 shadow-editorial sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-secondary">Contact</p>
          <h1 className="mt-4 text-5xl font-black">Reach the newsroom.</h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Use this page for editorial enquiries, partnership discussions, media relations, and
            reader feedback.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-muted p-6">
              <Mail className="h-5 w-5 text-secondary" />
              <h2 className="mt-4 text-xl font-bold">Editorial Desk</h2>
              <p className="mt-2 text-muted-foreground">info@thanhniennewspaper.com</p>
            </div>
            <div className="rounded-[1.5rem] bg-muted p-6">
              <Phone className="h-5 w-5 text-secondary" />
              <h2 className="mt-4 text-xl font-bold">General Enquiries</h2>
              <p className="mt-2 text-muted-foreground">+84 28 5555 0101</p>
            </div>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-border/70 bg-primary p-8 text-primary-foreground shadow-editorial">
          <MapPin className="h-5 w-5 text-secondary" />
          <h2 className="mt-4 text-3xl font-black">Publishing Office</h2>
          <p className="mt-4 text-primary-foreground/80">
            25 Nguyen Thi Minh Khai Street
            <br />
            District 1, Ho Chi Minh City
            <br />
            Vietnam
          </p>
          <p className="mt-8 text-sm uppercase tracking-[0.2em] text-primary-foreground/60">
            Mon to Fri
          </p>
          <p className="mt-2 text-lg">08:30 - 18:00</p>
        </aside>
      </section>
    </main>
  );
}
