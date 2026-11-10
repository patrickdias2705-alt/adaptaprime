import type { Metadata } from "next";
import Link from "next/link";
import { ProductQuote } from "@/components/catalog/ProductQuote";
import { ProductVisual } from "@/components/catalog/ProductVisual";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/ui/StructuredData";
import { createPageMetadata } from "@/lib/metadata";
import { getProduct, products } from "@/lib/products";
import { salesItemPath, salesItemsOf } from "@/lib/sales-items";
import { productEntity } from "@/lib/structured-data";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
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
            {product.compatibility?.length ? (
              <div className="product-compat">
                <span>Compatível com</span>
                <ul>{product.compatibility.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ) : null}
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
            {product.characteristics?.length ? (
              <div className="product-detail__list"><h2>Características disponíveis</h2><ul>{product.characteristics.map((item) => <li key={item}>{item}</li>)}</ul></div>
            ) : null}
            {product.applications?.length ? (
              <div className="product-detail__list"><h2>Aplicações</h2><ul>{product.applications.map((item) => <li key={item}>{item}</li>)}</ul></div>
            ) : null}
            {items.length ? (
              <div className="product-detail__list"><h2>Pedir por medida</h2><ul>{items.map((item) => <li key={item.id}><Link href={salesItemPath(item)}>{item.title}</Link></li>)}</ul></div>
            ) : null}
            <ProductQuote product={product} request={whatsappRequest} />
          </div>
        </div>
      </section>
    </>
  );
}
