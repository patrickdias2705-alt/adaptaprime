"use client";

import { useEffect, useState } from "react";
import { GradientWave } from "@/components/ui/gradient-wave";

const lightPalette = ["#000103", "#031827", "#008be6", "#00101d"];
const lightFrequency: [number, number] = [0.00012, 0.00084];
const lightDeform = { incline: 0.42, noiseAmp: 255, noiseFlow: 4.5 };

export function LightBackgroundWave() {
  const [isVisible, setIsVisible] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    const animationMedia = window.matchMedia(
      "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
    );
    const updateAnimationMode = () => setCanAnimate(animationMedia.matches);
    const frame = window.requestAnimationFrame(updateAnimationMode);

    animationMedia.addEventListener("change", updateAnimationMode);
    return () => {
      window.cancelAnimationFrame(frame);
      animationMedia.removeEventListener("change", updateAnimationMode);
    };
  }, []);

  useEffect(() => {
    const visibleSections = new Set<Element>();
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleSections.add(entry.target);
          else visibleSections.delete(entry.target);
        });
        setIsVisible(visibleSections.size > 0);
      },
      { rootMargin: "160px 0px" },
    );

    function observeLightSections() {
      sectionObserver.disconnect();
      visibleSections.clear();
      document.querySelectorAll(".section--ice").forEach((section) => {
        sectionObserver.observe(section);
      });
    }

    observeLightSections();
    const page = document.getElementById("conteudo-principal");
    const mutationObserver = new MutationObserver(observeLightSections);
    if (page) mutationObserver.observe(page, { childList: true, subtree: false });

    return () => {
      mutationObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <GradientWave
      colors={lightPalette}
      noiseFrequency={lightFrequency}
      deform={lightDeform}
      noiseSpeed={0.000006}
      shadowPower={6}
      darkenTop
      enabled={canAnimate}
      isPlaying={isVisible && canAnimate}
      className="site-light-wave"
    />
  );
}
