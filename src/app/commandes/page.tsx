'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  ClipboardList, Clock, Truck, CheckCircle2, XCircle, PackageCheck,
  Search, X, MapPin, Phone, MessageCircle, AlertTriangle,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
type OrderStatus = 'attente' | 'confirmee' | 'preparation' | 'livraison' | 'livree' | 'annulee';

interface Produit { nom: string; qty: number; prixUnitaire: number }
interface Order {
  numero: string;
  vendeur: string;
  vendeurTelephone: string;
  produits: Produit[];
  dateCommande: string;
  dateLivraisonPrevue: string;
  montantTotal: number;
  statut: OrderStatus;
  adresseLivraison: string;
}

// ── Config statuts ───────────────────────────────────────────────────────────
const STATUS_ORDER: OrderStatus[] = ['attente', 'confirmee', 'preparation', 'livraison', 'livree'];

const STATUS_CFG: Record<OrderStatus, { label: string; color: string; bg: string; border: string; Icon: typeof Clock }> = {
  attente:     { label: 'En attente',     color: '#F5A623', bg: 'rgba(245,166,35,.14)', border: 'rgba(245,166,35,.35)', Icon: Clock },
  confirmee:   { label: 'Confirmée',      color: 'var(--cyan)', bg: 'rgba(0,188,212,.14)', border: 'rgba(0,188,212,.35)', Icon: CheckCircle2 },
  preparation: { label: 'En préparation', color: '#FF8A34', bg: 'rgba(255,138,52,.14)', border: 'rgba(255,138,52,.35)', Icon: PackageCheck },
  livraison:   { label: 'En livraison',   color: 'var(--gold2)', bg: 'var(--bg)', border: 'rgba(212,175,55,.4)', Icon: Truck },
  livree:      { label: 'Livrée',         color: 'var(--green)', bg: 'rgba(34,197,94,.14)', border: 'rgba(34,197,94,.35)', Icon: CheckCircle2 },
  annulee:     { label: 'Annulée',        color: 'var(--red)', bg: 'rgba(239,68,68,.14)', border: 'rgba(239,68,68,.35)', Icon: XCircle },
};

const FILTER_TABS: { key: OrderStatus | 'toutes'; label: string }[] = [
  { key: 'toutes', label: 'Toutes' },
  { key: 'attente', label: 'En attente' },
  { key: 'confirmee', label: 'Confirmée' },
  { key: 'preparation', label: 'En préparation' },
  { key: 'livraison', label: 'En livraison' },
  { key: 'livree', label: 'Livrée' },
  { key: 'annulee', label: 'Annulée' },
];

// ── Données mock ─────────────────────────────────────────────────────────────
const MOCK_ORDERS: Order[] = [
  { numero: 'CMD-2026-001', vendeur: 'Awa Konaté', vendeurTelephone: '+226 70 12 34 56',
    produits: [{ nom: 'Tissu Bazin', qty: 2, prixUnitaire: 22500 }, { nom: 'Savon Karité', qty: 1, prixUnitaire: 8500 }],
    dateCommande: '2026-07-10', dateLivraisonPrevue: '2026-07-15', montantTotal: 53500,
    statut: 'livree', adresseLivraison: 'Secteur 15, Zone du Bois, Ouagadougou' },
  { numero: 'CMD-2026-002', vendeur: 'Fatoumata Traoré', vendeurTelephone: '+226 76 23 45 67',
    produits: [{ nom: 'Pagne Bogolanfini', qty: 3, prixUnitaire: 22500 }],
    dateCommande: '2026-07-26', dateLivraisonPrevue: '2026-08-02', montantTotal: 67500,
    statut: 'livraison', adresseLivraison: 'Ouaga 2000, Secteur 51, Ouagadougou' },
  { numero: 'CMD-2026-003', vendeur: 'Mariam Ouédraogo', vendeurTelephone: '+226 78 34 56 78',
    produits: [{ nom: 'Bijoux Bronze', qty: 1, prixUnitaire: 125000 }],
    dateCommande: '2026-07-30', dateLivraisonPrevue: '2026-08-05', montantTotal: 125000,
    statut: 'confirmee', adresseLivraison: 'Gounghin, Ouagadougou' },
  { numero: 'CMD-2026-004', vendeur: 'Aminata Sawadogo', vendeurTelephone: '+226 71 45 67 89',
    produits: [{ nom: 'Tissu Wax', qty: 4, prixUnitaire: 23000 }],
    dateCommande: '2026-07-28', dateLivraisonPrevue: '2026-08-04', montantTotal: 92000,
    statut: 'preparation', adresseLivraison: 'Tanghin, Ouagadougou' },
  { numero: 'CMD-2026-005', vendeur: 'Rokia Diallo', vendeurTelephone: '+226 75 56 78 90',
    produits: [{ nom: 'Paniers Osier', qty: 2, prixUnitaire: 17000 }],
    dateCommande: '2026-07-31', dateLivraisonPrevue: '2026-08-07', montantTotal: 34000,
    statut: 'attente', adresseLivraison: 'Dapoya, Ouagadougou' },
  { numero: 'CMD-2026-006', vendeur: 'Salimata Kabré', vendeurTelephone: '+226 79 67 89 01',
    produits: [{ nom: 'Boubou Brodé', qty: 1, prixUnitaire: 185000 }],
    dateCommande: '2026-07-05', dateLivraisonPrevue: '2026-07-12', montantTotal: 185000,
    statut: 'livree', adresseLivraison: 'Cissin, Ouagadougou' },
  { numero: 'CMD-2026-007', vendeur: 'Bintou Compaoré', vendeurTelephone: '+226 72 78 90 12',
    produits: [{ nom: 'Savon Karité Naturel', qty: 6, prixUnitaire: 4500 }],
    dateCommande: '2026-07-27', dateLivraisonPrevue: '2026-08-01', montantTotal: 27000,
    statut: 'livraison', adresseLivraison: 'Pissy, Ouagadougou' },
  { numero: 'CMD-2026-008', vendeur: 'Fatima Zongo', vendeurTelephone: '+226 77 89 01 23',
    produits: [{ nom: 'Mortier & Pilon', qty: 2, prixUnitaire: 24000 }],
    dateCommande: '2026-08-01', dateLivraisonPrevue: '2026-08-08', montantTotal: 48000,
    statut: 'attente', adresseLivraison: 'Somgandé, Ouagadougou' },
  { numero: 'CMD-2026-009', vendeur: 'Adja Ouattara', vendeurTelephone: '+226 74 90 12 34',
    produits: [{ nom: 'Tapis Raphia', qty: 1, prixUnitaire: 76000 }],
    dateCommande: '2026-07-20', dateLivraisonPrevue: '2026-07-27', montantTotal: 76000,
    statut: 'annulee', adresseLivraison: 'Karpala, Ouagadougou' },
  { numero: 'CMD-2026-010', vendeur: 'Habibata Barry', vendeurTelephone: '+226 73 01 23 45',
    produits: [{ nom: 'Pots Argile', qty: 3, prixUnitaire: 14000 }],
    dateCommande: '2026-07-29', dateLivraisonPrevue: '2026-08-05', montantTotal: 42000,
    statut: 'preparation', adresseLivraison: 'Kossodo, Ouagadougou' },
];

