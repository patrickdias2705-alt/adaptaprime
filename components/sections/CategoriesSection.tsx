import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { categories } from "@/lib/categories";

export function CategoriesSection() {
  return (
    <section id="solucoes" className="section section--ice categories-section">
      <div className="shell">
        <Reveal>
          <SectionIntro
            eyebrow="Soluções para sua prática"
            tone="light"
            title={<>Explore nossas<br />principais soluções.</>}
            body={<p>Categorias organizadas para facilitar uma conversa técnica mais objetiva.</p>}
          />
        </Reveal>

        <div className="categories-grid">
          {categories.map((category, index) => (
            <Reveal key={category.slug} delay={index * 0.05}>
              <Link
                href={`/produtos?categoria=${category.slug}`}
                className={`category-panel category-panel--${category.accent}`}
              >
                <span className="category-panel__visual" aria-hidden="true">
                  <span className="category-panel__code">{category.code}</span>
                  <span className="category-panel__measure" />
                </span>
                <span className="category-panel__content">
                  <strong>{category.name}</strong>
                  <span>{category.description}</span>
                </span>
                <span className="category-panel__arrow" aria-hidden="true">↗</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

