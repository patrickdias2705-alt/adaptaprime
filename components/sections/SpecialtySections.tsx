import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { LogisticsVideo } from "@/components/ui/LogisticsVideo";
import { getWhatsAppUrl } from "@/lib/site-config";

export function EndodonticsSection() {
  return (
    <section className="section section--ice specialty specialty--endo" aria-labelledby="endo-title">
      <div className="shell specialty__grid">
        <Reveal className="endo-visual" direction="right">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sections/endodontia-limas.webp"
            alt="Conjunto de limas endodônticas Adapta Prime"
            width="1448"
            height="1086"
            loading="lazy"
            decoding="async"
          />
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
          <div
            className="components-visual__connections"
            role="list"
            aria-label="Conexões disponíveis: CM, HE, GM e Straumann"
          >
            <span className="components-visual__connection components-visual__connection--cm" role="listitem">CM</span>
            <span className="components-visual__connection components-visual__connection--he" role="listitem">HE</span>
            <span className="components-visual__connection components-visual__connection--gm" role="listitem">GM</span>
            <span className="components-visual__connection components-visual__connection--straumann" role="listitem">Straumann</span>
            <span className="components-visual__core" aria-hidden="true">
              <strong>04</strong>
              <small>conexões</small>
            </span>
          </div>
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
          <div className="clinic-environment__frame">
            {/* Native image keeps this below-the-fold editorial visual lightweight. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sections/clinica-adapta-prime.webp"
              alt="Profissional de odontologia organizando componentes em ambiente clínico"
              width="1448"
              height="1086"
              loading="lazy"
              decoding="async"
            />
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
          <ButtonLink
            href={getWhatsAppUrl({
              origin: "Início > Atendimento para clínicas",
              interest: "Atendimento para clínica",
              request: "Quero conhecer as opções para a rotina da minha clínica.",
            })}
            variant="text"
            leadSource="Início > Atendimento para clínicas"
            leadStage="service"
            leadInterest="Atendimento para clínica"
          >
            Conversar com a equipe
          </ButtonLink>
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
          <ButtonLink
            href={getWhatsAppUrl({
              origin: "Início > Logística nacional",
              interest: "Entrega para minha região",
              request: "Quero confirmar atendimento e entrega para minha cidade.",
            })}
            variant="secondary"
            leadSource="Início > Logística nacional"
            leadStage="service"
            leadInterest="Entrega para minha região"
          >
            Consultar minha região
          </ButtonLink>
        </Reveal>

        <Reveal className="logistics-network" direction="left">
          <div className="logistics-network__field">
            <LogisticsVideo />
          </div>
          <div className="logistics-network__regions">
            {regions.map((region) => <span key={region}>{region}</span>)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
