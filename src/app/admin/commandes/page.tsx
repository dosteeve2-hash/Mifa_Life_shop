'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, TrendingUp, Truck, Clock,
  Search, Download, X, ChevronDown, Eye, ArrowLeft,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

// ── Types ──────────────────────────────────────────────────────────────────
type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
type PeriodFilter = 'all' | 'today' | 'week' | 'month';
type StatusFilter = OrderStatus | 'all';

interface OrderItem { name: string; qty: number; price: number }
interface MockOrder {
  id: string; client: string; email: string; phone: string;
  items: OrderItem[]; total: number; status: OrderStatus;
  address: string; createdAt: Date;
}

// ── Status config ──────────────────────────────────────────────────────────
const STATUS_CFG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending:   { label: 'En attente',  color: '#E65100', bg: '#FFF3E0' },
  confirmed: { label: 'Confirmé',    color: '#1565C0', bg: '#E3F2FD' },
  shipped:   { label: 'Expédié',     color: '#00897B', bg: '#E0F2F1' },
  delivered: { label: 'Livré',       color: '#2E7D32', bg: '#E8F5E9' },
  cancelled: { label: 'Annulé',      color: '#C62828', bg: '#FFEBEE' },
};
const ALL_STATUSES = Object.entries(STATUS_CFG) as [OrderStatus, (typeof STATUS_CFG)[OrderStatus]][];

