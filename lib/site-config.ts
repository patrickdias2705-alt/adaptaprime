const configuredSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

const vercelProductionUrl = (
  process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL ?? ""
)
  .trim()
  .replace(/\/+$/, "");

const DEFAULT_WHATSAPP = "5531992190003";
const WHATSAPP_SITE_IDENTIFIER = "[Contato via site Adapta Prime]";

const configuredWhatsApp = (
  process.env.NEXT_PUBLIC_WHATSAPP ?? DEFAULT_WHATSAPP
).trim() || DEFAULT_WHATSAPP;

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
    WHATSAPP_SITE_IDENTIFIER,
    "Olá! Vim pelo site da Adapta Prime.",
    interest ? `Interesse: ${interest}.` : null,
    request,
    `Origem do contato: ${origin}.`,
  ].filter(Boolean).join("\n");
}

function identifyWhatsAppMessage(message: string) {
  const trimmedMessage = message.trim();

  if (trimmedMessage.startsWith(WHATSAPP_SITE_IDENTIFIER)) {
    return trimmedMessage;
  }

  return [WHATSAPP_SITE_IDENTIFIER, trimmedMessage].filter(Boolean).join("\n");
}

export function getWhatsAppUrl(input?: string | WhatsAppLeadContext) {
  const number = siteConfig.whatsapp.replace(/\D/g, "");
  const message = typeof input === "string"
    ? identifyWhatsAppMessage(input)
    : input
      ? buildWhatsAppMessage(input)
      : identifyWhatsAppMessage(
          "Olá! Quero falar com um especialista da Adapta Prime.",
        );

  const text = message
    ? `?text=${encodeURIComponent(message)}`
    : "";

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
