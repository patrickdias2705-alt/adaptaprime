import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/site-config";

function HeroWhatsAppCta({ className = "" }: { className?: string }) {
  const origin = "Início > Banner principal";
  const href = getWhatsAppUrl({
    origin,
    interest: "Soluções odontológicas",
    request: "Quero conhecer as opções da Adapta Prime e falar com um especialista.",
  });

  return (
    <Link
      href={href}
      className={`hero-whatsapp-cta ${className}`.trim()}
      aria-label="Falar com especialista pelo WhatsApp"
      target="_blank"
      rel="noreferrer"
      data-whatsapp-cta="true"
      data-lead-stage="discovery"
      data-lead-source={origin}
      data-lead-interest="Soluções odontológicas"
    >
      Falar pelo WhatsApp
    </Link>
  );
}

export function Hero() {
  return (
    <section className="hero-banner" aria-labelledby="hero-title">
      <div className="sr-only">
        <h1 id="hero-title">Precisão para a rotina clínica.</h1>
        <p>
          Soluções em Implantodontia, Endodontia, componentes protéticos e
          instrumentais com qualidade e confiança que se adaptam ao seu dia a
          dia.
        </p>
      </div>

      <div className="hero-banner__mobile-copy">
        <div className="hero-banner__mobile-actions">
          <HeroWhatsAppCta className="hero-banner__mobile-whatsapp" />
        </div>
      </div>

      <HeroWhatsAppCta className="hero-banner__desktop-cta" />

      <div className="hero-banner__media" aria-hidden="true">
        <picture>
          <source
            media="(max-width: 700px)"
            srcSet="/brand/adapta-prime-hero-mobile.webp"
            type="image/webp"
          />
          {/* Native picture prevents desktop and mobile banners from downloading together. */}
          <img
            src="/brand/adapta-prime-hero.webp"
            alt=""
            width="1672"
            height="941"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>
    </section>
  );
}
