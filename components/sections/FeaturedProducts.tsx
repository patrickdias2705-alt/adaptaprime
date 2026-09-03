"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { products } from "@/lib/products";
import { getWhatsAppUrl } from "@/lib/site-config";

const featured = products.filter((product) => product.featured);

export function FeaturedProducts() {
  const [activeSlug, setActiveSlug] = useState(featured[0]?.slug ?? "");
  const reduceMotion = useReducedMotion();
  const active = featured.find((product) => product.slug === activeSlug) ?? featured[0];

  if (!active) return null;

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
        <div className="product-stage" aria-live="polite">
          <div className="product-stage__rail" aria-hidden="true"><span /></div>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              className="product-stage__content"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              <p>{active.category}</p>
              <h3>{active.name}</h3>
              <span>{active.description}</span>
              <div className="product-stage__actions">
                <Link href={`/produtos/${active.slug}`}>Ver apresentação <span aria-hidden="true">↗</span></Link>
                <Link href={getWhatsAppUrl(`Olá, quero falar sobre ${active.name}.`)}>Consultar disponibilidade</Link>
              </div>
            </motion.div>
          </AnimatePresence>
          <p className="product-stage__asset-note">Apresentação visual sem imagem fictícia de produto</p>
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
