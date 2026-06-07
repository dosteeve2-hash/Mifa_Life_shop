'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';

function formatPrice(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

export default function CartPage() {
  const { items, removeItem, updateQty, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 20, textAlign: 'center' }}>
        <ShoppingBag size={72} strokeWidth={1} color="var(--t4)" />
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 26, fontWeight: 700, color: 'var(--sl)' }}>
          Votre panier est vide
        </h1>
        <p style={{ fontSize: 14, color: 'var(--t3)', maxWidth: 380 }}>
          Découvrez nos produits et ajoutez vos articles favoris ici.
        </p>
        <Link
          href="/shop"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}
        >
          Voir la boutique →
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="wrap" style={{ paddingTop: 28, paddingBottom: 60 }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--t3)', textDecoration: 'none', marginBottom: 12 }}>
            <ArrowLeft size={14} /> Continuer mes achats
          </Link>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(22px,4vw,28px)', fontWeight: 700, color: 'var(--sl)' }}>
            Mon Panier — {totalItems} article{totalItems !== 1 ? 's' : ''}
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'start' }}>
          {/* Items list */}
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
                  style={{ display: 'flex', gap: 16, padding: 16, background: 'var(--white)', borderRadius: 'var(--rl)', border: '1.5px solid var(--bg3)', marginBottom: 12 }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', width: 80, height: 80, borderRadius: 9, overflow: 'hidden', background: 'var(--bg2)', flexShrink: 0 }}>
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} fill sizes="80px" style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShoppingBag size={24} color="var(--t4)" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 4, lineHeight: 1.4 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--t4)', marginBottom: 8 }}>{formatPrice(item.price_cfa)} / unité</div>

                    {/* Qty controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--bg2)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: 14, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--bg2)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Price + Remove */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, flexShrink: 0 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>
                      {formatPrice(item.price_cfa * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--bg2)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--t3)', transition: 'all 0.2s' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          <div style={{ background: 'var(--white)', borderRadius: 'var(--rl)', border: '1.5px solid var(--bg3)', padding: 24, position: 'sticky', top: 100 }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 700, color: 'var(--sl)', marginBottom: 20 }}>
              Résumé de commande
            </h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--t3)', marginBottom: 10 }}>
              <span>Sous-total ({totalItems} articles)</span>
              <span style={{ fontWeight: 700, color: 'var(--t1)' }}>{formatPrice(totalPrice)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--t3)', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--bg3)' }}>
              <span>Livraison</span>
              <span style={{ fontWeight: 600, color: 'var(--em)' }}>Calculée à l&apos;étape suivante</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: 'var(--t1)', marginBottom: 20 }}>
              <span>Total estimé</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <Link
              href="/checkout"
              style={{ display: 'block', width: '100%', padding: 14, background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, textAlign: 'center', textDecoration: 'none', marginBottom: 10 }}
            >
              Procéder au paiement →
            </Link>
            <Link
              href="/shop"
              style={{ display: 'block', textAlign: 'center', fontSize: 13, color: 'var(--t3)', textDecoration: 'none' }}
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
