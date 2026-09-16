import type { MetadataRoute } from "next";
import { categories } from "@/lib/categories";
import { products } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.siteUrl) return [];

  const routes = ["", "/solucoes", "/produtos", "/sobre"];
  return [
    ...routes.map((route) => ({ url: `${siteConfig.siteUrl}${route}` })),
    ...categories.map((category) => ({
      url: `${siteConfig.siteUrl}/solucoes/${category.slug}`,
    })),
    ...products.map((product) => ({
      url: `${siteConfig.siteUrl}/produtos/${product.slug}`,
    })),
  ];
}
