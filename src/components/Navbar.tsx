"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/shop", label: "Boutique" },
  { href: "/login", label: "Connexion" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header id="nav">
        <div className="nv">
          <Link href="/" className="logo" onClick={closeMenu}>
            <div className="logo-bars">
              <span />
              <span />
              <span />
            </div>
            <div className="logo-text">
              <em>MIFA</em> LIFE
            </div>
            <div className="flag-mini" aria-hidden="true">
              <span style={{ background: "var(--mg)" }} />
              <span style={{ background: "var(--my)" }} />
              <span style={{ background: "var(--mr)" }} />
            </div>
          </Link>

          <form action="/shop" className="nv-search">
            <input
              id="navSearch"
              name="q"
              className="si"
              type="search"
              placeholder="Rechercher un produit..."
            />
            <button type="submit" className="si-btn" aria-label="Rechercher">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          <nav className="nv-links" aria-label="Navigation principale">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nv-lnk">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nv-r">
            <Link href="/cart" className="ic-btn" aria-label="Panier">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="ic-bdg" style={{ display: itemCount ? "flex" : "none" }}>
                {itemCount}
              </span>
            </Link>

            <button
              id="burger"
              type="button"
              className={`burger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <button
        id="mob-bg"
        className={menuOpen ? "on" : ""}
        onClick={closeMenu}
        aria-label="Fermer le menu"
      />

      <aside id="mob-dr" className={menuOpen ? "on" : ""} aria-label="Menu mobile">
        <div className="mob-hd">
          <div className="mob-logo">
            <em>MIFA</em> LIFE
          </div>
          <button type="button" className="mob-cl" onClick={closeMenu} aria-label="Fermer">
            ×
          </button>
        </div>

        <div className="mob-sec-ti">Navigation</div>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="mob-l" onClick={closeMenu}>
            {link.label}
          </Link>
        ))}
        <Link href="/cart" className="mob-l" onClick={closeMenu}>
          Panier{itemCount ? ` (${itemCount})` : ""}
        </Link>

        <div className="mob-sep" />
        <div className="mob-auth">
          <Link href="/login" onClick={closeMenu}>
            Connexion
          </Link>
        </div>
      </aside>
    </>
  );
}
