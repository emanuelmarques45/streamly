import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";
import { getTrending } from "@/services/catalog";
import { mediaHref } from "@/types/Media";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/discover",
    "/login",
    "/signup",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.6,
  }));

  // Trending titles cover the detail pages worth indexing.
  let trendingRoutes: MetadataRoute.Sitemap = [];
  try {
    const trending = await getTrending("all", "week");

    trendingRoutes = trending.map((item) => ({
      url: `${SITE_URL}${mediaHref(item)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    trendingRoutes = [];
  }

  return [...staticRoutes, ...trendingRoutes];
}
