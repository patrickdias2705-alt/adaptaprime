import { products } from "./products";
import { cleanPageUrl, consentEvent, consentReadyEvent, googleConsent, gtmId, parseConsent, publicPath, pushMeasurement, readConsent, writeConsent, type ConsentChoice, type ConsentState } from "./measurement";

// This state belongs to the browser document, not to a React mount or a route.
const callbacks = new Set<(state: ConsentState) => void>();
let revision = 0;
let initialized = false;
let lastPage = "";
let lastReferrer = "";
let documentUrl = "";
const pendingVitals = new Map<string, Record<string, unknown>>();
const sentVitals = new Map<string, string>();

function validChoice() {
  return parseConsent(JSON.stringify(window.adaptaConsentChoice ?? null));
}

function applyConsent(choice: ConsentChoice | null) {
  if (initialized && JSON.stringify(window.adaptaConsentChoice) === JSON.stringify(choice)) return;
  initialized = true;
  revision++;
  window.adaptaConsentChoice = choice;
  window.adaptaMeasurementReady = false;
  if (!choice?.analytics) {
    lastPage = "";
    lastReferrer = "";
    pendingVitals.clear();
  }
  callbacks.forEach(callback => callback(googleConsent(choice)));
  window.dispatchEvent(new Event(consentEvent));
}

function installBridge() {
  window.adaptaConsentSubscribe ??= callback => {
    callbacks.add(callback);
    callback(googleConsent(validChoice()));
  };
  window.adaptaConsentReady ??= () => {
    const acknowledgedRevision = revision;
    // GTM applies native consent updates at the end of the current event.
    window.setTimeout(() => {
      if (revision !== acknowledgedRevision || window.adaptaMeasurementReady) return;
      window.adaptaMeasurementReady = true;
      window.dataLayer ??= [];
      window.dataLayer.push({ event: "adapta_consent_ready", ...googleConsent(validChoice()),
        page_location: cleanPageUrl(window.location.href), page_title: document.title });
      reportPage(window.location.pathname);
      flushVitals();
      window.dispatchEvent(new Event(consentReadyEvent));
    }, 0);
  };
}

function loadContainer() {
  installBridge();
  if (!gtmId || document.getElementById("adapta-gtm")) return;
  window.dataLayer ??= [];
  window.dataLayer.push({ ...googleConsent(validChoice()) });
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.id = "adapta-gtm";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
  script.onerror = () => script.remove();
  document.head.appendChild(script);
}

export function restoreMeasurementConsent() {
  documentUrl ||= cleanPageUrl(window.location.href);
  // On remount, retain a valid in-memory choice if both storage mechanisms failed.
  const choice = readConsent() ?? (initialized ? validChoice() : null);
  applyConsent(choice);
  if (choice?.analytics || choice?.advertising) loadContainer();
  return choice;
}

export function saveMeasurementConsent(choice: ConsentChoice | null) {
  documentUrl ||= cleanPageUrl(window.location.href);
  writeConsent(choice);
  applyConsent(choice);
  if (choice?.analytics || choice?.advertising) loadContainer();
}

export function reportPage(pathname: string) {
  if (!publicPath(pathname)) {
    lastPage = "";
    lastReferrer = "";
    return;
  }
  if (pathname !== window.location.pathname || !validChoice()?.analytics) return;
  const url = cleanPageUrl(window.location.href);
  if (lastPage === url) return;
  const sent = pushMeasurement({ event: "page_view", page_location: url, page_path: pathname,
    page_title: document.title, page_referrer: lastReferrer || cleanPageUrl(document.referrer) });
  // A failed/blocked push must remain retryable after native consent is ready.
  if (!sent) return;
  lastPage = url;
  lastReferrer = url;
  const product = products.find(item => pathname === `/produtos/${item.slug}`);
  if (product) pushMeasurement({ event: "view_item", ecommerce: { items: [{ item_id: product.slug, item_name: product.name, item_category: product.category }] } });
}

export type VitalMetric = { name: string; id: string; value: number; delta: number; rating: string };

export function reportVital(metric: VitalMetric) {
  if (!["LCP", "CLS", "INP", "FCP", "TTFB"].includes(metric.name) ||
      !Number.isFinite(metric.value) || !Number.isFinite(metric.delta) ||
      !publicPath(window.location.pathname) || !validChoice()?.analytics) return;
  const pending = pendingVitals.get(metric.name);
  pendingVitals.set(metric.name, { event: "web_vitals", metric_name: metric.name, metric_id: metric.id,
    metric_value: metric.value, metric_delta: metric.delta + (pending?.metric_id === metric.id ? Number(pending.metric_delta) : 0),
    metric_rating: metric.rating, page_location: documentUrl || cleanPageUrl(window.location.href) });
  flushVitals();
}

function flushVitals() {
  if (!validChoice()?.analytics) { pendingVitals.clear(); return; }
  for (const [name, event] of pendingVitals) {
    const signature = JSON.stringify([event.metric_id, event.metric_value]);
    if (sentVitals.get(name) === signature) { pendingVitals.delete(name); continue; }
    if (pushMeasurement(event)) {
      sentVitals.set(name, signature);
      pendingVitals.delete(name);
    }
  }
}
