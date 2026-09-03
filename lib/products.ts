export type Product = {
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  description: string;
  image?: string;
  featured?: boolean;
  characteristics?: string[];
  applications?: string[];
};

export const products: Product[] = [
  {
    name: "Mini Pilar CM",
    slug: "mini-pilar-cm",
    category: "Componentes protéticos",
    categorySlug: "componentes-proteticos",
    description:
      "Componente para composições protéticas que pedem avaliação criteriosa de conexão e aplicação.",
    featured: true,
  },
  {
    name: "Mini Pilar HE",
    slug: "mini-pilar-he",
    category: "Componentes protéticos",
    categorySlug: "componentes-proteticos",
    description:
      "Uma opção para rotinas protéticas em que a compatibilidade deve orientar a escolha.",
    featured: true,
  },
  {
    name: "Mini Pilar Angulado",
    slug: "mini-pilar-angulado",
    category: "Componentes protéticos",
    categorySlug: "componentes-proteticos",
    description:
      "Alternativa de componente cuja seleção considera conexão, angulação e objetivo protético.",
    featured: true,
  },
  {
    name: "Limas Rotatórias",
    slug: "limas-rotatorias",
    category: "Endodontia",
    categorySlug: "endodontia",
    description:
      "Instrumentação endodôntica para compor uma rotina clínica planejada e organizada.",
    featured: true,
  },
  {
    name: "Kit Extrator de Parafuso",
    slug: "kit-extrator-de-parafuso",
    category: "Kits",
    categorySlug: "kits",
    description:
      "Conjunto institucional apresentado para consulta de aplicação e disponibilidade com a equipe.",
    featured: true,
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
