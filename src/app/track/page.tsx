'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: string }> = {
  pending:   { label: 'En attente',     color: '#B45309', bg: '#FEF3C7', icon: '⏳' },
  confirmed: { label: 'Confirmée',      color: '#1D4ED8', bg: '#DBEAFE', icon: '✅' },
  shipped:   { label: 'En livraison',   color: '#6D28D9', bg: '#EDE9FE', icon: '🚚' },
  delivered: { label: 'Livrée',         color: '#065F46', bg: '#D1FAE5', icon: '✓'  },
  cancelled: { label: 'Annulée',        color: '#991B1B', bg: '#FEE2E2', icon: '✕'  },
};

const STEPS: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered'];

interface Order {
  id: string;
  order_number?: string;
  status: OrderStatus;
  total_cfa: number;
  created_at: string;
  payment_type: string;
  delivery_address?: string;
  order_items?: { quantity: number; unit_price_cfa: number; products?: { name: string } | null }[];
}

let _sb: ReturnType<typeof createBrowserClient> | null = null;
function getSb() {
  if (!_sb && typeof window !== 'undefined') {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    if (url && key) _sb = createBrowserClient(url, key);
  }
  return _sb;
}

function fmt(n: number) { return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'; }

export default function TrackPage() {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setNotFound(false);
    setError('');
    setOrder(null);
    try {
      const sb = getSb();
      if (!sb) { setError('Configuration manquante.'); setLoading(false); return; }

      const term = query.trim().toUpperCase();
      let q = sb.from('orders').select('*,order_items(quantity,unit_price_cfa,products(name))');

      if (term.startsWith('ML') && term.length >= 6) {
        q = q.ilike('id', `${term.slice(2).toLowerCase()}%`);
      } else {
        q = q.ilike('id', `${term.toLowerCase()}%`);
      }

      const { data, error: err } = await q.limit(1).maybeSingle();
      if (err) throw err;
      if (!data) { setNotFound(true); } else { setOrder(data as Order); }
    } catch {
      setError('Erreur lors de la recherche. Réessayez.');
    } finally { setLoading(false); }
  };

  const status = order ? (STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending) : null;
  const stepIdx = order ? STEPS.indexOf(order.status) : -1;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--sl3)', padding: 'clamp(28px,5vw,56px) 0' }}>
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>
            <Link href="/" style={{ color: 'inherit' }}>Accueil</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.65)' }}>Suivi de commande</span>
          </div>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(24px,5vw,38px)', fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            Suivre ma commande
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>
            Entrez votre numéro de commande (format ML-XXXXXX)
          </p>
          {/* Search form */}
          <form onSubmit={search} style={{ display: 'flex', maxWidth: 440, gap: 8 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: ML-A3F2B1"
              style={{ flex: 1, padding: '12px 16px', borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 14, outline: 'none' }}
            />
            <button
              type="submit" disabled={loading}
              style={{ padding: '12px 20px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', opacity: loading ? .7 : 1 }}
            >
              {loading ? '...' : 'Rechercher'}
            </button>
          </form>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 36, paddingBottom: 60, maxWidth: 640 }}>
        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#991B1B', marginBottom: 20 }}>{error}</div>
        )}
        {notFound && (
          <div style={{ background: 'var(--white)', borderRadius: 16, padding: 36, textAlign: 'center', boxShadow: 'var(--sh-m)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 18, fontWeight: 700, color: 'var(--sl)', marginBottom: 8 }}>Commande introuvable</h2>
            <p style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 20 }}>Vérifiez votre numéro de commande ou consultez votre email de confirmation.</p>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'var(--em)', color: '#fff', borderRadius: 9, fontSize: 13, fontWeight: 700 }}>
              Contacter le support
            </Link>
          </div>
        )}

        {order && status && (
          <div style={{ background: 'var(--white)', borderRadius: 16, boxShadow: 'var(--sh-m)', overflow: 'hidden' }}>
            {/* Status header */}
            <div style={{ padding: '20px 24px', background: status.bg, borderBottom: `2px solid ${status.color}22` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flexShrink: 0 }}>{status.icon}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: status.color, marginBottom: 2 }}>Statut actuel</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--t1)' }}>{status.label}</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: 'var(--t4)', marginBottom: 2 }}>Numéro</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t2)', fontFamily: 'monospace' }}>ML-{order.id.slice(0, 6).toUpperCase()}</div>
                </div>
              </div>
            </div>

            {/* Progress steps */}
            {order.status !== 'cancelled' && (
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--bg3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  {STEPS.map((step, i) => {
                    const cfg = STATUS_CONFIG[step];
                    const done = i <= stepIdx;
                    const active = i === stepIdx;
                    return (
                      <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          {i > 0 && <div style={{ flex: 1, height: 2, background: done ? 'var(--em)' : 'var(--bg3)', transition: 'background .3s' }} />}
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: done ? 'var(--em)' : 'var(--bg2)', border: `2px solid ${done ? 'var(--em)' : 'var(--bg3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: done ? '#fff' : 'var(--t4)', flexShrink: 0, transform: active ? 'scale(1.2)' : 'none', boxShadow: active ? '0 0 0 4px var(--em-l)' : 'none', transition: 'all .3s', zIndex: 1 }}>
                            {done ? (active ? cfg.icon : '✓') : '○'}
                          </div>
                          {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < stepIdx ? 'var(--em)' : 'var(--bg3)' }} />}
                        </div>
                        <div style={{ fontSize: 9, fontWeight: 600, color: done ? 'var(--em)' : 'var(--t4)', marginTop: 5, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '.04em' }}>{cfg.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order details */}
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                {[
                  { label: 'Total', value: fmt(order.total_cfa) },
                  { label: 'Paiement', value: order.payment_type === 'orange_money' ? 'Orange Money' : order.payment_type === 'wave' ? 'Wave' : 'À la livraison' },
                  { label: 'Date', value: new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) },
                  { label: 'Articles', value: order.order_items?.length ? `${order.order_items.reduce((s, i) => s + i.quantity, 0)} article(s)` : 'N/A' },
                ].map((d) => (
                  <div key={d.label} style={{ background: 'var(--bg)', borderRadius: 9, padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--t4)', marginBottom: 3 }}>{d.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{d.value}</div>
                  </div>
                ))}
              </div>

              {order.order_items && order.order_items.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--t4)', marginBottom: 10 }}>Produits commandés</div>
                  {order.order_items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: i > 0 ? '1px solid var(--bg3)' : 'none' }}>
                      <span style={{ fontSize: 13, color: 'var(--t2)' }}>{item.products?.name ?? 'Produit'} × {item.quantity}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{fmt(item.unit_price_cfa * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--bg3)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/contact" style={{ flex: 1, textAlign: 'center', padding: '10px', background: 'var(--bg)', color: 'var(--t2)', borderRadius: 9, fontSize: 12, fontWeight: 700, border: '1px solid var(--bg3)', minWidth: 120 }}>
                  📞 Support
                </Link>
                <Link href="/shop" style={{ flex: 1, textAlign: 'center', padding: '10px', background: 'var(--em)', color: '#fff', borderRadius: 9, fontSize: 12, fontWeight: 700, minWidth: 120 }}>
                  🛍️ Continuer les achats
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* No search yet */}
        {!order && !notFound && !error && !loading && (
          <div style={{ background: 'var(--white)', borderRadius: 16, padding: 40, textAlign: 'center', boxShadow: 'var(--sh-m)' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📦</div>
            <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 18, fontWeight: 700, color: 'var(--sl)', marginBottom: 10 }}>Suivez votre colis</h2>
            <p style={{ fontSize: 13, color: 'var(--t3)', maxWidth: 360, margin: '0 auto 20px', lineHeight: 1.7 }}>
              Entrez votre numéro de commande ci-dessus pour voir l&apos;état de votre livraison en temps réel.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
              {['⏳ En attente', '✅ Confirmée', '🚚 En livraison', '✓ Livrée'].map((s) => (
                <div key={s} style={{ fontSize: 12, color: 'var(--t4)', fontWeight: 600 }}>{s}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
