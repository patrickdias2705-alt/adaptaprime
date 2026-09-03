import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/ui/PageHero";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata(
  "Sobre a Adapta Prime",
  "Conheça o posicionamento da Adapta Prime e sua atuação em soluções para profissionais e clínicas odontológicas.",
  "/sobre",
);

const method = [
  ["Entender", "A necessidade, o contexto e o objetivo informado."],
  ["Verificar", "A conexão e os pontos de compatibilidade relevantes."],
  ["Orientar", "As categorias e soluções disponíveis para consulta."],
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Sobre a Adapta Prime"
        title={<>Precisão que acompanha<br />a rotina clínica.</>}
        description="Uma distribuidora técnica, criteriosa e próxima de profissionais que valorizam escolhas bem orientadas."
      />
      <section className="section section--ice about-page" aria-labelledby="about-manifesto-title">
        <div className="shell about-page__grid">
          <div>
            <p className="eyebrow">Nosso foco</p>
            <h2 id="about-manifesto-title" className="display-title">Seleção técnica.<br />Atendimento próximo.</h2>
          </div>
          <div className="about-page__manifesto">
            <p>A Adapta Prime atua com soluções para Implantodontia, Endodontia e componentes, oferecendo seleção técnica e atendimento próximo para profissionais e clínicas.</p>
            <p>Nosso foco está em facilitar escolhas, organizar rotinas e conectar profissionais às soluções adequadas para cada necessidade.</p>
          </div>
        </div>
        <div className="shell about-method">
          {method.map(([title, copy]) => (
            <article key={title}><strong>{title}</strong><p>{copy}</p></article>
          ))}
        </div>
      </section>
      <FinalCta />
    </>
  );
}

