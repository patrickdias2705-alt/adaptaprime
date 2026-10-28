import type { Metadata, Viewport } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : undefined,
  title: {
    default: "Distribuidora de Produtos Odontológicos | Adapta Prime",
    template: "%s | Adapta Prime",
  },
  description: siteConfig.description,
  applicationName: "Adapta Prime",
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "Odontologia",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  alternates: siteConfig.siteUrl ? { canonical: siteConfig.siteUrl } : undefined,
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "500x500" }],
    shortcut: "/favicon.png",
    apple: [{ url: "/brand/adapta-prime-symbol-mobile.png", sizes: "500x500", type: "image/png" }],
  },
  openGraph: {
    title: "Adapta Prime | Precisão para a rotina clínica",
    description: siteConfig.description,
    locale: siteConfig.locale,
    type: "website",
    siteName: "Adapta Prime",
    url: siteConfig.siteUrl || undefined,
    images: siteConfig.siteUrl
      ? [{ url: absoluteUrl(siteConfig.ogImage), width: 1729, height: 910, alt: "Adapta Prime — Precisão para a rotina clínica" }]
      : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: "Adapta Prime | Precisão para a rotina clínica",
    description: siteConfig.description,
    images: siteConfig.siteUrl ? [absoluteUrl(siteConfig.ogImage)] : undefined,
  },
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
  verification: siteConfig.googleSiteVerification
    ? { google: siteConfig.googleSiteVerification }
    : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0C10",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preload" href="/fonts/inter-variable-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
