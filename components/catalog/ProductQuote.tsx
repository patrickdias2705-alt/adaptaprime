"use client";

import { useEffect, useRef, useState } from "react";
import { quoteInterest, type Product } from "@/lib/products";
import { getWhatsAppUrl } from "@/lib/site-config";

type ProductQuoteProps = {
  product: Pick<Product, "name" | "technicalData">;
};

type Selection = { group: number; height?: string };

export function ProductQuote({ product }: ProductQuoteProps) {
  const groups = product.technicalData?.groups ?? [];
  const [pick, setPick] = useState<Selection | null>(null);
  const [inlineVisible, setInlineVisible] = useState(false);
  const inlineRef = useRef<HTMLDivElement>(null);
  const group = pick ? groups[pick.group] : undefined;
  const picked = group
    ? [group.connection, pick?.height ? `${pick.height} mm` : group.configuration].join(" · ")
    : "";

  // The fixed bar steps aside while the in-page button is on screen, so only one CTA shows.
  useEffect(() => {
    const inline = inlineRef.current;
    if (!inline) return;
    const observer = new IntersectionObserver(([entry]) => setInlineVisible(entry.isIntersecting));
    observer.observe(inline);
    return () => observer.disconnect();
  }, []);

  function isPicked(groupIndex: number, height?: string) {
    return pick?.group === groupIndex && pick.height === height;
  }

  function cta(source: string, className = "") {
    const href = getWhatsAppUrl(`quero um orçamento de ${quoteInterest(product, group, pick?.height)}`);

    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`whatsapp-cta ${className}`}
        data-whatsapp-cta="true"
        data-lead-source={source}
        data-lead-stage="product"
        data-lead-interest={product.name}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG icon */}
        <img src="/icons/whatsapp.svg" alt="" width="22" height="22" />
        <span>
          Cotar no WhatsApp
          <small>{picked ? `Já vai com a medida: ${picked}` : "Fale direto com o time comercial"}</small>
        </span>
      </a>
    );
  }

  return (
    <>
      {groups.length ? (
        <section className="product-technical" aria-labelledby="product-technical-title">
          <div className="product-technical__heading">
            <div>
              <p>Toque para escolher</p>
              <h2 id="product-technical-title">Medidas disponíveis</h2>
            </div>
            <span>mm</span>
          </div>
          <div className="product-technical__groups">
            {groups.map((item, groupIndex) => (
              <article className="product-technical__group" key={`${item.connection}-${item.configuration}`}>
                <div className="product-technical__label">
                  <strong>{item.connection}</strong>
                  <span>{item.configuration}</span>
                </div>
                {item.heights?.length ? (
                  <ul aria-label={`Alturas disponíveis para ${item.connection}`}>
                    {item.heights.map((height) => (
                      <li key={height}>
                        <button
                          type="button"
                          className="product-technical__pick"
                          aria-pressed={isPicked(groupIndex, height)}
                          aria-label={`${item.connection}, ${item.configuration}, altura ${height} mm`}
                          onClick={() => setPick(isPicked(groupIndex, height) ? null : { group: groupIndex, height })}
                        >
                          <strong>{height}</strong><span>mm</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>
                    {item.note ? <p>{item.note}</p> : null}
                    <button
                      type="button"
                      className="product-technical__pick product-technical__pick--wide"
                      aria-pressed={isPicked(groupIndex)}
                      onClick={() => setPick(isPicked(groupIndex) ? null : { group: groupIndex })}
                    >
                      <strong>Cotar {item.connection}</strong>
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
          <p className="product-technical__note">
            <span aria-hidden="true">i</span>
            Não achou ou ficou em dúvida? Chame assim mesmo: confirmamos medida e disponibilidade antes do envio.
          </p>
        </section>
      ) : null}

      <div className="product-quote">
        <p className="product-quote__status" aria-live="polite">
          {picked ? <>Medida escolhida: <strong>{picked}</strong></> : "Respondemos com cotação, compatibilidade e frete."}
        </p>
        <div ref={inlineRef}>{cta(`Página de produto > ${product.name}`)}</div>
      </div>

      <div className={`product-detail__sticky${inlineVisible ? " is-hidden" : ""}`} inert={inlineVisible}>
        {cta(`Página de produto > ${product.name} > Barra fixa`)}
      </div>
    </>
  );
}
