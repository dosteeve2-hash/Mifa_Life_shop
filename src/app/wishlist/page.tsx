'use client';

/**
 * MIFA LIFE — PAGE LISTE DE SOUHAITS
 * src/app/wishlist/page.tsx
 */

import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function formatPrix(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.07, type: 'spring' as const, stiffness: 260, damping: 20 },
  }),
  exit: { opacity: 0, scale: 0, transition: { duration: 0.2 } },
};

export default function WishlistPage() {
  const { items, removeFromWishlist, totalItems } = useWishlist();
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = async (produit_id: string) => {
    await addToCart(produit_id);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg, #0a0f08)', paddingTop: '2rem', paddingBottom: '4rem' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm"
            style={{ color: 'var(--gold, #C9A84C)', opacity: 0.8 }}
          >
            <ArrowLeft size={16} />
            Retour
          </button>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-bold mb-2"
          style={{ color: 'var(--gold, #C9A84C)', fontFamily: 'Playfair Display, serif' }}
        >
          Ma Liste de Souhaits
        </motion.h1>
        <p className="text-sm mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {totalItems} article{totalItems !== 1 ? 's' : ''}
        </p>

        {/* Empty state */}
        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              >
                <Heart
                  size={80}
                  style={{ color: 'var(--gold, #C9A84C)', opacity: 0.3 }}
                />
              </motion.div>
              <p
                className="text-xl font-semibold"
                style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Outfit, sans-serif' }}
              >
                Votre liste de souhaits est vide
              </p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Ajoutez des produits depuis la boutique pour les retrouver ici.
              </p>
              <Link
                href="/collections"
                className="mt-2 px-6 py-3 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: 'var(--gold, #C9A84C)',
                  color: '#0a0f08',
                  textDecoration: 'none',
                }}
              >
                Parcourir les collections
              </Link>
            </motion.div>
          ) : (
            /* Grid produits */
            <motion.div
              key="grid"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <AnimatePresence>
                {items.map((item, i) => (
                  <motion.div
                    key={item.produit_id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="relative rounded-2xl overflow-hidden flex flex-col"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(201,168,76,0.15)',
                    }}
                  >
                    {/* Image */}
                    <div
                      className="relative w-full"
                      style={{ aspectRatio: '1/1', background: 'rgba(255,255,255,0.06)' }}
                    >
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.nom}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Heart size={40} style={{ color: 'rgba(201,168,76,0.2)' }} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-2 p-3 flex-1">
                      <p
                        className="text-sm font-medium line-clamp-2"
                        style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Outfit, sans-serif' }}
                      >
                        {item.nom}
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{ color: 'var(--gold, #C9A84C)' }}
                      >
                        {formatPrix(item.prix)}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2 mt-auto pt-2">
                        <button
                          onClick={() => handleAddToCart(item.produit_id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
                          style={{ background: 'var(--gold, #C9A84C)', color: '#0a0f08' }}
                        >
                          <ShoppingBag size={13} />
                          Panier
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.produit_id)}
                          className="p-2 rounded-xl transition-all"
                          style={{
                            background: 'rgba(239,68,68,0.12)',
                            color: 'rgb(239,68,68)',
                            border: '1px solid rgba(239,68,68,0.2)',
                          }}
                          aria-label="Retirer des favoris"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
