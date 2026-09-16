"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { products } from "@/lib/products";
import { getWhatsAppUrl } from "@/lib/site-config";

const featured = products.filter((product) => product.featured);
const centeredFeaturedSlugs = new Set([
  "limas-rotatorias",
  "implantes-cm-he",
  "t-base-cm-11-5-parafuso-cm",
]);

export function FeaturedProducts() {
  const [activeSlug, setActiveSlug] = useState(featured[0]?.slug ?? "");
  const reduceMotion = useReducedMotion();
  const active = featured.find((product) => product.slug === activeSlug) ?? featured[0];

  if (!active) return null;

  const productOrigin = `Início > Produtos em evidência > ${active.name}`;
  const productWhatsappHref = getWhatsAppUrl({
    origin: productOrigin,
    interest: active.name,
    request: "Quero confirmar aplicação e disponibilidade deste produto.",
  });
  const productWhatsappExternal = productWhatsappHref.startsWith("http");
  const usesCenteredLayout = centeredFeaturedSlugs.has(active.slug);

  return (
    <section className="section products-feature" aria-labelledby="featured-products-title">
      <div className="shell products-feature__heading">
        <p className="eyebrow eyebrow--light">Catálogo institucional</p>
        <h2 id="featured-products-title" className="display-title display-title--light">
          Produtos em<br />evidência.
        </h2>
        <p>Uma visão inicial da seleção Adapta Prime. Consulte nossa equipe para confirmar aplicação e disponibilidade.</p>
      </div>

      <div className="shell products-feature__workspace">
        <div
          className={`product-stage${usesCenteredLayout ? " product-stage--centered" : ""}`}
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              data-product={active.slug}
              className={`product-stage__slide${usesCenteredLayout ? " product-stage__slide--centered" : ""}`}
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.995 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.46, ease: [0.22, 1, 0.36, 1] }}
            >
              {active.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="product-stage__image"
                  src={active.image}
                  alt={`Imagem do produto ${active.name}`}
                  width="1672"
                  height="941"
                  loading="lazy"
                  fetchPriority="low"
                  decoding="async"
                  draggable={false}
                />
              ) : null}
              <div className="product-stage__content">
                <p>{active.category}</p>
                <h3>{active.name}</h3>
                <span>{active.description}</span>
                <div className="product-stage__actions">
                  <Link href={`/produtos/${active.slug}`}>{active.model3d ? "Explorar em 3D" : "Ver apresentação"} <span aria-hidden="true">↗</span></Link>
                  <Link
                    href={productWhatsappHref}
                    target={productWhatsappExternal ? "_blank" : undefined}
                    rel={productWhatsappExternal ? "noreferrer" : undefined}
                    data-whatsapp-cta="true"
                    data-lead-stage="product"
                    data-lead-source={productOrigin}
                    data-lead-interest={active.name}
                  >
                    Consultar disponibilidade
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <p className="product-stage__asset-note">{active.model3d ? "Modelo 3D interativo disponível" : "Apresentação visual do produto"}</p>
        </div>

        <div className="product-ledger" aria-label="Produtos em evidência">
          {featured.map((product) => (
            <button
              key={product.slug}
              type="button"
              aria-pressed={product.slug === active.slug}
              onMouseEnter={() => setActiveSlug(product.slug)}
              onFocus={() => setActiveSlug(product.slug)}
              onClick={() => setActiveSlug(product.slug)}
            >
              <span>{product.category}</span>
              <strong>{product.name}</strong>
              <i aria-hidden="true">↗</i>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
