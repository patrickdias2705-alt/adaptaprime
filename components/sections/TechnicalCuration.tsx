import { Reveal } from "@/components/motion/Reveal";
import { CompatibilityAxis } from "@/components/ui/CompatibilityAxis";

export function TechnicalCuration() {
  return (
    <section className="section curation-section" aria-labelledby="curation-title">
      <div className="shell curation-section__grid">
        <Reveal>
          <p className="eyebrow eyebrow--light">Curadoria técnica</p>
          <h2 id="curation-title" className="display-title display-title--light">
            Compatibilidade vem<br />antes da escolha.
          </h2>
        </Reveal>

        <div className="curation-section__axis"><CompatibilityAxis label="PONTO DE CONEXÃO" /></div>

        <Reveal className="curation-section__copy" direction="left">
          <p>
            Aplicação clínica, conexão e objetivo protético precisam conversar entre si.
            Por isso, a seleção correta começa pelo entendimento da necessidade.
          </p>
          <strong>Menos improviso.<br />Mais segurança na escolha.</strong>
        </Reveal>
      </div>
    </section>
  );
}

