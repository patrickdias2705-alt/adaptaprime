"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type CorridorPath = {
  perspective?: number;
  cardWidth?: number;
  cardHeight?: number;
  cardRadius?: number;
  birthHeight?: number;
  exitHeight?: number;
  railBirth?: number;
  railExit?: number;
  fan?: number;
  turnBirth?: number;
  turnExit?: number;
  stops?: number;
};

const PATH: Required<CorridorPath> = {
  perspective: 30,
  cardWidth: 18,
  cardHeight: 25,
  cardRadius: 0.4,
  birthHeight: 2.6,
  exitHeight: 46,
  railBirth: -11,
  railExit: 44,
  fan: 3.3,
  turnBirth: 6,
  turnExit: 28,
  stops: 24,
};

function keyframes(dir: 1 | -1, name: string, p: Required<CorridorPath>) {
  const steps: string[] = [];

  for (let step = 0; step <= p.stops; step += 1) {
    const progress = step / p.stops;
    const scale =
      (p.birthHeight / p.cardHeight) *
      Math.pow(p.exitHeight / p.birthHeight, progress);
    const depth = p.perspective * (1 - 1 / scale);
    const rail =
      p.railExit -
      (p.railExit - p.railBirth) * Math.pow(1 - progress, p.fan);
    const turn = p.turnBirth + (p.turnExit - p.turnBirth) * progress;

    steps.push(
      `${(progress * 100).toFixed(2)}%{transform:translate3d(${(
        dir * rail
      ).toFixed(2)}cqw,0,${depth.toFixed(2)}cqw) rotateY(${(
        -dir * turn
      ).toFixed(2)}deg)}`,
    );
  }

  return `@keyframes ${name}{${steps.join("")}}`;
}

export type StreamImage = {
  src: string;
  alt?: string;
};

export type ImageStreamHeroProps = {
  images: StreamImage[];
  cards?: number;
  speed?: number;
  axis?: number;
  path?: CorridorPath;
  children?: React.ReactNode;
  className?: string;
};

export function ImageStreamHero({
  images,
  cards = 9,
  speed = 18,
  axis = 55,
  path,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & ImageStreamHeroProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [streamActive, setStreamActive] = React.useState(false);
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const right = `ish-r-${id}`;
  const left = `ish-l-${id}`;
  const card = `ish-c-${id}`;
  const corridor = React.useMemo(() => ({ ...PATH, ...path }), [path]);

  const css = React.useMemo(
    () =>
      `${keyframes(1, right, corridor)}${keyframes(-1, left, corridor)}` +
      `@media(prefers-reduced-motion:reduce){.${card}{animation-play-state:paused}}`,
    [right, left, card, corridor],
  );

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setStreamActive(entry.isIntersecting),
      { rootMargin: "180px 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      data-stream-active={streamActive ? "true" : "false"}
      className={cn("relative overflow-hidden", className)}
      {...props}
      style={{ containerType: "inline-size", ...props.style }}
    >
      <style>{css}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          perspective: `${corridor.perspective}cqw`,
          perspectiveOrigin: `50% ${axis}%`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {Array.from({ length: cards }, (_, index) => {
            const image = images[index % Math.max(images.length, 1)];
            const animationDelay = `${-(index * speed) / cards}s`;

            return (
              <React.Fragment key={`stream-pair-${index}`}>
                {[
                  { animationName: right, side: "right" },
                  { animationName: left, side: "left" },
                ].map(({ animationName, side }) => (
                <div
                  key={`${animationName}-${index}`}
                  data-stream-side={side}
                  className={cn(
                    card,
                    "absolute overflow-hidden border border-white/15 bg-[#07090d] shadow-2xl",
                  )}
                  style={{
                    left: "50%",
                    top: `${axis}%`,
                    width: `${corridor.cardWidth}cqw`,
                    height: `${corridor.cardHeight}cqw`,
                    marginLeft: `${-corridor.cardWidth / 2}cqw`,
                    marginTop: `${-corridor.cardHeight / 2}cqw`,
                    borderRadius: `${corridor.cardRadius}cqw`,
                    animation: `${animationName} ${speed}s linear infinite`,
                    animationDelay,
                    animationPlayState: streamActive ? "running" : "paused",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {image ? (
                    // Native img keeps the animated card light and the logo is local.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image.src}
                      alt={image.alt ?? ""}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain p-[7%]"
                      draggable={false}
                    />
                  ) : (
                    <span className="image-stream-card__gradient" />
                  )}
                </div>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {children}
    </div>
  );
}

export default ImageStreamHero;
