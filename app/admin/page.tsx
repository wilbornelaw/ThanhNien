import Link from "next/link";

import { AdminHeader } from "@/components/admin/header";
import { DataTable } from "@/components/admin/data-table";
import { StatsCard } from "@/components/admin/stats-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireStaff } from "@/lib/auth";
import { getDashboardStats, getRecentPosts } from "@/lib/queries/admin";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const profile = await requireStaff();
  const [stats, recentPosts] = await Promise.all([getDashboardStats(), getRecentPosts()]);

  return (
    <div className="grid gap-6">
      <AdminHeader
        title="Dashboard"
        description="Track publication volume, monitor recent updates, and jump into the newsroom workflow."
        profile={profile}
      />

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-5">
        <StatsCard label="Total Posts" value={stats.totalPosts} hint="All articles in the system." />
        <StatsCard label="Published" value={stats.publishedPosts} hint="Live content visible to readers." />
        <StatsCard label="Drafts" value={stats.draftPosts} hint="Stories still in progress." />
        <StatsCard label="Categories" value={stats.categoriesCount} hint="Active news sections." />
        <StatsCard label="Tags" value={stats.tagsCount} hint="Topical classification labels." />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4">
          <h2 className="text-2xl font-black">Recent posts</h2>
          <DataTable
            columns={["Title", "Status", "Category", "Updated"]}
            rows={recentPosts.map((post) => [
              <Link key={`${post.id}-title`} href={`/admin/posts/${post.id}/edit`} className="font-semibold hover:text-secondary">
                {post.title}
              </Link>,
              <span key={`${post.id}-status`} className="capitalize">
                {post.status}
              </span>,
              <span key={`${post.id}-category`}>{post.category?.name || "Unassigned"}</span>,
              <span key={`${post.id}-updated`}>{formatDate(post.updated_at, "MMM dd, yyyy")}</span>,
            ])}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button asChild>
              <Link href="/admin/posts/new">Create New Post</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/categories">Manage Categories</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/tags">Manage Tags</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/settings">Update Site Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
