"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getWhatsAppUrl, navigation } from "@/lib/site-config";
import { BrandLogo } from "./BrandLogo";

export function Header() {
  const pathname = usePathname();
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
    if (!menuOpen) return;

    const focusFrame = window.requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    });

    function getFocusableElements() {
      const header = menuRef.current?.closest("header");
      if (!header) return [];

      return Array.from(
        header.querySelectorAll<HTMLElement>(
          ".menu-toggle, #mobile-navigation a[href]",
        ),
      ).filter((element) => element.offsetParent !== null);
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

        <Link className="header-cta" href={getWhatsAppUrl("Olá, quero falar com um especialista da Adapta Prime.")}>
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

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            ref={menuRef}
            id="mobile-navigation"
            className="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.24 }}
          >
            <nav className="shell" aria-label="Navegação mobile">
              {navigation.map((item) => {
                const active = isCurrentPage(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => closeMenu({ restoreFocus: false })}
                  >
                    <span>{item.label}</span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                );
              })}
              <Link className="mobile-menu__cta" href={getWhatsAppUrl("Olá, quero falar com um especialista da Adapta Prime.")} onClick={() => closeMenu({ restoreFocus: false })}>
                Falar com especialista
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
