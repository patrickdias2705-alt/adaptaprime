"use client";

import { useEffect } from "react";

type LeadClick = {
  event: "whatsapp_click";
  lead_stage: string;
  lead_source: string;
  lead_interest: string;
};

declare global {
  interface Window {
    dataLayer?: LeadClick[];
  }
}

export function LeadClickTracker() {
  useEffect(() => {
    const trackClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const cta = target.closest<HTMLElement>("[data-whatsapp-cta='true']");
      if (!cta) return;

      const detail: LeadClick = {
        event: "whatsapp_click",
        lead_stage: cta.dataset.leadStage ?? "discovery",
        lead_source: cta.dataset.leadSource ?? "site",
        lead_interest: cta.dataset.leadInterest ?? "não informado",
      };

      window.dataLayer?.push(detail);
      window.dispatchEvent(new CustomEvent("adapta:whatsapp-click", { detail }));
    };

    document.addEventListener("click", trackClick);
    return () => document.removeEventListener("click", trackClick);
  }, []);

  return null;
}
