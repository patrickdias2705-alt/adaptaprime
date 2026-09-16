import type { ReactNode } from "react";

type VisualPageHeroProps = {
  variant: "about" | "products";
  desktopSrc: string;
  mobileSrc: string;
  width: number;
  height: number;
  eyebrow: string;
  title: ReactNode;
  description: string;
};

export function VisualPageHero({
  variant,
  desktopSrc,
  mobileSrc,
  width,
  height,
  eyebrow,
  title,
  description,
}: VisualPageHeroProps) {
  const titleId = `visual-page-hero-${variant}-title`;

  return (
    <section
      className={`visual-page-hero visual-page-hero--${variant}`}
      aria-labelledby={titleId}
    >
      <picture className="visual-page-hero__media">
        <source media="(max-width: 700px)" srcSet={mobileSrc} />
        {/* The picture element selects a dedicated crop before the fallback image loads. */}
        <img
          src={desktopSrc}
          alt=""
          width={width}
          height={height}
          fetchPriority="high"
          decoding="async"
        />
      </picture>

      <div className="visual-page-hero__content shell">
        <p className="eyebrow eyebrow--light">{eyebrow}</p>
        <h1 id={titleId}>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
