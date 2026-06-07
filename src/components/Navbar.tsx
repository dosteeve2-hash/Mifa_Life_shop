'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/shop', label: 'Boutique' },
  { href: '/shop?sort=sale', label: 'Promos' },
  { href: '/contact', label: 'Contact' },
];

const CATEGORIES = [
  { label: 'Électronique', emoji: '💻', href: '/shop?cat=electronique' },
  { label: 'Mode', emoji: '👗', href: '/shop?cat=mode' },
  { label: 'Maison', emoji: '🏠', href: '/shop?cat=maison' },
  { label: 'Sport', emoji: '⚽', href: '/shop?cat=sport' },
  { label: 'Beauté', emoji: '💄', href: '/shop?cat=beaute' },
  { label: 'Enfants', emoji: '🧸', href: '/shop?cat=enfants' },
  { label: 'Auto', emoji: '🚗', href: '/shop?cat=auto' },
  { label: 'Alimentation', emoji: '🛒', href: '/shop?cat=alimentation' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [badgePulse, setBadgePulse] = useState(false);
  const prevTotalRef = useRef(totalItems);

  const { scrollY } = useScroll();
  const shadowOpacity = useTransform(scrollY, [0, 60], [0, 1]);

  // Pulse cart badge when items added
  useEffect(() => {
    if (totalItems > prevTotalRef.current) {
      setBadgePulse(true);
      const t = setTimeout(() => setBadgePulse(false), 600);
      return () => clearTimeout(t);
    }
    prevTotalRef.current = totalItems;
  }, [totalItems]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* Mali stripe */}
      <div className="mali-stripe" style={{ position: 'sticky', top: 0, zIndex: 601 }}>
        <span style={{ background: '#009A00' }} />
        <span style={{ background: '#FFD700' }} />
        <span style={{ background: '#CE1126' }} />
      </div>

      <motion.div
        style={{ boxShadow: useTransform(shadowOpacity, (v) => `0 2px 20px rgba(0,0,0,${v * 0.12})`) }}
        className="sticky z-[600]"
        id="nav"
      >
        {/* Main navbar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ background: 'rgba(246,244,240,0.97)', backdropFilter: 'blur(18px)', borderBottom: '1px solid var(--bg3)' }}
        >
          <div className="nv">
            {/* Logo */}
            <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
              <div className="logo-bars">
                <span />
                <span />
                <span />
              </div>
              <div>
                <div className="logo-text">
                  <em>MIFA</em> LIFE
                </div>
                <div style={{ fontSize: '9px', color: 'var(--t4)', fontWeight: 600, letterSpacing: '0.06em' }}>
                  MALI PREMIUM
                </div>
              </div>
              <div className="flag-mini">
                <span style={{ background: '#009A00' }} />
                <span style={{ background: '#FFD700' }} />
                <span style={{ background: '#CE1126' }} />
              </div>
            </Link>

            {/* Desktop nav links */}
            <motion.nav
              className="nv-links"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
              }}
            >
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{ hidden: { opacity: 0, y: -8 }, visible: { opacity: 1, y: 0 } }}
                >
                  <Link
                    href={link.href}
                    className="nv-lnk"
                    style={{
                      color: pathname === link.href ? 'var(--em)' : undefined,
                      background: pathname === link.href ? 'var(--em-l)' : undefined,
                    }}
                  >
                    {link.label}
                    {pathname === link.href && (
                      <motion.div
                        layoutId="nav-underline"
                        style={{
                          position: 'absolute',
                          bottom: -2,
                          left: 8,
                          right: 8,
                          height: 2,
                          background: 'var(--em)',
                          borderRadius: 1,
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>

            {/* Search bar */}
            <motion.form
              className="nv-search"
              onSubmit={handleSearch}
              animate={{ width: searchFocused ? '560px' : undefined }}
              transition={{ duration: 0.3 }}
            >
              <input
                className="si"
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <button type="submit" className="si-btn" aria-label="Rechercher">
                <Search size={14} />
              </button>
            </motion.form>

            {/* Right icons */}
            <div className="nv-r">
              <button className="ic-btn" aria-label="Liste de souhaits">
                <Heart size={18} />
              </button>

              <button
                className="ic-btn"
                aria-label="Mon panier"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag size={18} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="badge"
                      className="ic-bdg"
                      initial={{ scale: 0 }}
                      animate={{ scale: badgePulse ? 1.35 : 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button className="ic-btn" aria-label="Mon compte">
                <User size={18} />
              </button>

              <Link href="/login" className="auth-btn">
                <User size={14} />
                Connexion
              </Link>

              {/* Hamburger */}
              <button
                className={`burger ${drawerOpen ? 'open' : ''}`}
                onClick={() => setDrawerOpen((o) => !o)}
                aria-label="Menu"
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>
        </motion.header>

        {/* Category subnav */}
        <div id="subnav" className="hidden sm:block">
          <div className="sn-in">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className={`sn-a ${pathname.includes(cat.href.split('?')[1] ?? '__') ? 'on' : ''}`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mobile drawer backdrop */}
      <div
        id="mob-bg"
        className={drawerOpen ? 'on' : ''}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            id="mob-dr"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(290px, 86vw)', background: 'var(--white)', zIndex: 499, overflowY: 'auto', boxShadow: 'var(--sh-l)' }}
          >
            <div className="mob-hd">
              <Link href="/" className="mob-logo" onClick={() => setDrawerOpen(false)}>
                <em>MIFA</em> LIFE
              </Link>
              <button className="mob-cl" onClick={() => setDrawerOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="mob-sec-ti">Navigation</div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mob-l"
                onClick={() => setDrawerOpen(false)}
              >
                <ChevronRight size={14} />
                {link.label}
              </Link>
            ))}

            <div className="mob-sep" />
            <div className="mob-sec-ti">Catégories</div>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="mob-l"
                onClick={() => setDrawerOpen(false)}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </Link>
            ))}

            <div className="mob-auth">
              <Link href="/login" onClick={() => setDrawerOpen(false)}>
                Se connecter / S&apos;inscrire
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
