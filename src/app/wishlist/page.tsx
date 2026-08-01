'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Package, Trash2, ArrowUpDown } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useCart } from '@/context/CartContext';

type SortKey = 'date' | 'prix-asc' | 'prix-desc';

function formatPrice(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

let _sb: ReturnType<typeof createBrowserClient> | null = null;
function getSb() {
  if (!_sb) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    if (url && key) _sb = createBrowserClient(url, key);
  }
  return _sb;
}

interface WishProduct {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  category?: string;
  images?: string[];
  stock?: number;
  shipping_days?: number;
}

export default function WishlistPage() {
  const { addToCart } = useCart();
  const [ids, setIds] = useState<(string | number)[]>([]);
  const [products, setProducts] = useState<WishProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    try {
      const raw: (string | number)[] = JSON.parse(localStorage.getItem('mifa_wishes') ?? '[]');
      setIds(raw);
    } catch {
      setIds([]);
    }
  }, []);

  useEffect(() => {
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    const sb = getSb();
    if (!sb) {
      setLoading(false);
      return;
    }
    sb.from('mifa_products')
      .select('id,name,price,original_price,category,images,stock,shipping_days')
      .in('id', ids.map(String))
      .then(({ data }) => {
        setProducts((data as WishProduct[]) ?? []);
        setLoading(false);
      });
  }, [ids]);

  const remove = (id: string | number) => {
    try {
      const wishes: (string | number)[] = JSON.parse(localStorage.getItem('mifa_wishes') ?? '[]');
      const next = wishes.filter((w) => w !== id && w !== String(id));
      localStorage.setItem('mifa_wishes', JSON.stringify(next));
      setIds(next);
      setProducts((prev) => prev.filter((p) => p.id !== String(id)));
    } catch {}
  };

  const clearAll = () => {
    localStorage.setItem('mifa_wishes', '[]');
    setIds([]);
    setProducts([]);
    setShowClearConfirm(false);
    window.dispatchEvent(new Event('storage'));
  };

  const sortedProducts = useMemo(() => {
    const copy = [...products];
    if (sortKey === 'prix-asc') return copy.sort((a, b) => a.price - b.price);
    if (sortKey === 'prix-desc') return copy.sort((a, b) => b.price - a.price);
    return copy; // 'date' = order in ids array
  }, [products, sortKey]);

  const handleAddToCart = async (id: string) => {
    if (added[id]) return;
    await addToCart(id);
    setAdded((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [id]: false })), 1500);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'var(--sl3)',
        padding: 'clamp(24px,4vw,48px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(0,137,123,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(0,137,123,0.04)', pointerEvents: 'none' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 14 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span style={{ opacity: 0.5 }}>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Liste de souhaits</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(22px,4vw,34px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 8 }}>
                Ma liste de souhaits
              </h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                {loading ? 'Chargement…' : `${products.length} article${products.length !== 1 ? 's' : ''} sauvegardé${products.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            {products.length > 0 && (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Tri */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ArrowUpDown size={13} style={{ color: 'rgba(255,255,255,0.5)' }} />
                  <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}
                    style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', outline: 'none' }}>
                    <option value="date">Ordre d&apos;ajout</option>
                    <option value="prix-asc">Prix : croissant</option>
                    <option value="prix-desc">Prix : décroissant</option>
                  </select>
                </div>
                {/* Tout supprimer */}
                {!showClearConfirm ? (
                  <button onClick={() => setShowClearConfirm(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 10, fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                    <Trash2 size={13} /> Tout supprimer
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={clearAll}
                      style={{ padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, background: '#ef4444', border: 'none', color: '#fff', cursor: 'pointer' }}>
                      Confirmer
                    </button>
                    <button onClick={() => setShowClearConfirm(false)}
                      style={{ padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer' }}>
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 60 }}>
        {loading ? (
          <div id="featured-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="prod-skel">
                <div className="ps-img" style={{ background: 'linear-gradient(90deg, var(--bg2) 25%, var(--bg3) 50%, var(--bg2) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
                <div className="ps-body">
                  <div className="ps-line short skeleton" />
                  <div className="ps-line med skeleton" />
                  <div className="ps-line skeleton" />
                  <div className="ps-line short skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'clamp(40px,8vw,80px) 20px' }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              style={{ width: 90, height: 90, borderRadius: '50%', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}
            >
              <Heart size={36} strokeWidth={1} color="var(--t4)" />
            </motion.div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(18px,3vw,24px)', fontWeight: 700, color: 'var(--t1)', marginBottom: 10 }}>
              Votre liste de souhaits est vide
            </h2>
            <p style={{ fontSize: 14, color: 'var(--t3)', lineHeight: 1.7, maxWidth: 380, marginBottom: 28 }}>
              Cliquez sur l&apos;icône ♡ sur n&apos;importe quel produit pour le sauvegarder ici et le retrouver facilement.
            </p>
            <Link
              href="/shop"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 26px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', transition: 'background 0.2s' }}
            >
              <ShoppingBag size={15} /> Découvrir la boutique
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div
              id="featured-grid"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
            >
              <AnimatePresence>
                {sortedProducts.map((p) => {
                  const price = p.price;
                  const original = p.original_price;
                  const discount = original && original > price ? Math.round((1 - price / original) * 100) : null;
                  const img = p.images?.[0] ?? null;
                  const isAdded = added[p.id] ?? false;

                  return (
                    <motion.article
                      key={p.id}
                      variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
                      className="prod-card"
                      layout
                    >
                      <Link href={`/shop/${p.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div className="prod-img-wrap">
                          {img ? (
                            <Image
                              src={img}
                              alt={p.name}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="prod-img"
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="prod-img-ph">
                              <Package size={32} strokeWidth={1} color="var(--t4)" />
                            </div>
                          )}
                          {discount && discount >= 5 && (
                            <div className="prod-badge pb-sale">-{discount}%</div>
                          )}
                        </div>

                        <div className="prod-body">
                          {p.category && <div className="prod-cat">{p.category}</div>}
                          <div className="prod-name">{p.name}</div>
                          <div className="prod-price-row">
                            <span className="prod-price">{formatPrice(price)}</span>
                            {original && original > price && (
                              <>
                                <span className="prod-orig">{formatPrice(original)}</span>
                                {discount && <span className="prod-discount">-{discount}%</span>}
                              </>
                            )}
                          </div>
                          {p.shipping_days !== undefined && (
                            <div className="prod-shipping">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                              </svg>
                              Livraison en {p.shipping_days}–{p.shipping_days + 2} jours
                            </div>
                          )}
                          <button
                            className="prod-add"
                            onClick={(e) => { e.preventDefault(); handleAddToCart(p.id); }}
                            style={isAdded ? { background: '#065F46' } : {}}
                            aria-label="Ajouter au panier"
                          >
                            {isAdded ? '✓ Ajouté !' : '+ Ajouter au panier'}
                          </button>
                        </div>
                      </Link>

                      {/* Remove from wishlist */}
                      <motion.button
                        onClick={() => remove(p.id)}
                        whileTap={{ scale: 0.85 }}
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.93)',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          zIndex: 4,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.14)',
                        }}
                        aria-label="Retirer de la liste"
                      >
                        <Heart size={13} fill="var(--or)" color="var(--or)" />
                      </motion.button>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            <div style={{ marginTop: 40, textAlign: 'center' }}>
              <Link
                href="/shop"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 24px',
                  background: 'var(--white)',
                  color: 'var(--t2)',
                  border: '1.5px solid var(--bg3)',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <ShoppingBag size={14} /> Continuer mes achats
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
