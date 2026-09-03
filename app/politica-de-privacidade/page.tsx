import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Documento institucional" title={<>Política de<br />Privacidade.</>} description="Conteúdo jurídico em revisão antes da publicação oficial." />
      <section className="section section--ice legal-page"><div className="shell"><p>Esta página está reservada para a Política de Privacidade aprovada da Adapta Prime. O conteúdo final deve ser inserido antes da publicação pública do site.</p></div></section>
    </>
  );
}

