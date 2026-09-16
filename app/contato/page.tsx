import { redirect } from "next/navigation";
import { getWhatsAppUrl } from "@/lib/site-config";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ mensagem?: string }>;
}) {
  const { mensagem } = await searchParams;
  const initialMessage = typeof mensagem === "string" ? mensagem.slice(0, 1200) : "";

  redirect(getWhatsAppUrl(initialMessage || {
    origin: "Acesso direto à antiga página de contato",
    request: "Quero falar com um especialista da Adapta Prime.",
  }));
}
