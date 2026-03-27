"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/shop", label: "Boutique" },
  { href: "/login", label: "Connexion" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            onClick={closeMenu}
            className="text-sm font-semibold uppercase tracking-[0.38em] text-emerald-700"
          >
            MIFA LIFE
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 transition hover:text-emerald-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-emerald-600 hover:text-emerald-700"
              aria-label="Panier"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {itemCount ? (
                <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              ) : null}
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 md:hidden"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
            >
              <span className="sr-only">Menu</span>
              <div className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={closeMenu}>
          <div
            className="absolute right-0 top-0 flex h-full w-72 flex-col bg-white px-6 py-20 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 text-xs font-semibold uppercase tracking-[0.32em] text-emerald-700">
              Navigation
            </div>
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 transition hover:border-emerald-600 hover:text-emerald-700"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/cart"
                onClick={closeMenu}
                className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 transition hover:border-emerald-600 hover:text-emerald-700"
              >
                Panier{itemCount ? ` (${itemCount})` : ""}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