// ── Mock data ──────────────────────────────────────────────────────────────
const TS = Date.now();
const MOCK_ORDERS: MockOrder[] = [
  { id: 'CMD-1042', client: 'Aminata Traoré',   email: 'aminata@mail.ml',  phone: '+223 76 12 34 56',
    items: [{ name: 'Bazin Royal', qty: 2, price: 18500 }, { name: 'Bogolan Premium', qty: 1, price: 11500 }],
    total: 48500,  status: 'pending',   address: 'ACI 2000, Bamako',        createdAt: new Date(TS - 20 * 60000) },
  { id: 'CMD-1041', client: 'Moussa Koné',       email: 'moussa@mail.ml',   phone: '+223 65 98 76 54',
    items: [{ name: 'Djellaba Homme', qty: 1, price: 126000 }],
    total: 126000, status: 'confirmed', address: 'Kalaban-coura, Bamako',   createdAt: new Date(TS - 85 * 60000) },
  { id: 'CMD-1040', client: 'Fatoumata Diallo',  email: 'fata@mail.ml',     phone: '+223 79 45 67 89',
    items: [{ name: 'Robe Wax Ankara', qty: 1, price: 29900 }],
    total: 29900,  status: 'shipped',   address: 'Hamdallaye, Bamako',      createdAt: new Date(TS - 200 * 60000) },
  { id: 'CMD-1039', client: 'Ibrahim Coulibaly', email: 'ibra@mail.ml',     phone: '+223 70 11 22 33',
    items: [{ name: 'Kénéfing Set', qty: 3, price: 25000 }],
    total: 75000,  status: 'delivered', address: 'Lafiabougou, Bamako',     createdAt: new Date(TS - 360 * 60000) },
  { id: 'CMD-1038', client: 'Kadiatou Bah',      email: 'kadi@mail.ml',     phone: '+223 66 54 32 10',
    items: [{ name: 'Tissu Guinée', qty: 1, price: 15200 }],
    total: 15200,  status: 'cancelled', address: 'Magnambougou, Bamako',    createdAt: new Date(TS - 480 * 60000) },
  { id: 'CMD-1037', client: 'Seydou Sanogo',     email: 'seydou@mail.ml',   phone: '+223 77 88 99 00',
    items: [{ name: 'Boubou Grand', qty: 1, price: 95000 }, { name: 'Chapeau Fula', qty: 1, price: 12000 }],
    total: 107000, status: 'delivered', address: 'Badalabougou, Bamako',    createdAt: new Date(TS - 8 * 3600000) },
  { id: 'CMD-1036', client: 'Mariam Sissoko',    email: 'mariam@mail.ml',   phone: '+223 65 11 22 44',
    items: [{ name: 'Robe Smock', qty: 2, price: 22500 }],
    total: 45000,  status: 'pending',   address: 'Quinzambougou, Bamako',   createdAt: new Date(TS - 12 * 3600000) },
  { id: 'CMD-1035', client: 'Oumar Diarra',      email: 'oumar@mail.ml',    phone: '+223 79 33 55 77',
    items: [{ name: 'Bazin Gold', qty: 1, price: 58000 }],
    total: 58000,  status: 'shipped',   address: 'Niaréla, Bamako',         createdAt: new Date(TS - 18 * 3600000) },
  { id: 'CMD-1034', client: 'Aissata Kouyaté',   email: 'aissata@mail.ml',  phone: '+223 70 99 88 77',
    items: [{ name: 'Ensemble Pagne', qty: 1, price: 33000 }, { name: 'Ceinture Cuir', qty: 1, price: 8500 }],
    total: 41500,  status: 'confirmed', address: 'Sogoniko, Bamako',         createdAt: new Date(TS - 24 * 3600000) },
  { id: 'CMD-1033', client: 'Bakary Touré',      email: 'bakary@mail.ml',   phone: '+223 66 77 88 99',
    items: [{ name: 'Tenue Bogolan', qty: 2, price: 67500 }],
    total: 135000, status: 'delivered', address: 'Commune I, Bamako',        createdAt: new Date(TS - 48 * 3600000) },
  { id: 'CMD-1032', client: 'Nana Coulibaly',    email: 'nana@mail.ml',     phone: '+223 76 55 44 33',
    items: [{ name: 'Tissu Wax Holland', qty: 3, price: 14000 }],
    total: 42000,  status: 'pending',   address: 'Commune VI, Bamako',       createdAt: new Date(TS - 72 * 3600000) },
  { id: 'CMD-1031', client: 'Youssouf Traoré',   email: 'youssouf@mail.ml', phone: '+223 65 22 33 44',
    items: [{ name: 'Keffiyeh Mali', qty: 1, price: 7500 }, { name: 'Babouche Gold', qty: 1, price: 18000 }],
    total: 25500,  status: 'shipped',   address: 'Commune IV, Bamako',       createdAt: new Date(TS - 96 * 3600000) },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function fmtFCFA(n: number) { return n.toLocaleString('fr-FR') + ' FCFA'; }

function timeAgo(d: Date) {
  const m = Math.floor((Date.now() - d.getTime()) / 60000);
  if (m < 60)  return `il y a ${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `il y a ${h}h`;
  return `il y a ${Math.floor(h / 24)}j`;
}

function inPeriod(d: Date, p: PeriodFilter) {
  if (p === 'today') return d.toDateString() === new Date().toDateString();
  if (p === 'week')  return Date.now() - d.getTime() < 7  * 86400000;
  if (p === 'month') return Date.now() - d.getTime() < 30 * 86400000;
  return true;
}

function exportCSV(orders: MockOrder[]) {
  const rows = [
    ['ID','Client','Email','Téléphone','Articles','Montant','Statut','Date'],
    ...orders.map(o => [
      o.id, o.client, o.email, o.phone,
      String(o.items.reduce((s, i) => s + i.qty, 0)),
      String(o.total),
      STATUS_CFG[o.status].label,
      o.createdAt.toLocaleString('fr-FR'),
    ]),
  ].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + rows], { type: 'text/csv;charset=utf-8;' });
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: `commandes-mifa-${new Date().toISOString().slice(0,10)}.csv`,
  });
  a.click();
  URL.revokeObjectURL(a.href);
}

// ── StatusBadge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: OrderStatus }) {
  const c = STATUS_CFG[status];
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5,
      padding:'3px 10px', borderRadius:20, background:c.bg, color:c.color,
      fontSize:11, fontWeight:700, whiteSpace:'nowrap' }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:c.color, flexShrink:0 }} />
      {c.label}
    </span>
  );
}

// ── StatusDropdown ─────────────────────────────────────────────────────────
function StatusDropdown({ orderId, current, isOpen, onToggle, onChange }: {
  orderId: string; current: OrderStatus;
  isOpen: boolean; onToggle: () => void;
  onChange: (id: string, s: OrderStatus) => void;
}) {
  return (
    <div style={{ position:'relative' }}>
      <button onClick={onToggle} style={{ display:'flex', alignItems:'center', gap:5,
        padding:'5px 10px', borderRadius:8, background:'var(--bg4)',
        border:'1px solid var(--border)', cursor:'pointer',
        fontSize:11, fontWeight:600, color:'var(--t2)' }}>
        <ChevronDown size={12} /> Statut
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity:0, y:-6, scale:0.95 }}
            animate={{ opacity:1, y:0,  scale:1 }}
            exit={{   opacity:0, y:-6, scale:0.95 }}
            transition={{ type:'spring' as const, stiffness:400, damping:30 }}
            style={{ position:'absolute', top:'100%', right:0, marginTop:4,
              background:'var(--white)', border:'1px solid var(--border)',
              borderRadius:10, boxShadow:'var(--sh-m)', zIndex:100,
              minWidth:160, overflow:'hidden' }}>
            {ALL_STATUSES.map(([key, cfg]) => (
              <button key={key}
                onClick={() => { onChange(orderId, key); onToggle(); }}
                style={{ display:'flex', alignItems:'center', gap:8,
                  width:'100%', padding:'8px 14px',
                  background: key === current ? 'var(--bg4)' : 'transparent',
                  border:'none', cursor:'pointer', textAlign:'left',
                  fontSize:12, fontWeight: key === current ? 700 : 500, color:cfg.color }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:cfg.color }} />
                {cfg.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── OrderModal ─────────────────────────────────────────────────────────────
function OrderModal({ order, onClose, onStatusChange }: {
  order: MockOrder; onClose: () => void;
  onStatusChange: (id: string, s: OrderStatus) => void;
}) {
  const cfg = STATUS_CFG[order.status];
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:0.18 }} onClick={onClose}
      style={{ position:'fixed', inset:0, background:'rgba(14,28,51,0.55)',
        zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <motion.div
        initial={{ opacity:0, scale:0.95, y:20 }}
        animate={{ opacity:1, scale:1,    y:0  }}
        exit={{   opacity:0, scale:0.95, y:20 }}
        transition={{ type:'spring' as const, stiffness:350, damping:28 }}
        onClick={e => e.stopPropagation()}
        style={{ background:'var(--white)', borderRadius:16, width:'100%', maxWidth:520,
          boxShadow:'var(--sh-l)', overflow:'hidden' }}>

        {/* Header */}
        <div style={{ padding:'18px 24px', borderBottom:'1px solid var(--border)',
          display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--bg)' }}>
          <div>
            <div style={{ fontSize:11, color:'var(--t3)', marginBottom:2 }}>Commande</div>
            <div style={{ fontFamily:'"Playfair Display",serif', fontSize:20, fontWeight:700, color:'var(--t1)' }}>
              {order.id}
            </div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:'50%',
            background:'var(--bg4)', border:'none', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <X size={16} color="var(--t2)" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding:'20px 24px', maxHeight:'68vh', overflowY:'auto' }}>
          {/* Client */}
          <div style={{ background:'var(--bg)', borderRadius:10, padding:'14px 16px', marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase',
              letterSpacing:'0.08em', color:'var(--t3)', marginBottom:8 }}>Client</div>
            <div style={{ fontWeight:700, fontSize:15, color:'var(--t1)', marginBottom:3 }}>{order.client}</div>
            <div style={{ fontSize:12, color:'var(--t2)', marginBottom:2 }}>{order.email}</div>
            <div style={{ fontSize:12, color:'var(--t2)', marginBottom:2 }}>{order.phone}</div>
            <div style={{ fontSize:12, color:'var(--t3)' }}>📍 {order.address}</div>
          </div>

          {/* Items */}
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase',
              letterSpacing:'0.08em', color:'var(--t3)', marginBottom:8 }}>Produits</div>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display:'flex', justifyContent:'space-between',
                padding:'10px 0', borderBottom: idx < order.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--t1)' }}>{item.name}</div>
                  <div style={{ fontSize:11, color:'var(--t3)' }}>Qté : {item.qty}</div>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--em)' }}>
                  {fmtFCFA(item.price * item.qty)}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
            padding:'12px 16px', background:'var(--em-l)', borderRadius:10, marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:14, color:'var(--t1)' }}>Total</div>
            <div style={{ fontWeight:800, fontSize:18, color:'var(--em)',
              fontFamily:'"JetBrains Mono",monospace' }}>{fmtFCFA(order.total)}</div>
          </div>

          {/* Change status */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase',
              letterSpacing:'0.08em', color:'var(--t3)', marginBottom:8 }}>Changer le statut</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {ALL_STATUSES.map(([key, c]) => (
                <button key={key} onClick={() => onStatusChange(order.id, key)} style={{
                  padding:'6px 14px', borderRadius:20,
                  background: order.status === key ? cfg.bg : 'var(--bg4)',
                  border: `1.5px solid ${order.status === key ? cfg.color : 'transparent'}`,
                  color: order.status === key ? cfg.color : 'var(--t3)',
                  fontSize:11, fontWeight:700, cursor:'pointer' }}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:'14px 24px', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'9px 24px', borderRadius:10,
            background:'var(--em)', color:'#fff', border:'none',
            cursor:'pointer', fontWeight:700, fontSize:13 }}>Fermer</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function AdminCommandesPage() {
  const [orders, setOrders]             = useState<MockOrder[]>(MOCK_ORDERS);
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [period, setPeriod]             = useState<PeriodFilter>('all');
  const [selectedOrder, setSelectedOrder] = useState<MockOrder | null>(null);
  const [openDropdown, setOpenDropdown]   = useState<string | null>(null);

  const kpis = useMemo(() => {
    const todayList = orders.filter(o => o.createdAt.toDateString() === new Date().toDateString());
    const delivered = orders.filter(o => o.status === 'delivered').length;
    return {
      count:         todayList.length,
      ca:            todayList.reduce((s, o) => s + o.total, 0),
      tauxLivraison: orders.length ? Math.round((delivered / orders.length) * 100) : 0,
      pending:       orders.filter(o => o.status === 'pending').length,
    };
  }, [orders]);

  const filtered = useMemo(() => orders.filter(o => {
    const q = search.toLowerCase();
    return (q === '' || o.id.toLowerCase().includes(q) || o.client.toLowerCase().includes(q))
        && (statusFilter === 'all' || o.status === statusFilter)
        && inPeriod(o.createdAt, period);
  }), [orders, search, statusFilter, period]);

  const handleStatusChange = useCallback((id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setSelectedOrder(prev => prev?.id === id ? { ...prev, status } : prev);
  }, []);

  const KPI_CARDS = [
    { label:'Commandes du jour', value: String(kpis.count),          sub:"Aujourd'hui", color:'#2f6fed', Icon:ShoppingBag },
    { label:'CA journalier',     value: fmtFCFA(kpis.ca),            sub:"Aujourd'hui", color:'#16a34a', Icon:TrendingUp  },
    { label:'Taux livraison',    value: `${kpis.tauxLivraison}%`,    sub:'Global',      color:'#00897B', Icon:Truck       },
    { label:'En attente',        value: String(kpis.pending),         sub:'Commandes',   color:'#E65100', Icon:Clock       },
  ];

  const PERIODS: { key: PeriodFilter; label: string }[] = [
    { key:'all',   label:'Tout'    },
    { key:'today', label:"Auj."    },
    { key:'week',  label:'Semaine' },
    { key:'month', label:'Mois'    },
  ];

  return (
    <div style={{ background:'var(--bg)', minHeight:'100vh' }}>
      {/* Overlay: ferme le dropdown ouvert */}
      {openDropdown && (
        <div style={{ position:'fixed', inset:0, zIndex:99 }} onClick={() => setOpenDropdown(null)} />
      )}

      {/* ── Header ── */}
      <div style={{ background:'linear-gradient(135deg,#0e1c33 0%,#1a3a6e 100%)', padding:'clamp(24px,4vw,40px) 0' }}>
        <div className="wrap">
          <nav style={{ display:'flex', gap:6, fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:14 }}>
            <Link href="/" style={{ color:'inherit' }}>Accueil</Link><span>›</span>
            <Link href="/admin" style={{ color:'inherit' }}>Admin</Link><span>›</span>
            <span style={{ color:'rgba(255,255,255,0.75)' }}>Commandes</span>
          </nav>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                <ShoppingBag size={22} color="#2f6fed" />
                <h1 style={{ fontFamily:'"Playfair Display",serif', fontSize:'clamp(22px,4vw,30px)',
                  fontWeight:700, color:'#fff', margin:0 }}>Gestion des Commandes</h1>
              </div>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', margin:0 }}>{orders.length} commandes au total</p>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <Link href="/admin" style={{ display:'flex', alignItems:'center', gap:6,
                padding:'9px 18px', background:'rgba(255,255,255,0.1)',
                border:'1px solid rgba(255,255,255,0.2)', borderRadius:9,
                fontSize:12, fontWeight:600, color:'#fff', textDecoration:'none' }}>
                <ArrowLeft size={14} /> Admin
              </Link>
              <button onClick={() => exportCSV(filtered)} style={{ display:'flex', alignItems:'center', gap:6,
                padding:'9px 18px', background:'#2f6fed', border:'none', borderRadius:9,
                fontSize:12, fontWeight:700, color:'#fff', cursor:'pointer' }}>
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop:32, paddingBottom:60 }}>

        {/* ── KPI Cards ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:16, marginBottom:28 }}>
          {KPI_CARDS.map(({ label, value, sub, color, Icon }, i) => (
            <motion.div key={label}
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
              transition={{ type:'spring' as const, stiffness:300, damping:26, delay: i * 0.06 }}
              style={{ background:'var(--white)', borderRadius:14, padding:'18px 20px',
                border:'1px solid var(--border)', borderTop:`3px solid ${color}`, boxShadow:'var(--sh-s)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase',
                  letterSpacing:'0.07em', color:'var(--t3)' }}>{label}</div>
                <div style={{ width:32, height:32, borderRadius:9, background:`${color}18`,
                  display:'flex', alignItems:'center', justifyContent:'center', color }}>
                  <Icon size={15} />
                </div>
              </div>
              <div style={{ fontSize:20, fontWeight:800, color:'var(--t1)', marginBottom:2,
                fontFamily:'"JetBrains Mono",monospace', wordBreak:'break-all' }}>{value}</div>
              <div style={{ fontSize:11, color:'var(--t4)' }}>{sub}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div style={{ background:'var(--white)', borderRadius:14, border:'1px solid var(--border)',
          padding:'14px 18px', marginBottom:20,
          display:'flex', flexWrap:'wrap', gap:12, alignItems:'center' }}>

          {/* Search */}
          <div style={{ position:'relative', flex:'1 1 220px' }}>
            <Search size={14} color="var(--t3)"
              style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par ID ou client…"
              style={{ width:'100%', padding:'9px 12px 9px 34px', background:'var(--bg)',
                border:'1px solid var(--border)', borderRadius:9,
                fontSize:13, color:'var(--t1)', outline:'none', boxSizing:'border-box' }} />
          </div>

          {/* Status */}
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as StatusFilter)}
            style={{ padding:'9px 14px', background:'var(--bg)', border:'1px solid var(--border)',
              borderRadius:9, fontSize:13, color:'var(--t1)', cursor:'pointer', outline:'none' }}>
            <option value="all">Tous les statuts</option>
            {ALL_STATUSES.map(([key, cfg]) => <option key={key} value={key}>{cfg.label}</option>)}
          </select>

          {/* Period */}
          <div style={{ display:'flex', gap:6 }}>
            {PERIODS.map(({ key, label }) => (
              <button key={key} onClick={() => setPeriod(key)} style={{
                padding:'7px 13px', borderRadius:8,
                background: period === key ? 'var(--em)' : 'var(--bg4)',
                border:'none', cursor:'pointer', fontSize:11, fontWeight:700,
                color: period === key ? '#fff' : 'var(--t2)' }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ marginLeft:'auto', fontSize:12, color:'var(--t3)', whiteSpace:'nowrap' }}>
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* ── Table ── */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ type:'spring' as const, stiffness:260, damping:24, delay:0.15 }}
          style={{ background:'var(--white)', borderRadius:16, border:'1px solid var(--border)', overflow:'hidden' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'var(--bg)' }}>
                  {['Commande','Client','Produits','Montant','Statut','Date','Actions'].map(h => (
                    <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:10,
                      fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em',
                      color:'var(--t3)', whiteSpace:'nowrap', borderBottom:'1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding:'48px 16px', textAlign:'center',
                    color:'var(--t3)', fontSize:14 }}>Aucune commande trouvée</td></tr>
                ) : filtered.map((order, i) => (
                  <motion.tr key={order.id}
                    initial={{ opacity:0 }} animate={{ opacity:1 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ borderBottom:'1px solid var(--bg4)' }}>
                    <td style={{ padding:'13px 16px', fontSize:13, fontWeight:700,
                      color:'var(--em)', whiteSpace:'nowrap' }}>{order.id}</td>
                    <td style={{ padding:'13px 16px', fontSize:13, color:'var(--t1)',
                      fontWeight:500, whiteSpace:'nowrap' }}>{order.client}</td>
                    <td style={{ padding:'13px 16px', fontSize:12, color:'var(--t2)' }}>
                      <div style={{ whiteSpace:'nowrap' }}>
                        {order.items.reduce((s, it) => s + it.qty, 0)} art.
                      </div>
                      <div style={{ fontSize:11, color:'var(--t3)' }}>
                        {order.items.length} réf.
                      </div>
                    </td>
                    <td style={{ padding:'13px 16px', fontSize:13, fontWeight:700,
                      color:'var(--t1)', fontFamily:'"JetBrains Mono",monospace',
                      whiteSpace:'nowrap' }}>{fmtFCFA(order.total)}</td>
                    <td style={{ padding:'13px 16px' }}><StatusBadge status={order.status} /></td>
                    <td style={{ padding:'13px 16px' }}>
                      <div style={{ fontSize:11, color:'var(--t3)', whiteSpace:'nowrap' }}>{timeAgo(order.createdAt)}</div>
                      <div style={{ fontSize:10, color:'var(--t4)' }}>
                        {order.createdAt.toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td style={{ padding:'13px 16px' }}>
                      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                        <button onClick={() => setSelectedOrder(order)} style={{
                          display:'flex', alignItems:'center', gap:5,
                          padding:'5px 10px', borderRadius:8,
                          background:'var(--em-l)', border:'1px solid var(--em-g)',
                          cursor:'pointer', fontSize:11, fontWeight:600, color:'var(--em)' }}>
                          <Eye size={12} /> Détail
                        </button>
                        <StatusDropdown
                          orderId={order.id} current={order.status}
                          isOpen={openDropdown === order.id}
                          onToggle={() => setOpenDropdown(p => p === order.id ? null : order.id)}
                          onChange={handleStatusChange} />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* ── Detail modal ── */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={handleStatusChange} />
        )}
      </AnimatePresence>
    </div>
  );
}
