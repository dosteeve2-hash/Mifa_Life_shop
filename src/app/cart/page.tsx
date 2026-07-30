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
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{ minHeight: '72vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center', background: 'var(--bg)' }}
      >
        {/* SVG illustration panier vide */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{ marginBottom: 28 }}
        >
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {/* Shadow */}
            <ellipse cx="60" cy="110" rx="36" ry="6" fill="var(--bg4)" />
            {/* Cart body */}
            <rect x="18" y="44" width="76" height="50" rx="10" fill="var(--em-l, rgba(47,111,237,.08))" stroke="var(--em, #2f6fed)" strokeWidth="2.5" />
            {/* Cart handle */}
            <path d="M10 28 L24 28 L36 72" stroke="var(--em, #2f6fed)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Wheels */}
            <circle cx="38" cy="100" r="7" fill="white" stroke="var(--em, #2f6fed)" strokeWidth="2.5" />
            <circle cx="82" cy="100" r="7" fill="white" stroke="var(--em, #2f6fed)" strokeWidth="2.5" />
            {/* Items inside (empty dashes) */}
            <line x1="38" y1="62" x2="74" y2="62" stroke="var(--border2, #d4dfee)" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3" />
            <line x1="38" y1="72" x2="64" y2="72" stroke="var(--border2, #d4dfee)" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3" />
            {/* Star sparkle */}
            <path d="M96 20 L98 26 L104 28 L98 30 L96 36 L94 30 L88 28 L94 26 Z" fill="var(--em, #2f6fed)" opacity="0.6" />
            <path d="M16 50 L17.2 54 L21 55 L17.2 56 L16 60 L14.8 56 L11 55 L14.8 54 Z" fill="var(--em, #2f6fed)" opacity="0.4" />
          </svg>
        </motion.div>

        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(20px,4vw,26px)', fontWeight: 700, color: 'var(--text, #0e1c33)', marginBottom: 10, lineHeight: 1.2 }}>
          Votre panier est vide
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text2, #4a6285)', maxWidth: 360, lineHeight: 1.7, marginBottom: 28 }}>
          Ajoutez des articles depuis notre boutique et retrouvez-les ici pour finaliser votre commande.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            href="/shop"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'var(--em, #2f6fed)', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.2s' }}
          >
            <ShoppingBag size={15} /> Commencer vos achats
          </Link>
          <Link
            href="/categories"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', border: '1.5px solid var(--border2, #d4dfee)', color: 'var(--text2, #4a6285)', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', background: 'var(--bg3, #fff)', transition: 'all 0.2s' }}
          >
            Voir les catégories
          </Link>
        </div>
      </motion.div>
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
