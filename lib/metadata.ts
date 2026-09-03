import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "./site-config";

export function createPageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const canonical = siteConfig.siteUrl
    ? new URL(path, siteConfig.siteUrl).toString()
    : undefined;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: `${title} | Adapta Prime`,
      description,
      type: "website",
      locale: "pt_BR",
      url: canonical,
      siteName: "Adapta Prime",
      images: siteConfig.siteUrl
        ? [{ url: absoluteUrl("/og.png"), width: 1729, height: 910, alt: "Adapta Prime — Precisão para a rotina clínica" }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Adapta Prime`,
      description,
      images: siteConfig.siteUrl ? [absoluteUrl("/og.png")] : undefined,
    },
  };
}
