'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CATEGORIES = ['Tout', 'Tenues', 'Accessoires', 'Tissu wax', 'Kente', 'Dashhiki', 'Robes'];

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  emoji: string;
  bg: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Robe Kente d'exception", price: 85000, category: 'Kente', emoji: '👗', bg: 'linear-gradient(135deg, #2d1b5e 0%, #1a0d3a 100%)' },
  { id: 2, name: 'Dashiki brodé Bogolan', price: 45000, category: 'Dashhiki', emoji: '🧣', bg: 'linear-gradient(135deg, #5e2d1b 0%, #3a1a0d 100%)' },
  { id: 3, name: 'Ensemble Wax Print Premium', price: 65000, category: 'Tenues', emoji: '✨', bg: 'linear-gradient(135deg, #1b3d5e 0%, #0d2540 100%)' },
  { id: 4, name: 'Foulard Kente or et vert', price: 18000, category: 'Accessoires', emoji: '🧤', bg: 'linear-gradient(135deg, #1b5e2d 0%, #0d3a1b 100%)' },
  { id: 5, name: 'Boubou grand Bazin', price: 120000, category: 'Tenues', emoji: '🥷', bg: 'linear-gradient(135deg, #3d1b5e 0%, #250d3a 100%)' },
  { id: 6, name: 'Pagne wax Ankara', price: 25000, category: 'Tissu wax', emoji: '🎭', bg: 'linear-gradient(135deg, #5e3d1b 0%, #3a250d 100%)' },
  { id: 7, name: 'Sandales sculptées artisanales', price: 35000, category: 'Accessoires', emoji: '👡', bg: 'linear-gradient(135deg, #1b5e4d 0%, #0d3a2f 100%)' },
  { id: 8, name: 'Chemise Kente homme', price: 55000, category: 'Tenues', emoji: '👔', bg: 'linear-gradient(135deg, #1b4d5e 0%, #0d2f3a 100%)' },
  { id: 9, name: 'Robe wrap Wax', price: 72000, category: 'Robes', emoji: '👘', bg: 'linear-gradient(135deg, #5e1b3d 0%, #3a0d25 100%)' },
];
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function CollectionsClient() {
  const [activeCategory, setActiveCategory] = useState('Tout');

  const filtered =
    activeCategory === 'Tout'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  const formatPrice = (price: number) =>
    price.toLocaleString('fr-FR') + ' FCFA';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* ── Hero Header ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 70%)',
          padding: 'clamp(40px, 7vw, 80px) 0',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border)',
        }}
      >        {/* Radial glows */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 40%, rgba(212,175,55,0.07) 0%, transparent 55%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 80%, rgba(0,180,216,0.04) 0%, transparent 50%)', pointerEvents: 'none' }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 22, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span style={{ opacity: 0.4 }}>›</span>
            <span style={{ color: 'var(--gold)' }}>Collections</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(34px, 6vw, 62px)',
              fontWeight: 900,
              fontStyle: 'italic',
              color: 'var(--t1)',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              margin: '0 0 16px',
            }}
          >
            Nos Collections
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ fontSize: 'clamp(12px, 1.8vw, 15px)', fontFamily: "'Outfit', sans-serif", color: 'var(--t2)', letterSpacing: '.1em', textTransform: 'uppercase', margin: 0 }}
          >
            Mode africaine contemporaine · Fait avec passion
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            style={{ width: 56, height: 2, background: 'var(--gold)', margin: '22px auto 0', borderRadius: 2, transformOrigin: 'left center' }}
          />
        </div>
      </div>

      {/* ── Filter Pills ── */}
      <div className="wrap" style={{ paddingTop: 30, paddingBottom: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 9, justifyContent: 'center' }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '9px 20px',
                  borderRadius: 30,
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  border: '1.5px solid',
                  borderColor: isActive ? 'var(--gold)' : 'var(--border2)',
                  background: isActive ? 'var(--gold)' : 'var(--bg3)',
                  color: isActive ? 'var(--bg)' : 'var(--t2)',
                  cursor: 'pointer',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '.07em',
                  transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                }}
              >
                {cat}
              </motion.button>
            );
          })}
        </motion.div>
        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'var(--t3)', letterSpacing: '.04em' }}>
          {filtered.length} article{filtered.length !== 1 ? 's' : ''} · Mode africaine premium
        </p>
      </div>

      {/* ── Product Grid ── */}
      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 64 }}>
        <motion.div
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 'clamp(16px, 2.5vw, 28px)' }}
        >          {filtered.map((product) => (
            <motion.article
              key={product.id}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              style={{
                background: 'var(--bg3)',
                border: '1px solid var(--border2)',
                borderRadius: 16,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column' as const,
                transition: 'border-color 0.25s, box-shadow 0.25s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,168,50,0.4)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 48px rgba(0,0,0,0.35)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '';
                (e.currentTarget as HTMLElement).style.boxShadow = '';
              }}
            >
              {/* Image placeholder */}
              <div style={{ background: product.bg, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <span style={{ fontSize: 68, filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.5))' }}>{product.emoji}</span>
                <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 11px', borderRadius: 20, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--gold)', textTransform: 'uppercase' as const, letterSpacing: '.08em', border: '1px solid rgba(240,168,50,0.25)' }}>
                  {product.category}
                </div>
              </div>
              {/* Card body */}
              <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column' as const, gap: 14, flex: 1 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: 'var(--t1)', lineHeight: 1.35, margin: 0 }}>
                  {product.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', gap: 8 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 700, color: 'var(--gold)', letterSpacing: '.01em' }}>
                    {formatPrice(product.price)}
                  </span>
                  <Link
                    href={`/produits/${product.id}`}
                    style={{ padding: '8px 18px', borderRadius: 10, background: 'var(--gold)', color: 'var(--bg)', fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", textDecoration: 'none', textTransform: 'uppercase' as const, letterSpacing: '.06em', flexShrink: 0 }}
                  >
                    Voir →
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontStyle: 'italic', color: 'var(--t2)' }}>
              Aucun produit dans cette catégorie
            </p>
          </div>
        )}
      </div>
    </div>
  );
}