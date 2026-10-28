export type ConsentChoice = { version: 1; analytics: boolean; advertising: boolean; updatedAt: number };
export type ConsentState = {
  analytics_storage: "granted" | "denied";
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "denied";
};
export const consentKey = "adapta:consent:v1";
export const consentCookie = "adapta_consent_v1";
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
    return { version: 1, analytics: choice.analytics, advertising: choice.advertising, updatedAt: choice.updatedAt };
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

function readConsentCookie() {
  try {
    const value = document.cookie.split(";").map(part => part.trim()).find(part => part.startsWith(`${consentCookie}=`));
    return value ? parseConsent(decodeURIComponent(value.slice(consentCookie.length + 1))) : null;
  } catch { return null; }
}

export function readConsent() {
  let stored: ConsentChoice | null = null;
  try { stored = parseConsent(window.localStorage.getItem(consentKey)); } catch { /* Cookie fallback. */ }
  const cookie = readConsentCookie();
  // A failed write in either store must not resurrect an older permission.
  if (cookie && stored && cookie.updatedAt === stored.updatedAt) {
    return { ...stored, analytics: stored.analytics && cookie.analytics, advertising: stored.advertising && cookie.advertising };
  }
  return cookie && (!stored || cookie.updatedAt > stored.updatedAt) ? cookie : stored;
}

export function writeConsent(choice: ConsentChoice | null) {
  try {
    if (choice) window.localStorage.setItem(consentKey, JSON.stringify(choice));
    else window.localStorage.removeItem(consentKey);
  } catch { /* Keep applying the choice even if browser storage is restricted. */ }
  try {
    const remaining = choice ? Math.max(0, Math.floor((choice.updatedAt + consentMaxAge - Date.now()) / 1000)) : 0;
    document.cookie = `${consentCookie}=${choice ? encodeURIComponent(JSON.stringify(choice)) : ""}; Path=/; Max-Age=${remaining}; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
  } catch { /* If both stores are blocked, the choice lasts for this document. */ }
}

export function pushMeasurement(event: LayerItem, category: "analytics" | "advertising" | "either" = "analytics") {
  if (typeof window === "undefined" || !publicPath(window.location.pathname) || !window.adaptaMeasurementReady) return false;
  const choice = window.adaptaConsentChoice;
  if (!choice || !parseConsent(JSON.stringify(choice))) return false;
  const allowed = category === "either" ? choice.analytics || choice.advertising : choice[category];
  if (!allowed) return false;
  window.dataLayer ??= [];
  window.dataLayer.push({ ...event, ...googleConsent(choice) });
  return true;
}
