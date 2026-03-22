import Link from "next/link";
import { format } from "date-fns";

import { Navbar } from "@/components/site/navbar";
import { SearchBar } from "@/components/site/search-bar";
import { ThemeToggle } from "@/components/site/theme-toggle";
import type { SiteSettings } from "@/types";

export function Header({ settings }: { settings: SiteSettings }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-shell py-3">
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 border-b border-border pb-4 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <ThemeToggle />
              <span>{format(new Date(), "EEEE, MMMM dd, yyyy")}</span>
            </div>
            <div className="text-center">
              <p className="eyebrow">Global Edition</p>
              <Link href="/" className="mt-2 block font-serif text-3xl font-black leading-none tracking-tight sm:text-4xl">
                {settings.site_name}
              </Link>
            </div>
            <div className="lg:justify-self-end lg:w-full lg:max-w-sm">
              <SearchBar />
            </div>
          </div>
          <div className="flex items-center justify-between gap-6">
            <Navbar className="flex-1" />
            <p className="hidden text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground xl:block">
              Independent reporting, sharp analysis
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
