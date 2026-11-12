export type ProductTechnicalGroup = {
  connection: string;
  configuration: string;
  heights?: string[];
  note?: string;
};

export type ProductTechnicalData = {
  summary: string;
  groups: ProductTechnicalGroup[];
};

export type Product = {
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  description: string;
  image?: string;
  companionImage?: string;
  visualLabel?: string;
  model3d?: string;
  modelVariant?: "reto" | "angulado" | "limas";
  featured?: boolean;
  /** Connections/systems the site already states; shown as chips near the title. */
  compatibility?: string[];
  characteristics?: string[];
  applications?: string[];
  technicalData?: ProductTechnicalData;
};

export const products: Product[] = [
  {
    name: "Mini Pilar CM",
    slug: "mini-pilar-cm",
    compatibility: ["Cone Morse (CM)"],
    category: "Componentes protéticos",
    categorySlug: "componentes-proteticos",
    image: "/products/featured/mini-pilar-reto.webp",
    model3d: "/models/mini-pilar-reto-fast.glb",
    modelVariant: "reto",
    description:
      "Mini pilar reto para implantes Cone Morse (CM). Alturas de 0,8 a 5,5 mm.",
    technicalData: {
      summary: "Alturas gengivais de 0,8 a 5,5 mm",
      groups: [
        {
          connection: "CM",
          configuration: "Reto · plataforma protética Ø 4,8 mm",
          heights: ["0,8", "1,5", "2,5", "3,5", "4,5", "5,5"],
        },
      ],
    },
    featured: true,
  },
  {
    name: "Mini Pilar HE",
    slug: "mini-pilar-he",
    compatibility: ["Hexágono externo (HE)"],
    category: "Componentes protéticos",
    categorySlug: "componentes-proteticos",
    image: "/products/featured/mini-pilar-he-reto.webp",
    description:
      "Mini pilar reto para hexágono externo (HE). Plataformas de 3,3 e 4,1 mm.",
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
      ],
    },
    featured: true,
  },
  {
    name: "Mini Pilar Angulado",
    slug: "mini-pilar-angulado",
    compatibility: ["CM", "HE", "GM", "Straumann"],
    category: "Componentes protéticos",
    categorySlug: "componentes-proteticos",
    image: "/products/featured/mini-pilar-angulado-corrigido.webp",
    model3d: "/models/mini-pilar-angulado-fast.glb",
    modelVariant: "angulado",
    description:
      "Mini pilar angulado de 17° ou 30° para conexões CM, HE, GM e Straumann.",
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
          configuration: "30° · Ø 3,3 / Ø 4,1",
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
    },
    featured: true,
  },
  {
    name: "Implantes CM e HE",
    slug: "implantes-cm-he",
    compatibility: ["Cone Morse (CM)", "Hexágono externo (HE)"],
    category: "Implantodontia",
    categorySlug: "implantodontia",
    visualLabel: "Singular e Systhex",
    description:
      "Trabalhamos com implantes Singular e Systhex. Consulte nossa equipe para confirmar os modelos disponíveis nas conexões cone morse (CM) e hexágono externo (HE).",
    characteristics: ["Marcas: Singular e Systhex", "Conexões CM e HE sob consulta", "Seleção orientada pelo planejamento"],
    applications: ["Planejamento implantodôntico", "Reabilitação sobre implantes"],
    featured: true,
  },
  {
    name: "T-Base CM 11,5° + Parafuso CM",
    slug: "t-base-cm-11-5-parafuso-cm",
    compatibility: ["Cone Morse (CM) 11,5°"],
    category: "Componentes protéticos",
    categorySlug: "componentes-proteticos",
    image: "/products/featured/t-base-cone-morse-11-5.png",
    companionImage: "/products/featured/parafuso-t-base-cone-morse.png",
    description:
      "T-Base para conexão cone morse (CM) 11,5° e respectivo parafuso. Consulte a equipe para confirmar plataforma, compatibilidade e disponibilidade.",
    characteristics: ["Conexão cone morse (CM) 11,5°", "Parafuso para T-Base cone morse", "Compatibilidade sob consulta"],
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

export function quoteInterest(product: Pick<Product, "name" | "technicalData">, group?: ProductTechnicalGroup, height?: string) {
  if (!group) return product.name;
  const groups = product.technicalData?.groups ?? [];
  // Skip what the product name already says; keep configuration only when two rows share a connection (HE 17° vs 30°).
  const showConnection = !(groups.length === 1 && product.name.includes(group.connection));
  const ambiguous = groups.filter((item) => item.connection === group.connection).length > 1;
  const connection = showConnection ? [group.connection, ambiguous ? group.configuration : null].filter(Boolean).join(" ") : null;
  const details = [connection, height ? `altura ${height} mm` : null].filter(Boolean);
  return details.length ? `${product.name} (${details.join(", ")})` : product.name;
}
