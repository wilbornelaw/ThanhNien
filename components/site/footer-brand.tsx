import Link from "next/link";

import { FOOTER_LINKS } from "@/lib/constants";
import { socialLinksToArray } from "@/lib/utils";
import type { SiteSettings } from "@/types";

export function FooterBrand({ settings }: { settings: SiteSettings }) {
  const socialLinks = socialLinksToArray(settings.social_links);

  return (
    <footer className="mt-20 border-t border-foreground bg-primary text-primary-foreground">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-[1.4fr_0.9fr_0.9fr_1fr]">
        <div>
          <p className="eyebrow text-primary-foreground/60">Thanh Nien Newspaper</p>
          <h2 className="mt-4 text-3xl font-black">{settings.site_name}</h2>
          <p className="mt-4 max-w-md text-primary-foreground/78">
            {settings.footer_text ||
              "Independent international reporting with clear analysis, sharp design, and a modern editorial voice."}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
            Explore
          </h3>
          <div className="mt-4 flex flex-col gap-3">
            {FOOTER_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className="story-link hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
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
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
            Sections
          </h3>
          <p className="mt-4 text-primary-foreground/78">
            World, Politics, Business, Technology, Education, Culture, Entertainment, Sports, Lifestyle, Law, Health, and Travel.
          </p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-4 text-center text-sm text-primary-foreground/70">
        Copyright {"\u00A9"} {new Date().getFullYear()} Thanh Nien Newspaper Joint Stock Company. All rights reserved.
      </div>
    </footer>
  );
}
