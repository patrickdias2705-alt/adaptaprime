import { getProduct } from "./products";

export type ItemAvailability = "in_stock" | "out_of_stock";

// Copied by hand from the price sheet (adapta-precos-merchant-center.xlsx). Only items listed here
// get a public page, so the site never shows a price the Adapta team did not provide.
export type ItemOffer = {
  priceBRL: number;
  availability: ItemAvailability;
  brand: string;
  mpn?: string;
  gtin?: string;
};

export const itemOffers: Record<string, ItemOffer> = {
};

export type SalesItemSpec = {
  id: string;
  productSlug: string;
  slug: string;
  title: string;
  summary: string;
};

export type SalesItem = SalesItemSpec & ItemOffer & { image?: string; category: string };

const decimal = (value: number) => String(value).replace(".", ",");
const platformLabel = (value: number) => value.toFixed(1).replace(".", ",");
const code = (value: number) => String(Math.round(value * 10)).padStart(2, "0");
const slugNumber = (value: number) => String(value).replace(".", "-");

function straightHe(platform: number, height: number): SalesItemSpec {
  return {
    id: `MPHE-${code(platform)}-${code(height)}`,
    productSlug: "mini-pilar-he",
    slug: `he-${slugNumber(platform)}-altura-${slugNumber(height)}-mm`,
    title: `Mini Pilar Cônico Reto HE Ø ${platformLabel(platform)} - Altura ${decimal(height)} mm`,
    summary: `Mini pilar cônico reto para conexão hexágono externo, plataforma Ø ${platformLabel(platform)}, altura transmucosa de ${decimal(height)} mm.`,
  };
}

function straightCm(height: number): SalesItemSpec {
  return {
    id: `MPCM-48-${code(height)}`,
    productSlug: "mini-pilar-cm",
    slug: `cm-4-8-altura-${slugNumber(height)}-mm`,
    title: `Mini Pilar Reto CM Ø 4,8 - Altura ${decimal(height)} mm`,
    summary: `Mini pilar reto para conexão cone morse, plataforma protética Ø 4,8 mm, altura gengival de ${decimal(height)} mm.`,
  };
}

function angled(connection: "CM" | "GM" | "HE", degrees: 17 | 30, height: number, platform?: number): SalesItemSpec {
  const platformId = platform ? `-${code(platform)}` : "";
  const platformSlug = platform ? `-${slugNumber(platform)}` : "";
  const platformTitle = platform ? ` Ø ${platformLabel(platform)}` : "";
  return {
    id: `MPAN-${connection}${platformId}-${degrees}-${code(height)}`,
    productSlug: "mini-pilar-angulado",
    slug: `${connection.toLowerCase()}${platformSlug}-${degrees}-graus-altura-${slugNumber(height)}-mm`,
    title: `Mini Pilar Angulado ${connection}${platformTitle} ${degrees}° - Altura ${decimal(height)} mm`,
    summary: `Mini pilar angulado de ${degrees}° para conexão ${connection}${platform ? `, plataforma Ø ${platformLabel(platform)}` : ""}, altura de ${decimal(height)} mm.`,
  };
}

function specs(): SalesItemSpec[] {
  const list: SalesItemSpec[] = [];
  for (const [platform, heights] of [[3.3, [1, 2, 3]], [4.1, [1, 2, 3, 4, 5]]] as const) {
    for (const height of heights) list.push(straightHe(platform, height));
  }
  for (const height of [0.8, 1.5, 2.5, 3.5, 4.5, 5.5]) list.push(straightCm(height));
  for (const connection of ["CM", "GM"] as const) {
    for (const degrees of [17, 30] as const) {
      for (const height of [1.5, 2.5, 3.5]) list.push(angled(connection, degrees, height));
    }
  }
  for (const platform of [3.3, 4.1]) {
    for (const height of [2, 3, 4]) list.push(angled("HE", 17, height, platform));
    for (const height of [3, 4]) list.push(angled("HE", 30, height, platform));
  }
  list.push({
    id: "KIT-EXTRATOR",
    productSlug: "kit-extrator-de-parafuso",
    slug: "kit-extrator",
    title: "Kit Extrator de Parafuso para Implantodontia",
    summary: "Kit extrator de parafuso. Consulte aplicação e compatibilidade com a equipe.",
  });
  return list;
}

export const salesItemSpecs = specs();

export function buildSalesItems(offers: Record<string, ItemOffer>): SalesItem[] {
  const known = new Set(salesItemSpecs.map((spec) => spec.id));
  for (const [id, offer] of Object.entries(offers)) {
    if (!known.has(id)) throw new Error(`Item sem cadastro na planilha: ${id}`);
    if (!(offer.priceBRL > 0)) throw new Error(`Preço inválido em ${id}`);
    if (!offer.brand.trim()) throw new Error(`Marca em branco em ${id}`);
  }
  return salesItemSpecs.flatMap((spec) => {
    const offer = offers[spec.id];
    const product = getProduct(spec.productSlug);
    if (!offer || !product) return [];
    return [{ ...spec, ...offer, image: product.image, category: product.category }];
  });
}

export const salesItems = buildSalesItems(itemOffers);

export function getSalesItem(productSlug: string, slug: string) {
  return salesItems.find((item) => item.productSlug === productSlug && item.slug === slug);
}

export function salesItemsOf(productSlug: string) {
  return salesItems.filter((item) => item.productSlug === productSlug);
}

export function salesItemPath(item: Pick<SalesItemSpec, "productSlug" | "slug">) {
  return `/produtos/${item.productSlug}/${item.slug}`;
}
