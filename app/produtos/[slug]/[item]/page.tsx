import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductVisual } from "@/components/catalog/ProductVisual";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StructuredData } from "@/components/ui/StructuredData";
import { createPageMetadata } from "@/lib/metadata";
import { getProduct } from "@/lib/products";
import { getSalesItem, salesItemPath, salesItems } from "@/lib/sales-items";
import { getWhatsAppUrl, siteConfig } from "@/lib/site-config";
import { salesItemEntity } from "@/lib/structured-data";

type ItemPageProps = { params: Promise<{ slug: string; item: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return salesItems.map((item) => ({ slug: item.productSlug, item: item.slug }));
}

const priceFormat = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const { slug, item: itemSlug } = await params;
  const item = getSalesItem(slug, itemSlug);
  if (!item) return {};
  return createPageMetadata(item.title, item.summary, salesItemPath(item), item.image);
}

export default async function SalesItemPage({ params }: ItemPageProps) {
  const { slug, item: itemSlug } = await params;
  const item = getSalesItem(slug, itemSlug);
  const product = getProduct(slug);
  if (!item || !product) notFound();

  const inStock = item.availability === "in_stock";

  return (
    <>
      {siteConfig.siteUrl ? <StructuredData data={[salesItemEntity(item)]} /> : null}
      <section className="product-detail">
        <div className="shell product-detail__breadcrumb" aria-label="Navegação estrutural">
          <Link href="/">Início</Link><span>/</span><Link href="/produtos">Produtos</Link><span>/</span><Link href={`/produtos/${product.slug}`}>{product.name}</Link><span>/</span><span>{item.title}</span>
        </div>
        <div className="shell product-detail__grid">
          <ProductVisual product={product} />
          <div className="product-detail__copy">
            <p className="eyebrow eyebrow--light">{product.category}</p>
            <h1>{item.title}</h1>
            <p>{item.summary}</p>
            <div className="product-offer">
              <strong className="product-offer__price">{priceFormat.format(item.priceBRL)}</strong>
              <span className="product-offer__unit">por unidade · frete à parte</span>
              <span className={`product-offer__stock${inStock ? "" : " product-offer__stock--out"}`}>
                {inStock ? "Em estoque" : "Sem estoque no momento"}
              </span>
              <dl className="product-offer__facts">
                <div><dt>Marca</dt><dd>{item.brand}</dd></div>
                {item.mpn ? <div><dt>Código</dt><dd>{item.mpn}</dd></div> : null}
              </dl>
            </div>
            <div className="product-detail__notice">
              <span aria-hidden="true" />
              Confirme indicação, conexão e compatibilidade com nossa equipe antes de fechar o pedido.
            </div>
            <div className="product-detail__actions">
              <ButtonLink
                href={getWhatsAppUrl(inStock ? `quero fazer um pedido de ${item.title}` : `quero saber quando volta o estoque de ${item.title}`)}
                leadSource={`Página de produto > ${product.name}`}
                leadStage="product"
                leadInterest={product.name}
              >
                {inStock ? "Pedir pelo WhatsApp" : "Avisar pelo WhatsApp"}
              </ButtonLink>
              <ButtonLink href={`/produtos/${product.slug}`} variant="secondary">Ver todas as medidas</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
