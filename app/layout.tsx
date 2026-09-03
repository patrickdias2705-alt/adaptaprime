import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { Header } from "@/components/layout/Header";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : undefined,
  title: {
    default: "Adapta Prime | Implantodontia, Endodontia e Componentes Odontológicos",
    template: "%s | Adapta Prime",
  },
  description: siteConfig.description,
  applicationName: "Adapta Prime",
  alternates: siteConfig.siteUrl ? { canonical: siteConfig.siteUrl } : undefined,
  icons: {
    icon: "/brand/adapta-prime-logo.png",
    shortcut: "/brand/adapta-prime-logo.png",
    apple: "/brand/adapta-prime-logo.png",
  },
  openGraph: {
    title: "Adapta Prime | Precisão para a rotina clínica",
    description: siteConfig.description,
    locale: "pt_BR",
    type: "website",
    siteName: "Adapta Prime",
    url: siteConfig.siteUrl || undefined,
    images: siteConfig.siteUrl
      ? [{ url: absoluteUrl("/og.png"), width: 1729, height: 910, alt: "Adapta Prime — Precisão para a rotina clínica" }]
      : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: "Adapta Prime | Precisão para a rotina clínica",
    description: siteConfig.description,
    images: siteConfig.siteUrl ? [absoluteUrl("/og.png")] : undefined,
  },
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
        <Header />
        <main id="conteudo-principal">{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
