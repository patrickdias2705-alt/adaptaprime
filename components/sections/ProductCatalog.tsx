"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categories } from "@/lib/categories";
import { products } from "@/lib/products";

export function ProductCatalog({ initialCategory = "todos" }: { initialCategory?: string }) {
  const validInitial = categories.some((category) => category.slug === initialCategory)
    ? initialCategory
    : "todos";
  const [active, setActive] = useState(validInitial);

  const filtered = useMemo(
    () => active === "todos" ? products : products.filter((product) => product.categorySlug === active),
    [active],
  );

  function selectCategory(slug: string) {
    setActive(slug);
    const url = new URL(window.location.href);
    if (slug === "todos") url.searchParams.delete("categoria");
    else url.searchParams.set("categoria", slug);
    window.history.replaceState({}, "", url);
  }

  return (
    <section className="section section--ice catalog-section" aria-labelledby="catalog-title">
      <div className="shell">
        <div className="catalog-toolbar">
          <div>
            <p className="eyebrow">Seleção Adapta Prime</p>
            <h2 id="catalog-title">Explore por categoria</h2>
          </div>
          <div className="catalog-filters" role="group" aria-label="Filtrar produtos por categoria">
            <button
              type="button"
              className={active === "todos" ? "is-active" : ""}
              aria-pressed={active === "todos"}
              onClick={() => selectCategory("todos")}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                type="button"
                className={active === category.slug ? "is-active" : ""}
                aria-pressed={active === category.slug}
                onClick={() => selectCategory(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {filtered.length} {filtered.length === 1 ? "produto exibido" : "produtos exibidos"}.
        </p>

        {filtered.length ? (
          <div className="catalog-grid">
            {filtered.map((product) => (
              <article className="catalog-card" key={product.slug}>
                <Link href={`/produtos/${product.slug}`} className="catalog-card__visual" aria-label={`Ver ${product.name}`}>
                  <span>{product.category}</span>
                  <i aria-hidden="true" />
                </Link>
                <div className="catalog-card__content">
                  <p>{product.category}</p>
                  <h3><Link href={`/produtos/${product.slug}`}>{product.name}</Link></h3>
                  <span>{product.description}</span>
                  <Link href={`/produtos/${product.slug}`} className="text-link">Ver apresentação <i aria-hidden="true">↗</i></Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <h3>Não há itens nesta seleção.</h3>
            <p>Escolha outra categoria ou fale com nossa equipe.</p>
          </div>
        )}
      </div>
    </section>
  );
}
