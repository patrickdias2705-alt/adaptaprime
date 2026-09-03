import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "text" | "light";
  className?: string;
  ariaLabel?: string;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  ariaLabel,
}: ButtonLinkProps) {
  const external = href.startsWith("http");

  return (
    <Link
      href={href}
      className={`button-link button-link--${variant} ${className}`}
      aria-label={ariaLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <span>{children}</span>
      <span className="button-link__arrow" aria-hidden="true">
        ↗
      </span>
    </Link>
  );
}

