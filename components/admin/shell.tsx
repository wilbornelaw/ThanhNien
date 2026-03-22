"use client";

import { usePathname } from "next/navigation";

import { AdminSidebar } from "@/components/admin/sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
      <AdminSidebar currentPath={pathname} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

