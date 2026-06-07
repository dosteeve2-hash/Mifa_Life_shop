'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface HeroProduct {
  id: number | string;
  name: string;
  price: number;
  image_url?: string | null;
}

interface HeroSectionProps {
  products: HeroProduct[];
}

const TAGS = ['Électronique', 'Mode', 'Sport', 'Maison', 'Beauté', 'Enfants'];

function formatPrice(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export default function HeroSection({ products }: HeroSectionProps) {
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
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

          <motion.h1 variants={itemVariants} className="hero-h1">
            Tout ce dont vous avez besoin,{' '}
            <em>livré chez vous</em> au Mali
          </motion.h1>

          <motion.p variants={itemVariants} className="hero-sub">
            Des milliers de produits soigneusement sélectionnés — électronique, mode, maison
            et plus. Paiement simple via Orange Money ou Wave.
          </motion.p>

          <motion.form variants={itemVariants} className="hero-search" onSubmit={handleSearch}>
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
            <input
              className="hs-inp"
              type="text"
              placeholder="Rechercher un produit..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="hs-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              Chercher
            </button>
          </motion.form>

          <motion.div variants={itemVariants} className="hero-chips">
            {TAGS.map((tag) => (
              <button
                key={tag}
                className="hc"
                onClick={() => router.push(`/shop?cat=${tag.toLowerCase()}`)}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: product mini-cards */}
        <motion.div
          className="hero-cards"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: 'easeOut' }}
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
  );
}
