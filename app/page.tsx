import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { SeoFaq } from "@/components/sections/SeoFaq";
import {
  ClinicsSection,
  ComponentsSection,
  EndodonticsSection,
  LogisticsSection,
} from "@/components/sections/SpecialtySections";
import { StructuredData } from "@/components/ui/StructuredData";
import { categories } from "@/lib/categories";
import { createPageMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const metadata = createPageMetadata(
  "Distribuidora de Produtos Odontológicos",
  "Soluções para Implantodontia, Endodontia, componentes protéticos, kits e instrumentais odontológicos, com atendimento técnico em todo o Brasil.",
  "/",
);

export default function Home() {
  const structuredData = siteConfig.siteUrl
    ? [
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${siteConfig.siteUrl}/#organization`,
          name: siteConfig.name,
          alternateName: siteConfig.alternateName,
          url: siteConfig.siteUrl,
          logo: {
            "@type": "ImageObject",
            url: absoluteUrl("/brand/adapta-prime-symbol-mobile.png"),
            contentUrl: absoluteUrl("/brand/adapta-prime-symbol-mobile.png"),
            width: 500,
            height: 500,
            caption: siteConfig.name,
          },
          description: siteConfig.description,
          areaServed: {
            "@type": "Country",
            name: "Brasil",
          },
          knowsAbout: categories.map((category) => category.name),
          ...(siteConfig.email ? { email: siteConfig.email } : {}),
          ...(siteConfig.whatsapp ? { telephone: siteConfig.whatsapp } : {}),
          contactPoint: {
            "@type": "ContactPoint",
            telephone: `+${siteConfig.whatsapp}`,
            contactType: "customer service",
            availableLanguage: "Portuguese",
            areaServed: "BR",
          },
          ...(siteConfig.instagram ? { sameAs: [siteConfig.instagram] } : {}),
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${siteConfig.siteUrl}/#website`,
          url: siteConfig.siteUrl,
          name: siteConfig.name,
          alternateName: siteConfig.alternateName,
          inLanguage: "pt-BR",
          publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
        },
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Soluções odontológicas Adapta Prime",
          itemListElement: categories.map((category, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: category.name,
            url: absoluteUrl(`/solucoes/${category.slug}`),
          })),
        },
      ]
    : null;

  return (
    <>
      {structuredData ? <StructuredData data={structuredData} /> : null}
      <Hero />
      <CategoriesSection />
      <FeaturedProducts />
      <EndodonticsSection />
      <ComponentsSection />
      <ClinicsSection />
      <LogisticsSection />
      <SeoFaq />
      <FinalCta />
    </>
  );
}
