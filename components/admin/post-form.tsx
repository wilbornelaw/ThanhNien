"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { savePostAction } from "@/actions/posts";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { ImageUploader } from "@/components/forms/image-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";
import { postSchema, type PostFormValues } from "@/lib/validators/post";
import type { Category, Post, Profile, Tag } from "@/types";

function toDatetimeLocalValue(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export function PostForm({
  initialData,
  categories,
  tags,
  authors,
}: {
  initialData?: Post | null;
  categories: Category[];
  tags: Tag[];
  authors: Profile[];
}) {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [slugTouched, setSlugTouched] = useState(Boolean(initialData?.slug));

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      id: initialData?.id,
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "<p>Start writing here.</p>",
      featured_image: initialData?.featured_image || "",
      category_id: initialData?.category_id || "",
      author_id: initialData?.author_id || "",
      tag_ids: initialData?.post_tags?.map((item) => item.tag_id) || [],
      seo_title: initialData?.seo_title || "",
      seo_description: initialData?.seo_description || "",
      canonical_url: initialData?.canonical_url || "",
      status: initialData?.status || "draft",
      is_featured: initialData?.is_featured || false,
      is_breaking: initialData?.is_breaking || false,
      published_at: toDatetimeLocalValue(initialData?.published_at),
    },
  });

  const titleValue = form.watch("title");

  useEffect(() => {
    if (!slugTouched && titleValue) {
      form.setValue("slug", slugify(titleValue), { shouldValidate: true });
    }
  }, [form, slugTouched, titleValue]);

  return (
    <form
      className="grid gap-6"
      onSubmit={form.handleSubmit((values) => {
        setStatusMessage(null);

        startTransition(async () => {
          try {
            await savePostAction(values);
            setStatusMessage("Post saved successfully.");
            router.push("/admin/posts");
            router.refresh();
          } catch (error) {
            setStatusMessage(error instanceof Error ? error.message : "Failed to save post.");
          }
        });
      })}
    >
      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Story Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register("title")} />
              <p className="text-sm text-red-600">{form.formState.errors.title?.message}</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                {...form.register("slug")}
                onChange={(event) => {
                  setSlugTouched(true);
                  form.setValue("slug", slugify(event.target.value), { shouldValidate: true });
                }}
              />
              <p className="text-sm text-red-600">{form.formState.errors.slug?.message}</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" {...form.register("excerpt")} />
              <p className="text-sm text-red-600">{form.formState.errors.excerpt?.message}</p>
            </div>

            <div className="grid gap-2">
              <Label>Article Content</Label>
              <Controller
                control={form.control}
                name="content"
                render={({ field }) => (
                  <RichTextEditor value={field.value} onChange={field.onChange} />
                )}
              />
              <p className="text-sm text-red-600">{form.formState.errors.content?.message}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select id="status" {...form.register("status")}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="published_at">Publish Date</Label>
                <Input id="published_at" type="datetime-local" {...form.register("published_at")} />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-[1.25rem] bg-muted p-4">
                <div>
                  <Label htmlFor="is_featured">Featured Article</Label>
                  <p className="text-sm text-muted-foreground">Highlight the article in homepage placements.</p>
                </div>
                <Controller
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <Switch checked={field.value} onChange={(event) => field.onChange(event.target.checked)} />
                  )}
                />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-[1.25rem] bg-muted p-4">
                <div>
                  <Label htmlFor="is_breaking">Breaking News</Label>
                  <p className="text-sm text-muted-foreground">Pin the article to the breaking news strip.</p>
                </div>
                <Controller
                  control={form.control}
                  name="is_breaking"
                  render={({ field }) => (
                    <Switch checked={field.value} onChange={(event) => field.onChange(event.target.checked)} />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Taxonomy</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="category_id">Category</Label>
                <Select id="category_id" {...form.register("category_id")}>
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="author_id">Author</Label>
                <Select id="author_id" {...form.register("author_id")}>
                  <option value="">Assign an author</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.full_name || author.email}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-3">
                <Label>Tags</Label>
                <Controller
                  control={form.control}
                  name="tag_ids"
                  render={({ field }) => (
                    <div className="grid gap-3">
                      {tags.map((tag) => {
                        const checked = field.value.includes(tag.id);
                        return (
                          <label
                            key={tag.id}
                            className="flex items-center gap-3 rounded-[1rem] border border-border px-4 py-3 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                field.onChange(
                                  checked
                                    ? field.value.filter((item) => item !== tag.id)
                                    : [...field.value, tag.id],
                                );
                              }}
                            />
                            {tag.name}
                          </label>
                        );
                      })}
                    </div>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                control={form.control}
                name="featured_image"
                render={({ field }) => (
                  <ImageUploader value={field.value} onChange={field.onChange} />
                )}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="seo_title">SEO Title</Label>
            <Input id="seo_title" {...form.register("seo_title")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="canonical_url">Canonical URL</Label>
            <Input id="canonical_url" {...form.register("canonical_url")} />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="seo_description">SEO Description</Label>
            <Textarea id="seo_description" {...form.register("seo_description")} />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">{statusMessage}</div>
        <div className="flex flex-wrap items-center gap-3">
          {initialData?.id ? (
            <Button asChild variant="outline">
              <Link href={`/admin/posts/${initialData.id}/preview`}>Preview</Link>
            </Button>
          ) : null}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : initialData?.id ? "Update Post" : "Publish Post"}
          </Button>
        </div>
      </div>
    </form>
  );
}
