import { AboutSection, WhySection } from "@/components/sections/WhyAndAbout";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import {
  ClinicsSection,
  ComponentsSection,
  EndodonticsSection,
  LogisticsSection,
} from "@/components/sections/SpecialtySections";
import { TechnicalCuration } from "@/components/sections/TechnicalCuration";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { StructuredData } from "@/components/ui/StructuredData";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export default function Home() {
  const structuredData = siteConfig.siteUrl
    ? [
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${siteConfig.siteUrl}/#organization`,
          name: siteConfig.name,
          url: siteConfig.siteUrl,
          logo: absoluteUrl("/brand/adapta-prime-logo.png"),
          description: siteConfig.description,
          ...(siteConfig.email ? { email: siteConfig.email } : {}),
          ...(siteConfig.whatsapp ? { telephone: siteConfig.whatsapp } : {}),
          ...(siteConfig.instagram ? { sameAs: [siteConfig.instagram] } : {}),
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${siteConfig.siteUrl}/#website`,
          url: siteConfig.siteUrl,
          name: siteConfig.name,
          inLanguage: "pt-BR",
          publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
        },
      ]
    : null;

  return (
    <>
      {structuredData ? <StructuredData data={structuredData} /> : null}
      <Hero />
      <TrustStrip />
      <CategoriesSection />
      <FeaturedProducts />
      <TechnicalCuration />
      <EndodonticsSection />
      <ComponentsSection />
      <ClinicsSection />
      <LogisticsSection />
      <WhySection />
      <AboutSection />
      <FinalCta />
    </>
  );
}

