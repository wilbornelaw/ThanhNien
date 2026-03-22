import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export function SearchBar({
  defaultValue,
  className,
}: {
  defaultValue?: string;
  className?: string;
}) {
  return (
    <form action="/search" className={className}>
      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Search reporting, analysis, and opinion"
          className="h-12 border-foreground/15 bg-white pl-11 text-sm"
        />
      </label>
    </form>
  );
}
