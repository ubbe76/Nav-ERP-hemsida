import type { MetadataRoute } from "next";
import { lastModified } from "@/lib/lastmod";
import { allRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes().map((route) => {
    const date = lastModified(route);
    return { url: absoluteUrl(route), ...(date && { lastModified: date }) };
  });
}
