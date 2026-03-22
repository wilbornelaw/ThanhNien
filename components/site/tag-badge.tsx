import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { Tag } from "@/types";

export function TagBadge({ tag }: { tag: Tag }) {
  return (
    <Link href={`/tag/${tag.slug}`}>
      <Badge variant="outline" className="hover:border-foreground/40 hover:bg-transparent">
        {tag.name}
      </Badge>
    </Link>
  );
}
