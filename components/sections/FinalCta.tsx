import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getWhatsAppUrl } from "@/lib/site-config";

export function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <div className="final-cta__watermark" aria-hidden="true">
        <Image src="/brand/adapta-prime-logo.png" alt="" width={2172} height={724} sizes="80vw" unoptimized />
      </div>
      <div className="shell final-cta__inner">
        <Reveal>
          <p className="eyebrow eyebrow--light">Orientação comercial</p>
          <h2 id="final-cta-title" className="display-title display-title--light">
            Escolhas técnicas começam<br />com uma boa orientação.
          </h2>
          <p>Fale com nossa equipe e encontre a solução adequada para sua rotina.</p>
          <div className="final-cta__actions">
            <ButtonLink href={getWhatsAppUrl("Olá, quero orientação sobre as soluções da Adapta Prime.")}>
              Falar com especialista
            </ButtonLink>
            <ButtonLink href="/contato" variant="secondary">Entrar em contato</ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
