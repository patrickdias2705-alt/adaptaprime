import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/ButtonLink";
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
  return createPageMetadata(product.name, product.description, `/produtos/${product.slug}`);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const productSchema = siteConfig.siteUrl
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        category: product.category,
        description: product.description,
        url: absoluteUrl(`/produtos/${product.slug}`),
        ...(product.image ? { image: absoluteUrl(product.image) } : {}),
      }
    : null;

  return (
    <>
      {productSchema ? <StructuredData data={productSchema} /> : null}
      <section className="product-detail">
        <div className="shell product-detail__breadcrumb" aria-label="Navegação estrutural">
          <Link href="/">Início</Link><span>/</span><Link href="/produtos">Produtos</Link><span>/</span><span>{product.name}</span>
        </div>
        <div className="shell product-detail__grid">
          <div className="product-detail__visual">
            {product.image ? (
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
            {product.characteristics?.length ? (
              <div className="product-detail__list"><h2>Características disponíveis</h2><ul>{product.characteristics.map((item) => <li key={item}>{item}</li>)}</ul></div>
            ) : null}
            {product.applications?.length ? (
              <div className="product-detail__list"><h2>Aplicações</h2><ul>{product.applications.map((item) => <li key={item}>{item}</li>)}</ul></div>
            ) : null}
            <div className="product-detail__actions">
              <ButtonLink href={getWhatsAppUrl(`Olá, quero falar sobre ${product.name}.`)}>Falar com especialista</ButtonLink>
              <ButtonLink href="/produtos" variant="secondary">Voltar ao catálogo</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
