import { deleteCategoryAction } from "@/actions/categories";
import { AdminHeader } from "@/components/admin/header";
import { CategoryForm } from "@/components/admin/category-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireStaff } from "@/lib/auth";
import { getAllCategories } from "@/lib/queries/admin";

export default async function CategoriesPage() {
  const profile = await requireStaff();
  const categories = await getAllCategories();

  return (
    <div className="grid gap-6">
      <AdminHeader
        title="Categories"
        description="Maintain high-level news sections and editorial landing pages."
        profile={profile}
      />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <CategoryForm />
        <div className="grid gap-4">
          {categories.map((category) => (
            <div key={category.id} className="grid gap-3">
              <CategoryForm initialData={category} />
              <Card>
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-semibold">{category.name}</p>
                    <p className="text-sm text-muted-foreground">/{category.slug}</p>
                  </div>
                  <form action={deleteCategoryAction}>
                    <input type="hidden" name="id" value={category.id} />
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
