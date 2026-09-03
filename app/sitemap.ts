import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.siteUrl) return [];

  const routes = ["", "/solucoes", "/produtos", "/sobre", "/contato"];
  return [
    ...routes.map((route) => ({ url: `${siteConfig.siteUrl}${route}`, lastModified: new Date() })),
    ...products.map((product) => ({ url: `${siteConfig.siteUrl}/produtos/${product.slug}`, lastModified: new Date() })),
  ];
}

