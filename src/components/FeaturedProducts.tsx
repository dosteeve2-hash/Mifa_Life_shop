'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Check, Package, Eye, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export interface Product {
  id: number | string;
  name: string;
  price?: number;
  price_cfa?: number;
  original_price?: number;
  original_price_cfa?: number;
  image_url?: string | null;
  images?: string[];
  category?: string;
  featured?: boolean;
  shipping_days?: number;
  stock?: number;
  description?: string;
}

interface FeaturedProductsProps {
  products: Product[];
  loading?: boolean;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

function getPrice(p: Product): number {
  return p.price ?? p.price_cfa ?? 0;
}
function getOriginalPrice(p: Product): number | null {
  return p.original_price ?? p.original_price_cfa ?? null;
}
function getImageUrl(p: Product): string | null {
  if (p.images && p.images.length > 0) return p.images[0];
  return p.image_url ?? null;
}

// Generate a stable pseudo-random rating from product id
function getRating(id: number | string): number {
  const seed = typeof id === 'number' ? id : id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return 4 + (seed % 10) / 10; // 4.0 – 4.9
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={10}
          fill={i < full ? '#FFD700' : i === full && half ? 'url(#half)' : 'none'}
          color={i < full || (i === full && half) ? '#FFD700' : 'var(--bg3)'}
          strokeWidth={1.5}
        />
      ))}
      <span style={{ fontSize: 10, color: 'var(--t4)', marginLeft: 3, fontWeight: 600 }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const [hovered, setHovered] = useState(false);

  const price = getPrice(product);
  const original = getOriginalPrice(product);
  const imageUrl = getImageUrl(product);
  const discount = original && original > price ? Math.round((1 - price / original) * 100) : null;
  const isNew = !discount && !product.featured;
  const rating = getRating(product.id);

  useEffect(() => {
    try {
      const wishes: (number | string)[] = JSON.parse(localStorage.getItem('mifa_wishes') ?? '[]');
      setWished(wishes.includes(product.id));
    } catch { /* noop */ }
  }, [product.id]);

  const toggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const wishes: (number | string)[] = JSON.parse(localStorage.getItem('mifa_wishes') ?? '[]');
      const newWishes = wishes.includes(product.id)
        ? wishes.filter((id) => id !== product.id)
        : [...wishes, product.id];
      localStorage.setItem('mifa_wishes', JSON.stringify(newWishes));
      setWished(!wished);
    } catch { /* noop */ }
  };

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (added) return;
    await addToCart(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.article
      variants={cardVariants}
      className="prod-card"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <Link href={`/shop/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Image */}
        <div className="prod-img-wrap">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="prod-img"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="prod-img-ph" style={{ color: 'var(--t4)' }}>
              <Package size={32} strokeWidth={1} />
            </div>
          )}

          {/* Quick-view overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(17,27,34,0.52)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  backdropFilter: 'blur(2px)',
                }}
              >
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '9px 18px',
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: 22,
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--t1)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                  }}
                >
                  <Eye size={14} color="var(--em)" />
                  Voir le produit
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wishlist button */}
          <motion.button
            className={`prod-wish ${wished ? 'on' : ''}`}
            onClick={toggleWish}
            aria-label={wished ? 'Retirer des souhaits' : 'Ajouter aux souhaits'}
            whileTap={{ scale: 0.8 }}
            animate={wished ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
            style={{ zIndex: 3 }}
          >
            <Heart size={13} fill={wished ? 'var(--or)' : 'none'} color={wished ? 'var(--or)' : 'var(--t3)'} />
          </motion.button>

          {/* Badge */}
          {discount && discount >= 5 ? (
            <div className="prod-badge pb-sale">-{discount}%</div>
          ) : product.featured ? (
            <div className="prod-badge pb-featured">VEDETTE</div>
          ) : isNew ? (
            <div className="prod-badge pb-new">NOUVEAU</div>
          ) : null}
        </div>

        {/* Body */}
        <div className="prod-body">
          {product.category && (
            <div className="prod-cat">{product.category}</div>
          )}
          <div className="prod-name">{product.name}</div>

          {/* Star rating */}
          <div style={{ marginBottom: 8 }}>
            <StarRating rating={rating} />
          </div>

          <div className="prod-price-row">
            <span className="prod-price">{formatPrice(price)}</span>
            {original && original > price && (
              <>
                <span className="prod-orig">{formatPrice(original)}</span>
                {discount && <span className="prod-discount">-{discount}%</span>}
              </>
            )}
          </div>

          {product.shipping_days !== undefined && (
            <div className="prod-shipping">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              Livraison en {product.shipping_days}–{product.shipping_days + 2} jours
            </div>
          )}

          {/* Add to cart */}
          <button
            className="prod-add"
            onClick={handleAdd}
            style={added ? { background: '#065F46' } : {}}
            aria-label="Ajouter au panier"
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Check size={13} /> Ajouté !
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <ShoppingBag size={12} /> Ajouter au panier
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </Link>
    </motion.article>
  );
}

function SkeletonCard() {
  return (
    <div className="prod-skel">
      <div className="ps-img" style={{ background: 'linear-gradient(90deg, var(--bg2) 25%, var(--bg3) 50%, var(--bg2) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
      <div className="ps-body">
        <div className="ps-line short skeleton" />
        <div className="ps-line med skeleton" />
        <div className="ps-line skeleton" />
        <div className="ps-line short skeleton" />
        <div className="ps-line skeleton" style={{ height: 32, borderRadius: 8, marginTop: 4 }} />
      </div>
    </div>
  );
}

export default function FeaturedProducts({ products, loading = false }: FeaturedProductsProps) {
  return (
    <section className="section" style={{ background: 'var(--bg)' }}>
      <div className="wrap">
        <div className="sec-hd">
          <div>
            <div className="sec-eyebrow">Sélection premium</div>
            <h2 className="sec-ti">Nos meilleures offres</h2>
            <p style={{ fontSize: 13, color: 'var(--t3)', marginTop: 6, lineHeight: 1.55 }}>
              Des produits soigneusement sélectionnés pour vous
            </p>
          </div>
          <Link href="/shop" className="sec-link">
            Voir tout <span>→</span>
          </Link>
        </div>

        <motion.div
          id="featured-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : products.length === 0
            ? (
              <div className="empty-state">
                <div className="empty-ico"><ShoppingBag size={28} strokeWidth={1} color="var(--t4)" /></div>
                <div className="empty-ti">Aucun produit pour l&apos;instant</div>
                <p className="empty-sub">Revenez bientôt, notre catalogue se remplit chaque jour.</p>
                <Link href="/shop" className="empty-cta">
                  <ShoppingBag size={14} /> Parcourir la boutique
                </Link>
              </div>
            )
            : products.map((p) => <ProductCard key={p.id} product={p} />)}
        </motion.div>
      </div>
    </section>
  );
}
