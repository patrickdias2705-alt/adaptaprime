"use client";

import { usePathname } from "next/navigation";
import { LeadClickTracker } from "@/components/analytics/LeadClickTracker";
import { GoogleMeasurement } from "@/components/analytics/GoogleMeasurement";
import { WebVitalsReporter } from "@/components/analytics/WebVitalsReporter";
import { Footer } from "./Footer";
import { FloatingContact } from "./FloatingContact";
import { Header } from "./Header";
import { LightBackgroundWave } from "./LightBackgroundWave";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/crm" || pathname.startsWith("/crm/")) return <>{children}</>;
  return <><a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a><LightBackgroundWave /><Header /><main id="conteudo-principal">{children}</main><Footer /><FloatingContact /><GoogleMeasurement /><LeadClickTracker /><WebVitalsReporter /></>;
}
