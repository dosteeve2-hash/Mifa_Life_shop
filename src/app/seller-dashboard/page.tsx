'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { Package, TrendingUp, ShoppingBag, Star, Plus, Eye, Edit } from 'lucide-react';

let _sb: ReturnType<typeof createBrowserClient> | null = null;
function getSb() {
  if (!_sb) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    if (url && key) _sb = createBrowserClient(url, key);
  }
  return _sb;
}

interface SellerProduct { id: string; name: string; price: number; stock?: number; sales?: number; status?: string }

const MOCK_STATS = { revenue: 487500, orders: 32, products: 14, rating: 4.6 };
const MOCK_PRODUCTS: SellerProduct[] = [
  { id: 'p1', name: 'Boubou traditionnel homme', price: 25000, stock: 8, sales: 14, status: 'active' },
  { id: 'p2', name: 'Tissu wax 6 yards', price: 18000, stock: 22, sales: 9, status: 'active' },
  { id: 'p3', name: 'Sandales artisanales', price: 12000, stock: 0, sales: 5, status: 'out_of_stock' },
  { id: 'p4', name: 'Sac à main cuir', price: 35000, stock: 3, sales: 4, status: 'active' },
];

export default function SellerDashboardPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(MOCK_STATS);
  const [products, setProducts] = useState<SellerProduct[]>(MOCK_PRODUCTS);
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    const sb = getSb();
    if (!sb) { setLoading(false); return; }
    sb.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return; }
      setAuthed(true);
      setUser({ email: data.user.email });
      try {
        const { data: prods } = await sb
          .from('mifa_products')
          .select('id,name,price,stock,status')
          .eq('seller_id', data.user.id)
          .order('created_at', { ascending: false })
          .limit(20);
        if (prods && prods.length > 0) setProducts(prods as SellerProduct[]);
      } catch { /* use mock */ }
      setLoading(false);
    });
  }, []);

  const getStatusStyle = (status?: string): React.CSSProperties => {
    if (status === 'out_of_stock') return { background: '#FFEBEE', color: '#C62828', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 12 };
    if (status === 'inactive') return { background: 'var(--bg2)', color: 'var(--t4)', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 12 };
    return { background: 'var(--em-l)', color: 'var(--em)', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 12 };
  };

  if (loading) return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--bg3)', borderTop: '3px solid var(--em)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!authed) return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '40px 24px', maxWidth: 400 }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🏪</div>
        <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 26, fontWeight: 700, color: 'var(--sl)', marginBottom: 10 }}>Espace vendeur</h1>
        <p style={{ fontSize: 14, color: 'var(--t3)', marginBottom: 8 }}>Connectez-vous pour accéder à votre tableau de bord.</p>
        <p style={{ fontSize: 13, color: 'var(--t4)', marginBottom: 24 }}>Pas encore vendeur ? Rejoignez notre programme.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Se connecter →</Link>
          <Link href="/seller-register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: 'var(--white)', color: 'var(--t2)', border: '1.5px solid var(--bg3)', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Devenir vendeur</Link>
        </div>
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
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Mon espace vendeur</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700, color: '#fff', marginBottom: 4 }}>Tableau de bord vendeur</h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{user?.email}</p>
            </div>
            <Link href="/add-product" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              <Plus size={14} /> Ajouter un produit
            </Link>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 60 }}>
        {/* KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 32 }}>
          {[
            { label: 'Revenus totaux', value: `${(stats.revenue / 1000).toFixed(0)}K F`, Icon: TrendingUp, color: '#00897B' },
            { label: 'Commandes', value: stats.orders, Icon: ShoppingBag, color: '#1565C0' },
            { label: 'Produits', value: stats.products, Icon: Package, color: '#E65100' },
            { label: 'Note moyenne', value: `${stats.rating}/5 ⭐`, Icon: Star, color: '#F9A825' },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} style={{ background: 'var(--white)', borderRadius: 13, padding: '18px 18px', border: '1px solid var(--bg3)', borderTop: `3px solid ${color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t4)' }}>{label}</span>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                  <Icon size={14} />
                </div>
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--sl)' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
          {[
            { label: 'Ajouter un produit', href: '/add-product', emoji: '➕', primary: true },
            { label: 'Mes commandes', href: '/orders', emoji: '📦', primary: false },
            { label: 'Ma boutique', href: '/shop', emoji: '🛍️', primary: false },
            { label: 'Guide vendeur', href: '/seller-register', emoji: '📖', primary: false },
            { label: 'Aide & contact', href: '/contact', emoji: '💬', primary: false },
          ].map(({ label, href, emoji, primary }) => (
            <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', background: primary ? 'var(--em)' : 'var(--white)', border: `1.5px solid ${primary ? 'var(--em)' : 'var(--bg3)'}`, color: primary ? '#fff' : 'var(--t2)', borderRadius: 9, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
              {emoji} {label}
            </Link>
          ))}
        </div>

        {/* Products list */}
        <div style={{ background: 'var(--white)', borderRadius: 16, border: '1px solid var(--bg3)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 700, color: 'var(--sl)', margin: 0 }}>Mes produits</h2>
            <Link href="/add-product" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--em)', textDecoration: 'none' }}>
              <Plus size={13} /> Ajouter
            </Link>
          </div>
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>📦</div>
              <p style={{ fontSize: 14, color: 'var(--t3)', marginBottom: 20 }}>Vous n&apos;avez pas encore de produits.</p>
              <Link href="/add-product" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 22px', background: 'var(--em)', color: '#fff', borderRadius: 9, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                <Plus size={14} /> Ajouter mon premier produit
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg2)' }}>
                    {['Produit', 'Prix', 'Stock', 'Ventes', 'Statut', 'Actions'].map((h) => (
                      <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--t4)', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--bg2)' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--sl)', maxWidth: 200 }}>{p.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: 'var(--em)', whiteSpace: 'nowrap' }}>{p.price.toLocaleString('fr')} F</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: (p.stock ?? 0) === 0 ? '#C62828' : 'var(--t2)' }}>
                        {(p.stock ?? 0) === 0 ? '❌ Épuisé' : `${p.stock} unités`}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)' }}>{p.sales ?? 0}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={getStatusStyle(p.status)}>
                          {p.status === 'out_of_stock' ? 'Épuisé' : p.status === 'inactive' ? 'Inactif' : 'Actif'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Link href={`/shop/${p.id}`} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', border: '1px solid var(--bg3)', borderRadius: 7, fontSize: 11, fontWeight: 600, color: 'var(--t2)', textDecoration: 'none' }}>
                            <Eye size={11} /> Voir
                          </Link>
                          <button style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', border: '1px solid var(--em)', borderRadius: 7, fontSize: 11, fontWeight: 600, color: 'var(--em)', background: 'transparent', cursor: 'pointer' }}>
                            <Edit size={11} /> Modifier
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tip box */}
        <div style={{ marginTop: 24, background: 'var(--em-l)', border: '1px solid var(--em-g)', borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.7, margin: 0 }}>
            <strong>Conseil :</strong> Les produits avec plus de 3 photos et une description détaillée se vendent 3x plus vite. Pensez aussi à mettre à jour votre stock régulièrement.
          </p>
        </div>
      </div>
    </div>
  );
}