const KPI_CARDS = [
  { label: 'Total Commandes', value: '47', Icon: ClipboardList },
  { label: 'En Attente', value: '8', Icon: Clock },
  { label: 'En Livraison', value: '12', Icon: Truck },
  { label: 'Livrées ce mois', value: '27', Icon: CheckCircle2 },
];

// ── Helpers ───────────────────────────────────────────────────────────────
function fmtFCFA(n: number) {
  return n.toLocaleString('fr-FR') + ' FCFA';
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function buildTimeline(order: Order) {
  const steps: { label: string; date: string; color: string }[] = [
    { label: 'Commande passée', date: order.dateCommande, color: STATUS_CFG.attente.color },
  ];
  if (order.statut === 'annulee') {
    steps.push({ label: 'Commande annulée', date: addDays(order.dateCommande, 2), color: STATUS_CFG.annulee.color });
    return steps;
  }
  const idx = STATUS_ORDER.indexOf(order.statut);
  if (idx >= 1) steps.push({ label: 'Commande confirmée', date: addDays(order.dateCommande, 1), color: STATUS_CFG.confirmee.color });
  if (idx >= 2) steps.push({ label: 'En préparation', date: addDays(order.dateCommande, 2), color: STATUS_CFG.preparation.color });
  if (idx >= 3) steps.push({ label: 'Expédiée — en livraison', date: addDays(order.dateCommande, 3), color: 'var(--gold2)' });
  if (idx >= 4) steps.push({ label: 'Livrée', date: addDays(order.dateCommande, 4), color: STATUS_CFG.livree.color });
  return steps;
}

// ── StatusBadge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 12px', borderRadius: 20,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
    }}>
      <cfg.Icon size={12} />
      {cfg.label}
    </span>
  );
}

