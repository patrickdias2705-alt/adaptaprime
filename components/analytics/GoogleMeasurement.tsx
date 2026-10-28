"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { products } from "@/lib/products";
import { cleanPageUrl, consentEvent, consentKey, consentReadyEvent, googleConsent, gtmId, preferencesEvent, pushMeasurement, readConsent, type ConsentChoice, type ConsentState } from "@/lib/measurement";
import styles from "./GoogleMeasurement.module.css";

let lastPage = "";
let lastReferrer = "";
const callbacks = new Set<(state: ConsentState) => void>();

function applyConsent(choice: ConsentChoice | null) {
  window.adaptaConsentChoice = choice;
  if (!choice?.analytics) lastPage = "";
  callbacks.forEach(callback => callback(googleConsent(choice)));
}

function loadContainer() {
  if (!gtmId || document.getElementById("adapta-gtm")) return;
  window.adaptaConsentSubscribe = callback => {
    callbacks.add(callback);
    callback(googleConsent(window.adaptaConsentChoice ?? null));
  };
  // Called only by the GTM consent template after its native consent API runs.
  window.adaptaConsentReady = () => {
    window.setTimeout(() => {
      window.adaptaMeasurementReady = true;
      window.dataLayer?.push({ event: "adapta_consent_ready", ...googleConsent(window.adaptaConsentChoice ?? null),
        page_location: cleanPageUrl(window.location.href), page_title: document.title });
      window.dispatchEvent(new Event(consentReadyEvent));
    }, 0);
  };
  window.dataLayer ??= [];
  window.dataLayer.push({ ...googleConsent(window.adaptaConsentChoice ?? null) });
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.id = "adapta-gtm";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
  script.onerror = () => script.remove();
  document.head.appendChild(script);
}

function reportPage(pathname: string) {
  const choice = window.adaptaConsentChoice;
  if (!window.adaptaMeasurementReady || !choice?.analytics || lastPage === pathname) return;
  const url = cleanPageUrl(window.location.href);
  pushMeasurement({ event: "page_view", page_location: url, page_path: pathname, page_title: document.title,
    page_referrer: lastReferrer || cleanPageUrl(document.referrer) });
  lastPage = pathname;
  lastReferrer = url;
  const product = products.find(item => pathname === `/produtos/${item.slug}`);
  if (product) pushMeasurement({ event: "view_item", ecommerce: { items: [{ item_id: product.slug, item_name: product.name, item_category: product.category }] } });
}

export function GoogleMeasurement() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => () => {
    applyConsent(null);
    window.adaptaMeasurementReady = false;
  }, []);

  useEffect(() => {
    const restore = () => {
      const choice = readConsent();
      applyConsent(choice);
      setAnalytics(choice?.analytics ?? false);
      setAdvertising(choice?.advertising ?? false);
      setOpen(!choice && Boolean(gtmId));
      if (choice?.analytics || choice?.advertising) loadContainer();
      reportPage(pathname);
    };
    const frame = requestAnimationFrame(restore);
    const ready = () => reportPage(pathname);
    const preferences = () => setOpen(true);
    const storage = (event: StorageEvent) => { if (event.key === consentKey || event.key === null) restore(); };
    window.addEventListener("storage", storage);
    window.addEventListener(consentReadyEvent, ready);
    window.addEventListener(preferencesEvent, preferences);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("storage", storage);
      window.removeEventListener(consentReadyEvent, ready);
      window.removeEventListener(preferencesEvent, preferences);
    };
  }, [pathname]);

  function save(allowAnalytics: boolean, allowAdvertising: boolean) {
    const choice: ConsentChoice = { version: 1, analytics: allowAnalytics, advertising: allowAdvertising, updatedAt: Date.now() };
    try { localStorage.setItem(consentKey, JSON.stringify(choice)); } catch { /* Apply for this page even when storage is unavailable. */ }
    applyConsent(choice);
    window.dispatchEvent(new Event(consentEvent));
    if (allowAnalytics || allowAdvertising) loadContainer();
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
