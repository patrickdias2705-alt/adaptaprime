import Link from "next/link";
import { getWhatsAppUrl, siteConfig } from "@/lib/site-config";

export function FloatingContact() {
  return (
    <Link
      className="floating-contact"
      href={getWhatsAppUrl("Olá, quero falar com um especialista da Adapta Prime.")}
      aria-label={siteConfig.whatsapp ? "Falar com especialista pelo WhatsApp" : "Ir para a página de contato"}
    >
      <span className="floating-contact__signal" aria-hidden="true" />
      <span className="floating-contact__label">Falar com especialista</span>
      <span aria-hidden="true">↗</span>
    </Link>
  );
}

