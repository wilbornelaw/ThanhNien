import Link from "next/link";

import { Button } from "@/components/ui/button";

export function PaginationNav({
  page,
  pageCount,
  basePath,
  query,
}: {
  page: number;
  pageCount: number;
  basePath: string;
  query?: Record<string, string>;
}) {
  if (pageCount <= 1) return null;

  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams(query);
    if (targetPage > 1) {
      params.set("page", String(targetPage));
    } else {
      params.delete("page");
    }
    const search = params.toString();
    return search ? `${basePath}?${search}` : basePath;
  };

  return (
    <div className="flex items-center justify-between gap-4 pt-8">
      <Button asChild variant="outline">
        <Link
          href={buildHref(Math.max(1, page - 1))}
          aria-disabled={page <= 1}
          className={page <= 1 ? "pointer-events-none opacity-50" : ""}
        >
          Previous
        </Link>
      </Button>
      <p className="text-sm text-muted-foreground">
        Page {page} of {pageCount}
      </p>
      <Button asChild variant="outline">
        <Link
          href={buildHref(Math.min(pageCount, page + 1))}
          aria-disabled={page >= pageCount}
          className={page >= pageCount ? "pointer-events-none opacity-50" : ""}
        >
          Next
        </Link>
      </Button>
    </div>
  );
}

