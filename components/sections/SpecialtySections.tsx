import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function EndodonticsSection() {
  return (
    <section className="section section--ice specialty specialty--endo" aria-labelledby="endo-title">
      <div className="shell specialty__grid">
        <Reveal className="endo-visual" direction="right">
          <div className="endo-visual__type" aria-hidden="true">ENDO</div>
          <div className="endo-visual__calibration" aria-hidden="true">
            <span>Instrumentação</span>
            <i />
            <span>Rotina</span>
          </div>
          <p>Instrumentação endodôntica</p>
          <small>Imagem oficial será incorporada ao catálogo quando disponibilizada.</small>
        </Reveal>

        <Reveal className="specialty__copy" direction="left">
          <p className="eyebrow">Endodontia</p>
          <h2 id="endo-title" className="display-title">Precisão em<br />cada milímetro.</h2>
          <p>
            Instrumentação pensada para uma rotina clínica mais controlada e organizada.
          </p>
          <div className="attribute-line" aria-label="Pontos de atenção">
            <span>Instrumentação</span>
            <span>Organização</span>
            <span>Orientação técnica</span>
          </div>
          <ButtonLink href="/produtos?categoria=endodontia" variant="text">
            Explorar Endodontia
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

export function ComponentsSection() {
  return (
    <section className="section specialty specialty--components" aria-labelledby="components-title">
      <div className="shell specialty__grid specialty__grid--reverse">
        <Reveal className="specialty__copy">
          <p className="eyebrow eyebrow--light">Componentes protéticos</p>
          <h2 id="components-title" className="display-title display-title--light">
            Detalhes que fazem<br />parte do resultado.
          </h2>
          <p>
            Componentes para diferentes conexões e objetivos protéticos. Confirme a
            compatibilidade com nossa equipe.
          </p>
          <ButtonLink href="/produtos?categoria=componentes-proteticos" variant="secondary">
            Conhecer componentes
          </ButtonLink>
        </Reveal>

        <Reveal className="components-visual" direction="left">
          <div className="components-visual__halo" aria-hidden="true" />
          <p className="components-visual__code" aria-hidden="true">CM<br /><span>HE</span></p>
          <div className="components-visual__ledger">
            <span>Conexão</span>
            <span>Objetivo protético</span>
            <span>Compatibilidade</span>
          </div>
          <small>Seleção orientada pela necessidade</small>
        </Reveal>
      </div>
    </section>
  );
}

export function ClinicsSection() {
  return (
    <section className="section section--ice clinics-section" aria-labelledby="clinics-title">
      <div className="shell clinics-section__grid">
        <Reveal className="clinic-environment" direction="right">
          <div className="clinic-environment__frame" aria-hidden="true">
            <strong>B2B</strong>
            <span className="clinic-environment__context">Clínicas · Profissionais</span>
            <span className="clinic-environment__line" />
          </div>
          <p>Ambiente de atuação dos clientes atendidos pela Adapta Prime.</p>
        </Reveal>

        <Reveal className="specialty__copy" direction="left">
          <p className="eyebrow">Atendimento para clínicas</p>
          <h2 id="clinics-title" className="display-title">A qualidade que<br />sua clínica precisa.</h2>
          <p>
            Soluções em Implantodontia, Endodontia e componentes para clínicas que
            valorizam precisão, critério de escolha e confiança na rotina.
          </p>
          <div className="clinics-section__principles">
            <span>Curadoria técnica</span>
            <span>Compatibilidade</span>
            <span>Atendimento próximo</span>
          </div>
          <ButtonLink href="/contato" variant="text">Conversar com a equipe</ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

const regions = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

export function LogisticsSection() {
  return (
    <section className="section logistics-section" aria-labelledby="logistics-title">
      <div className="shell logistics-section__grid">
        <Reveal>
          <p className="eyebrow eyebrow--light">Logística nacional</p>
          <h2 id="logistics-title" className="display-title display-title--light">
            Entrega para<br />todo o Brasil.
          </h2>
          <p>
            Uma operação preparada para atender clínicas em diferentes regiões com
            organização e previsibilidade.
          </p>
          <ButtonLink href="/contato" variant="secondary">Consultar sua região</ButtonLink>
        </Reveal>

        <Reveal className="logistics-network" direction="left">
          <div className="logistics-network__field" aria-hidden="true">
            <span className="route route--one" />
            <span className="route route--two" />
            <span className="route route--three" />
            <strong>BR</strong>
          </div>
          <div className="logistics-network__regions">
            {regions.map((region) => <span key={region}>{region}</span>)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
