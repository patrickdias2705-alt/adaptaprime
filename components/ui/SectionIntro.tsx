import type { ReactNode } from "react";

type SectionIntroProps = {
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
};

export function SectionIntro({
  eyebrow,
  title,
  body,
  tone = "dark",
  className = "",
}: SectionIntroProps) {
  return (
    <div className={`section-intro section-intro--${tone} ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display-title">{title}</h2>
      {body ? <div className="section-intro__body">{body}</div> : null}
    </div>
  );
}

