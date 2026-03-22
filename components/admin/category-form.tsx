"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { saveCategoryAction } from "@/actions/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";
import { categorySchema, type CategoryFormValues } from "@/lib/validators/taxonomy";
import type { Category } from "@/types";

export function CategoryForm({ initialData }: { initialData?: Category | null }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Category" : "New Category"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit((values) => {
            startTransition(async () => {
              try {
                await saveCategoryAction({
                  ...values,
                  slug: slugify(values.slug || values.name),
                });
                setMessage("Category saved.");
                if (!initialData) form.reset({ name: "", slug: "", description: "" });
                router.refresh();
              } catch (error) {
                setMessage(error instanceof Error ? error.message : "Save failed.");
              }
            });
          })}
        >
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input {...form.register("name")} />
          </div>
          <div className="grid gap-2">
            <Label>Slug</Label>
            <Input {...form.register("slug")} />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea {...form.register("description")} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{message}</p>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Category"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

