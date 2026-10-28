"use client";

import { useReportWebVitals } from "next/web-vitals";
import { useEffect, useState } from "react";
import { consentEvent } from "@/lib/measurement";
import { reportVital } from "@/lib/measurement-runtime";

type Metric = Parameters<Parameters<typeof useReportWebVitals>[0]>[0];
function report(metric: Metric) {
  reportVital(metric);
}

function VitalsCollection() { useReportWebVitals(report); return null; }

export function WebVitalsReporter() {
  const [started, setStarted] = useState(false);
  useEffect(() => {
    // Register once after opting in. The runtime also gates every callback after revocation.
    const start = () => { if (window.adaptaConsentChoice?.analytics) setStarted(true); };
    start();
    window.addEventListener(consentEvent, start);
    return () => window.removeEventListener(consentEvent, start);
  }, []);
  return started ? <VitalsCollection /> : null;
}
