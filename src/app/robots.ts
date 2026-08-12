import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Authenticated areas and the API have no value in search results.
      disallow: ["/api/", "/profile"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
