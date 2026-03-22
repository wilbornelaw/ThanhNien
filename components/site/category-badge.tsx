import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types";

export function CategoryBadge({ category }: { category: Category | null | undefined }) {
  if (!category) return null;

  return (
    <Link href={`/category/${category.slug}`}>
      <Badge variant="secondary" className="hover:border-secondary hover:bg-transparent">
        {category.name}
      </Badge>
    </Link>
  );
}
