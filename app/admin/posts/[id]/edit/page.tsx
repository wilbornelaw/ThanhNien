import { notFound } from "next/navigation";

import { AdminHeader } from "@/components/admin/header";
import { PostForm } from "@/components/admin/post-form";
import { requireStaff } from "@/lib/auth";
import { getAdminPostById, getAllAuthors, getAllCategories, getAllTags } from "@/lib/queries/admin";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireStaff();
  const { id } = await params;
  const [post, categories, tags, authors] = await Promise.all([
    getAdminPostById(id),
    getAllCategories(),
    getAllTags(),
    getAllAuthors(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <AdminHeader
        title="Edit Post"
        description="Update content, scheduling, SEO fields, and feature placements."
        profile={profile}
      />
      <PostForm initialData={post} categories={categories} tags={tags} authors={authors} />
    </div>
  );
}

