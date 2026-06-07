'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQty, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 800,
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(380px, 93vw)',
              background: 'var(--white)',
              zIndex: 801,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--sh-l)',
            }}
          >
            {/* Header */}
            <div className="cs-hd">
              <span className="cs-ti">
                Mon Panier{' '}
                <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--t3)' }}>
                  ({totalItems} article{totalItems !== 1 ? 's' : ''})
                </span>
              </span>
              <button className="cs-cl" onClick={onClose} aria-label="Fermer">
                <X size={16} />
              </button>
            </div>

            {/* Items */}
            <div className="cs-items">
              {items.length === 0 ? (
                <div className="cs-empty">
                  <ShoppingBag size={56} strokeWidth={1} />
                  <p className="cs-empty-txt">Votre panier est vide</p>
                  <p style={{ fontSize: 12, color: 'var(--t4)', lineHeight: 1.6 }}>
                    Découvrez nos produits et ajoutez-les à votre panier.
                  </p>
                  <Link
                    href="/shop"
                    onClick={onClose}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      marginTop: 12,
                      padding: '10px 20px',
                      background: 'var(--em)',
                      color: '#fff',
                      borderRadius: 9,
                      fontSize: 13,
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Voir la boutique
                  </Link>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0, padding: 0 }}
                      transition={{ duration: 0.22 }}
                      className="cs-item"
                    >
                      {/* Image */}
                      <div style={{ width: 52, height: 52, borderRadius: 7, overflow: 'hidden', background: 'var(--bg2)', flexShrink: 0, position: 'relative' }}>
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            sizes="52px"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShoppingBag size={20} color="var(--t4)" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="cs-info">
                        <div className="cs-nm">{item.name}</div>
                        <div className="cs-pr">{formatPrice(item.price_cfa * item.quantity)}</div>
                        {/* Qty controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--bg2)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                            aria-label="Diminuer"
                          >
                            <Minus size={10} />
                          </button>
                          <span style={{ fontSize: 12, fontWeight: 700, minWidth: 16, textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--bg2)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                            aria-label="Augmenter"
                          >
                            <Plus size={10} />
                          </button>
                          <span style={{ fontSize: 11, color: 'var(--t4)', marginLeft: 4 }}>
                            {formatPrice(item.price_cfa)} / unité
                          </span>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        className="cs-rm"
                        onClick={() => removeItem(item.id)}
                        aria-label="Supprimer"
                      >
                        <Trash2 size={11} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="cs-ft">
                <div className="cs-total-row">
                  <span>Sous-total</span>
                  <b>{formatPrice(totalPrice)}</b>
                </div>
                <div className="cs-total-row">
                  <span>Livraison</span>
                  <span style={{ color: 'var(--em)', fontWeight: 600 }}>Calculée à l&apos;étape suivante</span>
                </div>
                <div style={{ borderTop: '1px solid var(--bg3)', paddingTop: 10, marginBottom: 12, display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>
                  <span>Total estimé</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="cs-cta"
                  style={{ textDecoration: 'none', display: 'block', textAlign: 'center', cursor: 'pointer' }}
                >
                  Commander →
                </Link>
                <Link
                  href="/cart"
                  onClick={onClose}
                  style={{ display: 'block', textAlign: 'center', fontSize: 12, color: 'var(--t3)', marginTop: 10, textDecoration: 'none' }}
                >
                  Voir le panier complet
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
