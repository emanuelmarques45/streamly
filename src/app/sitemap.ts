import type { MetadataRoute } from "next";
import { getTrending } from "@/services/catalog";
import { mediaHref } from "@/types/Media";

const siteUrl = process.env.APP_URL ?? "http://localhost:5173";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/discover",
    "/login",
    "/signup",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.6,
  }));

  // Os títulos em alta cobrem as páginas de detalhe que valem indexar.
  let trendingRoutes: MetadataRoute.Sitemap = [];
  try {
    const trending = await getTrending("all", "week");

    trendingRoutes = trending.map((item) => ({
      url: `${siteUrl}${mediaHref(item)}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    trendingRoutes = [];
  }

  return [...staticRoutes, ...trendingRoutes];
}
