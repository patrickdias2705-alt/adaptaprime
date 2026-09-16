import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { getWhatsAppUrl } from "@/lib/site-config";

export const seoFaqItems = [
  {
    question: "Quais soluções odontológicas a Adapta Prime oferece?",
    answer:
      "A seleção inclui soluções para Implantodontia, Endodontia, componentes protéticos, kits e instrumentais odontológicos.",
  },
  {
    question: "Como confirmar a compatibilidade de um componente protético?",
    answer:
      "A escolha deve considerar conexão, aplicação e objetivo protético. A equipe comercial ajuda a organizar essas informações antes da consulta de disponibilidade.",
  },
  {
    question: "A Adapta Prime atende profissionais e clínicas em todo o Brasil?",
    answer:
      "Sim. O atendimento é direcionado a profissionais e clínicas, com entrega para todo o Brasil conforme disponibilidade e condições comerciais.",
  },
  {
    question: "Como consultar produtos e disponibilidade?",
    answer:
      "Você pode navegar pelo catálogo institucional e falar diretamente com a equipe pelo WhatsApp, já com o contexto do produto ou categoria escolhida.",
  },
  {
    question: "O site realiza venda direta de produtos odontológicos?",
    answer:
      "O site funciona como catálogo institucional. Aplicação, compatibilidade, disponibilidade e condições comerciais são confirmadas durante o atendimento.",
  },
] as const;

export function SeoFaq() {
  const faqWhatsappHref = getWhatsAppUrl({
    origin: "Início > Dúvidas frequentes",
    interest: "Dúvida sobre produtos",
    request: "Tenho uma dúvida e quero conversar com a equipe.",
  });
  const faqWhatsappExternal = faqWhatsappHref.startsWith("http");

  return (
    <section
      className="section section--ice seo-faq"
      aria-labelledby="seo-faq-title"
    >
      <div className="shell seo-faq__grid">
        <Reveal className="seo-faq__heading">
          <p className="eyebrow">Dúvidas frequentes</p>
          <h2 id="seo-faq-title" className="display-title">
            Informação clara.
            <br />
            Escolha mais segura.
          </h2>
          <p>
            Entenda como consultar soluções odontológicas e preparar uma
            conversa mais objetiva com nossa equipe.
          </p>
          <Link
            href={faqWhatsappHref}
            className="text-link"
            target={faqWhatsappExternal ? "_blank" : undefined}
            rel={faqWhatsappExternal ? "noreferrer" : undefined}
            data-whatsapp-cta="true"
            data-lead-stage="discovery"
            data-lead-source="Início > Dúvidas frequentes"
            data-lead-interest="Dúvida sobre produtos"
          >
            Falar com a equipe <i aria-hidden="true">↗</i>
          </Link>
        </Reveal>

        <div className="seo-faq__list">
          {seoFaqItems.map((item, index) => (
            <Reveal key={item.question} delay={index * 0.04}>
              <details>
                <summary>
                  <span>{item.question}</span>
                  <i aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
