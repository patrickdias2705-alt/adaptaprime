import { Reveal } from "@/components/motion/Reveal";
import { FinalCta } from "@/components/sections/FinalCta";
import { BrandLogo3D } from "@/components/ui/BrandLogo3D";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { VisualPageHero } from "@/components/ui/VisualPageHero";
import { createPageMetadata } from "@/lib/metadata";
import { getWhatsAppUrl } from "@/lib/site-config";

export const metadata = createPageMetadata(
  "Sobre nós",
  "Conheça o propósito da Adapta Prime: organizar escolhas em Implantodontia, Endodontia, componentes e instrumentais com contexto, clareza e orientação.",
  "/sobre",
);

const principles = [
  {
    title: "Escutar antes de indicar",
    copy: "A conversa começa pelo uso pretendido, pela conexão e pelo cenário informado — não por uma lista pronta de produtos.",
  },
  {
    title: "Organizar o que importa",
    copy: "Categorias, aplicações e alternativas são apresentadas de um jeito que facilita comparar sem sobrecarregar a decisão.",
  },
  {
    title: "Tornar limites visíveis",
    copy: "Compatibilidade, aplicação e disponibilidade entram na conversa antes do próximo passo, onde realmente fazem diferença.",
  },
  {
    title: "Continuar presente",
    copy: "A relação não termina na escolha. Dúvidas, confirmações e novos contextos encontram um canal direto com a equipe.",
  },
];

const method = [
  ["01", "Ler o contexto", "Entender a necessidade, a rotina e o objetivo descrito pelo profissional."],
  ["02", "Cruzar critérios", "Relacionar conexão, aplicação e categoria antes de apresentar possibilidades."],
  ["03", "Indicar o próximo passo", "Organizar uma resposta objetiva: avançar, confirmar um detalhe ou aprofundar a conversa."],
];

export default function AboutPage() {
  return (
    <>
      <VisualPageHero
        variant="about"
        desktopSrc="/sections/sobre-hero.webp"
        mobileSrc="/sections/sobre-hero-mobile.webp"
        width={1536}
        height={1024}
        eyebrow="Sobre nós"
        title={<>Soluções que transformam a <span>rotina clínica.</span></>}
        description="Organizamos soluções para profissionais da odontologia conectando aplicação, precisão e atendimento especializado."
      />

      <section className="section section--ice about-page" aria-labelledby="about-manifesto-title">
        <div className="shell about-page__grid">
          <Reveal>
            <p className="eyebrow">O que nos move</p>
            <h2 id="about-manifesto-title" className="display-title">
              Transformar catálogo<br />em caminho.
            </h2>
          </Reveal>
          <Reveal className="about-page__manifesto" direction="left">
            <p>
              Uma peça não chega sozinha à rotina. Ela encontra um sistema, um
              protocolo, uma preferência profissional e uma necessidade específica.
              Por isso, nosso trabalho começa pela pergunta certa, não pela oferta mais rápida.
            </p>
            <p>
              Reunimos soluções para Implantodontia, Endodontia, componentes protéticos,
              kits e instrumentais com uma ideia simples: tornar a escolha mais compreensível
              e o atendimento mais útil para quem está do outro lado.
            </p>
          </Reveal>
        </div>

        <Reveal className="shell about-brand-orbit">
          <div className="about-brand-orbit__axis" aria-hidden="true" />
          <BrandLogo3D className="about-brand-orbit__model" />
        </Reveal>

        <Reveal className="shell about-purpose">
          <p className="eyebrow">Nosso propósito</p>
          <p className="about-purpose__statement">
            Adaptar não é improvisar. É entender o contexto antes de indicar um caminho.
          </p>
          <p className="about-purpose__support">
            Esse princípio orienta a forma como organizamos o portfólio, conduzimos o
            atendimento e apresentamos cada possibilidade.
          </p>
        </Reveal>

        <div className="shell about-principles">
          <Reveal className="about-principles__heading">
            <p className="eyebrow">Por que Adapta Prime</p>
            <h2 className="display-title">O critério aparece<br />no processo.</h2>
          </Reveal>
          <div className="about-principles__grid">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 0.04}>
                <article>
                  <span aria-hidden="true">0{index + 1}</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="shell about-method-block">
          <Reveal className="about-method-block__heading">
            <p className="eyebrow">Como trabalhamos</p>
            <h2 className="display-title">Sem atalhos entre<br />necessidade e escolha.</h2>
          </Reveal>
          <div className="about-method">
            {method.map(([number, title, copy]) => (
              <article key={title}>
                <span aria-hidden="true">{number}</span>
                <strong>{title}</strong>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-practice" aria-labelledby="about-practice-title">
        <div className="shell about-practice__grid">
          <Reveal>
            <p className="eyebrow eyebrow--light">Na rotina</p>
            <h2 id="about-practice-title" className="display-title display-title--light">
              Para quem precisa<br />decidir com clareza.
            </h2>
          </Reveal>
          <Reveal className="about-practice__copy" direction="left">
            <p>
              Atendemos profissionais e clínicas que transitam por diferentes especialidades
              e precisam localizar rapidamente o que faz sentido para cada situação.
              Nosso papel é reduzir a distância entre uma necessidade descrita e uma solução
              que possa ser avaliada com critério.
            </p>
            <p>
              Isso também significa dizer quando é preciso confirmar uma conexão, revisar
              uma aplicação ou aprofundar a conversa antes de seguir.
            </p>
            <div className="about-practice__actions">
              <ButtonLink href="/solucoes">Explorar soluções</ButtonLink>
              <ButtonLink
                href={getWhatsAppUrl({
                  origin: "Sobre nós > Na rotina",
                  interest: "Orientação sobre o portfólio",
                  request: "Quero explicar minha necessidade e entender quais opções fazem sentido.",
                })}
                variant="secondary"
                leadSource="Sobre nós > Na rotina"
                leadStage="discovery"
                leadInterest="Orientação sobre o portfólio"
              >
                Conversar com a equipe
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
