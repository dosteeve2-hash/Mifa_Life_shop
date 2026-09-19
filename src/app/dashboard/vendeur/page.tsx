'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { Package, TrendingUp, ShoppingCart, Star, Plus, Edit } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

interface Produit {
  id: string;
  couleur: string;
  nom: string;
  prix: number;
  stock: number;
  statut: 'actif' | 'rupture';
}

interface CommandeRecente {
  id: string;
  numero: string;
  client: string;
  produit: string;
  montant: number;
  statut: 'en_attente' | 'livre' | 'annule';
  date: string;
}

interface ChartPoint {
  month: string;
  value: number;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const CHART_DATA: ChartPoint[] = [
  { month: 'Fév', value: 280000 },
  { month: 'Mar', value: 420000 },
  { month: 'Avr', value: 350000 },
  { month: 'Mai', value: 510000 },
  { month: 'Jui', value: 445000 },
  { month: 'Jul', value: 487500 },
];

const PRODUITS: Produit[] = [
  { id: 'p1', couleur: '#E8A838', nom: 'Boubou traditionnel homme', prix: 25000, stock: 8, statut: 'actif' },
  { id: 'p2', couleur: '#6B4226', nom: 'Tissu bogolan 6 yards', prix: 18000, stock: 22, statut: 'actif' },
  { id: 'p3', couleur: '#C45C26', nom: 'Sandales artisanales cuir', prix: 12000, stock: 0, statut: 'rupture' },
  { id: 'p4', couleur: '#2D5A27', nom: 'Sac à main tissé', prix: 35000, stock: 3, statut: 'actif' },
  { id: 'p5', couleur: '#1A3A6B', nom: 'Chapeau Fula tressé', prix: 8500, stock: 15, statut: 'actif' },
];

const COMMANDES: CommandeRecente[] = [
  { id: 'c1', numero: 'ML-3F2B1A', client: 'Aminata K.', produit: 'Boubou traditionnel', montant: 25000, statut: 'livre', date: '14/07/2026' },
  { id: 'c2', numero: 'ML-8D4C2E', client: 'Ibrahima T.', produit: 'Tissu bogolan 6y', montant: 36000, statut: 'en_attente', date: '14/07/2026' },
  { id: 'c3', numero: 'ML-1A5F9B', client: 'Fatoumata D.', produit: 'Sac à main tissé', montant: 35000, statut: 'en_attente', date: '13/07/2026' },
  { id: 'c4', numero: 'ML-7E3D6C', client: 'Moussa B.', produit: 'Sandales cuir', montant: 12000, statut: 'annule', date: '12/07/2026' },
  { id: 'c5', numero: 'ML-2C8A4F', client: 'Kadiatou S.', produit: 'Chapeau Fula', montant: 17000, statut: 'livre', date: '11/07/2026' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

// ── SVG Area Chart ────────────────────────────────────────────────────────────

function SvgAreaChart({ data }: { data: ChartPoint[] }) {
  const W = 600, H = 160;
  const padT = 16, padB = 28, padL = 68, padR = 20;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxVal = Math.max(...data.map(d => d.value)) * 1.15;

  const xs = data.map((_, i) => padL + (i / (data.length - 1)) * innerW);
  const ys = data.map(d => padT + (1 - d.value / maxVal) * innerH);

  const linePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${xs[xs.length - 1].toFixed(1)},${(padT + innerH).toFixed(1)} L${xs[0].toFixed(1)},${(padT + innerH).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="vendAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00BCD4" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#00BCD4" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((s, i) => {
        const y = padT + (1 - s) * innerH;
        const label = s === 0 ? '0' : `${Math.round(maxVal * s / 1000)}K`;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W - padR} y2={y}
              stroke="#e4ebf5" strokeWidth="1"
              strokeDasharray={s === 0 ? undefined : '4 4'} />
            <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="9"
              fill="#8fa3bf" fontFamily="JetBrains Mono, monospace">{label}</text>
          </g>
        );
      })}
      <path d={areaPath} fill="url(#vendAreaGrad)" />
      <path d={linePath} fill="none" stroke="#00BCD4" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => (
        <g key={d.month}>
          <circle cx={xs[i]} cy={ys[i]} r="4.5" fill="#fff" stroke="#00BCD4" strokeWidth="2" />
          <text x={xs[i]} y={H - 6} textAnchor="middle" fontSize="10"
            fill="#8fa3bf" fontFamily="JetBrains Mono, monospace">{d.month}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  Icon: LucideIcon;
  color: string;
  sub?: ReactNode;
}

function StatCard({ label, value, Icon, color, sub }: StatCardProps) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid var(--border)',
      boxShadow: 'var(--sh-s)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: color, borderRadius: '14px 14px 0 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '.07em', color: 'var(--t3)' }}>{label}</span>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: `${color}1a`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          <Icon size={15} />
        </div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--t1)',
        fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

// ── Statut badge ──────────────────────────────────────────────────────────────

