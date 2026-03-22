import { AdminHeader } from "@/components/admin/header";
import { SettingsForm } from "@/components/admin/settings-form";
import { requireAdminRole } from "@/lib/auth";
import { getAdminSiteSettings } from "@/lib/queries/admin";

export default async function SettingsPage() {
  const profile = await requireAdminRole();
  const settings = await getAdminSiteSettings();

  return (
    <div className="grid gap-6">
      <AdminHeader
        title="Settings"
        description="Manage brand assets, footer details, contact metadata, and SEO defaults."
        profile={profile}
      />
      <SettingsForm initialData={settings} />
    </div>
  );
}
