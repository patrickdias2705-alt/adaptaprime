import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { FinalCta } from "@/components/sections/FinalCta";
import { PageHero } from "@/components/ui/PageHero";
import { StructuredData } from "@/components/ui/StructuredData";
import { categories } from "@/lib/categories";
import { createPageMetadata } from "@/lib/metadata";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const metadata = createPageMetadata(
  "Soluções Odontológicas",
  "Conheça as áreas de atuação da Adapta Prime em Implantodontia, Endodontia, componentes protéticos, kits e instrumentais.",
  "/solucoes",
);

const journey = [
  { label: "Entender a necessidade", copy: "Começamos pela rotina, pelo contexto e pelo objetivo informado pelo profissional." },
  { label: "Verificar compatibilidade", copy: "Conexão, aplicação e composição da solução precisam ser avaliadas em conjunto." },
  { label: "Orientar a categoria", copy: "A conversa comercial direciona para as opções disponíveis no catálogo." },
];

export default function SolutionsPage() {
  const structuredData = siteConfig.siteUrl
    ? [
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${absoluteUrl("/solucoes")}#collection`,
          url: absoluteUrl("/solucoes"),
          name: "Soluções Odontológicas Adapta Prime",
          description:
            "Soluções para Implantodontia, Endodontia, componentes protéticos, kits e instrumentais odontológicos.",
          inLanguage: siteConfig.language,
          isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: categories.map((category, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: category.name,
              url: absoluteUrl(`/solucoes/${category.slug}`),
            })),
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Início",
              item: siteConfig.siteUrl,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Soluções",
              item: absoluteUrl("/solucoes"),
            },
          ],
        },
      ]
    : null;

  return (
    <>
      {structuredData ? <StructuredData data={structuredData} /> : null}
      <PageHero
        eyebrow="Soluções"
        title={<>Critério para cada<br />escolha técnica.</>}
        description="Uma seleção organizada por áreas para aproximar profissionais e clínicas das soluções adequadas a cada necessidade."
      />

      <section className="section section--ice solutions-ledger" aria-labelledby="solutions-list-title">
        <div className="shell">
          <Reveal className="solutions-ledger__heading">
            <p className="eyebrow">Áreas de atuação</p>
            <h2 id="solutions-list-title" className="display-title">Cinco frentes.<br />Uma visão integrada.</h2>
          </Reveal>
          <div className="solutions-ledger__list">
            {categories.map((category) => (
              <Reveal key={category.slug}>
                <Link href={`/solucoes/${category.slug}`}>
                  <span>{category.code}</span>
                  <strong>{category.name}</strong>
                  <p>{category.description}</p>
                  <i aria-hidden="true">↗</i>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section choice-method" aria-labelledby="choice-method-title">
        <div className="shell choice-method__grid">
          <Reveal>
            <p className="eyebrow eyebrow--light">Como orientamos a escolha</p>
            <h2 id="choice-method-title" className="display-title display-title--light">Da necessidade<br />à solução.</h2>
          </Reveal>
          <div className="choice-method__steps">
            {journey.map((step, index) => (
              <Reveal key={step.label} delay={index * 0.06}>
                <article>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><h3>{step.label}</h3><p>{step.copy}</p></div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
