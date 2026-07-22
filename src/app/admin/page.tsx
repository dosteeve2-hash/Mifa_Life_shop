'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { ShoppingBag, Users, TrendingUp, Package, AlertCircle, CheckCircle, Clock, BarChart2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

let _sb: ReturnType<typeof createBrowserClient> | null = null;
function getSb() {
  if (!_sb) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    if (url && key) _sb = createBrowserClient(url, key);
  }
  return _sb;
}

interface Stats { orders: number; revenue: number; users: number; products: number }
interface RecentOrder { id: string; created_at: string; status: string; total: number; buyer_name?: string }

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  pending:    { label: 'En attente',  color: '#E65100', bg: '#FFF3E0', Icon: Clock },
  processing: { label: 'En cours',    color: '#1565C0', bg: '#E3F2FD', Icon: BarChart2 },
  shipped:    { label: 'Expédié',     color: '#00897B', bg: 'var(--em-l)', Icon: Package },
  delivered:  { label: 'Livré',       color: '#2E7D32', bg: '#E8F5E9', Icon: CheckCircle },
  cancelled:  { label: 'Annulé',      color: '#C62828', bg: '#FFEBEE', Icon: AlertCircle },
};

const MOCK_STATS: Stats = { orders: 142, revenue: 3_540_000, users: 89, products: 312 };
const MOCK_ORDERS: RecentOrder[] = [
  { id: 'CMD-1042', created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(), status: 'pending', total: 48500, buyer_name: 'Aminata Traoré' },
  { id: 'CMD-1041', created_at: new Date(Date.now() - 1000 * 60 * 85).toISOString(), status: 'processing', total: 126000, buyer_name: 'Moussa Koné' },
  { id: 'CMD-1040', created_at: new Date(Date.now() - 1000 * 60 * 200).toISOString(), status: 'shipped', total: 29900, buyer_name: 'Fatoumata Diallo' },
  { id: 'CMD-1039', created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(), status: 'delivered', total: 75000, buyer_name: 'Ibrahim Coulibaly' },
  { id: 'CMD-1038', created_at: new Date(Date.now() - 1000 * 60 * 480).toISOString(), status: 'cancelled', total: 15200, buyer_name: 'Kadiatou Bah' },
];

function timeAgo(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 60) return `Il y a ${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  return `Il y a ${Math.floor(h / 24)}j`;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>(MOCK_STATS);
  const [orders, setOrders] = useState<RecentOrder[]>(MOCK_ORDERS);

  useEffect(() => {
    const sb = getSb();
    if (!sb) { setLoading(false); return; }
    sb.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return; }
      setAuthed(true);
      try {
        const [{ count: oCount }, { count: uCount }, { count: pCount }, { data: oData }] = await Promise.all([
          sb.from('mifa_orders').select('*', { count: 'exact', head: true }),
          sb.from('profiles').select('*', { count: 'exact', head: true }),
          sb.from('mifa_products').select('*', { count: 'exact', head: true }),
          sb.from('mifa_orders').select('id,created_at,status,total,buyer_name').order('created_at', { ascending: false }).limit(10),
        ]);
        setStats((s) => ({ ...s, orders: oCount ?? s.orders, users: uCount ?? s.users, products: pCount ?? s.products }));
        if (oData && oData.length > 0) setOrders(oData as RecentOrder[]);
      } catch { /* use mock data */ }
      setLoading(false);
    });
  }, []);

  const cardStyle = (color: string): React.CSSProperties => ({
    background: 'var(--white)', borderRadius: 14, padding: '20px 22px',
    border: '1px solid var(--bg3)', boxShadow: '0 2px 10px rgba(0,0,0,.04)',
    borderTop: `3px solid ${color}`,
  });

  if (loading) return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--bg3)', borderTop: '3px solid var(--em)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!authed) return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🔐</div>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 26, fontWeight: 700, color: 'var(--sl)', marginBottom: 10 }}>Accès restreint</h1>
        <p style={{ fontSize: 14, color: 'var(--t3)', marginBottom: 24 }}>Cette zone est réservée aux administrateurs.</p>
        <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Se connecter →</Link>
      </div>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--sl3) 0%, #1a3a2e 100%)', padding: 'clamp(24px,4vw,40px) 0' }}>
        <div className="wrap">
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 14 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Administration</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700, color: '#fff', marginBottom: 4 }}>Tableau de bord admin</h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Mifa Life — Vue d&apos;ensemble</p>
            </div>
            <Link href="/seller-dashboard" style={{ padding: '9px 18px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 9, fontSize: 12, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>
              Espace vendeur →
            </Link>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 36, paddingBottom: 60 }}>
        {/* KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 36 }}>
          {[
            { label: 'Commandes', value: stats.orders.toLocaleString('fr'), color: '#00897B', Icon: ShoppingBag, sub: 'Total' },
            { label: 'Revenus', value: `${(stats.revenue / 1000).toFixed(0)}K FCFA`, color: '#2E7D32', Icon: TrendingUp, sub: 'Ce mois' },
            { label: 'Clients', value: stats.users.toLocaleString('fr'), color: '#1565C0', Icon: Users, sub: 'Inscrits' },
            { label: 'Produits', value: stats.products.toLocaleString('fr'), color: '#E65100', Icon: Package, sub: 'En ligne' },
          ].map(({ label, value, color, Icon, sub }) => (
            <div key={label} style={cardStyle(color)}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t4)' }}>{label}</div>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                  <Icon size={16} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--sl)', marginBottom: 2 }}>{value}</div>
              <div style={{ fontSize: 11, color: 'var(--t4)' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 36 }}>
          {[
            { label: 'Nouveau produit', href: '/admin/produits/nouveau', emoji: '➕' },
            { label: 'Voir la boutique', href: '/shop', emoji: '🛍️' },
            { label: 'Commandes', href: '/admin/commandes', emoji: '📦' },
            { label: 'Vendeurs', href: '/seller-dashboard', emoji: '🏪' },
            { label: 'Contact client', href: '/contact', emoji: '💬' },
            { label: 'Stats avancées', href: '/admin/stats', emoji: '📊' },
          ].map(({ label, href, emoji }) => (
            <Link key={href} href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 10px', background: 'var(--white)', border: '1px solid var(--bg3)', borderRadius: 12, textDecoration: 'none', textAlign: 'center', transition: 'border-color 0.2s' }}>
              <span style={{ fontSize: 24 }}>{emoji}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)' }}>{label}</span>
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div style={{ background: 'var(--white)', borderRadius: 16, border: '1px solid var(--bg3)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 700, color: 'var(--sl)', margin: 0 }}>Commandes récentes</h2>
            <Link href="/orders" style={{ fontSize: 12, fontWeight: 700, color: 'var(--em)', textDecoration: 'none' }}>Voir toutes →</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg2)' }}>
                  {['Commande', 'Client', 'Montant', 'Statut', 'Heure'].map((h) => (
                    <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--t4)', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const cfg = STATUS_CONFIG[o.status] ?? STATUS_CONFIG.pending;
                  const Icon = cfg.Icon;
                  return (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--bg2)' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: 'var(--em)' }}>{o.id}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>{o.buyer_name ?? '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--sl)' }}>{o.total.toLocaleString('fr')} F</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700 }}>
                          <Icon size={11} /> {cfg.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--t4)' }}>{timeAgo(o.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
