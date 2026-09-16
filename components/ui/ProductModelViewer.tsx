"use client";

import { useEffect, useRef, useState } from "react";

type ProductModelViewerProps = {
  src: string;
  name: string;
  variant?: "reto" | "angulado" | "limas";
};

type ModelViewerElement = HTMLElement & {
  cameraOrbit: string;
  fieldOfView: string;
  jumpCameraToGoal?: () => void;
};

type ModelProgressEvent = Event & {
  detail?: { totalProgress?: number };
};

const viewerScriptId = "adapta-model-viewer-runtime-4-3-1";
const initialCameraOrbit = "25deg 70deg 150%";
const initialFieldOfView = "30deg";

export function ProductModelViewer({
  src,
  name,
  variant = "reto",
}: ProductModelViewerProps) {
  const viewerRef = useRef<ModelViewerElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const [runtimeReady, setRuntimeReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [fullscreenAvailable, setFullscreenAvailable] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fallbackExpanded, setFallbackExpanded] = useState(false);
  const [touchAction, setTouchAction] = useState<"pan-y" | "none">("pan-y");
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const initialStateFrame = window.requestAnimationFrame(() => {
      setAutoRotate(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
      setFullscreenAvailable(Boolean(document.fullscreenEnabled));
    });

    const handleFullscreen = () => {
      setIsFullscreen(document.fullscreenElement === frameRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => {
      window.cancelAnimationFrame(initialStateFrame);
      document.removeEventListener("fullscreenchange", handleFullscreen);
    };
  }, []);

  useEffect(() => {
    const coarsePointer = window.matchMedia("(hover: none) and (pointer: coarse)");
    const syncTouchAction = () => setTouchAction(coarsePointer.matches ? "none" : "pan-y");

    syncTouchAction();
    coarsePointer.addEventListener("change", syncTouchAction);
    return () => coarsePointer.removeEventListener("change", syncTouchAction);
  }, []);

  useEffect(() => {
    if (!fallbackExpanded) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFallbackExpanded(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fallbackExpanded]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        preloadObserver.disconnect();
      },
      { rootMargin: "320px 0px" },
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

    setLoaded(false);
    setProgress(0);
    setError(false);

    const handleLoad = () => {
      setLoaded(true);
      setProgress(1);
    };
    const handleError = () => setError(true);
    const handleProgress = (event: Event) => {
      const nextProgress = (event as ModelProgressEvent).detail?.totalProgress;
      if (typeof nextProgress === "number") setProgress(nextProgress);
    };
    const handlePointerDown = () => {
      setIsInteracting(true);
      setAutoRotate(false);
    };
    const handlePointerEnd = () => setIsInteracting(false);

    viewer.addEventListener("load", handleLoad);
    viewer.addEventListener("error", handleError);
    viewer.addEventListener("progress", handleProgress);
    viewer.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerEnd);
    window.addEventListener("pointercancel", handlePointerEnd);

    return () => {
      viewer.removeEventListener("load", handleLoad);
      viewer.removeEventListener("error", handleError);
      viewer.removeEventListener("progress", handleProgress);
      viewer.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
    };
  }, [src, runtimeReady, shouldLoad]);

  function resetCamera() {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.cameraOrbit = initialCameraOrbit;
    viewer.fieldOfView = initialFieldOfView;
    viewer.jumpCameraToGoal?.();
  }

  async function toggleFullscreen() {
    if (fallbackExpanded) {
      setFallbackExpanded(false);
      return;
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (fullscreenAvailable && frameRef.current?.requestFullscreen) {
        await frameRef.current.requestFullscreen();
      } else {
        setFallbackExpanded(true);
      }
    } catch {
      setFullscreenAvailable(false);
      setFallbackExpanded(true);
    }
  }

  const progressLabel = Math.round(progress * 100);
  const expanded = isFullscreen || fallbackExpanded;
  const touchOptimized = touchAction === "none";

  return (
    <div
      ref={frameRef}
      className={`product-model-viewer product-model-viewer--${variant}${isInteracting ? " is-interacting" : ""}${fallbackExpanded ? " is-expanded" : ""}`}
      data-touch-optimized={touchOptimized}
    >
      <div className="product-model-viewer__chrome" aria-hidden="true">
        <span>Visualização 3D</span>
        <i />
        <small>{name}</small>
      </div>

      <model-viewer
        ref={viewerRef}
        src={runtimeReady && shouldLoad ? src : undefined}
        alt={`Modelo 3D interativo do ${name}`}
        loading="eager"
        reveal="auto"
        camera-controls
        touch-action={touchAction}
        disable-pan
        orbit-sensitivity="1.18"
        zoom-sensitivity="1.05"
        auto-rotate={autoRotate && inViewport}
        auto-rotate-delay="1200"
        rotation-per-second="14deg"
        interaction-prompt="auto"
        interaction-prompt-style="basic"
        shadow-intensity="1.15"
        shadow-softness="0.85"
        exposure="1.05"
        environment-image="neutral"
        camera-orbit={initialCameraOrbit}
        min-camera-orbit="auto 28deg 65%"
        max-camera-orbit="auto 145deg 250%"
        field-of-view={initialFieldOfView}
        min-field-of-view="18deg"
        max-field-of-view="48deg"
      />

      {!loaded && !error ? (
        <div className="product-model-viewer__loading" role="status" aria-live="polite">
          <span>Preparando visualização 3D</span>
          <div aria-hidden="true"><i style={{ width: `${progressLabel}%` }} /></div>
          <small>{runtimeReady ? `${progressLabel}%` : "Carregando tecnologia 3D"}</small>
        </div>
      ) : null}

      {error ? (
        <div className="product-model-viewer__error" role="alert">
          <strong>Visualização 3D indisponível</strong>
          <span>Recarregue a página para explorar o {name}.</span>
        </div>
      ) : null}

      <div className={`product-model-viewer__hud${loaded ? " is-visible" : ""}`}>
        <p>
          <span aria-hidden="true">↔</span>
          {touchOptimized ? "Arraste livremente para girar" : "Arraste para girar"}
          <i aria-hidden="true" />
          {touchOptimized ? "Pinça para aproximar" : "Pinça ou scroll para aproximar"}
        </p>
        <div className="product-model-viewer__controls" aria-label="Controles do modelo 3D">
          <button type="button" onClick={() => setAutoRotate((current) => !current)} aria-pressed={autoRotate}>
            <span aria-hidden="true">{autoRotate ? "Ⅱ" : "↻"}</span>
            {autoRotate ? "Pausar giro" : "Ativar giro"}
          </button>
          <button type="button" onClick={resetCamera}>
            <span aria-hidden="true">⌖</span>
            Recentrar
          </button>
          <button type="button" onClick={toggleFullscreen} aria-pressed={expanded}>
            <span aria-hidden="true">⛶</span>
            {expanded ? "Fechar ampliação" : "Ampliar 3D"}
          </button>
        </div>
      </div>
    </div>
  );
}
