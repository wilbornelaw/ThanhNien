import Link from "next/link";

import { FOOTER_LINKS } from "@/lib/constants";
import { socialLinksToArray } from "@/lib/utils";
import type { SiteSettings } from "@/types";

export function Footer({ settings }: { settings: SiteSettings }) {
  const socialLinks = socialLinksToArray(settings.social_links);

  return (
    <footer className="mt-16 border-t border-border/70 bg-primary text-primary-foreground">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-primary-foreground/70">
            Thanh Nien Newspaper
          </p>
          <h2 className="mt-4 text-3xl font-black">{settings.site_name}</h2>
          <p className="mt-4 max-w-md text-primary-foreground/80">
            {settings.footer_text ||
              "Independent international reporting with clear analysis, sharp design, and a modern editorial voice."}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
            Explore
          </h3>
          <div className="mt-4 flex flex-col gap-3">
            {FOOTER_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-secondary">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
            Connect
          </h3>
          <div className="mt-4 flex flex-col gap-3">
            <a href={`mailto:${settings.contact_email || "info@thanhniennewspaper.com"}`}>
              {settings.contact_email || "info@thanhniennewspaper.com"}
            </a>
            {socialLinks.map(([platform, url]) => (
              <a key={platform} href={url} target="_blank" rel="noreferrer">
                {platform}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-4 text-center text-sm text-primary-foreground/70">
        Copyright © {new Date().getFullYear()} {settings.site_name}. All rights reserved.
      </div>
    </footer>
  );
}
