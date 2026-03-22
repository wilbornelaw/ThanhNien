import Link from "next/link";

import { deletePostAction } from "@/actions/posts";
import { AdminHeader } from "@/components/admin/header";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { requireStaff } from "@/lib/auth";
import { getAdminPosts } from "@/lib/queries/admin";
import { formatDate } from "@/lib/utils";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const profile = await requireStaff();
  const params = await searchParams;
  const posts = await getAdminPosts(params.search, params.status);

  return (
    <div className="grid gap-6">
      <AdminHeader
        title="Posts"
        description="Search, review, publish, and manage every article in the newsroom."
        profile={profile}
      />

      <form className="grid gap-3 rounded-[2rem] border border-border/70 bg-card p-5 shadow-editorial md:grid-cols-[1fr_220px_auto]">
        <Input name="search" defaultValue={params.search} placeholder="Search by title or slug" />
        <Select name="status" defaultValue={params.status || "all"}>
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
        </Select>
        <div className="flex gap-3">
          <Button type="submit" variant="outline">
            Filter
          </Button>
          <Button asChild>
            <Link href="/admin/posts/new">New Post</Link>
          </Button>
        </div>
      </form>

      <DataTable
        columns={["Post", "Status", "Category", "Published", "Actions"]}
        rows={posts.map((post) => [
          <div key={`${post.id}-post`} className="grid gap-1">
            <Link href={`/admin/posts/${post.id}/edit`} className="font-semibold hover:text-secondary">
              {post.title}
            </Link>
            <span className="text-xs text-muted-foreground">/{post.slug}</span>
          </div>,
          <span key={`${post.id}-status`} className="capitalize">
            {post.status}
          </span>,
          <span key={`${post.id}-category`}>{post.category?.name || "Unassigned"}</span>,
          <span key={`${post.id}-published`}>{formatDate(post.published_at)}</span>,
          <div key={`${post.id}-actions`} className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/posts/${post.id}/edit`}>Edit</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/admin/posts/${post.id}/preview`}>Preview</Link>
            </Button>
            <form action={deletePostAction}>
              <input type="hidden" name="id" value={post.id} />
              <input type="hidden" name="slug" value={post.slug} />
              <Button type="submit" size="sm" variant="destructive">
                Delete
              </Button>
            </form>
          </div>,
        ])}
      />
    </div>
  );
}

