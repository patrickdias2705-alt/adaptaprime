import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "./site-config";

export function createPageMetadata(
  title: string,
  description: string,
  path: string,
  image?: string,
): Metadata {
  const canonical = siteConfig.siteUrl
    ? new URL(path, siteConfig.siteUrl).toString()
    : undefined;

  return {
    title,
    description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    category: "Odontologia",
    robots: {
      index: siteConfig.indexable,
      follow: siteConfig.indexable,
      googleBot: {
        index: siteConfig.indexable,
        follow: siteConfig.indexable,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: canonical
      ? {
          canonical,
          languages: {
            "pt-BR": canonical,
            "x-default": canonical,
          },
        }
      : undefined,
    openGraph: {
      title: `${title} | Adapta Prime`,
      description,
      type: "website",
      locale: "pt_BR",
      url: canonical,
      siteName: "Adapta Prime",
      images: siteConfig.siteUrl
        ? [image ? { url: absoluteUrl(image), alt: title } : { url: absoluteUrl(siteConfig.ogImage), width: 1729, height: 910, alt: "Adapta Prime — Precisão para a rotina clínica" }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Adapta Prime`,
      description,
      images: siteConfig.siteUrl ? [absoluteUrl(image ?? siteConfig.ogImage)] : undefined,
    },
  };
}
