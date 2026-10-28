"use client";

import { useReportWebVitals } from "next/web-vitals";
import { cleanPageUrl, pushMeasurement } from "@/lib/measurement";

type Metric = Parameters<Parameters<typeof useReportWebVitals>[0]>[0];
function report(metric: Metric) {
  if (!["LCP", "CLS", "INP", "FCP", "TTFB"].includes(metric.name)) return;
  pushMeasurement({ event: "web_vitals", metric_name: metric.name, metric_id: metric.id,
    metric_value: metric.value, metric_delta: metric.delta, metric_rating: metric.rating,
    page_location: cleanPageUrl(window.location.href) });
}
export function WebVitalsReporter() { useReportWebVitals(report); return null; }
