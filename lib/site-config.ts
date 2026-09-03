export const siteConfig = {
  name: "Adapta Prime",
  legalName: "",
  description:
    "Soluções especializadas em Implantodontia, Endodontia, componentes e instrumentais odontológicos, com atendimento técnico e entrega para todo o Brasil.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  whatsapp: "",
  email: "",
  instagram: "",
  address: "",
  cnpj: "",
} as const;

export const navigation = [
  { label: "Início", href: "/" },
  { label: "Soluções", href: "/solucoes" },
  { label: "Produtos", href: "/produtos" },
  { label: "Por que Adapta Prime", href: "/#por-que" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
] as const;

export function getWhatsAppUrl(message?: string) {
  const number = siteConfig.whatsapp.replace(/\D/g, "");

  if (!number) return "/contato";

  const text = message
    ? `?text=${encodeURIComponent(message)}`
    : "";

  return `https://wa.me/${number}${text}`;
}

export function absoluteUrl(path = "/") {
  if (!siteConfig.siteUrl) return "";
  return new URL(path, siteConfig.siteUrl).toString();
}

