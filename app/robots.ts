import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: siteConfig.indexable ? {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    } : { userAgent: "*", disallow: "/" },
    sitemap: siteConfig.siteUrl && siteConfig.indexable ? `${siteConfig.siteUrl}/sitemap.xml` : undefined,
    host: siteConfig.siteUrl || undefined,
  };
}
