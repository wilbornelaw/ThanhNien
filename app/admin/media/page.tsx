import { AdminHeader } from "@/components/admin/header";
import { MediaManager } from "@/components/admin/media-manager";
import { requireStaff } from "@/lib/auth";
import { getMediaLibrary } from "@/lib/queries/admin";

export default async function MediaPage() {
  const profile = await requireStaff();
  const library = await getMediaLibrary();

  return (
    <div className="grid gap-6">
      <AdminHeader
        title="Media Library"
        description="Upload images to Supabase Storage and reuse them across article publishing."
        profile={profile}
      />
      <MediaManager library={library} />
    </div>
  );
}

