"use client";

import { useEffect, useRef, useState } from "react";

type BrandLogo3DProps = {
  className?: string;
  loading?: "lazy" | "eager";
};

type ModelProgressEvent = Event & {
  detail?: { totalProgress?: number };
};

const viewerScriptId = "adapta-model-viewer-runtime-4-3-1";
const modelSrc = "/models/adapta-prime-logo-3d-fast.glb";

export function BrandLogo3D({
  className = "",
  loading = "lazy",
}: BrandLogo3DProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<HTMLElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const [runtimeReady, setRuntimeReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setAutoRotate(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        preloadObserver.disconnect();
      },
      { rootMargin: "280px 0px" },
    );
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting),
    );

    preloadObserver.observe(frame);
    visibilityObserver.observe(frame);
    return () => {
      preloadObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    let active = true;

    const markReady = () => {
      window.customElements.whenDefined("model-viewer").then(() => {
        if (active) setRuntimeReady(true);
      });
    };
    const markError = () => {
      if (active) setError(true);
    };

    if (window.customElements.get("model-viewer")) {
      markReady();
      return () => {
        active = false;
      };
    }

    let script = document.getElementById(viewerScriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = viewerScriptId;
      script.type = "module";
      script.src = "/vendor/model-viewer/model-viewer.min.js?v=4.3.1-complete";
      document.head.appendChild(script);
    }

    script.addEventListener("load", markReady);
    script.addEventListener("error", markError);

    return () => {
      active = false;
      script?.removeEventListener("load", markReady);
      script?.removeEventListener("error", markError);
    };
  }, [shouldLoad]);

  useEffect(() => {
    if (!runtimeReady || !shouldLoad) return;
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleLoad = () => setLoaded(true);
    const handleError = () => setError(true);
    const handleProgress = (event: Event) => {
      const progress = (event as ModelProgressEvent).detail?.totalProgress;
      if (progress === 1) setLoaded(true);
    };

    viewer.addEventListener("load", handleLoad);
    viewer.addEventListener("error", handleError);
    viewer.addEventListener("progress", handleProgress);

    return () => {
      viewer.removeEventListener("load", handleLoad);
      viewer.removeEventListener("error", handleError);
      viewer.removeEventListener("progress", handleProgress);
    };
  }, [runtimeReady, shouldLoad]);

  return (
    <div
      ref={frameRef}
      className={`brand-logo-3d${loaded ? " is-loaded" : ""}${error ? " has-error" : ""}${className ? ` ${className}` : ""}`}
      role="img"
      aria-label="Logo tridimensional da Adapta Prime em rotação suave"
    >
      <model-viewer
        ref={viewerRef}
        aria-hidden="true"
        src={runtimeReady && shouldLoad ? modelSrc : undefined}
        alt="Logo 3D da Adapta Prime"
        loading={loading}
        reveal="auto"
        auto-rotate={autoRotate && inViewport}
        auto-rotate-delay="0"
        rotation-per-second="7deg"
        interaction-prompt="none"
        shadow-intensity="0"
        exposure="1.08"
        environment-image="neutral"
        camera-orbit="0deg 90deg 155%"
        field-of-view="30deg"
      />

      {!loaded && !error ? (
        <span className="brand-logo-3d__loading" role="status">
          Preparando logo 3D
        </span>
      ) : null}

      {error ? (
        <span className="brand-logo-3d__fallback" aria-hidden="true">
          ADAPTA PRIME
        </span>
      ) : null}
    </div>
  );
}
