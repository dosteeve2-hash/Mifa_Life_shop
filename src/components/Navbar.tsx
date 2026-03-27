'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const NAV_LINKS = [
  { href: '/',      label: 'Accueil'  },
  { href: '/shop',  label: 'Boutique' },
  { href: '/login', label: 'Connexion'},
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname        = usePathname();
  const { totalItems }  = useCart();

  return (
    <>
      {/* Bande tricolore Mali */}
      <div className="flex h-[3px] w-full">
        <span className="flex-1 bg-[#009739]" />
        <span className="flex-1 bg-[#FCD116]" />
        <span className="flex-1 bg-[#CE1126]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* ── LOGO ── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            {/* Barres décoratives */}
            <div className="flex flex-col gap-[3px]">
              <span className="block h-[2px] w-6 rounded-full bg-[#009739]" />
              <span className="block h-[2px] w-4 rounded-full bg-[#009739]" />
              <span className="block h-[2px] w-5 rounded-full bg-[#009739]" />
            </div>
            <span className="font-serif text-[17px] font-bold tracking-tight text-gray-900">
              <span className="text-[#009739]">MIFA</span> LIFE
            </span>
            {/* Mini drapeau */}
            <div className="flex overflow-hidden rounded-[2px] shadow-sm">
              <span className="block h-2.5 w-[5px] bg-[#009739]" />
              <span className="block h-2.5 w-[5px] bg-[#FCD116]" />
              <span className="block h-2.5 w-[5px] bg-[#CE1126]" />
            </div>
          </Link>

          {/* ── LIENS DESKTOP ── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-[#009739]/10 text-[#009739]'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* ── ACTIONS DROITE ── */}
          <div className="flex items-center gap-2">

            {/* Panier */}
            <Link
              href="/cart"
              aria-label="Panier"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#009739]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#CE1126] px-1 text-[9px] font-bold text-white">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Bouton connexion desktop */}
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[#009739] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#007a2e]"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Connexion
            </Link>

            {/* Burger mobile */}
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[4px] rounded-lg border border-gray-200 transition-colors hover:border-[#009739] hover:bg-[#009739]/5 md:hidden"
            >
              <span className={`block h-[2px] w-[15px] rounded-full bg-gray-700 transition-transform duration-200 ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
              <span className={`block h-[2px] w-[15px] rounded-full bg-gray-700 transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-[2px] w-[15px] rounded-full bg-gray-700 transition-transform duration-200 ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── MENU MOBILE DÉROULANT ── */}
        <div className={`overflow-hidden border-t border-gray-100 transition-all duration-300 ease-in-out md:hidden ${open ? 'max-h-96' : 'max-h-0'}`}>
          <nav className="flex flex-col px-4 py-3 gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-[#009739]/10 text-[#009739]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <span>Panier</span>
              {totalItems > 0 && (
                <span className="rounded-full bg-[#CE1126] px-2 py-0.5 text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
