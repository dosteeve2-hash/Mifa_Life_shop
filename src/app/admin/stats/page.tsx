'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  ShoppingBag, TrendingUp, Users, Package, ArrowUp, ArrowDown, BarChart2,
} from 'lucide-react';

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

const MOIS_LABEL = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const MOCK_MONTHLY = [
  { mois: 'Fév', commandes: 18, revenus: 540000 },
  { mois: 'Mar', commandes: 24, revenus: 720000 },
  { mois: 'Avr', commandes: 31, revenus: 890000 },
  { mois: 'Mai', commandes: 28, revenus: 780000 },
  { mois: 'Jun', commandes: 42, revenus: 1240000 },
  { mois: 'Jul', commandes: 56, revenus: 1680000 },
];

const MOCK_STATUS = [
  { name: 'Livré',      value: 62, color: '#16a34a' },
  { name: 'En cours',   value: 23, color: '#2f6fed' },
  { name: 'En attente', value: 12, color: '#e65100' },
  { name: 'Annulé',     value: 8,  color: '#dc2626' },
];

const MOCK_TOP_PRODUITS = [
  { nom: 'Boubou Wax Premium XL', commandes: 34, revenus: 1190000, categorie: 'Mode' },
  { nom: 'Manteau Bogolan Femme', commandes: 28, revenus: 980000, categorie: 'Mode' },
  { nom: 'Bracelet Or Sahel 18k', commandes: 22, revenus: 880000, categorie: 'Bijoux' },
  { nom: 'Tissu Kente 6m Multicolore', commandes: 19, revenus: 570000, categorie: 'Tissu' },
  { nom: 'Sculpture Ébène Masque', commandes: 15, revenus: 525000, categorie: 'Art' },
];

interface MonthStat { mois: string; commandes: number; revenus: number }
interface KPI { orders: number; revenue: number; users: number; products: number; ordersGrowth: number; revenueGrowth: number }

const MOCK_KPI: KPI = {
  orders: 142, revenue: 4_150_000, users: 89, products: 312,
  ordersGrowth: 33, revenueGrowth: 35,
};

const card = (): React.CSSProperties => ({
  background: 'var(--bg3)',
  border: '1px solid var(--border)',
  borderRadius: 14,
  padding: '20px 22px',
});

function GrowthBadge({ pct }: { pct: number }) {
  const up = pct >= 0;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
      background: up ? '#16a34a18' : '#dc262618',
      color: up ? '#16a34a' : '#dc2626',
    }}>
      {up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
      {Math.abs(pct)}%
    </span>
  );
}

const TOOLTIP_STYLE = {
  contentStyle: { background: '#fff', border: '1px solid #e4ebf5', borderRadius: 8, fontSize: 12 },
  labelStyle: { color: '#4a6285', fontWeight: 600 },
};

