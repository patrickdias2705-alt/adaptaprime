import type { Product } from "@/lib/products";

export function ProductPhotoPair({ product }: { product: Product }) {
  return (
    <div className="product-photo-pair">
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt="T-Base cone morse 11,5°" width={550} height={550} />
        <figcaption>T-Base cone morse 11,5°</figcaption>
      </figure>
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.companionImage} alt="Parafuso do T-Base cone morse" width={570} height={427} />
        <figcaption>Parafuso do T-Base</figcaption>
      </figure>
    </div>
  );
}
