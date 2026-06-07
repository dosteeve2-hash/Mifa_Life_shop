'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Check, Package } from 'lucide-react';
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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);

  const price = getPrice(product);
  const original = getOriginalPrice(product);
  const imageUrl = getImageUrl(product);
  const discount = original && original > price ? Math.round((1 - price / original) * 100) : null;

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
    <motion.article variants={cardVariants} className="prod-card">
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

          {/* Wishlist button */}
          <button
            className={`prod-wish ${wished ? 'on' : ''}`}
            onClick={toggleWish}
            aria-label={wished ? 'Retirer des souhaits' : 'Ajouter aux souhaits'}
          >
            <Heart size={13} fill={wished ? 'var(--or)' : 'none'} color={wished ? 'var(--or)' : 'var(--t3)'} />
          </button>

          {/* Badge */}
          {discount && discount >= 5 ? (
            <div className="prod-badge pb-sale">-{discount}%</div>
          ) : product.featured ? (
            <div className="prod-badge pb-featured">VEDETTE</div>
          ) : null}
        </div>

        {/* Body */}
        <div className="prod-body">
          {product.category && (
            <div className="prod-cat">{product.category}</div>
          )}
          <div className="prod-name">{product.name}</div>

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
      <div className="ps-img" />
      <div className="ps-body">
        <div className="ps-line short" />
        <div className="ps-line med" />
        <div className="ps-line" />
        <div className="ps-line short" />
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
            <div className="sec-eyebrow">Sélection</div>
            <h2 className="sec-ti">Nos meilleures offres</h2>
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
              </div>
            )
            : products.map((p) => <ProductCard key={p.id} product={p} />)}
        </motion.div>
      </div>
    </section>
  );
}
