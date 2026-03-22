import { deleteTagAction } from "@/actions/tags";
import { AdminHeader } from "@/components/admin/header";
import { TagForm } from "@/components/admin/tag-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireStaff } from "@/lib/auth";
import { getAllTags } from "@/lib/queries/admin";

export default async function TagsPage() {
  const profile = await requireStaff();
  const tags = await getAllTags();

  return (
    <div className="grid gap-6">
      <AdminHeader
        title="Tags"
        description="Manage topical labels used for article discovery, SEO, and related content."
        profile={profile}
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <TagForm />
        <div className="grid gap-4">
          {tags.map((tag) => (
            <div key={tag.id} className="grid gap-3">
              <TagForm initialData={tag} />
              <Card>
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-semibold">{tag.name}</p>
                    <p className="text-sm text-muted-foreground">/{tag.slug}</p>
                  </div>
                  <form action={deleteTagAction}>
                    <input type="hidden" name="id" value={tag.id} />
                    <Button type="submit" size="sm" variant="destructive">
                      Delete
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
