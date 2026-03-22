"use client";

import { useState } from "react";

import { ImageUploader } from "@/components/forms/image-uploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MediaManager({
  library,
}: {
  library: Array<{
    name: string;
    path: string;
    publicUrl: string;
    createdAt: string;
  }>;
}) {
  const [latestUrl, setLatestUrl] = useState("");

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Upload Media</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <ImageUploader value={latestUrl} onChange={setLatestUrl} />
          {latestUrl ? (
            <div className="rounded-[1.25rem] bg-muted p-4 text-sm">
              <p className="font-semibold">Latest upload URL</p>
              <p className="mt-2 break-all text-muted-foreground">{latestUrl}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {library.map((item) => (
            <a
              key={item.path}
              href={item.publicUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-[1.25rem] border border-border p-4 transition hover:bg-muted"
            >
              <p className="truncate font-semibold">{item.name}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.createdAt || "Uploaded"}</p>
            </a>
          ))}
          {!library.length ? (
            <p className="text-sm text-muted-foreground">No media found in storage yet.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

