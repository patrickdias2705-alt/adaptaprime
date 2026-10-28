export type ConsentChoice = { version: 1; analytics: boolean; advertising: boolean; updatedAt: number };
export type ConsentState = {
  analytics_storage: "granted" | "denied";
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "denied";
};
export const consentKey = "adapta:consent:v1";
export const consentEvent = "adapta:consent-change";
export const consentReadyEvent = "adapta:consent-ready";
export const preferencesEvent = "adapta:open-privacy";
export const consentMaxAge = 180 * 24 * 60 * 60 * 1000;
const configuredContainer = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-523HQHQ";
export const gtmId = /^GTM-[A-Z0-9]+$/.test(configuredContainer) ? configuredContainer : "";

export function parseConsent(value: string | null, now = Date.now()): ConsentChoice | null {
  try {
    const choice = JSON.parse(value ?? "null");
    if (choice?.version !== 1 || typeof choice.analytics !== "boolean" || typeof choice.advertising !== "boolean" ||
        !Number.isFinite(choice.updatedAt) || choice.updatedAt > now || now - choice.updatedAt > consentMaxAge) return null;
    return choice;
  } catch { return null; }
}

export function googleConsent(choice: ConsentChoice | null): ConsentState {
  return {
    analytics_storage: choice?.analytics ? "granted" : "denied",
    ad_storage: choice?.advertising ? "granted" : "denied",
    ad_user_data: choice?.advertising ? "granted" : "denied",
    ad_personalization: "denied",
  };
}

export function publicPath(pathname: string) {
  return !/^\/(crm|api)(\/|$)/.test(pathname);
}

// Do not send URL queries, fragment identifiers, WhatsApp messages or customer details.
export function cleanPageUrl(value: string) {
  try { const url = new URL(value); return /^https?:$/.test(url.protocol) ? `${url.origin}${url.pathname}` : ""; }
  catch { return ""; }
}

type LayerItem = Record<string, unknown>;
declare global {
  interface Window {
    dataLayer?: LayerItem[];
    adaptaConsentSubscribe?: (callback: (state: ConsentState) => void) => void;
    adaptaConsentReady?: () => void;
    adaptaMeasurementReady?: boolean;
    adaptaConsentChoice?: ConsentChoice | null;
  }
}

export function readConsent() {
  try { return parseConsent(window.localStorage.getItem(consentKey)); } catch { return null; }
}

export function pushMeasurement(event: LayerItem, category: "analytics" | "advertising" | "either" = "analytics") {
  if (typeof window === "undefined" || !publicPath(window.location.pathname) || !window.adaptaMeasurementReady) return;
  const choice = window.adaptaConsentChoice;
  if (!choice || !parseConsent(JSON.stringify(choice))) return;
  const allowed = category === "either" ? choice.analytics || choice.advertising : choice[category];
  if (!allowed) return;
  window.dataLayer ??= [];
  window.dataLayer.push({ ...event, ...googleConsent(choice) });
}
