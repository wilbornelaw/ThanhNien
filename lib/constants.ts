export const DEFAULT_CATEGORIES = [
  "World",
  "Politics",
  "Business",
  "Technology",
  "Education",
  "Culture",
  "Entertainment",
  "Sports",
  "Lifestyle",
  "Law",
  "Health",
  "Travel",
] as const;

export const PRIMARY_NAV = [
  { label: "World", href: "/category/world" },
  { label: "Politics", href: "/category/politics" },
  { label: "Business", href: "/category/business" },
  { label: "Technology", href: "/category/technology" },
  { label: "Culture", href: "/category/culture" },
  { label: "Sports", href: "/category/sports" },
  { label: "Travel", href: "/category/travel" },
];

export const FOOTER_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Search", href: "/search" },
];

export const DEFAULT_PAGE_SIZE = 9;

export const STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "news-media";

