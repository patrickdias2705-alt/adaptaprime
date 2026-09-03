"use client";

import { motion, useReducedMotion } from "framer-motion";

export function CompatibilityAxis({ label }: { label?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="compatibility-axis" aria-hidden="true">
      <motion.span
        className="compatibility-axis__line"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: reduceMotion ? 0.01 : 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className="compatibility-axis__node"
        initial={{ opacity: 0, y: -12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.5, delay: reduceMotion ? 0 : 0.55 }}
      />
      {label ? <span className="compatibility-axis__label">{label}</span> : null}
    </div>
  );
}

