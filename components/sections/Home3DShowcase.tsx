"use client";

import Link from "next/link";
import { type KeyboardEvent, useState } from "react";
import { ProductModelViewer } from "@/components/ui/ProductModelViewer";

const showcaseItems = [
  {
    id: "mini-pilar-reto",
    name: "Mini Pilar Reto",
    category: "Componentes protéticos",
    description:
      "Observe conexão, perfil e acabamento do componente por todos os ângulos.",
    model: "/models/mini-pilar-reto-fast.glb",
    variant: "reto" as const,
    href: "/solucoes/componentes-proteticos",
  },
  {
    id: "mini-pilar-angulado",
    name: "Mini Pilar Angulado",
    category: "Componentes protéticos",
    description:
      "Gire o modelo para compreender a angulação e visualizar sua geometria.",
    model: "/models/mini-pilar-angulado-fast.glb",
    variant: "angulado" as const,
    href: "/produtos/mini-pilar-angulado",
  },
  {
    id: "limas-rotatorias",
    name: "Limas Rotatórias",
    category: "Endodontia",
    description:
      "Aproxime e examine o desenho helicoidal da lima em uma visualização completa.",
    model: "/models/limas-meshy-compatible.glb",
    variant: "limas" as const,
    href: "/produtos/limas-rotatorias",
  },
];

export function Home3DShowcase() {
  const [activeId, setActiveId] = useState(showcaseItems[0].id);
  const active = showcaseItems.find((item) => item.id === activeId) ?? showcaseItems[0];

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown"
      ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? -1
        : 0;

    if (!direction) return;
    event.preventDefault();
    const nextIndex = (index + direction + showcaseItems.length) % showcaseItems.length;
    const nextItem = showcaseItems[nextIndex];
    setActiveId(nextItem.id);
    window.requestAnimationFrame(() => {
      document.getElementById(`showroom-tab-${nextItem.id}`)?.focus();
    });
  }

  return (
    <section
      id="showroom-3d"
      className="home-3d-showcase"
      aria-labelledby="home-3d-title"
    >
      <header className="home-3d-showcase__heading">
        <div>
          <p className="eyebrow eyebrow--light">Showroom técnico interativo</p>
          <h2 id="home-3d-title">Veja cada detalhe antes de escolher.</h2>
        </div>
        <p>
          Selecione uma solução, arraste para girar e aproxime para conhecer sua
          geometria diretamente na página inicial.
        </p>
      </header>

      <div className="home-3d-showcase__workspace">
        <div
          id="showroom-panel"
          className="home-3d-showcase__stage"
          role="tabpanel"
          aria-labelledby={`showroom-tab-${active.id}`}
        >
          <ProductModelViewer
            key={active.id}
            src={active.model}
            name={active.name}
            variant={active.variant}
          />
        </div>

        <div className="home-3d-showcase__console">
          <div className="home-3d-showcase__tabs" role="tablist" aria-label="Escolha um modelo 3D">
            {showcaseItems.map((item, index) => (
              <button
                key={item.id}
                id={`showroom-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={item.id === active.id}
                aria-controls="showroom-panel"
                tabIndex={item.id === active.id ? 0 : -1}
                onClick={() => setActiveId(item.id)}
                onKeyDown={(event) => handleTabKey(event, index)}
              >
                <span>{item.category}</span>
                <strong>{item.name}</strong>
                <i aria-hidden="true">↗</i>
              </button>
            ))}
          </div>

          <div className="home-3d-showcase__active" aria-live="polite">
            <span>Em visualização</span>
            <h3>{active.name}</h3>
            <p>{active.description}</p>
            <Link href={active.href}>
              Ver detalhes da solução <i aria-hidden="true">↗</i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
