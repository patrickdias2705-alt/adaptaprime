import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";

const pillars = [
  { name: "Seleção técnica", copy: "Categorias e soluções organizadas com critério." },
  { name: "Atendimento próximo", copy: "Conversa comercial conectada à necessidade." },
  { name: "Soluções completas", copy: "Áreas complementares reunidas em um só catálogo." },
  { name: "Agilidade", copy: "Uma rotina de atendimento clara e objetiva." },
  { name: "Qualidade", copy: "Atenção à origem, à apresentação e à escolha." },
  { name: "Logística nacional", copy: "Atendimento organizado para diferentes regiões." },
];

export function WhySection() {
  return (
    <section id="por-que" className="section section--ice why-section" aria-labelledby="why-title">
      <div className="shell">
        <Reveal className="why-section__heading">
          <p className="eyebrow">Por que Adapta Prime</p>
          <h2 id="why-title" className="display-title">
            Mais critério na escolha.<br />Mais confiança na rotina.
          </h2>
        </Reveal>

        <div className="pillar-ledger">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.name} delay={index * 0.035}>
              <div className="pillar-ledger__item">
                <span aria-hidden="true">—</span>
                <strong>{pillar.name}</strong>
                <p>{pillar.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section className="section section--ice about-section" aria-labelledby="about-title">
      <div className="shell about-section__grid">
        <Reveal>
          <p className="eyebrow">Sobre a marca</p>
          <h2 id="about-title" className="display-title">Precisão que acompanha<br />a rotina clínica.</h2>
        </Reveal>
        <Reveal className="about-section__copy" direction="left">
          <p>
            A Adapta Prime atua com soluções para Implantodontia, Endodontia e
            componentes, oferecendo seleção técnica e atendimento próximo para
            profissionais e clínicas.
          </p>
          <p>
            Nosso foco está em facilitar escolhas, organizar rotinas e conectar
            profissionais às soluções adequadas para cada necessidade.
          </p>
          <ButtonLink href="/sobre" variant="text">Conheça a Adapta Prime</ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
