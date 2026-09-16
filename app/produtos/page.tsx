import { ProductCatalog } from "@/components/sections/ProductCatalog";
import { FinalCta } from "@/components/sections/FinalCta";
import { VisualPageHero } from "@/components/ui/VisualPageHero";
import { StructuredData } from "@/components/ui/StructuredData";
import { createPageMetadata } from "@/lib/metadata";
import { products } from "@/lib/products";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const metadata = createPageMetadata(
  "Catálogo de Produtos Odontológicos",
  "Consulte soluções em Implantodontia, Endodontia, componentes, kits e instrumentais e fale com a equipe Adapta Prime.",
  "/produtos",
);

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  const structuredData = siteConfig.siteUrl
    ? [
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${absoluteUrl("/produtos")}#catalog`,
          url: absoluteUrl("/produtos"),
          name: "Catálogo de Produtos Odontológicos Adapta Prime",
          description:
            "Catálogo institucional de soluções odontológicas para profissionais e clínicas.",
          inLanguage: siteConfig.language,
          isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: products.map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: product.name,
              url: absoluteUrl(`/produtos/${product.slug}`),
            })),
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Início",
              item: siteConfig.siteUrl,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Produtos",
              item: absoluteUrl("/produtos"),
            },
          ],
        },
      ]
    : null;

  return (
    <>
      {structuredData ? <StructuredData data={structuredData} /> : null}
      <VisualPageHero
        variant="products"
        desktopSrc="/sections/produtos-hero.webp"
        mobileSrc="/sections/produtos-hero-mobile.webp"
        width={1672}
        height={941}
        eyebrow="Produtos"
        title={<>Componentes e soluções para a <span>rotina clínica.</span></>}
        description="Escolha uma categoria para conhecer as opções e iniciar uma conversa já direcionada com nossa equipe."
      />
      <ProductCatalog initialCategory={categoria} />
      <FinalCta />
    </>
  );
}
