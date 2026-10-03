'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search } from 'lucide-react';

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
  { label: 'Robes', slug: 'robes' },
  { label: 'Costumes', slug: 'costumes' },
  { label: 'Accessoires', slug: 'accessoires' },
  { label: 'Nouveautés', slug: 'newest' },
];

const STATS = [
  { value: 'FCFA', label: 'prix affichés' },
  { value: 'Catalogue', label: 'produits et catégories' },
  { value: 'MVP', label: 'pilote recherché' },
];

function formatPrice(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

// Particles config — generated once
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: 55 + Math.sin(i * 2.4) * 38,
  y: 10 + (i * 6.2) % 80,
  size: 2 + (i % 3),
  delay: i * 0.3,
  duration: 3 + (i % 4),
}));

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

export default function HeroSection({ products }: HeroSectionProps) {
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const router = useRouter();

  const heroProducts = products.slice(0, 4);

  // Auto-cycle hero card highlight
  useEffect(() => {
    if (heroProducts.length < 2) return;
    const t = setInterval(() => setActiveCard((c) => (c + 1) % heroProducts.length), 2800);
    return () => clearInterval(t);
  }, [heroProducts.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (category) params.set('cat', category);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <section id="hero">
      {/* Subtle bg texture */}
      <div className="hero-bg" />
      <div className="hero-overlay" />
      {/* Mali flag stripe — bande décorative verticale */}
      <div className="hero-mali-stripe" />

      {/* Gold particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: 'var(--gold)',
              opacity: 0,
            }}
            animate={{ opacity: [0, 0.5, 0], y: [0, -18, 0] }}
            transition={{ repeat: Infinity, duration: p.duration, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="hero-in">
        {/* Left: text */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="hero-eyebrow">
            <span />
            MVP — PILOTE RECHERCHÉ
          </motion.div>

          <motion.h1 variants={itemVariants} className="hero-h1">
            MIFA Life{' '}
            <em>Shop</em>
          </motion.h1>

          <motion.p variants={itemVariants} className="hero-sub">
            Catalogue de produits et prix affichés en FCFA.
          </motion.p>

          {/* Search bar */}
          <motion.form
            variants={itemVariants}
            className="hero-search"
            onSubmit={handleSearch}
            style={searchFocused ? { transform: 'translateY(-2px)' } : {}}
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
            </select>
            <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
              <Search size={14} style={{ position: 'absolute', left: 12, color: 'var(--t3)', pointerEvents: 'none', flexShrink: 0 }} />
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
              Chercher
            </button>
          </motion.form>

          {/* Quick-access pills */}
          <motion.div variants={itemVariants} className="hero-chips">
            {QUICK_CATS.map((cat) => (
              <button
                key={cat.slug}
                className="hc"
                onClick={() => router.push(`/shop?cat=${cat.slug}`)}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: product cards */}
        <motion.div
          className="hero-cards"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: 'easeOut' }}
        >
          {/* Floating badges */}
          <motion.div
            style={{
              position: 'absolute',
              top: -16,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              background: 'rgba(21,32,16,0.88)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border2)',
              borderRadius: 22,
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--gold2)',
              whiteSpace: 'nowrap',
              zIndex: 5,
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            MVP — pilote recherché
          </motion.div>

          {heroProducts.length > 0
            ? heroProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  className="hc-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    borderColor: activeCard === i ? 'rgba(212,175,55,0.5)' : 'var(--border2)',
                    boxShadow: activeCard === i ? '0 0 20px rgba(212,175,55,0.12)' : 'none',
                  }}
                  transition={{ delay: 0.45 + i * 0.08 }}
                  onClick={() => router.push(`/shop/${p.id}`)}
                >
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '1', overflow: 'hidden', background: 'var(--bg3)' }}>
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
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(212,175,55,0.25)" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
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

          {/* Livraison badge */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: -14,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              background: 'rgba(34,217,138,0.10)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(34,217,138,0.25)',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--green)',
              zIndex: 5,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
            MVP — pilote recherché
          </motion.div>
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        style={{
          position: 'relative',
          zIndex: 1,
          borderTop: '1px solid var(--border)',
          padding: '16px clamp(14px,3vw,28px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(16px,4vw,48px)',
          flexWrap: 'wrap',
          background: 'rgba(15,26,13,0.6)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {STATS.map((stat, i) => (
          <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px,4vw,48px)' }}>
            <div style={{ textAlign: 'center' as const }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(15px,2.5vw,18px)', fontWeight: 600, color: 'var(--gold)' }}>
                {stat.value}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: 'var(--t3)', textTransform: 'uppercase' as const, letterSpacing: '.07em' }}>
                {stat.label}
              </div>
            </div>
            {i < STATS.length - 1 && (
              <div style={{ width: 1, height: 28, background: 'var(--border2)' }} />
            )}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
