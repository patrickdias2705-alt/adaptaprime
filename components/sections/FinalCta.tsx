"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getLeadPageLabel, getWhatsAppUrl } from "@/lib/site-config";

export function FinalCta() {
  const pathname = usePathname();
  const origin = `${getLeadPageLabel(pathname)} > Chamada final`;

  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <div className="final-cta__watermark" aria-hidden="true">
        <Image src="/brand/adapta-prime-logo.webp" alt="" width={700} height={233} sizes="80vw" unoptimized />
      </div>
      <div className="shell final-cta__inner">
        <Reveal>
          <p className="eyebrow eyebrow--light">Orientação comercial</p>
          <h2 id="final-cta-title" className="display-title display-title--light">
            Escolhas técnicas começam<br />com uma boa orientação.
          </h2>
          <p>Fale com nossa equipe e encontre a solução adequada para sua rotina.</p>
          <div className="final-cta__actions">
            <ButtonLink
              href={getWhatsAppUrl({
                origin,
                interest: "Orientação comercial",
                request: "Quero explicar o que procuro e receber orientação da equipe.",
              })}
              leadSource={origin}
              leadStage="discovery"
              leadInterest="Orientação comercial"
            >
              Falar com especialista
            </ButtonLink>
            <ButtonLink href="/produtos" variant="secondary">Escolher uma categoria</ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
