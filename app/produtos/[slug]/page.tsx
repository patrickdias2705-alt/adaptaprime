import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProductModelViewer } from "@/components/ui/ProductModelViewer";
import { StructuredData } from "@/components/ui/StructuredData";
import { createPageMetadata } from "@/lib/metadata";
import { getProduct, products } from "@/lib/products";
import { absoluteUrl, getWhatsAppUrl, siteConfig } from "@/lib/site-config";

type ProductPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return createPageMetadata(
    `${product.name} — ${product.category}`,
    `${product.description} Consulte disponibilidade com a equipe Adapta Prime.`,
    `/produtos/${product.slug}`,
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const productUrl = absoluteUrl(`/produtos/${product.slug}`);
  const productSchema = siteConfig.siteUrl
    ? [
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${productUrl}#webpage`,
          url: productUrl,
          name: product.name,
          description: product.description,
          inLanguage: siteConfig.language,
          isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
          about: {
            "@type": "Thing",
            name: product.category,
          },
          ...(product.image ? { primaryImageOfPage: absoluteUrl(product.image) } : {}),
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
            {
              "@type": "ListItem",
              position: 3,
              name: product.category,
              item: absoluteUrl(`/solucoes/${product.categorySlug}`),
            },
            {
              "@type": "ListItem",
              position: 4,
              name: product.name,
              item: productUrl,
            },
          ],
        },
      ]
    : null;

  return (
    <>
      {productSchema ? <StructuredData data={productSchema} /> : null}
      <section className="product-detail">
        <div className="shell product-detail__breadcrumb" aria-label="Navegação estrutural">
          <Link href="/">Início</Link><span>/</span><Link href="/produtos">Produtos</Link><span>/</span><Link href={`/solucoes/${product.categorySlug}`}>{product.category}</Link><span>/</span><span>{product.name}</span>
        </div>
        <div className="shell product-detail__grid">
          <div className={`product-detail__visual${product.model3d ? " product-detail__visual--3d" : ""}`}>
            {product.model3d ? (
              <ProductModelViewer
                src={product.model3d}
                name={product.name}
                variant={product.modelVariant}
              />
            ) : product.image ? (
              <Image src={product.image} alt={product.name} fill sizes="(max-width: 900px) 100vw, 50vw" priority unoptimized />
            ) : (
              <div className="product-detail__typographic" aria-label={`Apresentação tipográfica de ${product.name}`}>
                <span>{product.category}</span>
                <i aria-hidden="true" />
                <small>Imagem oficial não disponibilizada</small>
              </div>
            )}
          </div>

          <div className="product-detail__copy">
            <p className="eyebrow eyebrow--light">{product.category}</p>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <div className="product-detail__notice">
              <span aria-hidden="true" />
              Confirme indicação, conexão e compatibilidade com nossa equipe.
            </div>
            {product.technicalData ? (
              <section className="product-technical" aria-labelledby="product-technical-title">
                <div className="product-technical__heading">
                  <div>
                    <p>Leitura técnica</p>
                    <h2 id="product-technical-title">Altura gengival / transmucosa</h2>
                  </div>
                  <span>mm</span>
                </div>
                <p className="product-technical__intro">
                  O valor identifica a altura declarada para cada combinação de conexão, plataforma e angulação.
                </p>
                <div className="product-technical__groups">
                  {product.technicalData.groups.map((group) => (
                    <article className="product-technical__group" key={`${group.connection}-${group.configuration}`}>
                      <div className="product-technical__label">
                        <strong>{group.connection}</strong>
                        <span>{group.configuration}</span>
                      </div>
                      {group.heights?.length ? (
                        <ul aria-label={`Alturas disponíveis para ${group.connection}`}>
                          {group.heights.map((height) => (
                            <li key={height}><strong>{height}</strong><span>mm</span></li>
                          ))}
                        </ul>
                      ) : null}
                      {group.note ? <p>{group.note}</p> : null}
                    </article>
                  ))}
                </div>
                <p className="product-technical__note">
                  <span aria-hidden="true">i</span>
                  {product.technicalData.note} Medidas organizadas a partir de documentação técnica oficial de referência; confirme disponibilidade comercial com a Adapta Prime.
                </p>
              </section>
            ) : null}
            {product.characteristics?.length ? (
              <div className="product-detail__list"><h2>Características disponíveis</h2><ul>{product.characteristics.map((item) => <li key={item}>{item}</li>)}</ul></div>
            ) : null}
            {product.applications?.length ? (
              <div className="product-detail__list"><h2>Aplicações</h2><ul>{product.applications.map((item) => <li key={item}>{item}</li>)}</ul></div>
            ) : null}
            <div className="product-detail__actions">
              <ButtonLink
                href={getWhatsAppUrl({
                  origin: `Página de produto > ${product.name}`,
                  interest: product.name,
                  request: product.technicalData
                    ? "Quero confirmar conexão, altura transmucosa, aplicação e disponibilidade deste produto."
                    : "Quero confirmar aplicação, compatibilidade e disponibilidade deste produto.",
                })}
                leadSource={`Página de produto > ${product.name}`}
                leadStage="product"
                leadInterest={product.name}
              >
                Falar sobre este produto
              </ButtonLink>
              <ButtonLink href="/produtos" variant="secondary">Voltar ao catálogo</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
