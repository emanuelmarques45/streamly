import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Áreas autenticadas e API não têm valor em busca.
      disallow: ["/api/", "/profile"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
