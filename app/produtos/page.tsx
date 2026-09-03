import { ProductCatalog } from "@/components/sections/ProductCatalog";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/ui/PageHero";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Catálogo de Produtos Odontológicos",
  "Consulte soluções em Implantodontia, Endodontia, componentes, kits e instrumentais e fale com a equipe Adapta Prime.",
  "/produtos",
);

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="Catálogo institucional"
        title={<>Soluções organizadas.<br />Escolhas mais claras.</>}
        description="Consulte as categorias disponíveis e fale com nossa equipe para orientação comercial. Sem preço, carrinho ou compra online."
      />
      <ProductCatalog initialCategory={categoria} />
      <FinalCta />
    </>
  );
}
