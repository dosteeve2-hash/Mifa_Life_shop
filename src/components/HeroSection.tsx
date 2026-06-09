'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Zap, ShieldCheck, RotateCcw, CreditCard, Search } from 'lucide-react';

interface HeroProduct {
  id: number | string;
  name: string;
  price: number;
  image_url?: string | null;
}

interface HeroSectionProps {
  products: HeroProduct[];
}

const QUICK_CATS = [
  { label: 'Mode & Vêtements', slug: 'mode', icon: '👗' },
  { label: 'Électronique', slug: 'electronique', icon: '💻' },
  { label: 'Beauté', slug: 'beaute', icon: '💄' },
];

function formatPrice(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

const VALUE_ITEMS = [
  { icon: <Zap size={11} />, label: 'Livraison 7-14j' },
  { icon: <CreditCard size={11} />, label: 'Orange Money & Wave' },
  { icon: <ShieldCheck size={11} />, label: 'Paiement sécurisé' },
  { icon: <RotateCcw size={11} />, label: 'Retours faciles' },
];

export default function HeroSection({ products }: HeroSectionProps) {
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const router = useRouter();

  const heroProducts = products.slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (category) params.set('cat', category);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <>
      {/* Value strip */}
      <div style={{
        background: 'var(--sl)',
        padding: '7px 0',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'clamp(10px,3vw,28px)',
          maxWidth: 'var(--max)',
          margin: '0 auto',
          padding: '0 clamp(14px,3vw,28px)',
        }}>
          {VALUE_ITEMS.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.72)', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
              <span style={{ color: 'var(--em)', display: 'flex' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <section id="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />

        <div className="hero-in">
          {/* Left: text */}
          <motion.div
            className="hero-txt"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="hero-eyebrow">
              <span />
              🌍 Mali Premium — Qualité garantie
            </motion.div>

            {/* Gradient title */}
            <motion.h1 variants={itemVariants} className="hero-h1" style={{ background: 'linear-gradient(110deg, #ffffff 0%, #c8f5ef 45%, #009739 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Tout ce dont vous avez besoin,{' '}
              <em style={{ fontStyle: 'italic', WebkitTextFillColor: 'inherit' }}>livré chez vous</em> au Mali
            </motion.h1>

            <motion.p variants={itemVariants} className="hero-sub">
              Des milliers de produits soigneusement sélectionnés — électronique, mode, maison
              et plus. Paiement simple via Orange Money ou Wave.
            </motion.p>

            {/* Trust badge */}
            <motion.div
              variants={itemVariants}
              style={{ marginBottom: 'clamp(14px,3vw,20px)' }}
            >
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(0,151,57,0.18)',
                  border: '1px solid rgba(0,151,57,0.35)',
                  borderRadius: 24,
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#6ee7b7',
                }}
              >
                <span style={{ display: 'flex', gap: 2 }}>
                  {'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: '#FFD700', fontSize: 11 }}>{s}</span>)}
                </span>
                + de 500 clients satisfaits
              </motion.div>
            </motion.div>

            {/* Search bar */}
            <motion.form
              variants={itemVariants}
              className="hero-search"
              onSubmit={handleSearch}
              style={{
                transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                boxShadow: searchFocused ? '0 12px 40px rgba(0,151,57,0.28), 0 0 0 2px rgba(0,151,57,0.4)' : '0 8px 32px rgba(0,0,0,0.25)',
                transform: searchFocused ? 'translateY(-2px)' : 'none',
              }}
            >
              <select
                className="hs-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Toutes catégories</option>
                <option value="electronique">Électronique</option>
                <option value="mode">Mode</option>
                <option value="maison">Maison</option>
                <option value="sport">Sport</option>
                <option value="beaute">Beauté</option>
                <option value="enfants">Enfants</option>
              </select>
              <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                <Search size={14} style={{ position: 'absolute', left: 12, color: 'var(--t4)', pointerEvents: 'none', flexShrink: 0 }} />
                <input
                  className="hs-inp"
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  style={{ paddingLeft: 34 }}
                />
              </div>
              <button type="submit" className="hs-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                Chercher
              </button>
            </motion.form>

            {/* Quick-access category pills */}
            <motion.div
              variants={itemVariants}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 'clamp(10px,2vw,14px)' }}
            >
              {QUICK_CATS.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => router.push(`/shop?cat=${cat.slug}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.75)',
                    background: 'rgba(255,255,255,0.07)',
                    cursor: 'pointer',
                    transition: 'all 0.22s ease',
                    backdropFilter: 'blur(4px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,151,57,0.2)';
                    e.currentTarget.style.borderColor = 'rgba(0,151,57,0.45)';
                    e.currentTarget.style.color = '#6ee7b7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                  }}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: product mini-cards */}
          <motion.div
            className="hero-cards"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: 'easeOut' as const }}
          >
            {heroProducts.length > 0
              ? heroProducts.map((p, i) => (
                  <motion.div
                    key={p.id}
                    className="hc-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + i * 0.08 }}
                    onClick={() => router.push(`/shop/${p.id}`)}
                  >
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '1', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                      {p.image_url ? (
                        <Image
                          src={p.image_url}
                          alt={p.name}
                          fill
                          sizes="(max-width: 900px) 0px, 180px"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="hc-img-ph">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="hc-info">
                      <div className="hc-name">{p.name}</div>
                      <div className="hc-price">{formatPrice(p.price)}</div>
                    </div>
                  </motion.div>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="hc-skel">
                    <div className="hc-skel-img" />
                    <div className="hc-skel-body">
                      <div className="hc-skel-line" />
                      <div className="hc-skel-line" />
                    </div>
                  </div>
                ))}
          </motion.div>
        </div>

        {/* Bottom Mali stripe */}
        <div className="mali-stripe">
          <span style={{ background: '#009A00' }} />
          <span style={{ background: '#FFD700' }} />
          <span style={{ background: '#CE1126' }} />
        </div>
      </section>
    </>
  );
}
