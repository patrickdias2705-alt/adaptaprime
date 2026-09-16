"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLeadPageLabel, getWhatsAppUrl } from "@/lib/site-config";

export function FloatingContact() {
  const pathname = usePathname();
  const origin = `${getLeadPageLabel(pathname)} > Botão flutuante`;
  const href = getWhatsAppUrl({ origin, request: "Quero falar com um especialista da Adapta Prime." });
  const external = href.startsWith("http");

  return (
    <Link
      className="floating-contact"
      href={href}
      aria-label="Falar com especialista pelo WhatsApp"
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      data-whatsapp-cta="true"
      data-lead-stage="discovery"
      data-lead-source={origin}
    >
      <span className="floating-contact__icon" aria-hidden="true">
        {/* This is the official WhatsApp brand silhouette from Simple Icons. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/whatsapp.svg" alt="" width="25" height="25" />
      </span>
    </Link>
  );
}
