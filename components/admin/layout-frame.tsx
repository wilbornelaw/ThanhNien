"use client";

import { usePathname } from "next/navigation";

import { AdminShell } from "@/components/admin/shell";

export function AdminLayoutFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <main className="container-shell py-8">
      <AdminShell>{children}</AdminShell>
    </main>
  );
}

