'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag, Heart, User, Search, X, ChevronRight, Settings, Laptop, Shirt, Home as HomeIcon, Dumbbell, Sparkles, Baby, Car, UtensilsCrossed, Store } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartDrawer from './CartDrawer';
import Logo from './Logo';

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/shop', label: 'Boutique' },
  { href: '/vendeurs', label: 'Vendeurs' },
  { href: '/promo', label: 'Promos' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const CATEGORIES = [
  { label: 'Électronique', Icon: Laptop, href: '/shop?cat=electronique' },
  { label: 'Mode', Icon: Shirt, href: '/shop?cat=mode' },
  { label: 'Maison', Icon: HomeIcon, href: '/shop?cat=maison' },
  { label: 'Sport', Icon: Dumbbell, href: '/shop?cat=sport' },
  { label: 'Beauté', Icon: Sparkles, href: '/shop?cat=beaute' },
  { label: 'Enfants', Icon: Baby, href: '/shop?cat=enfants' },
  { label: 'Auto', Icon: Car, href: '/shop?cat=auto' },
  { label: 'Alimentation', Icon: UtensilsCrossed, href: '/shop?cat=alimentation' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [badgePulse, setBadgePulse] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wishCount, setWishCount] = useState(0);
  const prevTotalRef = useRef(totalItems);

  const { scrollY } = useScroll();
  const shadowOpacity = useTransform(scrollY, [0, 60], [0, 1]);

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 20));
    return unsub;
  }, [scrollY]);

  useEffect(() => {
    const readWish = () => {
      try {
        const raw = JSON.parse(localStorage.getItem('mifa_wishes') ?? '[]');
        setWishCount(Array.isArray(raw) ? raw.length : 0);
      } catch { setWishCount(0); }
    };
    readWish();
    window.addEventListener('storage', readWish);
    return () => window.removeEventListener('storage', readWish);
  }, []);

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
      {/* Gold accent line */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, var(--gold3) 0%, var(--gold) 40%, var(--gold2) 60%, var(--gold3) 100%)', position: 'sticky', top: 0, zIndex: 601 }} />

      <motion.div
        style={{
          boxShadow: useTransform(shadowOpacity, (v) =>
            v > 0.5 ? `0 2px 40px rgba(0,0,0,${v * 0.6})` : 'none'
          ),
        }}
        className="sticky z-[600]"
        id="nav"
      >
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="nv">
            {/* Logo with subtle gold glow */}
            <Link href="/" aria-label="Mifa Life — Accueil" style={{ flexShrink: 0 }}>
              <motion.div
                whileHover={{ filter: 'drop-shadow(0 0 8px rgba(240,168,50,0.4))' }}
                transition={{ duration: 0.2 }}
              >
                <Logo variant="compact" size="sm" />
              </motion.div>
            </Link>

            {/* Desktop nav */}
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
                    style={pathname === link.href ? { color: 'var(--gold)', background: 'rgba(240,168,50,0.08)' } : {}}
                  >
                    {link.label}
                    {pathname === link.href && (
                      <motion.div
                        layoutId="nav-underline"
                        style={{
                          position: 'absolute',
                          bottom: -1,
                          left: 8,
                          right: 8,
                          height: 2,
                          background: 'var(--gold)',
                          borderRadius: 1,
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>

            {/* Search */}
            <motion.form
              className="nv-search"
              onSubmit={handleSearch}
              animate={{ width: searchFocused ? '520px' : undefined }}
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
              <Link href="/wishlist" className="ic-btn" aria-label="Liste de souhaits" style={{ position: 'relative' }}>
                <Heart size={18} />
                <AnimatePresence>
                  {wishCount > 0 && (
                    <motion.span
                      key="wish-badge"
                      className="ic-bdg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      style={{ background: 'var(--gold)', color: 'var(--bg)' }}
                    >
                      {wishCount > 99 ? '99+' : wishCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <button className="ic-btn" aria-label="Mon panier" onClick={() => setCartOpen(true)}>
                <ShoppingBag size={18} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="badge"
                      className="ic-bdg"
                      initial={{ scale: 0 }}
                      animate={{ scale: badgePulse ? 1.4 : 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      {totalItems > 99 ? '99+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <Link href="/profil" className="ic-btn" aria-label="Mon profil">
                <User size={18} />
              </Link>

              <Link href="/login" className="auth-btn">
                Connexion
              </Link>

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
                <cat.Icon size={13} />
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
          >
            <div className="mob-hd">
              <Link href="/" className="mob-logo" onClick={() => setDrawerOpen(false)}>
                <em>MIFA</em> LIFE
              </Link>
              <button className="mob-cl" onClick={() => setDrawerOpen(false)} aria-label="Fermer le menu">
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
                style={pathname === link.href ? { color: 'var(--gold)' } : {}}
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
                <cat.Icon size={14} />
                {cat.label}
              </Link>
            ))}

            <div className="mob-sep" />
            <div className="mob-sec-ti">Mon compte</div>
            <Link href="/wishlist" className="mob-l" onClick={() => setDrawerOpen(false)}>
              <Heart size={14} />
              Ma wishlist {wishCount > 0 && <span style={{ marginLeft: 4, fontSize: 10, fontWeight: 700, background: 'var(--gold)', color: 'var(--bg)', borderRadius: 10, padding: '1px 6px' }}>{wishCount}</span>}
            </Link>
            <Link href="/profil" className="mob-l" onClick={() => setDrawerOpen(false)}>
              <User size={14} />
              Mon profil
            </Link>
            <Link href="/compte/parametres" className="mob-l" onClick={() => setDrawerOpen(false)}>
              <Settings size={14} />
              Paramètres
            </Link>

            <div className="mob-auth">
              <Link href="/login" onClick={() => setDrawerOpen(false)}>
                Se connecter / S&apos;inscrire
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
