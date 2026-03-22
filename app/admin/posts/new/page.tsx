import { AdminHeader } from "@/components/admin/header";
import { PostForm } from "@/components/admin/post-form";
import { requireStaff } from "@/lib/auth";
import { getAllAuthors, getAllCategories, getAllTags } from "@/lib/queries/admin";

export default async function NewPostPage() {
  const profile = await requireStaff();
  const [categories, tags, authors] = await Promise.all([
    getAllCategories(),
    getAllTags(),
    getAllAuthors(),
  ]);

  return (
    <div className="grid gap-6">
      <AdminHeader
        title="New Post"
        description="Create a new article, assign taxonomy, upload media, and set SEO metadata."
        profile={profile}
      />
      <PostForm categories={categories} tags={tags} authors={authors} />
    </div>
  );
}

