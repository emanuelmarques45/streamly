import type { MetadataRoute } from "next";

const siteUrl = process.env.APP_URL ?? "http://localhost:5173";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Áreas autenticadas e API não têm valor em busca.
      disallow: ["/api/", "/profile"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
