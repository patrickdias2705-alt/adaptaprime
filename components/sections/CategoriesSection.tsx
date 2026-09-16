import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Home3DShowcase } from "@/components/sections/Home3DShowcase";
import { BrandLogo3D } from "@/components/ui/BrandLogo3D";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import { categories } from "@/lib/categories";

export function CategoriesSection() {
  return (
    <section
      id="solucoes"
      className="section section--ice categories-section"
      aria-labelledby="solutions-title"
    >
      <Reveal>
        <ImageStreamHero
          images={[]}
          cards={10}
          speed={24}
          axis={55}
          path={{
            cardWidth: 26,
            cardHeight: 10,
            cardRadius: 0.25,
            birthHeight: 1.8,
            exitHeight: 22,
            railBirth: -10,
            railExit: 46,
            fan: 3.3,
            turnBirth: 4,
            turnExit: 24,
          }}
          className="solutions-logo-stream"
        >
          <BrandLogo3D
            className="solutions-logo-stream__brand-3d"
            loading="eager"
          />
          <div className="solutions-logo-stream__content">
            <div>
              <p className="eyebrow eyebrow--light">
                Soluções para sua prática
              </p>
              <h2 id="solutions-title">
                Explore nossas
                <br />
                <span>principais soluções.</span>
              </h2>
            </div>
            <p>
              Categorias organizadas para facilitar uma conversa técnica
              mais objetiva.
            </p>
          </div>
        </ImageStreamHero>
      </Reveal>

      <div className="shell categories-section__content">
        <Home3DShowcase />

        <div className="categories-grid">
          {categories.map((category, index) => (
            <Reveal key={category.slug} delay={index * 0.05}>
              <Link
                href={`/solucoes/${category.slug}`}
                className="category-panel"
                aria-label={`Ver produtos de ${category.name}`}
              >
                {/* The supplied artwork already contains the complete card copy. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.image}
                  alt={`Soluções odontológicas em ${category.name}`}
                  width="1448"
                  height="1086"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
