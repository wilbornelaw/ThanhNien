import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container-shell flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="rounded-full bg-secondary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-secondary">
        404
      </p>
      <h1 className="mt-6 max-w-2xl text-5xl font-black">
        The story you are looking for is no longer available.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted-foreground">
        The article may have moved, expired, or never existed. Return to the
        front page to continue reading the latest coverage.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Back to Homepage</Link>
      </Button>
    </main>
  );
}

