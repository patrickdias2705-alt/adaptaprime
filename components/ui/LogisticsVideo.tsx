"use client";

import { useEffect, useRef } from "react";

export function LogisticsVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isVisible = true;

    const syncPlayback = () => {
      if (reducedMotion.matches || !isVisible) {
        video.pause();
        return;
      }

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
    syncPlayback();

    return () => {
      visibilityObserver.disconnect();
      reducedMotion.removeEventListener("change", syncPlayback);
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
        preload="metadata"
        poster="/media/brasil-logistica-poster.webp"
        aria-hidden="true"
      >
        <source src="/media/brasil-logistica.mp4" type="video/mp4" />
      </video>
      <span className="logistics-video__shade" aria-hidden="true" />
    </div>
  );
}
