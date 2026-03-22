import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminHeader } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireStaff } from "@/lib/auth";
import { getAdminPostById } from "@/lib/queries/admin";
import { formatDate } from "@/lib/utils";

export default async function PreviewPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireStaff();
  const { id } = await params;
  const post = await getAdminPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <AdminHeader
        title="Preview"
        description="Internal preview of the article before or after publication."
        profile={profile}
      />
      <Card>
        <CardContent className="p-8 sm:p-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
                {post.status}
              </p>
              <h1 className="mt-3 text-5xl font-black">{post.title}</h1>
              <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
            </div>
            <Button asChild variant="outline">
              <Link href={`/admin/posts/${post.id}/edit`}>Back to editor</Link>
            </Button>
          </div>

          {post.featured_image ? (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[1.5rem]">
              <Image src={post.featured_image} alt={post.title} fill className="object-cover" />
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>{post.author?.full_name || "Thanh Nien Desk"}</span>
            <span>•</span>
            <span>{formatDate(post.published_at, "MMMM dd, yyyy • HH:mm")}</span>
            <span>•</span>
            <span>{post.reading_time} min read</span>
          </div>

          <div className="prose-news mt-10" dangerouslySetInnerHTML={{ __html: post.content }} />
        </CardContent>
      </Card>
    </div>
  );
}

