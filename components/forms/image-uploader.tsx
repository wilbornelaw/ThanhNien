"use client";

import Image from "next/image";
import { useState, useTransition } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { slugify } from "@/lib/utils";
import { STORAGE_BUCKET } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ImageUploader({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  const [preview, setPreview] = useState(value || "");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem] border border-border">
          <Image src={preview} alt="Featured preview" fill className="object-cover" />
        </div>
      ) : null}

      <Input
        type="url"
        value={preview}
        placeholder="https://..."
        onChange={(event) => {
          setPreview(event.target.value);
          onChange(event.target.value);
        }}
      />

      <div className="rounded-[1.5rem] border border-dashed border-border p-4">
        <Input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;

            startTransition(async () => {
              const supabase = createSupabaseBrowserClient();
              const filePath = `uploads/${Date.now()}-${slugify(file.name)}`;
              const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
              });

              if (error) {
                window.alert(error.message);
                return;
              }

              const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
              setPreview(data.publicUrl);
              onChange(data.publicUrl);
            });
          }}
        />
        <p className="mt-3 text-sm text-muted-foreground">
          Upload directly to Supabase Storage and store the public URL in the post.
        </p>
      </div>

      <Button type="button" variant="outline" disabled={isPending}>
        {isPending ? "Uploading..." : "Image upload ready"}
      </Button>
    </div>
  );
}

