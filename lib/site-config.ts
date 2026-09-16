const configuredSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

const vercelProductionUrl = (
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL ?? ""
)
  .trim()
  .replace(/\/+$/, "");

const configuredWhatsApp = (process.env.NEXT_PUBLIC_WHATSAPP ?? "").trim();

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
  ogImage: "/og.png",
  googleSiteVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  whatsapp: configuredWhatsApp,
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

export type WhatsAppLeadContext = {
  origin: string;
  interest?: string;
  request?: string;
};

export function buildWhatsAppMessage({
  origin,
  interest,
  request = "Quero conhecer as opções e receber orientação da equipe.",
}: WhatsAppLeadContext) {
  return [
    "Olá! Vim pelo site da Adapta Prime.",
    interest ? `Interesse: ${interest}.` : null,
    request,
    `Origem do contato: ${origin}.`,
  ].filter(Boolean).join("\n");
}

export function getWhatsAppUrl(input?: string | WhatsAppLeadContext) {
  const number = siteConfig.whatsapp.replace(/\D/g, "");
  const message = typeof input === "string"
    ? input
    : input
      ? buildWhatsAppMessage(input)
      : undefined;

  const text = message
    ? `?text=${encodeURIComponent(message)}`
    : "";

  // Without a configured business number, WhatsApp opens its contact picker.
  // This keeps every CTA direct and avoids sending the visitor through a form.
  return `https://wa.me/${number}${text}`;
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
