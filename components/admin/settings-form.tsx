"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { saveSettingsAction } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { settingsSchema, type SettingsFormValues } from "@/lib/validators/settings";
import type { SiteSettings } from "@/types";

export function SettingsForm({ initialData }: { initialData?: SiteSettings | null }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      site_name: initialData?.site_name || "Thanh Nien Newspaper",
      logo_url: initialData?.logo_url || "",
      favicon_url: initialData?.favicon_url || "",
      footer_text: initialData?.footer_text || "",
      contact_email: initialData?.contact_email || "",
      twitter: initialData?.social_links?.twitter || "",
      facebook: initialData?.social_links?.facebook || "",
      instagram: initialData?.social_links?.instagram || "",
      linkedin: initialData?.social_links?.linkedin || "",
      youtube: initialData?.social_links?.youtube || "",
      default_seo_title: initialData?.default_seo_title || "",
      default_seo_description: initialData?.default_seo_description || "",
    },
  });

  return (
    <form
      className="grid gap-6"
      onSubmit={form.handleSubmit((values) => {
        startTransition(async () => {
          try {
            await saveSettingsAction(values);
            setMessage("Settings updated.");
            router.refresh();
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Update failed.");
          }
        });
      })}
    >
      <Card>
        <CardHeader>
          <CardTitle>Brand Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="grid gap-2">
            <Label>Site Name</Label>
            <Input {...form.register("site_name")} />
          </div>
          <div className="grid gap-2">
            <Label>Contact Email</Label>
            <Input {...form.register("contact_email")} />
          </div>
          <div className="grid gap-2">
            <Label>Logo URL</Label>
            <Input {...form.register("logo_url")} />
          </div>
          <div className="grid gap-2">
            <Label>Favicon URL</Label>
            <Input {...form.register("favicon_url")} />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label>Footer Text</Label>
            <Textarea {...form.register("footer_text")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="grid gap-2">
            <Label>Twitter</Label>
            <Input {...form.register("twitter")} />
          </div>
          <div className="grid gap-2">
            <Label>Facebook</Label>
            <Input {...form.register("facebook")} />
          </div>
          <div className="grid gap-2">
            <Label>Instagram</Label>
            <Input {...form.register("instagram")} />
          </div>
          <div className="grid gap-2">
            <Label>LinkedIn</Label>
            <Input {...form.register("linkedin")} />
          </div>
          <div className="grid gap-2">
            <Label>YouTube</Label>
            <Input {...form.register("youtube")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Defaults</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Label>Default SEO Title</Label>
            <Input {...form.register("default_seo_title")} />
          </div>
          <div className="grid gap-2">
            <Label>Default SEO Description</Label>
            <Textarea {...form.register("default_seo_description")} />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{message}</p>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
