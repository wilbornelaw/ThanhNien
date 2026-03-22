"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { saveTagAction } from "@/actions/tags";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/utils";
import { tagSchema, type TagFormValues } from "@/lib/validators/taxonomy";
import type { Tag } from "@/types";

export function TagForm({ initialData }: { initialData?: Tag | null }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name || "",
      slug: initialData?.slug || "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Tag" : "New Tag"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit((values) => {
            startTransition(async () => {
              try {
                await saveTagAction({
                  ...values,
                  slug: slugify(values.slug || values.name),
                });
                setMessage("Tag saved.");
                if (!initialData) form.reset({ name: "", slug: "" });
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
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{message}</p>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Tag"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

