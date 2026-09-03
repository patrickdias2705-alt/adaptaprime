import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { CompatibilityAxis } from "@/components/ui/CompatibilityAxis";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getWhatsAppUrl } from "@/lib/site-config";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__grain" aria-hidden="true" />
      <div className="shell hero__grid">
        <div className="hero__copy">
          <Reveal direction="none">
            <p className="eyebrow eyebrow--light">Distribuidora especializada</p>
          </Reveal>
          <Reveal delay={0.08} direction="up">
            <h1 id="hero-title" className="hero__title">
              <span className="hero__title-accent">Precisão</span> para a
              <br /> rotina clínica.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="hero__description">
              Soluções em Implantodontia, Endodontia e componentes selecionados
              com critério para profissionais que não abrem mão de precisão.
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="hero__actions">
              <ButtonLink href={getWhatsAppUrl("Olá, quero falar com um especialista da Adapta Prime.")}>
                Falar com especialista
              </ButtonLink>
              <ButtonLink href="#solucoes" variant="secondary">
                Conhecer soluções
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.28}>
            <p className="hero__microcopy">
              <span aria-hidden="true" /> Atendimento técnico especializado
            </p>
          </Reveal>
        </div>

        <div className="hero__axis-wrap">
          <CompatibilityAxis label="CONEXÃO / APLICAÇÃO" />
        </div>

        <Reveal className="hero__brand-stage" direction="left" delay={0.12}>
          <div className="hero__symbol-crop" aria-hidden="true">
            <Image
              src="/brand/adapta-prime-logo.png"
              alt=""
              width={2172}
              height={724}
              priority
              sizes="(max-width: 900px) 92vw, 48vw"
              unoptimized
            />
          </div>
          <div className="hero__stage-meta">
            <p>Seleção orientada por</p>
            <ul>
              <li>Necessidade</li>
              <li>Compatibilidade</li>
              <li>Aplicação</li>
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="shell hero__footer">
        <span>Implantodontia</span>
        <span>Endodontia</span>
        <span>Componentes protéticos</span>
        <span className="hero__scroll-hint">Role para explorar <i aria-hidden="true" /></span>
      </div>
    </section>
  );
}
