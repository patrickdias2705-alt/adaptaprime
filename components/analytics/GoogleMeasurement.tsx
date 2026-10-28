"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { consentKey, consentReadyEvent, gtmId, parseConsent, preferencesEvent, type ConsentChoice } from "@/lib/measurement";
import { reportPage, restoreMeasurementConsent, saveMeasurementConsent } from "@/lib/measurement-runtime";
import styles from "./GoogleMeasurement.module.css";

export function GoogleMeasurement() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    const reflectChoice = (choice: ConsentChoice | null, show = !choice) => {
      setAnalytics(choice?.analytics ?? false);
      setAdvertising(choice?.advertising ?? false);
      setOpen(show && Boolean(gtmId));
    };
    const frame = requestAnimationFrame(() => reflectChoice(restoreMeasurementConsent()));
    const ready = () => reportPage(window.location.pathname);
    const preferences = () => reflectChoice(restoreMeasurementConsent(), true);
    const storage = (event: StorageEvent) => {
      if (event.key !== consentKey && event.key !== null) return;
      // Use the incoming value, including a deletion, rather than an older cookie.
      const choice = parseConsent(event.newValue);
      saveMeasurementConsent(choice);
      reflectChoice(choice);
    };
    window.addEventListener("storage", storage);
    window.addEventListener(consentReadyEvent, ready);
    window.addEventListener(preferencesEvent, preferences);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("storage", storage);
      window.removeEventListener(consentReadyEvent, ready);
      window.removeEventListener(preferencesEvent, preferences);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => reportPage(pathname), 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  function save(allowAnalytics: boolean, allowAdvertising: boolean) {
    const choice: ConsentChoice = { version: 1, analytics: allowAnalytics, advertising: allowAdvertising, updatedAt: Date.now() };
    saveMeasurementConsent(choice);
    setAnalytics(allowAnalytics);
    setAdvertising(allowAdvertising);
    setOpen(false);
    // Native consent updates are applied at the end of the GTM tag's current event.
    window.setTimeout(() => reportPage(pathname), 0);
  }

  if (!open || !gtmId) return null;
  return <section className={styles.panel} aria-labelledby="privacy-preferences-title" aria-describedby="privacy-preferences-description" data-consent-panel="true">
    <h2 id="privacy-preferences-title">Sua privacidade, sua escolha</h2>
    <p id="privacy-preferences-description">Usamos dados opcionais para entender a navegação e medir o resultado dos anúncios. Você pode recusar e continuar usando o site. <Link href="/politica-de-privacidade#cookies">Política de Privacidade</Link></p>
    <div className={styles.choices}>
      <label><input type="checkbox" checked disabled /> Essenciais <small>Sempre ativos para o funcionamento e suas escolhas.</small></label>
      <label><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} /> Estatísticas <small>Visitas, interesse em produtos e velocidade das páginas.</small></label>
      <label><input type="checkbox" checked={advertising} onChange={e => setAdvertising(e.target.checked)} /> Medição de anúncios <small>Cliques de contato originados de campanhas, sem personalizar anúncios.</small></label>
    </div>
    <div className={styles.actions}>
      <button type="button" onClick={() => save(false, false)}>Recusar opcionais</button>
      <button type="button" onClick={() => save(analytics, advertising)}>Salvar escolhas</button>
      <button type="button" onClick={() => save(true, true)}>Aceitar opcionais</button>
    </div>
    <p className={styles.note}>Altere sua escolha a qualquer momento em “Preferências de cookies”, no rodapé.</p>
  </section>;
}

export function MeasurementPreferencesButton() {
  if (!gtmId) return null;
  return <button type="button" className={styles.preferences} onClick={() => window.dispatchEvent(new Event(preferencesEvent))}>Preferências de cookies</button>;
}
