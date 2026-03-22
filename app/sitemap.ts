import type { MetadataRoute } from "next";

import {
  getAllCategoryPaths,
  getAllPublishedPaths,
  getAllTagPaths,
} from "@/lib/queries/public";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, tags] = await Promise.all([
    getAllPublishedPaths(),
    getAllCategoryPaths(),
    getAllTagPaths(),
  ]);

  return ["/", "/about", "/contact", "/search", ...posts, ...categories, ...tags].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "/" ? 1 : 0.8,
  }));
}

