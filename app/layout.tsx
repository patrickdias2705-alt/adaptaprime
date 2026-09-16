import type { Metadata, Viewport } from "next";
import { LeadClickTracker } from "@/components/analytics/LeadClickTracker";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { Header } from "@/components/layout/Header";
import { LightBackgroundWave } from "@/components/layout/LightBackgroundWave";
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
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/brand/adapta-prime-logo.png",
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
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
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
      <body>
        <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
        <LightBackgroundWave />
        <Header />
        <main id="conteudo-principal">{children}</main>
        <Footer />
        <FloatingContact />
        <LeadClickTracker />
      </body>
    </html>
  );
}
