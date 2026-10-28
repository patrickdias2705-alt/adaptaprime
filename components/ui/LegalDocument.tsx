import type { ReactNode } from "react";
import Link from "next/link";
import { getWhatsAppUrl, siteConfig } from "@/lib/site-config";
import styles from "./LegalDocument.module.css";
import { StructuredData } from "./StructuredData";
import { informationPage } from "@/lib/structured-data";

export type LegalSection = { id: string; title: string; content: ReactNode };

export function LegalDocument({ title, description, sections }: { title: string; description: string; sections: LegalSection[] }) {
  const path = title === "Política de Privacidade" ? "/politica-de-privacidade" : "/termos-de-uso";
  const schema = informationPage("WebPage", title, description, path);
  return <>
    {schema ? <StructuredData data={schema} /> : null}
    <section className={`page-hero ${styles.hero}`}>
      <div className="shell page-hero__copy">
        <p className="eyebrow eyebrow--light">Informações institucionais</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
    <section className={`section ${styles.document}`}>
      <div className="shell">
        <p className={styles.updated}>Última atualização: <time dateTime="2026-10-28">28 de outubro de 2026</time></p>
        <div className={styles.layout}>
          <nav className={styles.index} aria-label={`Índice: ${title}`}>
            <h2>Nesta página</h2>
            <ol>{sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol>
          </nav>
          <div className={styles.content}>
            {sections.map((section, index) => <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`}>{index + 1}. {section.title}</h2>
              {section.content}
            </section>)}
            <aside className={styles.contact}>
              <h2>Fale com a Adapta Prime</h2>
              <p>Para dúvidas sobre estes documentos ou solicitações relacionadas a dados pessoais, utilize nosso canal de atendimento.</p>
              <a href={getWhatsAppUrl("Olá! Gostaria de falar sobre privacidade ou termos de uso da Adapta Prime.")} target="_blank" rel="noreferrer">WhatsApp: +{siteConfig.whatsapp.replace(/\D/g, "")}</a>
              <p><Link href="/politica-de-privacidade">Política de Privacidade</Link> · <Link href="/termos-de-uso">Termos de Uso</Link></p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  </>;
}
