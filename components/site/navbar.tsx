import Link from "next/link";

import { PRIMARY_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar({ className }: { className?: string }) {
  return (
    <nav className={cn("overflow-x-auto", className)}>
      <div className="flex min-w-max items-center gap-6 pb-1">
        {PRIMARY_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border-b border-transparent pb-3 text-xs font-semibold uppercase tracking-[0.22em] text-foreground/82 transition hover:border-foreground hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