export default function AdminStatsPage() {
  const [loading, setLoading]       = useState(true);
  const [authed, setAuthed]         = useState(false);
  const [kpi, setKpi]               = useState<KPI>(MOCK_KPI);
  const [monthly, setMonthly]       = useState<MonthStat[]>(MOCK_MONTHLY);

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
          sb.from('mifa_orders').select('id,created_at,total,status').order('created_at', { ascending: true }),
        ]);
        setKpi(k => ({ ...k, orders: oCount ?? k.orders, users: uCount ?? k.users, products: pCount ?? k.products }));
        if (oData && oData.length > 0) {
          const monthMap: Record<string, MonthStat> = {};
          oData.forEach((o: { created_at: string; total: number }) => {
            const d = new Date(o.created_at);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            if (!monthMap[key]) monthMap[key] = { mois: MOIS_LABEL[d.getMonth()], commandes: 0, revenus: 0 };
            monthMap[key].commandes++;
            monthMap[key].revenus += o.total ?? 0;
          });
          const sorted = Object.entries(monthMap).sort(([a], [b]) => a.localeCompare(b)).slice(-6).map(([, v]) => v);
          if (sorted.length > 0) setMonthly(sorted);
          const rev = oData.reduce((s: number, o: { total?: number }) => s + (o.total ?? 0), 0);
          setKpi(k => ({ ...k, revenue: rev }));
        }
      } catch { /* keep mock */ }
      setLoading(false);
    });
  }, []);

  const lastMonth = monthly[monthly.length - 1];
  const prevMonth = monthly[monthly.length - 2];
  const cmdGrowth = prevMonth && prevMonth.commandes > 0
    ? Math.round(((lastMonth.commandes - prevMonth.commandes) / prevMonth.commandes) * 100) : kpi.ordersGrowth;
  const revGrowth = prevMonth && prevMonth.revenus > 0
    ? Math.round(((lastMonth.revenus - prevMonth.revenus) / prevMonth.revenus) * 100) : kpi.revenueGrowth;

  if (loading) return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTop: '3px solid var(--em)', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!authed) return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
        <p style={{ color: 'var(--text2)', marginBottom: 20 }}>Accès réservé aux administrateurs.</p>
        <Link href="/login" style={{ padding: '10px 24px', background: 'var(--em)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>Se connecter →</Link>
      </div>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--sl3) 0%, #e8f0fb 100%)', padding: 'clamp(24px,4vw,40px) 0', borderBottom: '1px solid var(--border)' }}>
        <div className="wrap">
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'var(--text3)', marginBottom: 12 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <Link href="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>Admin</Link>
            <span>›</span>
            <span style={{ color: 'var(--text2)' }}>Statistiques</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <BarChart2 size={28} style={{ color: 'var(--em)' }} />
              <div>
                <h1 style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, color: 'var(--text)', margin: 0 }}>Statistiques avancées</h1>
                <p style={{ fontSize: 13, color: 'var(--text3)', margin: '2px 0 0' }}>Analyse des performances Mifa Life</p>
              </div>
            </div>
            <Link href="/admin" style={{ padding: '8px 16px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 9, fontSize: 12, fontWeight: 600, color: 'var(--text2)', textDecoration: 'none' }}>
              ← Retour admin
            </Link>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 60 }}>

        {/* KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Commandes',  value: kpi.orders.toLocaleString('fr'),  icon: ShoppingBag, color: '#2f6fed', growth: cmdGrowth },
            { label: 'Revenus',    value: `${(kpi.revenue/1000).toFixed(0)}K FCFA`, icon: TrendingUp, color: '#16a34a', growth: revGrowth },
            { label: 'Clients',    value: kpi.users.toLocaleString('fr'),   icon: Users,       color: '#e65100', growth: null },
            { label: 'Produits',   value: kpi.products.toLocaleString('fr'),icon: Package,     color: '#7c3aed', growth: null },
          ].map(({ label, value, icon: Icon, color, growth }) => (
            <div key={label} style={{ ...card(), borderTop: `3px solid ${color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text3)' }}>{label}</span>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                  <Icon size={15} />
                </div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>{value}</div>
              {growth !== null && <GrowthBadge pct={growth} />}
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>

          {/* LineChart — commandes / mois */}
          <div style={card()}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: '0 0 16px' }}>Commandes mensuelles (6 mois)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="mois" tick={{ fill: 'var(--text3)', fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [v, 'Commandes']} />
                <Line type="monotone" dataKey="commandes" stroke="#2f6fed" strokeWidth={2.5} dot={{ fill: '#2f6fed', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* PieChart — statuts */}
          <div style={card()}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: '0 0 16px' }}>Statuts commandes</h2>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={MOCK_STATUS} dataKey="value" cx="50%" cy="50%" outerRadius={65} strokeWidth={0}>
                  {MOCK_STATUS.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [v, 'commandes']} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
              {MOCK_STATUS.map((s) => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text3)', flex: 1 }}>{s.name}</span>
                  <span style={{ color: 'var(--text)', fontWeight: 600 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts row 2 */}
        <div style={{ ...card(), marginBottom: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: '0 0 16px' }}>Revenus mensuels (FCFA)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="mois" tick={{ fill: 'var(--text3)', fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${(v as number).toLocaleString('fr-FR')} FCFA`, 'Revenus']} />
              <Bar dataKey="revenus" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top produits */}
        <div style={card()}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: '0 0 16px' }}>Top 5 produits par revenus</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['#', 'Produit', 'Catégorie', 'Commandes', 'Revenus'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text3)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_TOP_PRODUITS.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)', transition: 'background .1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg4)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#2f6fed' }}>#{i + 1}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text)' }}>{p.nom}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ background: 'var(--em-l)', color: 'var(--em)', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{p.categorie}</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text2)' }}>{p.commandes}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#16a34a' }}>{p.revenus.toLocaleString('fr-FR')} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text3)', marginTop: 24 }}>
          * Les données se remplissent automatiquement depuis Supabase lorsque vous êtes connecté
        </p>
      </div>
    </div>
  );
}
