import type { Metadata } from "next";
import Link from "next/link";
import { ProductVisual } from "@/components/catalog/ProductVisual";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StructuredData } from "@/components/ui/StructuredData";
import { createPageMetadata } from "@/lib/metadata";
import { getProduct, products } from "@/lib/products";
import { salesItemPath, salesItemsOf } from "@/lib/sales-items";
import { productEntity } from "@/lib/structured-data";
import { absoluteUrl, getWhatsAppUrl, siteConfig } from "@/lib/site-config";
import "./product-page.css";

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
    product.image,
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const productUrl = absoluteUrl(`/produtos/${product.slug}`);
  const items = salesItemsOf(product.slug);
  const isMiniPilar = product.slug.startsWith("mini-pilar");
  const whatsappRequest = product.technicalData
    ? "Quero confirmar conexão, altura transmucosa, aplicação e disponibilidade deste produto."
    : "Quero confirmar aplicação, compatibilidade e disponibilidade deste produto.";
  const contactButton = (origin: string) => (
    <ButtonLink
      href={getWhatsAppUrl({ origin, interest: product.name, request: whatsappRequest })}
      leadSource={origin}
      leadStage="product"
      leadInterest={product.name}
    >
      Falar sobre este produto
    </ButtonLink>
  );
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
          mainEntity: { "@id": `${productUrl}#product` },
          ...(product.image ? { primaryImageOfPage: absoluteUrl(product.image) } : {}),
        },
        productEntity(product),
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
        <div className="shell product-detail__grid product-detail__grid--split">
          <div className="product-detail__copy product-detail__intro">
            <p className="eyebrow eyebrow--light">{product.category}</p>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <div className="product-detail__notice">
              <span aria-hidden="true" />
              {isMiniPilar
                ? "Não sabe a medida? Mande sua dúvida no WhatsApp que a gente confirma."
                : "Confirme indicação, conexão e compatibilidade com nossa equipe."}
            </div>
            <ul className="product-detail__assurances">
              <li>Envio para todo o Brasil</li>
              <li>Atendimento técnico pelo WhatsApp</li>
              {isMiniPilar ? <li>Opções compatíveis com implantes Neodent</li> : null}
            </ul>
          </div>

          <ProductVisual product={product} />

          <div className="product-detail__copy product-detail__details">
            {product.technicalData ? (
              <section className="product-technical" aria-labelledby="product-technical-title">
                <div className="product-technical__heading">
                  <div>
                    <h2 id="product-technical-title">Medidas disponíveis</h2>
                  </div>
                  <span>mm</span>
                </div>
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
                  Alturas em mm. Confirmamos medida e disponibilidade antes do envio.
                </p>
              </section>
            ) : null}
            {product.characteristics?.length ? (
              <div className="product-detail__list"><h2>Características disponíveis</h2><ul>{product.characteristics.map((item) => <li key={item}>{item}</li>)}</ul></div>
            ) : null}
            {product.applications?.length ? (
              <div className="product-detail__list"><h2>Aplicações</h2><ul>{product.applications.map((item) => <li key={item}>{item}</li>)}</ul></div>
            ) : null}
            {items.length ? (
              <div className="product-detail__list"><h2>Pedir por medida</h2><ul>{items.map((item) => <li key={item.id}><Link href={salesItemPath(item)}>{item.title}</Link></li>)}</ul></div>
            ) : null}
            <div className="product-detail__actions">
              {contactButton(`Página de produto > ${product.name}`)}
              <ButtonLink href="/produtos" variant="secondary">Voltar ao catálogo</ButtonLink>
            </div>
          </div>
        </div>
      </section>
      <div className="product-detail__sticky">{contactButton(`Página de produto > ${product.name} > Barra fixa`)}</div>
    </>
  );
}
