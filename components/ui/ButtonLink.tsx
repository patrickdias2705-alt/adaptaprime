import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "text" | "light";
  className?: string;
  ariaLabel?: string;
  leadSource?: string;
  leadStage?: "discovery" | "category" | "product" | "service";
  leadInterest?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  ariaLabel,
  leadSource,
  leadStage,
  leadInterest,
}: ButtonLinkProps) {
  const external = href.startsWith("http");

  return (
    <Link
      href={href}
      className={`button-link button-link--${variant} ${className}`}
      aria-label={ariaLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      data-whatsapp-cta={leadSource ? "true" : undefined}
      data-lead-source={leadSource}
      data-lead-stage={leadStage}
      data-lead-interest={leadInterest}
    >
      <span>{children}</span>
      <span className="button-link__arrow" aria-hidden="true">
        ↗
      </span>
    </Link>
  );
}
