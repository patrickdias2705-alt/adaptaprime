import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/politica-de-privacidade", "/termos-de-uso"],
    },
    sitemap: siteConfig.siteUrl ? `${siteConfig.siteUrl}/sitemap.xml` : undefined,
  };
}

