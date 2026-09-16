import Link from "next/link";
import type { Product } from "@/lib/products";
import { getWhatsAppUrl } from "@/lib/site-config";

type ProductCardProps = {
  product: Product;
  origin: string;
};

export function ProductCard({ product, origin }: ProductCardProps) {
  const whatsappHref = getWhatsAppUrl({
    origin: `${origin} > ${product.name}`,
    interest: product.name,
    request: "Quero conhecer melhor este produto e confirmar aplicação e disponibilidade.",
  });
  const external = whatsappHref.startsWith("http");

  return (
    <article className="catalog-card">
      <Link
        href={`/produtos/${product.slug}`}
        className="catalog-card__visual"
        aria-label={`Conhecer ${product.name}`}
      >
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt=""
            width="1672"
            height="941"
            loading="lazy"
            decoding="async"
          />
        ) : null}
        <span className="catalog-card__shade" aria-hidden="true" />
        <span className="catalog-card__category">{product.category}</span>
        {product.model3d ? <small className="catalog-card__3d">3D interativo</small> : null}
      </Link>

      <div className="catalog-card__content">
        <div>
          <h3><Link href={`/produtos/${product.slug}`}>{product.name}</Link></h3>
          <p>{product.description}</p>
          {product.technicalData ? (
            <p className="catalog-card__technical">
              <span>Altura transmucosa</span>
              {product.technicalData.summary}
            </p>
          ) : null}
        </div>
        <div className="catalog-card__actions">
          <Link href={`/produtos/${product.slug}`} className="text-link">
            {product.model3d ? "Ver produto em 3D" : "Conhecer produto"}
            <i aria-hidden="true">↗</i>
          </Link>
          <Link
            href={whatsappHref}
            className="catalog-card__whatsapp"
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            data-whatsapp-cta="true"
            data-lead-stage="product"
            data-lead-source={`${origin} > ${product.name}`}
            data-lead-interest={product.name}
          >
            Falar sobre este produto
          </Link>
        </div>
      </div>
    </article>
  );
}
