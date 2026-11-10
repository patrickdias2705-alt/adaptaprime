const configuredSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

const vercelProductionUrl = (
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL ?? ""
)
  .trim()
  .replace(/\/+$/, "");

// Single sales number on purpose (31 7525-5290, no 9th digit): no env override, so no other number can creep in.
const WHATSAPP_NUMBER = "553175255290";

export const siteConfig = {
  name: "Adapta Prime",
  alternateName: "Adapta Prime Odontologia",
  legalName: "",
  description:
    "Soluções especializadas em Implantodontia, Endodontia, componentes e instrumentais odontológicos, com atendimento técnico e entrega para todo o Brasil.",
  siteUrl:
    configuredSiteUrl ||
    (vercelProductionUrl ? `https://${vercelProductionUrl}` : "") ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : ""),
  locale: "pt_BR",
  language: "pt-BR",
  country: "BR",
  indexable: !["preview", "development"].includes(process.env.VERCEL_ENV ?? ""),
  ogImage: "/og.png",
  googleSiteVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  whatsapp: WHATSAPP_NUMBER,
  email: "",
  instagram: "",
  address: "",
  cnpj: "",
} as const;

export const navigation = [
  { label: "Início", href: "/" },
  { label: "Produtos", href: "/produtos" },
  { label: "Sobre nós", href: "/sobre" },
] as const;

/**
 * One human sentence: "Olá! Vim pelo site e quero um orçamento de Mini Pilar CM."
 * Which button was clicked is measured by the click event, so the text only says what the visitor wants.
 */
export function getWhatsAppUrl(request = "quero falar com um especialista") {
  const number = siteConfig.whatsapp.replace(/\D/g, "");
  const clause = request.trim().replace(/^(olá|ola|oi|bom dia|boa tarde|boa noite)(?=[\s!,.]|$)[\s!,.]*/i, "") || "quero falar com um especialista";
  const sentence = /[.!?]$/.test(clause) ? clause : `${clause}.`;
  const text = `Olá! Vim pelo site e ${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function getLeadPageLabel(pathname: string) {
  if (pathname === "/") return "Início";
  if (pathname === "/produtos") return "Catálogo de produtos";
  if (pathname.startsWith("/produtos/")) return "Página de produto";
  if (pathname.startsWith("/solucoes/")) return "Página de categoria";
  if (pathname === "/sobre") return "Sobre nós";
  if (pathname === "/contato") return "Contato";
  return "Site institucional";
}

export function absoluteUrl(path = "/") {
  if (!siteConfig.siteUrl) return "";
  return new URL(path, siteConfig.siteUrl).toString();
}
