import Image from "next/image";
import { ProductPhotoPair } from "@/components/catalog/ProductPhotoPair";
import { ProductModelViewer } from "@/components/ui/ProductModelViewer";
import type { Product } from "@/lib/products";

export function ProductVisual({ product }: { product: Product }) {
  return (
    <div className={`product-detail__visual${product.model3d ? " product-detail__visual--3d" : ""}`}>
      {product.model3d ? (
        <ProductModelViewer
          src={product.model3d}
          name={product.name}
          variant={product.modelVariant}
        />
      ) : product.companionImage ? (
        <ProductPhotoPair product={product} />
      ) : product.image ? (
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 900px) 100vw, 50vw" priority unoptimized />
      ) : (
        <div className="product-detail__typographic" aria-label={`Apresentação tipográfica de ${product.name}`}>
          <span>{product.visualLabel ?? product.category}</span>
          <i aria-hidden="true" />
          <small>Imagem oficial não disponibilizada</small>
        </div>
      )}
    </div>
  );
}
