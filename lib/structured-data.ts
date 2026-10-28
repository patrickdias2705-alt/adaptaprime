import type { Product } from "./products";
import { absoluteUrl, siteConfig } from "./site-config";

export function productEntity(product: Product) {
  const url = absoluteUrl(`/produtos/${product.slug}`);
  const images = [product.image, product.companionImage].filter((path): path is string => Boolean(path)).map(path => absoluteUrl(path));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description,
    url,
    category: product.category,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    ...(images.length ? { image: images } : {}),
    ...(product.technicalData ? {
      additionalProperty: product.technicalData.groups.map(group => ({
        "@type": "PropertyValue", name: group.connection,
        value: `${group.configuration}${group.heights?.length ? ` · Alturas: ${group.heights.join(" / ")} mm` : ""}`,
      })),
    } : {}),
    // This catalog has no public prices or genuine reviews. Never fabricate offers/ratings.
  };
}

export function informationPage(type: "AboutPage" | "WebPage", name: string, description: string, path: string) {
  const url = absoluteUrl(path);
  if (!url) return null;
  return [
    { "@context": "https://schema.org", "@type": type, "@id": `${url}#webpage`, url, name, description,
      inLanguage: siteConfig.language, isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
      publisher: { "@id": `${siteConfig.siteUrl}/#organization` } },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name, item: url },
    ] },
  ];
}
