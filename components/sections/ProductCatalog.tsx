"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { categories } from "@/lib/categories";
import { products } from "@/lib/products";
import { getWhatsAppUrl } from "@/lib/site-config";

export function ProductCatalog({ initialCategory = "todos" }: { initialCategory?: string }) {
  const validInitial = categories.some((category) => category.slug === initialCategory)
    ? initialCategory
    : "todos";
  const [active, setActive] = useState(validInitial);

  const filtered = useMemo(
    () => active === "todos" ? products : products.filter((product) => product.categorySlug === active),
    [active],
  );
  const selectedCategory = categories.find((category) => category.slug === active);
  const selectedLabel = selectedCategory?.name ?? "Ajuda para escolher";
  const selectionOrigin = selectedCategory
    ? `Catálogo de produtos > Categoria ${selectedCategory.name}`
    : "Catálogo de produtos > Ajuda para escolher";
  const whatsappHref = getWhatsAppUrl({
    origin: selectionOrigin,
    interest: selectedCategory?.name,
    request: selectedCategory
      ? `Quero conhecer as opções de ${selectedCategory.name} e entender qual atende melhor à minha necessidade.`
      : "Ainda não sei qual categoria escolher e quero orientação da equipe.",
  });
  const whatsappExternal = whatsappHref.startsWith("http");

  function selectCategory(slug: string) {
    setActive(slug);
    const url = new URL(window.location.href);
    if (slug === "todos") url.searchParams.delete("categoria");
    else url.searchParams.set("categoria", slug);
    window.history.replaceState({}, "", url);
  }

  return (
    <section className="section catalog-section" aria-labelledby="catalog-title">
      <div className="shell">
        <div className="catalog-toolbar">
          <div>
            <p className="eyebrow eyebrow--light">Primeiro passo</p>
            <h2 id="catalog-title">O que você procura?</h2>
            <p>Escolha uma área para organizar os produtos e preparar uma conversa mais objetiva.</p>
          </div>
          <p className="catalog-toolbar__note"><span>01</span> Selecione a categoria<br /><span>02</span> Escolha conversar ou explorar</p>
        </div>

        <div className="catalog-category-grid" role="group" aria-label="Escolher categoria de interesse">
          <button
            type="button"
            className={`catalog-category-card catalog-category-card--guidance${active === "todos" ? " is-active" : ""}`}
            aria-pressed={active === "todos"}
            onClick={() => selectCategory("todos")}
          >
            <span>Não sabe por onde começar?</span>
            <strong>Quero ajuda para escolher</strong>
            <small>A equipe organiza a conversa a partir da sua necessidade.</small>
            <i aria-hidden="true" />
          </button>

          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              className={`catalog-category-card${active === category.slug ? " is-active" : ""}`}
              aria-pressed={active === category.slug}
              onClick={() => selectCategory(category.slug)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={category.image} alt="" width="1448" height="1086" loading="lazy" decoding="async" />
              <span className="catalog-category-card__shade" aria-hidden="true" />
              <span>{category.code}</span>
              <strong>{category.name}</strong>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="catalog-conversation" aria-live="polite">
          <div>
            <p>Interesse selecionado</p>
            <h3>{selectedLabel}</h3>
            <span>{selectedCategory?.description ?? "Conte sua necessidade e a equipe ajuda a localizar o caminho mais adequado."}</span>
          </div>
          <div className="catalog-conversation__action">
            <Link
              href={whatsappHref}
              target={whatsappExternal ? "_blank" : undefined}
              rel={whatsappExternal ? "noreferrer" : undefined}
              data-whatsapp-cta="true"
              data-lead-stage="category"
              data-lead-source={selectionOrigin}
              data-lead-interest={selectedCategory?.name ?? "Orientação inicial"}
            >
              {selectedCategory ? `Conhecer ${selectedCategory.name}` : "Receber orientação"}
              <span aria-hidden="true">↗</span>
            </Link>
            <small>A mensagem já leva sua escolha e a origem do contato.</small>
          </div>
        </div>

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {filtered.length} {filtered.length === 1 ? "produto exibido" : "produtos exibidos"}.
        </p>

        <div className="catalog-results-heading">
          <p className="eyebrow eyebrow--light">Seleção relacionada</p>
          <h2>{selectedCategory ? `Produtos de ${selectedCategory.name}` : "Produtos em destaque"}</h2>
          <span>{filtered.length ? `${filtered.length} ${filtered.length === 1 ? "opção disponível" : "opções disponíveis"}` : "Converse com a equipe para conhecer as opções"}</span>
        </div>

        {filtered.length ? (
          <div className="catalog-grid">
            {filtered.map((product) => (
              <ProductCard product={product} origin={selectionOrigin} key={product.slug} />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <div>
              <p className="eyebrow eyebrow--light">Atendimento orientado</p>
              <h3>Vamos localizar a opção certa com você.</h3>
              <p>Essa categoria é atendida por consulta. Envie seu interesse e a equipe continua a conversa já com o contexto desta página.</p>
            </div>
            <Link
              href={whatsappHref}
              target={whatsappExternal ? "_blank" : undefined}
              rel={whatsappExternal ? "noreferrer" : undefined}
              data-whatsapp-cta="true"
              data-lead-stage="category"
              data-lead-source={`${selectionOrigin} > Sem item publicado`}
              data-lead-interest={selectedCategory?.name}
            >
              Consultar esta categoria <span aria-hidden="true">↗</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
