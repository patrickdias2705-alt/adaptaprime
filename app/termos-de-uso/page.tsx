import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Termos de Uso",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Documento institucional" title={<>Termos de<br />Uso.</>} description="Conteúdo jurídico em revisão antes da publicação oficial." />
      <section className="section section--ice legal-page"><div className="shell"><p>Esta página está reservada para os Termos de Uso aprovados da Adapta Prime. O conteúdo final deve ser inserido antes da publicação pública do site.</p></div></section>
    </>
  );
}

