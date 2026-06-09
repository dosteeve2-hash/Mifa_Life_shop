'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, Package, ShoppingBag, Check } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useCart } from '@/context/CartContext';

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

interface FlashProduct {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  category?: string;
  images?: string[];
  stock?: number;
  shipping_days?: number;
  featured?: boolean;
}

function useCountdown(targetMs: number) {
  const calc = useCallback(() => {
    const diff = Math.max(0, targetMs - Date.now());
    return {
      h: Math.floor(diff / 3_600_000),
      m: Math.floor((diff % 3_600_000) / 60_000),
      s: Math.floor((diff % 60_000) / 1_000),
    };
  }, [targetMs]);
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1_000);
    return () => clearInterval(id);
  }, [calc]);
  return time;
}

export default function FlashPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<FlashProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState<Record<string, boolean>>({});

  // 6-hour flash window
  const [endMs] = useState(() => Date.now() + 6 * 3_600_000);
  const countdown = useCountdown(endMs);

  useEffect(() => {
    const sb = getSb();
    if (!sb) { setLoading(false); return; }
    sb.from('mifa_products')
      .select('id,name,price,original_price,category,images,stock,shipping_days,featured')
      .eq('active', true)
      .eq('featured', true)
      .limit(8)
      .then(({ data }) => {
        setProducts((data as FlashProduct[]) ?? []);
        setLoading(false);
      });
  }, []);

  const handleAdd = async (id: string) => {
    if (added[id]) return;
    await addToCart(id);
    setAdded((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [id]: false })), 1500);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Flash banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        padding: 'clamp(32px,6vw,64px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#FFD700',
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{ y: [-10, 10, -10], opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 + i * 0.3, ease: 'easeInOut' }}
          />
        ))}

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.65)' }}>Flash Deals</span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            >
              <Zap size={30} color="#FFD700" fill="#FFD700" />
            </motion.div>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Ventes Flash — Stocks limités !
            </span>
          </div>

          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(28px,5vw,52px)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            marginBottom: 24,
          }}>
            Flash Deals{' '}
            <span style={{ color: '#FFD700' }}>⚡</span>
          </h1>

          {/* Countdown */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Offre expire dans :
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {[{ v: countdown.h, l: 'h' }, { v: countdown.m, l: 'min' }, { v: countdown.s, l: 's' }].map((unit, i) => (
                <div key={unit.l} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {i > 0 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 24, fontWeight: 800 }}>:</span>}
                  <div style={{ textAlign: 'center' }}>
                    <motion.div
                      key={unit.v}
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      style={{
                        width: 64,
                        height: 64,
                        background: '#FFD700',
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        fontWeight: 900,
                        color: '#1a1a1a',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {String(unit.v).padStart(2, '0')}
                    </motion.div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginTop: 5, textTransform: 'uppercase' }}>
                      {unit.l}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="#flash-grid" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 26px', background: '#FFD700', color: '#1a1a1a', borderRadius: 10, fontSize: 13, fontWeight: 800, textDecoration: 'none' }}>
              <Zap size={14} fill="currentColor" /> Voir les offres
            </a>
            <Link href="/promo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 26px', background: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
              Toutes les promos →
            </Link>
          </div>
        </div>
      </div>

      {/* Products */}
      <div id="flash-grid" className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div className="sec-hd" style={{ marginBottom: 24 }}>
          <div>
            <div className="sec-eyebrow">Offres flash</div>
            <h2 className="sec-ti">Nos meilleures offres du moment</h2>
          </div>
          {!loading && products.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 16px', background: '#FFF9C4', border: '1px solid #FFD700', borderRadius: 22, fontSize: 12, fontWeight: 700, color: '#E65100' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF6F00', display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }} />
              {products.length} offres actives
            </div>
          )}
        </div>

        {loading ? (
          <div id="featured-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="prod-skel">
                <div className="ps-img" style={{ background: 'linear-gradient(90deg, var(--bg2) 25%, var(--bg3) 50%, var(--bg2) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
                <div className="ps-body">
                  <div className="ps-line short skeleton" />
                  <div className="ps-line med skeleton" />
                  <div className="ps-line skeleton" />
                  <div className="ps-line skeleton" style={{ height: 32, borderRadius: 8, marginTop: 4 }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'clamp(40px,8vw,80px) 20px' }}>
            <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22, fontSize: 36 }}>⚡</div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(18px,3vw,24px)', fontWeight: 700, color: 'var(--t1)', marginBottom: 10 }}>
              Prochaine vente flash bientôt
            </h2>
            <p style={{ fontSize: 14, color: 'var(--t3)', lineHeight: 1.7, maxWidth: 380, marginBottom: 28 }}>
              Nos offres flash arrivent par vagues. En attendant, découvrez notre catalogue et nos promotions permanentes.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/promo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                Voir les promos →
              </Link>
              <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'var(--white)', color: 'var(--t2)', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', border: '1.5px solid var(--bg3)' }}>
                <ShoppingBag size={14} /> La boutique
              </Link>
            </div>
          </div>
        ) : (
          <motion.div
            id="featured-grid"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          >
            <AnimatePresence>
              {products.map((p) => {
                const price = p.price;
                const original = p.original_price;
                const discount = original && original > price ? Math.round((1 - price / original) * 100) : null;
                const img = p.images?.[0] ?? null;
                const isAdded = added[p.id] ?? false;

                return (
                  <motion.article
                    key={p.id}
                    variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } }}
                    className="prod-card"
                  >
                    <Link href={`/shop/${p.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div className="prod-img-wrap">
                        {img ? (
                          <Image src={img} alt={p.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="prod-img" style={{ objectFit: 'cover' }} />
                        ) : (
                          <div className="prod-img-ph"><Package size={32} strokeWidth={1} color="var(--t4)" /></div>
                        )}
                        <div className="prod-badge" style={{ background: '#1a1a2e', color: '#FFD700', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Zap size={9} fill="#FFD700" /> FLASH
                        </div>
                        {discount && discount >= 5 && (
                          <div className="prod-badge pb-sale" style={{ top: 'auto', bottom: 10, left: 10 }}>-{discount}%</div>
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
                        {p.stock !== undefined && p.stock <= 5 && p.stock > 0 && (
                          <div style={{ fontSize: 11, color: '#E53935', fontWeight: 700, marginBottom: 6 }}>
                            ⚠️ Plus que {p.stock} en stock !
                          </div>
                        )}
                        {p.shipping_days !== undefined && (
                          <div className="prod-shipping">Livraison en {p.shipping_days}–{p.shipping_days + 2}j</div>
                        )}
                        <button
                          className="prod-add"
                          onClick={(e) => { e.preventDefault(); handleAdd(p.id); }}
                          style={isAdded ? { background: '#065F46' } : {}}
                          aria-label="Ajouter au panier"
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {isAdded ? (
                              <motion.span key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Check size={13} /> Ajouté !
                              </motion.span>
                            ) : (
                              <motion.span key="add" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Zap size={12} fill="currentColor" /> Saisir l&apos;offre
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
