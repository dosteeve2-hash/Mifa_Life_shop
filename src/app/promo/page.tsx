'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, Package, ShoppingBag, Check, Tag } from 'lucide-react';
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

interface PromoProduct {
  id: string;
  name: string;
  price: number;
  original_price: number;
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

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 56,
        height: 56,
        background: 'rgba(255,255,255,0.12)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        fontWeight: 800,
        color: '#fff',
        fontVariantNumeric: 'tabular-nums',
        border: '1px solid rgba(255,255,255,0.18)',
      }}>
        {String(value).padStart(2, '0')}
      </div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    </div>
  );
}

export default function PromoPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<PromoProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState<Record<string, boolean>>({});

  // Flash sale ends in 48 hours from first render
  const [endMs] = useState(() => Date.now() + 48 * 3_600_000);
  const countdown = useCountdown(endMs);

  useEffect(() => {
    const sb = getSb();
    if (!sb) { setLoading(false); return; }

    sb.from('mifa_products')
      .select('id,name,price,original_price,category,images,stock,shipping_days,featured')
      .eq('active', true)
      .not('original_price', 'is', null)
      .order('featured', { ascending: false })
      .limit(12)
      .then(({ data }) => {
        const discounted = ((data ?? []) as PromoProduct[]).filter(
          (p) => p.original_price && p.original_price > p.price,
        );
        setProducts(discounted);
        setLoading(false);
      });
  }, []);

  const handleAdd = async (id: string) => {
    if (added[id]) return;
    await addToCart(id);
    setAdded((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [id]: false })), 1500);
  };

  const maxDiscount = products.reduce((best, p) => {
    const d = Math.round((1 - p.price / p.original_price) * 100);
    return d > best ? d : best;
  }, 0);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, #B71C1C 0%, #FF6F00 60%, #E65100 100%)',
        padding: 'clamp(32px,6vw,64px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -50, left: -50, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 18 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span style={{ opacity: 0.5 }}>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Promotions</span>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <motion.div
              animate={{ rotate: [0, -15, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            >
              <Zap size={28} color="#FFD700" fill="#FFD700" />
            </motion.div>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Vente flash — Offres limitées
            </span>
          </div>

          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(28px,5vw,52px)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            marginBottom: 14,
          }}>
            Jusqu&apos;à{' '}
            <span style={{ color: '#FFD700' }}>-{maxDiscount || 50}%</span>
            <br />
            sur des centaines d&apos;articles
          </h1>

          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 28, maxWidth: 440, lineHeight: 1.65 }}>
            Des réductions exceptionnelles sur notre sélection. Livraison rapide partout au Mali via Orange Money ou Wave.
          </p>

          {/* Countdown */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 10, fontWeight: 600 }}>
              ⏱ L&apos;offre expire dans :
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <CountdownUnit value={countdown.h} label="Heures" />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 22, fontWeight: 800, marginBottom: 18 }}>:</span>
              <CountdownUnit value={countdown.m} label="Minutes" />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 22, fontWeight: 800, marginBottom: 18 }}>:</span>
              <CountdownUnit value={countdown.s} label="Secondes" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a
              href="#promos"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 26px',
                background: '#FFD700',
                color: '#1a1a1a',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 800,
                textDecoration: 'none',
              }}
            >
              <Tag size={15} /> Voir les offres
            </a>
            <Link
              href="/shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 26px',
                background: 'rgba(255,255,255,0.12)',
                color: '#fff',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.22)',
              }}
            >
              Toute la boutique →
            </Link>
          </div>
        </div>
      </div>

      {/* Promo highlights strip */}
      <div style={{
        background: '#FFD700',
        padding: '10px 0',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(16px,4vw,48px)',
          flexWrap: 'wrap',
          padding: '0 clamp(14px,3vw,28px)',
        }}>
          {[
            { icon: '🚀', text: 'Livraison rapide' },
            { icon: '✅', text: 'Qualité garantie' },
            { icon: '📱', text: 'Paiement Orange Money & Wave' },
            { icon: '↩️', text: '14j pour retourner' },
          ].map((item) => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 700, color: '#1a1a1a', whiteSpace: 'nowrap' }}>
              <span>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div id="promos" className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div className="sec-hd" style={{ marginBottom: 24 }}>
          <div>
            <div className="sec-eyebrow">Offres en cours</div>
            <h2 className="sec-ti">Articles en promotion</h2>
          </div>
          {!loading && products.length > 0 && (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 16px',
              background: '#FFF3E0',
              border: '1px solid #FFCC02',
              borderRadius: 22,
              fontSize: 12,
              fontWeight: 700,
              color: '#E65100',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF6F00', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
              {products.length} article{products.length !== 1 ? 's' : ''} en promo
            </span>
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
                  <div className="ps-line short skeleton" />
                  <div className="ps-line skeleton" style={{ height: 32, borderRadius: 8, marginTop: 4 }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'clamp(40px,8vw,80px) 20px' }}>
            <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22, fontSize: 36 }}>
              🏷️
            </div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(18px,3vw,24px)', fontWeight: 700, color: 'var(--t1)', marginBottom: 10 }}>
              Nouvelles promos bientôt disponibles
            </h2>
            <p style={{ fontSize: 14, color: 'var(--t3)', lineHeight: 1.7, maxWidth: 380, marginBottom: 28 }}>
              Nos offres flash arrivent très bientôt. En attendant, parcourez notre catalogue complet.
            </p>
            <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              <ShoppingBag size={15} /> Voir la boutique
            </Link>
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
                const discount = Math.round((1 - p.price / p.original_price) * 100);
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
                          <div className="prod-img-ph">
                            <Package size={32} strokeWidth={1} color="var(--t4)" />
                          </div>
                        )}
                        {discount >= 5 && (
                          <div className="prod-badge pb-sale" style={{ background: '#E53935' }}>-{discount}%</div>
                        )}
                      </div>

                      <div className="prod-body">
                        {p.category && <div className="prod-cat">{p.category}</div>}
                        <div className="prod-name">{p.name}</div>
                        <div className="prod-price-row">
                          <span className="prod-price" style={{ color: '#E53935' }}>{formatPrice(p.price)}</span>
                          <span className="prod-orig">{formatPrice(p.original_price)}</span>
                          <span className="prod-discount">-{discount}%</span>
                        </div>
                        <div style={{ fontSize: 11, color: '#2E7D32', fontWeight: 700, marginBottom: 8 }}>
                          Économisez {formatPrice(p.original_price - p.price)}
                        </div>
                        {p.shipping_days !== undefined && (
                          <div className="prod-shipping">Livraison en {p.shipping_days}–{p.shipping_days + 2}j</div>
                        )}
                        <button
                          className="prod-add"
                          onClick={(e) => { e.preventDefault(); handleAdd(p.id); }}
                          style={isAdded ? { background: '#065F46' } : { background: '#E53935' }}
                          aria-label="Ajouter au panier"
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {isAdded ? (
                              <motion.span key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Check size={13} /> Ajouté !
                              </motion.span>
                            ) : (
                              <motion.span key="add" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <ShoppingBag size={12} /> Profiter de l&apos;offre
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
