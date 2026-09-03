import Image from "next/image";
import Link from "next/link";

export function BrandLogo({
  priority = false,
  onNavigate,
}: {
  priority?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href="/"
      className="brand-logo"
      aria-label="Adapta Prime — página inicial"
      onClick={onNavigate}
    >
      <Image
        src="/brand/adapta-prime-logo.png"
        alt="Adapta Prime"
        width={2172}
        height={724}
        sizes="(max-width: 640px) 156px, 190px"
        priority={priority}
        unoptimized
      />
    </Link>
  );
}
