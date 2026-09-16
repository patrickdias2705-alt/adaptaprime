import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/catalog/ProductCard";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/ui/PageHero";
import { StructuredData } from "@/components/ui/StructuredData";
import { categories } from "@/lib/categories";
import { createPageMetadata } from "@/lib/metadata";
import { products } from "@/lib/products";
import { absoluteUrl, getWhatsAppUrl, siteConfig } from "@/lib/site-config";

type CategoryPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);

  if (!category) return {};

  return createPageMetadata(
    category.seoTitle,
    category.seoDescription,
    `/solucoes/${category.slug}`,
  );
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);

  if (!category) notFound();

  const categoryProducts = products.filter(
    (product) => product.categorySlug === category.slug,
  );
  const relatedCategories = categories.filter(
    (item) => item.slug !== category.slug,
  );
  const categoryWhatsappHref = getWhatsAppUrl({
    origin: `Página de categoria > ${category.name}`,
    interest: category.name,
    request: "Quero conhecer as opções disponíveis nesta categoria.",
  });
  const categoryWhatsappExternal = categoryWhatsappHref.startsWith("http");

  const pageUrl = absoluteUrl(`/solucoes/${category.slug}`);
  const structuredData = siteConfig.siteUrl
    ? [
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${pageUrl}#collection`,
          url: pageUrl,
          name: category.seoTitle,
          description: category.seoDescription,
          inLanguage: siteConfig.language,
          isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
          about: { "@type": "Thing", name: category.name },
          ...(categoryProducts.length
            ? {
                mainEntity: {
                  "@type": "ItemList",
                  itemListElement: categoryProducts.map((product, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: product.name,
                    url: absoluteUrl(`/produtos/${product.slug}`),
                  })),
                },
              }
            : {}),
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
              name: "Soluções",
              item: absoluteUrl("/solucoes"),
            },
            {
              "@type": "ListItem",
              position: 3,
              name: category.name,
              item: pageUrl,
            },
          ],
        },
      ]
    : null;

  return (
    <>
      {structuredData ? <StructuredData data={structuredData} /> : null}
      <PageHero
        eyebrow="Soluções odontológicas"
        title={category.name}
        description={category.seoDescription}
      />

      <section
        className="section section--ice category-landing"
        aria-labelledby="category-overview-title"
      >
        <div className="shell">
          <nav className="category-breadcrumb" aria-label="Navegação estrutural">
            <Link href="/">Início</Link>
            <span aria-hidden="true">/</span>
            <Link href="/solucoes">Soluções</Link>
            <span aria-hidden="true">/</span>
            <span>{category.name}</span>
          </nav>

          <div className="category-landing__intro">
            <div className="category-landing__art">
              <Image
                src={category.image}
                alt={`Soluções em ${category.name}`}
                width={1448}
                height={1086}
                sizes="(max-width: 900px) 100vw, 48vw"
                unoptimized
              />
            </div>
            <div className="category-landing__copy">
              <p className="eyebrow">Atendimento especializado</p>
              <h2 id="category-overview-title">
                Produtos e soluções em {category.name}
              </h2>
              <p>{category.description}</p>
              <ul>
                <li>Orientação comercial para uma escolha mais objetiva.</li>
                <li>Consulta de aplicação, conexão e compatibilidade.</li>
                <li>Atendimento a profissionais e clínicas em todo o Brasil.</li>
              </ul>
            </div>
          </div>

          <div className="category-products" aria-labelledby="category-products-title">
            <div className="category-products__heading">
              <p className="eyebrow">Catálogo institucional</p>
              <h2 id="category-products-title">Explore a seleção disponível</h2>
            </div>

            {categoryProducts.length ? (
              <div className="catalog-grid">
                {categoryProducts.map((product) => (
                  <ProductCard
                    product={product}
                    origin={`Página de categoria > ${category.name}`}
                    key={product.slug}
                  />
                ))}
              </div>
            ) : (
              <div className="catalog-empty">
                <h3>Consulte as opções desta categoria.</h3>
                <p>
                  A equipe Adapta Prime orienta sobre aplicações e disponibilidade
                  conforme a necessidade informada.
                </p>
                <Link
                  href={categoryWhatsappHref}
                  className="text-link"
                  target={categoryWhatsappExternal ? "_blank" : undefined}
                  rel={categoryWhatsappExternal ? "noreferrer" : undefined}
                  data-whatsapp-cta="true"
                  data-lead-stage="category"
                  data-lead-source={`Página de categoria > ${category.name} > Sem item publicado`}
                  data-lead-interest={category.name}
                >
                  Solicitar atendimento <i aria-hidden="true">↗</i>
                </Link>
              </div>
            )}
          </div>

          <nav className="category-related" aria-label="Outras categorias">
            <p>Explore também</p>
            <div>
              {relatedCategories.map((item) => (
                <Link key={item.slug} href={`/solucoes/${item.slug}`}>
                  {item.name} <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
