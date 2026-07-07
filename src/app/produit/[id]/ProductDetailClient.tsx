'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Product } from '@/lib/products';

interface Props {
  product: Product;
}

const formatPrice = (price: number) => price.toLocaleString('fr-FR') + ' FCFA';

export default function ProductDetailClient({ product }: Props) {
  const [toastVisible, setToastVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes ? product.sizes[0] : null
  );

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* ── Toast ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 'clamp(16px, 4vw, 24px)',
          left: '50%',
          transform: `translateX(-50%) translateY(${toastVisible ? '0' : '14px'})`,
          background: 'rgba(240,168,50,0.12)',
          border: '1px solid rgba(240,168,50,0.35)',
          color: 'var(--gold)',
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "'JetBrains Mono', monospace",
          padding: '12px 24px',
          borderRadius: 10,
          boxShadow: '0 14px 42px rgba(0,0,0,0.65)',
          zIndex: 9999,
          opacity: toastVisible ? 1 : 0,
          visibility: toastVisible ? 'visible' : 'hidden',
          transition: 'all 0.25s cubic-bezier(0.25,0.46,0.45,0.94)',
          whiteSpace: 'nowrap',
        }}
      >
        Bientôt disponible ✨
      </div>

      <div className="wrap" style={{ paddingTop: 28, paddingBottom: 72 }}>
        {/* ── Bouton retour ── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 24 }}
        >
          <Link
            href="/collections"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              color: 'var(--t3)',
              textTransform: 'uppercase',
              letterSpacing: '.07em',
              textDecoration: 'none',
              padding: '7px 14px',
              borderRadius: 8,
              border: '1px solid var(--border2)',
              transition: 'color 0.2s, border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gold)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(240,168,50,0.4)';
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(240,168,50,0.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = 'var(--t3)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border2)';
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
            }}
          >
            ← Retour aux collections
          </Link>
        </motion.div>

        {/* ── Breadcrumb ── */}
        <motion.nav
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          style={{ display: 'flex', gap: 6, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 32, alignItems: 'center', flexWrap: 'wrap' }}
        >
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <Link href="/collections" style={{ color: 'inherit', textDecoration: 'none' }}>Collections</Link>
          <span style={{ opacity: 0.4 }}>›</span>
          <span style={{ color: 'var(--t2)' }}>{product.name}</span>
        </motion.nav>

        {/* ── Layout 2 colonnes ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 'clamp(28px, 5vw, 56px)', alignItems: 'start' }}>

          {/* Colonne gauche — image */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div style={{
              background: product.bg,
              borderRadius: 20,
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid var(--border2)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            }}>
              <span style={{ fontSize: 'clamp(80px, 18vw, 140px)', filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.6))' }}>
                {product.emoji}
              </span>
              {/* Badge catégorie */}
              <div style={{
                position: 'absolute', top: 16, left: 16,
                padding: '5px 14px', borderRadius: 20,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
                fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.09em',
                border: '1px solid rgba(240,168,50,0.3)',
              }}>
                {product.category}
              </div>
              {/* Badge inStock */}
              {product.inStock && (
                <div style={{
                  position: 'absolute', bottom: 16, right: 16,
                  padding: '4px 12px', borderRadius: 20,
                  background: 'rgba(34,217,138,0.12)', backdropFilter: 'blur(8px)',
                  fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                  color: 'var(--green)', letterSpacing: '.06em',
                  border: '1px solid rgba(34,217,138,0.25)',
                }}>
                  ✓ En stock
                </div>
              )}
            </div>
          </motion.div>

          {/* Colonne droite — détails */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ display: 'flex', flexDirection: 'column', gap: 22 }}
          >
            {/* Catégorie */}
            <div style={{ fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.12em' }}>
              {product.category}
            </div>

            {/* Titre */}
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(24px, 4vw, 38px)',
              fontWeight: 900,
              fontStyle: 'italic',
              color: 'var(--t1)',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              margin: 0,
            }}>
              {product.name}
            </h1>

            {/* Prix */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 700, color: 'var(--gold)' }}>
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: 'clamp(13px, 2vw, 15px)', color: 'var(--t2)', lineHeight: 1.78, margin: 0 }}>
              {product.description}
            </p>

            {/* Tailles */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>
                  Taille
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: "'JetBrains Mono', monospace",
                          border: '1.5px solid',
                          borderColor: isSelected ? 'var(--gold)' : 'var(--border2)',
                          background: isSelected ? 'rgba(240,168,50,0.12)' : 'var(--bg3)',
                          color: isSelected ? 'var(--gold)' : 'var(--t2)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Détails produit */}
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 14, padding: '18px 20px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>
                Détails & Matières
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {product.details.map((detail, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--t2)', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }}>◆</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { icon: '🔒', label: 'Paiement sécurisé' },
                { icon: '↩️', label: 'Retours 14j' },
                { icon: '✓', label: 'Qualité garantie' },
                { icon: '🚚', label: 'Livraison rapide' },
              ].map((b) => (
                <div key={b.label} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 11px', background: 'var(--bg3)',
                  border: '1px solid var(--border)', borderRadius: 20,
                  fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                  color: 'var(--t2)', fontWeight: 600,
                }}>
                  <span>{b.icon}</span>
                  {b.label}
                </div>
              ))}
            </div>

            {/* Bouton Ajouter au panier */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={showToast}
              style={{
                width: '100%',
                padding: 'clamp(14px, 2.5vw, 18px)',
                borderRadius: 12,
                background: 'var(--gold)',
                color: 'var(--bg)',
                border: 'none',
                fontSize: 'clamp(13px, 2vw, 15px)',
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: 'uppercase',
                letterSpacing: '.07em',
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(240,168,50,0.25)',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold2)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(240,168,50,0.38)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(240,168,50,0.25)';
              }}
            >
              Ajouter au panier
            </motion.button>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
