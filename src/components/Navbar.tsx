"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/shop", label: "Boutique" },
  { href: "/login", label: "Connexion" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <header className="mifa-navbar">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.38em] text-[var(--mg)]"
            onClick={closeMenu}
          >
            Mifa Life
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="mifa-nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="mifa-menu-button md:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`mifa-drawer ${open ? "mifa-drawer-open" : ""}`}>
        <div className="mifa-drawer-panel">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--mg)]">
              Navigation
            </p>
            <button
              type="button"
              onClick={closeMenu}
              className="rounded-full border border-white/10 px-3 py-2 text-sm text-white"
            >
              Fermer
            </button>
          </div>

          <nav className="mt-6 grid gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-2xl border border-white/10 px-4 py-4 text-base font-medium text-white transition hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