// ── OrderModal ────────────────────────────────────────────────────────────────
function OrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const timeline = useMemo(() => buildTimeline(order), [order]);

  const handleContact = () => {
    toast.success(`Message envoyé à ${order.vendeur}`, { duration: 4000, icon: '📩' });
  };

  const handleReport = () => {
    toast.warning('Signalement transmis à notre équipe support', { duration: 4000, icon: '⚠️' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }} onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 16, width: '100%', maxWidth: 560, boxShadow: 'var(--sh-l)', overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg3)' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 2 }}>Commande</div>
            <div style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{order.numero}</div>
          </div>
          <button onClick={onClose} aria-label="Fermer" style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg4)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color="var(--text2)" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', maxHeight: '68vh', overflowY: 'auto' }}>
          {/* Vendeur */}
          <div style={{ background: 'var(--bg3)', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: 8 }}>Vendeur</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>{order.vendeur}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>
              <Phone size={12} /> {order.vendeurTelephone}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text3)' }}>
              <MapPin size={12} /> {order.adresseLivraison}
            </div>
          </div>

          {/* Produits */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: 8 }}>Produits</div>
            {order.produits.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < order.produits.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{p.nom}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>Qté : {p.qty} × {fmtFCFA(p.prixUnitaire)}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', fontFamily: '"JetBrains Mono", monospace' }}>
                  {fmtFCFA(p.qty * p.prixUnitaire)}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(212,175,55,.08)', borderRadius: 10, marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>Total</div>
            <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--gold)', fontFamily: '"JetBrains Mono", monospace' }}>{fmtFCFA(order.montantTotal)}</div>
          </div>

          {/* Timeline */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: 12 }}>Suivi de commande</div>
            <div style={{ position: 'relative', paddingLeft: 22 }}>
              <div style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 2, background: 'var(--border2)' }} />
              {timeline.map((step, i) => (
                <div key={i} style={{ position: 'relative', paddingBottom: i < timeline.length - 1 ? 18 : 0 }}>
                  <span style={{ position: 'absolute', left: -22, top: 2, width: 12, height: 12, borderRadius: '50%', background: step.color, border: '2px solid var(--bg2)' }} />
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{step.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{fmtDate(step.date)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={handleContact} style={{ flex: '1 1 160px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 16px', borderRadius: 10, background: 'var(--gold)', color: 'var(--bg)', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            <MessageCircle size={14} /> Contacter vendeur
          </button>
          <button onClick={handleReport} style={{ flex: '1 1 160px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 16px', borderRadius: 10, background: 'rgba(239,68,68,.1)', color: 'var(--red)', border: '1px solid rgba(239,68,68,.3)', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            <AlertTriangle size={14} /> Signaler un problème
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── OrderCard ─────────────────────────────────────────────────────────────────
function OrderCard({ order, onVoirDetails, index }: { order: Order; onVoirDetails: () => void; index: number }) {
  const nbArticles = order.produits.reduce((s, p) => s + p.qty, 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26, delay: index * 0.04 }}
      style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{order.numero}</div>
          <div style={{ fontSize: 13, color: 'var(--text2)' }}>Vendeur : <strong style={{ color: 'var(--text)' }}>{order.vendeur}</strong></div>
        </div>
        <StatusBadge status={order.statut} />
      </div>

      <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>
        {order.produits.map((p) => `${p.qty}x ${p.nom}`).join(' + ')}
        <span style={{ color: 'var(--text3)' }}> ({nbArticles} article{nbArticles > 1 ? 's' : ''})</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text3)', marginBottom: 2 }}>Commandée</div>
            <div style={{ fontSize: 12, color: 'var(--text2)' }}>{fmtDate(order.dateCommande)}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text3)', marginBottom: 2 }}>Livraison prévue</div>
            <div style={{ fontSize: 12, color: 'var(--text2)' }}>{fmtDate(order.dateLivraisonPrevue)}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 16, fontWeight: 800, color: 'var(--gold)' }}>{fmtFCFA(order.montantTotal)}</div>
          <button onClick={onVoirDetails} style={{ padding: '8px 16px', borderRadius: 9, background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Voir détails
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function CommandesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<OrderStatus | 'toutes'>('toutes');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_ORDERS.filter((o) =>
      (filter === 'toutes' || o.statut === filter) &&
      (q === '' || o.numero.toLowerCase().includes(q) || o.vendeur.toLowerCase().includes(q))
    );
  }, [search, filter]);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="wrap" style={{ paddingTop: 36, paddingBottom: 60 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(24px,4vw,32px)', fontWeight: 700, fontStyle: 'italic', color: 'var(--text)', marginBottom: 6 }}>
            Mes <span style={{ color: 'var(--gold)' }}>Commandes</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text3)' }}>Suivez vos commandes en temps réel</p>
        </div>

        {/* KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
          {KPI_CARDS.map(({ label, value, Icon }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26, delay: i * 0.06 }}
              style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)' }}>{label}</div>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(212,175,55,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                  <Icon size={15} />
                </div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--gold)', fontFamily: '"JetBrains Mono", monospace' }}>{value}</div>
            </motion.div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {FILTER_TABS.map((tab) => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              style={{
                padding: '7px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                background: filter === tab.key ? 'var(--gold)' : 'var(--bg3)',
                color: filter === tab.key ? 'var(--bg)' : 'var(--text2)',
                border: filter === tab.key ? '1px solid var(--gold)' : '1px solid var(--border2)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 24, maxWidth: 420 }}>
          <Search size={14} color="var(--text3)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par N° ou vendeur…"
            style={{ width: '100%', padding: '10px 14px 10px 36px', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 10, fontSize: 13, color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)', fontSize: 14 }}>
            Aucune commande ne correspond à votre recherche.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map((order, i) => (
              <OrderCard key={order.numero} order={order} index={i} onVoirDetails={() => setSelectedOrder(order)} />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
      </AnimatePresence>
    </div>
  );
}
