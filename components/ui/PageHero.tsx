import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  aside?: ReactNode;
};

export function PageHero({ eyebrow, title, description, aside }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="shell page-hero__grid">
        <Reveal className="page-hero__copy" direction="none">
          <p className="eyebrow eyebrow--light">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </Reveal>
        <Reveal className="page-hero__aside" direction="left" delay={0.08}>
          {aside ?? (
            <div className="page-hero__datum" aria-hidden="true">
              <span />
              <i />
              <strong>AP</strong>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

