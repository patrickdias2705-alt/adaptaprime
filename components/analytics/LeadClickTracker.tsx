"use client";

import { useEffect } from "react";
import { cleanPageUrl, pushMeasurement } from "@/lib/measurement";

type LeadClick = {
  event: "whatsapp_click";
  lead_stage: string;
  lead_source: string;
  lead_interest: string;
};

export function LeadClickTracker() {
  useEffect(() => {
    const lastClicks = new WeakMap<Element, number>();
    const trackClick = (event: MouseEvent) => {
      if (event.defaultPrevented || (event.type === "click" ? event.button !== 0 : event.button !== 1)) return;
      const target = event.target;
      if (!(target instanceof Element)) return;

      const cta = target.closest<HTMLAnchorElement>("a[data-whatsapp-cta='true']");
      if (!cta) return;
      const destination = new URL(cta.href, window.location.origin);
      if (destination.protocol !== "https:" || destination.hostname !== "wa.me") return;
      const now = Date.now();
      if (now - (lastClicks.get(cta) ?? 0) < 900) return;
      lastClicks.set(cta, now);

      const detail: LeadClick = {
        event: "whatsapp_click",
        lead_stage: cta.dataset.leadStage ?? "discovery",
        lead_source: cta.dataset.leadSource ?? "site",
        lead_interest: cta.dataset.leadInterest ?? "não informado",
      };

      pushMeasurement({ ...detail, page_location: cleanPageUrl(window.location.href), contact_method: "whatsapp" }, "either");
      window.dispatchEvent(new CustomEvent("adapta:whatsapp-click", { detail }));
    };

    document.addEventListener("click", trackClick);
    document.addEventListener("auxclick", trackClick);
    return () => {
      document.removeEventListener("click", trackClick);
      document.removeEventListener("auxclick", trackClick);
    };
  }, []);

  return null;
}