function StatutBadge({ statut }: { statut: CommandeRecente['statut'] }) {
  const cfg: Record<CommandeRecente['statut'], { label: string; bg: string; color: string }> = {
    en_attente: { label: 'En attente', bg: '#FEF3C7', color: '#92400E' },
    livre:      { label: 'Livré',      bg: '#D1FAE5', color: '#065F46' },
    annule:     { label: 'Annulé',     bg: '#FEE2E2', color: '#991B1B' },
  };
  const c = cfg[statut];
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 700, background: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function VendeurPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const produitsActifs = PRODUITS.filter(p => p.statut === 'actif').length;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0d1f3c 100%)',
        padding: 'clamp(24px,4vw,40px) 0' }}>
        <div className="wrap">
          <nav style={{ display: 'flex', gap: 6, fontSize: 12,
            color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
            <Link href="/" style={{ color: 'inherit' }}>Accueil</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Espace vendeur</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <h1 style={{ fontFamily: '"Playfair Display", serif',
                fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                Mon espace vendeur
              </h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                Gérez vos produits et suivez vos ventes
              </p>
            </div>
            <Link href="/add-product" style={{ display: 'inline-flex', alignItems: 'center',
              gap: 8, padding: '11px 20px', background: '#D4AF37', color: '#0A1628',
              borderRadius: 10, fontSize: 13, fontWeight: 800, textDecoration: 'none', flexShrink: 0 }}>
              <Plus size={15} /> Ajouter un produit
            </Link>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 60 }}>

        {/* ── Stats ─────────────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16, marginBottom: 32 }}>
          <StatCard label="Produits actifs" value={String(produitsActifs)}
            Icon={Package} color="#2f6fed" />
          <StatCard label="Commandes aujourd'hui" value="3"
            Icon={ShoppingCart} color="#00BCD4" />
          <StatCard
            label="CA ce mois"
            value={new Intl.NumberFormat('fr-FR').format(487500)}
            Icon={TrendingUp} color="#D4AF37"
            sub={<span style={{ fontSize: 11, color: 'var(--t3)' }}>FCFA</span>}
          />
          <StatCard
            label="Note moyenne" value="4.6 / 5"
            Icon={Star} color="#f59e0b"
            sub={
              <span>
                {[1,2,3,4,5].map(i => (
                  <span key={i} style={{ color: i <= 5 ? '#f59e0b' : '#e4ebf5', fontSize: 13 }}>
                    {i <= 4 ? '★' : '☆'}
                  </span>
                ))}
              </span>
            }
          />
        </div>

        {/* ── Area Chart ────────────────────────────────────────────────────── */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)',
          boxShadow: 'var(--sh-s)', padding: 24, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)', marginBottom: 3 }}>
                CA mensuel — 6 derniers mois
              </h2>
              <p style={{ fontSize: 12, color: 'var(--t3)' }}>Chiffre d&apos;affaires en FCFA</p>
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, color: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace' }}>
              <span style={{ display: 'inline-block', width: 8, height: 8,
                borderRadius: '50%', background: '#00BCD4' }} />
              Revenu mensuel
            </span>
          </div>
          <div style={{ height: 160 }}>
            {mounted ? <SvgAreaChart data={CHART_DATA} /> : null}
          </div>
        </div>

        {/* ── Products table ────────────────────────────────────────────────── */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)',
          boxShadow: 'var(--sh-s)', overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)' }}>Mes produits</h2>
            <Link href="/add-product" style={{ display: 'inline-flex', alignItems: 'center',
              gap: 6, fontSize: 12, fontWeight: 700, color: '#D4AF37',
              background: 'rgba(212,175,55,0.1)', padding: '6px 14px', borderRadius: 8,
              border: '1px solid rgba(212,175,55,0.3)', textDecoration: 'none' }}>
              <Plus size={13} /> Ajouter
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 540 }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['Photo', 'Nom produit', 'Prix FCFA', 'Stock', 'Statut', 'Action'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left',
                      fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '.07em', color: 'var(--t3)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRODUITS.map(p => (
                  <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: p.couleur,
                        border: '1px solid rgba(0,0,0,0.08)' }} />
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13,
                      fontWeight: 600, color: 'var(--t1)' }}>{p.nom}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700,
                      color: '#D4AF37', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>
                      {new Intl.NumberFormat('fr-FR').format(p.prix)}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13,
                      color: p.stock === 0 ? '#dc2626' : 'var(--t2)',
                      fontFamily: 'JetBrains Mono, monospace' }}>
                      {p.stock === 0 ? '❌ Épuisé' : `${p.stock} unités`}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ display: 'inline-block', padding: '3px 10px',
                        borderRadius: 20, fontSize: 11, fontWeight: 700,
                        background: p.statut === 'actif' ? '#D1FAE5' : '#FEE2E2',
                        color: p.statut === 'actif' ? '#065F46' : '#991B1B' }}>
                        {p.statut === 'actif' ? 'Actif' : 'Rupture'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button style={{ display: 'inline-flex', alignItems: 'center',
                        gap: 5, padding: '6px 12px', border: '1.5px solid var(--border2)',
                        borderRadius: 8, fontSize: 12, fontWeight: 600,
                        color: 'var(--t2)', background: 'transparent', cursor: 'pointer' }}>
                        <Edit size={12} /> Modifier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Recent orders ─────────────────────────────────────────────────── */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)',
          boxShadow: 'var(--sh-s)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)' }}>
              Commandes récentes
            </h2>
            <Link href="/orders" style={{ fontSize: 12, fontWeight: 600,
              color: 'var(--em)', textDecoration: 'none' }}>Tout voir →</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['N° Commande', 'Client', 'Produit', 'Montant', 'Statut', 'Date'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left',
                      fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '.07em', color: 'var(--t3)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMMANDES.map(c => (
                  <tr key={c.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 700,
                      color: '#00BCD4', fontFamily: 'JetBrains Mono, monospace' }}>{c.numero}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13,
                      fontWeight: 600, color: 'var(--t1)' }}>{c.client}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--t2)',
                      maxWidth: 160, overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.produit}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700,
                      color: '#D4AF37', fontFamily: 'JetBrains Mono, monospace',
                      whiteSpace: 'nowrap' }}>{fmt(c.montant)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <StatutBadge statut={c.statut} />
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12,
                      color: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace' }}>{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
