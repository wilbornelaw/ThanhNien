import Link from "next/link";
import { Newspaper, FolderTree, Tags, Images, Settings, LayoutDashboard, PenSquare } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Posts", icon: Newspaper },
  { href: "/admin/posts/new", label: "New Post", icon: PenSquare },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/admin/media", label: "Media", icon: Images },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="rounded-[2rem] border border-border/70 bg-card p-4 shadow-editorial">
      <Link href="/" className="flex items-center gap-3 rounded-[1.25rem] bg-primary px-4 py-4 text-primary-foreground">
        <div className="rounded-full bg-white/10 p-2">
          <Newspaper className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">Admin</p>
          <p className="font-serif text-lg font-black">Thanh Nien</p>
        </div>
      </Link>

      <nav className="mt-6 grid gap-2">
        {links.map((item) => {
          const isActive = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[1.25rem] px-4 py-3 text-sm font-semibold transition",
                isActive ? "bg-secondary text-secondary-foreground" : "hover:bg-muted",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

