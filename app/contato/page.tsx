import { ContactForm } from "@/components/sections/ContactForm";
import { PageHero } from "@/components/ui/PageHero";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata = createPageMetadata(
  "Contato",
  "Fale com a equipe comercial Adapta Prime para conhecer soluções e consultar disponibilidade de produtos odontológicos.",
  "/contato",
);

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contato comercial"
        title={<>Vamos entender<br />sua necessidade.</>}
        description="Conte um pouco sobre sua rotina e a solução que procura. Nossa equipe direcionará a conversa comercial."
      />
      <section className="section section--ice contact-page" aria-labelledby="contact-form-title">
        <div className="shell contact-page__grid">
          <div className="contact-page__intro">
            <p className="eyebrow">Fale com a equipe</p>
            <h2 id="contact-form-title" className="display-title">Uma conversa<br />mais objetiva.</h2>
            <p>Quanto mais contexto você compartilhar sobre a área de interesse, melhor poderemos organizar o primeiro atendimento.</p>
            <dl>
              {siteConfig.email ? <><dt>E-mail</dt><dd><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></dd></> : null}
              {siteConfig.whatsapp ? <><dt>WhatsApp</dt><dd>{siteConfig.whatsapp}</dd></> : null}
              {!siteConfig.email && !siteConfig.whatsapp ? <><dt>Canais comerciais</dt><dd>Configuração pendente no arquivo de dados do site.</dd></> : null}
            </dl>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}

