export type ProductTechnicalGroup = {
  connection: string;
  configuration: string;
  heights?: string[];
  note?: string;
};

export type ProductTechnicalData = {
  summary: string;
  groups: ProductTechnicalGroup[];
  note: string;
};

export type Product = {
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  description: string;
  image?: string;
  model3d?: string;
  modelVariant?: "reto" | "angulado" | "limas";
  featured?: boolean;
  characteristics?: string[];
  applications?: string[];
  technicalData?: ProductTechnicalData;
};

export const products: Product[] = [
  {
    name: "Mini Pilar CM",
    slug: "mini-pilar-cm",
    category: "Componentes protéticos",
    categorySlug: "componentes-proteticos",
    image: "/products/featured/mini-pilar-reto.webp",
    model3d: "/models/mini-pilar-reto-fast.glb",
    modelVariant: "reto",
    description:
      "Componente para composições protéticas que pedem avaliação criteriosa de conexão e aplicação.",
    technicalData: {
      summary: "Alturas gengivais de 0,8 a 5,5 mm",
      groups: [
        {
          connection: "CM",
          configuration: "Reto · plataforma protética Ø 4,8 mm",
          heights: ["0,8", "1,5", "2,5", "3,5", "4,5", "5,5"],
        },
      ],
      note:
        "A altura gengival deve ser confirmada junto com a conexão e o espaço interoclusal do caso.",
    },
    featured: true,
  },
  {
    name: "Mini Pilar HE",
    slug: "mini-pilar-he",
    category: "Componentes protéticos",
    categorySlug: "componentes-proteticos",
    image: "/products/featured/mini-pilar-he.webp",
    model3d: "/models/mini-pilar-reto-fast.glb",
    modelVariant: "reto",
    description:
      "Uma opção para rotinas protéticas em que a compatibilidade deve orientar a escolha.",
    technicalData: {
      summary: "Alturas organizadas por plataforma HE",
      groups: [
        {
          connection: "HE Ø 3,3",
          configuration: "Mini pilar cônico reto",
          heights: ["1", "2", "3"],
        },
        {
          connection: "HE SF Ø 4,1",
          configuration: "Mini pilar cônico reto",
          heights: ["1", "2", "3", "4", "5"],
        },
        {
          connection: "HE SF Ø 5,0",
          configuration: "Mini pilar cônico reto",
          heights: ["1", "2", "3"],
        },
      ],
      note:
        "Em HE, a faixa muda conforme o diâmetro da plataforma; por isso a medida nunca deve ser lida sem a plataforma correspondente.",
    },
    featured: true,
  },
  {
    name: "Mini Pilar Angulado",
    slug: "mini-pilar-angulado",
    category: "Componentes protéticos",
    categorySlug: "componentes-proteticos",
    image: "/products/featured/mini-pilar-angulado.webp",
    model3d: "/models/mini-pilar-angulado-fast.glb",
    modelVariant: "angulado",
    description:
      "Alternativa de componente cuja seleção considera conexão, angulação e objetivo protético.",
    technicalData: {
      summary: "Altura combinada com conexão e angulação",
      groups: [
        {
          connection: "CM",
          configuration: "17° ou 30°",
          heights: ["1,5", "2,5", "3,5"],
        },
        {
          connection: "HE",
          configuration: "17° · Ø 3,3 / Ø 4,1",
          heights: ["2", "3", "4"],
        },
        {
          connection: "HE",
          configuration: "30° · Ø 4,1 / Ø 5,0",
          heights: ["3", "4"],
        },
        {
          connection: "GM",
          configuration: "17° ou 30°",
          heights: ["1,5", "2,5", "3,5"],
        },
        {
          connection: "Straumann",
          configuration: "Seleção por plataforma NC, RC, RB ou WB",
          note: "A altura muda conforme a família e o tipo de pilar. Informe a plataforma para receber a combinação correta.",
        },
      ],
      note:
        "Nos modelos angulados, altura, grau e plataforma formam uma única especificação. Confirme os três dados antes da seleção.",
    },
    featured: true,
  },
  {
    name: "Implantes CM e HE",
    slug: "implantes-cm-he",
    category: "Implantodontia",
    categorySlug: "implantodontia",
    image: "/products/featured/implantes-cm-he.webp",
    description:
      "Implantes nas conexões CM e HE para seleção conforme o planejamento cirúrgico e o protocolo clínico.",
    characteristics: ["Conexão CM", "Conexão HE", "Seleção orientada pelo planejamento"],
    applications: ["Planejamento implantodôntico", "Reabilitação sobre implantes"],
    featured: true,
  },
  {
    name: "T-Base CM 11,5° + Parafuso CM",
    slug: "t-base-cm-11-5-parafuso-cm",
    category: "Componentes protéticos",
    categorySlug: "componentes-proteticos",
    image: "/products/featured/t-base-cm-11-5.webp",
    description:
      "Conjunto T-Base CM com angulação de 11,5° e parafuso CM para composições protéticas que exigem compatibilidade precisa.",
    characteristics: ["Conexão CM", "Angulação de 11,5°", "Parafuso CM incluído"],
    applications: ["Planejamento protético", "Reabilitação sobre implantes"],
    featured: true,
  },
  {
    name: "Limas Rotatórias",
    slug: "limas-rotatorias",
    category: "Endodontia",
    categorySlug: "endodontia",
    image: "/products/featured/limas-rotatorias.webp",
    model3d: "/models/limas-meshy-compatible.glb",
    modelVariant: "limas",
    description:
      "Instrumentação endodôntica para compor uma rotina clínica planejada e organizada.",
    featured: true,
  },
  {
    name: "Kit Extrator de Parafuso",
    slug: "kit-extrator-de-parafuso",
    category: "Kits",
    categorySlug: "kits",
    image: "/products/featured/kit-extrator-parafuso.webp",
    description:
      "Conjunto institucional apresentado para consulta de aplicação e disponibilidade com a equipe.",
    featured: true,
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
