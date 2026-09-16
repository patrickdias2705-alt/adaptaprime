"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getLeadPageLabel, getWhatsAppUrl, navigation } from "@/lib/site-config";
import { BrandLogo } from "./BrandLogo";

export function Header() {
  const pathname = usePathname();
  const headerOrigin = `${getLeadPageLabel(pathname)} > Cabeçalho`;
  const headerWhatsappHref = getWhatsAppUrl({
    origin: headerOrigin,
    request: "Quero falar com um especialista da Adapta Prime.",
  });
  const headerWhatsappExternal = headerWhatsappHref.startsWith("http");
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const shouldRestoreFocusRef = useRef(true);

  function isCurrentPage(href: string) {
    const [basePath, hash] = href.split("#");
    return !hash && (
      basePath === "/"
        ? pathname === "/"
        : pathname === basePath || pathname.startsWith(`${basePath}/`)
    );
  }

  function openMenu() {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    shouldRestoreFocusRef.current = true;
    setMenuOpen(true);
  }

  function closeMenu({ restoreFocus = true } = {}) {
    shouldRestoreFocusRef.current = restoreFocus;
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-is-open", menuOpen);
    return () => document.body.classList.remove("menu-is-open");
  }, [menuOpen]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1181px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu({ restoreFocus: false });
    };

    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const focusFrame = window.requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    });

    function getFocusableElements() {
      const menuLinks = menuRef.current
        ? Array.from(menuRef.current.querySelectorAll<HTMLElement>("a[href]"))
        : [];

      return [menuButtonRef.current, ...menuLinks].filter(
        (element): element is HTMLElement => Boolean(element && element.offsetParent !== null),
      );
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusableElements();
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);

      if (shouldRestoreFocusRef.current) {
        previousFocusRef.current?.focus();
      }
      previousFocusRef.current = null;
    };
  }, [menuOpen]);

  return (
    <header className={`site-header ${scrolled || pathname !== "/" ? "site-header--solid" : ""}`}>
      <div className="site-header__inner shell">
        <BrandLogo priority onNavigate={() => closeMenu({ restoreFocus: false })} />

        <Link
          href="/"
          className="mobile-brand-mark"
          aria-label="Adapta Prime — página inicial"
          onClick={() => closeMenu({ restoreFocus: false })}
        >
          <Image
            src="/brand/adapta-prime-symbol-mobile.png"
            alt=""
            width={500}
            height={500}
            sizes="56px"
            priority
            unoptimized
          />
        </Link>

        <nav className="desktop-nav" aria-label="Navegação principal">
          {navigation.map((item) => {
            const active = isCurrentPage(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={active ? "is-active" : ""}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          className="header-cta"
          href={headerWhatsappHref}
          target={headerWhatsappExternal ? "_blank" : undefined}
          rel={headerWhatsappExternal ? "noreferrer" : undefined}
          data-whatsapp-cta="true"
          data-lead-stage="discovery"
          data-lead-source={headerOrigin}
        >
          Falar com especialista
          <span aria-hidden="true">↗</span>
        </Link>

        <button
          ref={menuButtonRef}
          type="button"
          className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
          onClick={() => (menuOpen ? closeMenu() : openMenu())}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          <span />
          <span />
        </button>
      </div>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {menuOpen ? (
                <motion.div
                  ref={menuRef}
                  id="mobile-navigation"
                  className="mobile-menu"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Menu principal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
                >
                  <motion.button
                    type="button"
                    className="mobile-menu__scrim"
                    aria-label="Fechar menu"
                    tabIndex={-1}
                    onClick={() => closeMenu()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
                  />

                  <motion.aside
                    className="mobile-menu__panel"
                    initial={{ x: "105%", opacity: 0.72, scaleX: 0.94 }}
                    animate={{ x: 0, opacity: 1, scaleX: 1 }}
                    exit={{ x: "105%", opacity: 0, scaleX: 0.97 }}
                    transition={reduceMotion
                      ? { duration: 0.01 }
                      : { type: "spring", stiffness: 310, damping: 34, mass: 0.86 }}
                  >
                    <div className="mobile-menu__liquid" aria-hidden="true" />
                    <div className="mobile-menu__heading">
                      <Image
                        src="/brand/adapta-prime-symbol-mobile.png"
                        alt=""
                        width={500}
                        height={500}
                        sizes="42px"
                        unoptimized
                      />
                      <div>
                        <strong>Adapta Prime</strong>
                        <span>Navegação</span>
                      </div>
                    </div>

                    <nav className="mobile-menu__nav" aria-label="Navegação mobile">
                      {navigation.map((item, index) => {
                        const active = isCurrentPage(item.href);
                        return (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: reduceMotion ? 0 : 18 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: reduceMotion ? 0 : 0.08 + index * 0.045,
                              duration: reduceMotion ? 0.01 : 0.24,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          >
                            <Link
                              href={item.href}
                              className={active ? "is-active" : ""}
                              aria-current={active ? "page" : undefined}
                              onClick={() => closeMenu({ restoreFocus: false })}
                            >
                              <span>{item.label}</span>
                              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </nav>

                    <Link
                      className="mobile-menu__cta"
                      href={headerWhatsappHref}
                      target={headerWhatsappExternal ? "_blank" : undefined}
                      rel={headerWhatsappExternal ? "noreferrer" : undefined}
                      data-whatsapp-cta="true"
                      data-lead-stage="discovery"
                      data-lead-source={`${headerOrigin} > Menu mobile`}
                      onClick={() => closeMenu({ restoreFocus: false })}
                    >
                      Falar pelo WhatsApp
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </motion.aside>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </header>
  );
}
