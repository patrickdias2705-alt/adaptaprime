"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
};

export function Reveal({
  children,
  className,
  delay = 0,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: reduceMotion ? 0.01 : 0.72,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function LineReveal({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      aria-hidden="true"
      className={className ?? "line-reveal"}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.9, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
