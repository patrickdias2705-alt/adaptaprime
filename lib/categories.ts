export type Category = {
  name: string;
  slug: string;
  code: string;
  description: string;
  accent: string;
};

export const categories: Category[] = [
  {
    name: "Implantodontia",
    slug: "implantodontia",
    code: "IMPL",
    description:
      "Soluções selecionadas para diferentes etapas da rotina implantodôntica.",
    accent: "blue",
  },
  {
    name: "Endodontia",
    slug: "endodontia",
    code: "ENDO",
    description:
      "Instrumentação e recursos para uma rotina mais organizada e controlada.",
    accent: "silver",
  },
  {
    name: "Componentes protéticos",
    slug: "componentes-proteticos",
    code: "PROT",
    description:
      "Opções para diferentes conexões, necessidades e objetivos protéticos.",
    accent: "graphite",
  },
  {
    name: "Kits",
    slug: "kits",
    code: "KITS",
    description:
      "Conjuntos organizados para apoiar fluxos cirúrgicos e protéticos.",
    accent: "deep-blue",
  },
  {
    name: "Instrumentais",
    slug: "instrumentais",
    code: "INST",
    description:
      "Instrumentais escolhidos com atenção à aplicação e à rotina profissional.",
    accent: "titanium",
  },
];

