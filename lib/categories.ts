export type Category = {
  name: string;
  slug: string;
  code: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  image: string;
  accent: string;
};

export const categories: Category[] = [
  {
    name: "Implantodontia",
    slug: "implantodontia",
    code: "IMPL",
    description:
      "Soluções selecionadas para diferentes etapas da rotina implantodôntica.",
    seoTitle: "Soluções para Implantodontia",
    seoDescription:
      "Conheça soluções odontológicas para Implantodontia e consulte aplicações, compatibilidade e disponibilidade com a equipe Adapta Prime.",
    image: "/categories/implantodontia-tecnica.webp",
    accent: "blue",
  },
  {
    name: "Endodontia",
    slug: "endodontia",
    code: "ENDO",
    description:
      "Instrumentação e recursos para uma rotina mais organizada e controlada.",
    seoTitle: "Produtos e Instrumentais para Endodontia",
    seoDescription:
      "Consulte produtos e instrumentais para Endodontia, incluindo limas rotatórias, com orientação comercial e entrega para todo o Brasil.",
    image: "/categories/endodontia-tecnica.webp",
    accent: "silver",
  },
  {
    name: "Componentes protéticos",
    slug: "componentes-proteticos",
    code: "PROT",
    description:
      "Opções para diferentes conexões, necessidades e objetivos protéticos.",
    seoTitle: "Componentes Protéticos para Implantodontia",
    seoDescription:
      "Encontre componentes protéticos odontológicos e consulte conexão, aplicação e compatibilidade para sua rotina clínica.",
    image: "/categories/componentes-proteticos-tecnica.webp",
    accent: "graphite",
  },
  {
    name: "Kits",
    slug: "kits",
    code: "KITS",
    description:
      "Conjuntos organizados para apoiar fluxos cirúrgicos e protéticos.",
    seoTitle: "Kits Odontológicos Cirúrgicos e Protéticos",
    seoDescription:
      "Conheça kits odontológicos organizados para fluxos cirúrgicos e protéticos e consulte disponibilidade com atendimento especializado.",
    image: "/categories/kits-tecnica.webp",
    accent: "deep-blue",
  },
  {
    name: "Instrumentais",
    slug: "instrumentais",
    code: "INST",
    description:
      "Instrumentais escolhidos com atenção à aplicação e à rotina profissional.",
    seoTitle: "Instrumentais Odontológicos Profissionais",
    seoDescription:
      "Consulte instrumentais odontológicos selecionados para diferentes aplicações e rotinas profissionais, com atendimento em todo o Brasil.",
    image: "/categories/instrumentais-tecnica.webp",
    accent: "titanium",
  },
];
