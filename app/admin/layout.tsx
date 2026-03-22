import { AdminLayoutFrame } from "@/components/admin/layout-frame";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutFrame>{children}</AdminLayoutFrame>;
}
