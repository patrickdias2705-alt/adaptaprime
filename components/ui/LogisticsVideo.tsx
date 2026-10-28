"use client";

import { useEffect, useRef } from "react";

export function LogisticsVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isVisible = false;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;

    const syncPlayback = () => {
      if (reducedMotion.matches || connection?.saveData || !isVisible || document.hidden) {
        video.pause();
        return;
      }

      if (!video.getAttribute("src")) video.src = "/media/brasil-logistica.mp4";
      void video.play().catch(() => undefined);
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        syncPlayback();
      },
      { rootMargin: "120px 0px", threshold: 0.08 },
    );

    visibilityObserver.observe(video);
    reducedMotion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      visibilityObserver.disconnect();
      reducedMotion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, []);

  return (
    <div className="logistics-video">
      <video
        ref={videoRef}
        className="logistics-video__media"
        loop
        muted
        playsInline
        preload="none"
        poster="/media/brasil-logistica-poster.webp"
        aria-hidden="true"
      />
      <span className="logistics-video__shade" aria-hidden="true" />
    </div>
  );
}
