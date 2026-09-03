"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { getWhatsAppUrl, siteConfig } from "@/lib/site-config";

export function ContactForm() {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = [
      "Olá, quero falar com a equipe da Adapta Prime.",
      `Nome: ${form.get("name")}`,
      `Clínica/empresa: ${form.get("company") || "Não informado"}`,
      `E-mail: ${form.get("email")}`,
      `WhatsApp: ${form.get("phone")}`,
      `Cidade/UF: ${form.get("location")}`,
      `Interesse: ${form.get("interest")}`,
      `Mensagem: ${form.get("message")}`,
    ].join("\n");

    if (siteConfig.whatsapp) {
      window.open(getWhatsAppUrl(message), "_blank", "noopener,noreferrer");
      setStatus("Abrimos o WhatsApp com sua solicitação preparada para envio.");
      return;
    }

    if (siteConfig.email) {
      window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent("Contato pelo site Adapta Prime")}&body=${encodeURIComponent(message)}`;
      setStatus("Abrimos seu aplicativo de e-mail com a solicitação preparada.");
      return;
    }

    setStatus("O envio online será habilitado assim que o canal comercial for configurado.");
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>Nome *</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label>
          <span>Clínica ou empresa</span>
          <input name="company" type="text" autoComplete="organization" />
        </label>
        <label>
          <span>E-mail *</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span>WhatsApp *</span>
          <input name="phone" type="tel" autoComplete="tel" required />
        </label>
        <label>
          <span>Cidade / UF *</span>
          <input name="location" type="text" autoComplete="address-level2" required />
        </label>
        <label>
          <span>Área de interesse *</span>
          <select name="interest" required defaultValue="">
            <option value="" disabled>Selecione uma área</option>
            <option>Implantodontia</option>
            <option>Endodontia</option>
            <option>Componentes protéticos</option>
            <option>Kits</option>
            <option>Instrumentais</option>
            <option>Outras soluções</option>
          </select>
        </label>
      </div>
      <label className="form-message">
        <span>Como podemos ajudar? *</span>
        <textarea name="message" rows={5} required />
      </label>
      <p className="form-privacy-note">Não envie dados de pacientes ou informações clínicas sensíveis.</p>
      <label className="form-consent">
        <input name="consent" type="checkbox" required />
        <span>Li e concordo com a <Link href="/politica-de-privacidade">Política de Privacidade</Link>.</span>
      </label>
      <div className="form-submit-row">
        <button type="submit" className="form-submit">Enviar solicitação <span aria-hidden="true">↗</span></button>
        <p aria-live="polite" role="status">{status}</p>
      </div>
    </form>
  );
}

