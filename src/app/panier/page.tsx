'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';

const LIVRAISON_SEUIL = 50000;
const LIVRAISON_PRIX = 2500;

export default function PanierPage() {
  const { items, removeItem, updateQty, totalPrice, totalItems } = useCart();

  const livraison = totalPrice >= LIVRAISON_SEUIL ? 0 : LIVRAISON_PRIX;
  const totalFinal = totalPrice + livraison;

  if (items.length === 0) {
    return (
      <div
        style={{
          minHeight: '80vh',
          background: 'var(--bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          padding: '40px 24px',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <ShoppingCart size={72} strokeWidth={1} color="var(--t3)" />
        </motion.div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(22px, 4vw, 28px)',
            fontWeight: 900,
            fontStyle: 'italic',
            color: 'var(--t1)',
            margin: 0,
          }}
        >
          Votre panier est vide
        </h1>
        <p style={{ fontSize: 14, color: 'var(--t3)', maxWidth: 360, margin: 0 }}>
          Découvrez nos créations africaines et ajoutez vos articles favoris ici.
        </p>
        <Link
          href="/collections"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 28px',
            background: 'var(--gold)',
            color: 'var(--bg)',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "'JetBrains Mono', monospace",
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
        >
          Voir les collections →
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="wrap" style={{ paddingTop: 28, paddingBottom: 72 }}>

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 28 }}
        >
          <Link
            href="/collections"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontFamily: "'JetBrains Mono', monospace",
              color: 'var(--t3)',
              textDecoration: 'none',
              marginBottom: 14,
            }}
          >
            <ArrowLeft size={13} /> Continuer mes achats
          </Link>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(22px, 4vw, 30px)',
              fontWeight: 900,
              fontStyle: 'italic',
              color: 'var(--t1)',
              margin: 0,
            }}
          >
            Mon Panier{' '}
            <span style={{ color: 'var(--gold)', fontStyle: 'normal', fontSize: '0.7em' }}>
              ({totalItems} article{totalItems !== 1 ? 's' : ''})
            </span>
          </h1>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
            gap: 28,
            alignItems: 'start',
          }}
        >
          {/* Liste des articles */}
          <div style={{ gridColumn: 'span 2' }}>
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    display: 'flex',
                    gap: 16,
                    padding: 16,
                    background: 'var(--bg3)',
                    borderRadius: 14,
                    border: '1px solid var(--border2)',
                    marginBottom: 12,
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      position: 'relative',
                      width: 80,
                      height: 80,
                      borderRadius: 10,
                      overflow: 'hidden',
                      background: 'var(--bg2)',
                      flexShrink: 0,
                      border: '1px solid var(--border)',
                    }}
                  >
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        sizes="80px"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ShoppingBag size={24} color="var(--t3)" />
                      </div>
                    )}
                  </div>

                  {/* Infos */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: 'var(--t1)',
                        marginBottom: 4,
                        lineHeight: 1.4,
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: 'var(--t3)',
                        fontFamily: "'JetBrains Mono', monospace",
                        marginBottom: 10,
                      }}
                    >
                      {fmt(item.price_cfa)} / unité
                    </div>

                    {/* Contrôles quantité */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: 'var(--bg2)',
                          border: '1px solid var(--border2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: 'var(--t2)',
                        }}
                        aria-label="Diminuer la quantité"
                      >
                        <Minus size={12} />
                      </button>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: 'var(--t1)',
                          minWidth: 24,
                          textAlign: 'center',
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          background: 'var(--bg2)',
                          border: '1px solid var(--border2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: 'var(--t2)',
                        }}
                        aria-label="Augmenter la quantité"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Prix + supprimer */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: 'var(--gold)',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {fmt(item.price_cfa * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--red)',
                        transition: 'background 0.2s',
                      }}
                      aria-label="Supprimer l'article"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Récapitulatif commande */}
          <div
            style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border2)',
              borderRadius: 16,
              padding: 24,
              position: 'sticky',
              top: 100,
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 20,
                fontWeight: 700,
                fontStyle: 'italic',
                color: 'var(--t1)',
                marginTop: 0,
                marginBottom: 20,
              }}
            >
              Récapitulatif
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  color: 'var(--t3)',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                <span>Sous-total ({totalItems} articles)</span>
                <span style={{ fontWeight: 600, color: 'var(--t2)' }}>{fmt(totalPrice)}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  color: 'var(--t3)',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                <span>Livraison</span>
                <span
                  style={{
                    fontWeight: 600,
                    color: livraison === 0 ? 'var(--green)' : 'var(--t2)',
                  }}
                >
                  {livraison === 0 ? '✓ Gratuite' : fmt(livraison)}
                </span>
              </div>

              {livraison > 0 && (
                <p
                  style={{
                    fontSize: 11,
                    color: 'var(--t3)',
                    margin: 0,
                    fontFamily: "'JetBrains Mono', monospace",
                    borderTop: '1px solid var(--border)',
                    paddingTop: 8,
                  }}
                >
                  Livraison gratuite dès {fmt(LIVRAISON_SEUIL)}
                </p>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--t1)',
                  borderTop: '1px solid var(--border2)',
                  paddingTop: 12,
                  marginTop: 4,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <span>Total</span>
                <span style={{ color: 'var(--gold)' }}>{fmt(totalFinal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              style={{
                display: 'block',
                width: '100%',
                padding: '14px 0',
                background: 'var(--gold)',
                color: 'var(--bg)',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                textAlign: 'center',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '.06em',
                marginBottom: 10,
                transition: 'background 0.2s',
              }}
            >
              Commander →
            </Link>

            <Link
              href="/collections"
              style={{
                display: 'block',
                textAlign: 'center',
                fontSize: 13,
                color: 'var(--t3)',
                textDecoration: 'none',
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              ← Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
