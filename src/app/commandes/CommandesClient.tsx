'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronDown, ShoppingBag, CheckCircle2, TrendingUp, XCircle } from 'lucide-react';
import type { Commande } from './page';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatFCFA(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// ─── Badge statut ────────────────────────────────────────────────────────────

const STATUT_CONFIG: Record<
  Commande['statut'],
  { label: string; bg: string; text: string; icon: React.ReactNode }
> = {
  en_cours: {
    label: 'En cours',
    bg: 'rgba(6,182,212,0.12)',
    text: '#06B6D4',
    icon: <TrendingUp size={12} />,
  },
  confirmee: {
    label: 'Confirmée',
    bg: 'rgba(245,158,11,0.12)',
    text: '#F59E0B',
    icon: <CheckCircle2 size={12} />,
  },
  livree: {
    label: 'Livrée',
    bg: 'rgba(34,197,94,0.12)',
    text: '#22C55E',
    icon: <CheckCircle2 size={12} />,
  },
  annulee: {
    label: 'Annulée',
    bg: 'rgba(239,68,68,0.12)',
    text: '#EF4444',
    icon: <XCircle size={12} />,
  },
};

// ─── Stats card ──────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  delay: number;
}

function StatCard({ label, value, icon, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(245,158,11,0.15)',
        borderRadius: 16,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flex: 1,
        minWidth: 160,
      }}
    >
      <div style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500 }}>
        {icon}
        {label}
      </div>
      <div style={{ color: '#F1F5F9', fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>{value}</div>
    </motion.div>
  );
}

// ─── Commande Card ───────────────────────────────────────────────────────────

interface CommandeCardProps {
  commande: Commande;
  index: number;
}

function CommandeCard({ commande, index }: CommandeCardProps) {
  const [open, setOpen] = useState(false);
  const cfg = STATUT_CONFIG[commande.statut];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
      whileHover={{ borderColor: 'rgba(245,158,11,0.3)' }}
    >
      {/* En-tête cliquable */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        {/* Numéro + date */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
          <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: 15, letterSpacing: '0.3px' }}>
            {commande.numero}
          </span>
          <span style={{ color: '#94A3B8', fontSize: 12 }}>{formatDate(commande.created_at)}</span>
        </div>

        {/* Badge statut */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: cfg.bg,
            color: cfg.text,
            border: `1px solid ${cfg.text}33`,
            borderRadius: 20,
            padding: '4px 12px',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {cfg.icon}
          {cfg.label}
        </div>

        {/* Total + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
          <span style={{ color: '#F1F5F9', fontWeight: 700, fontSize: 16 }}>
            {formatFCFA(commande.total_fcfa)}
          </span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            style={{ color: '#64748B' }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </button>

      {/* Accordion items */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="accordion"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 24px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ color: '#64748B', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12, paddingTop: 16 }}>
                Articles ({commande.items.length})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {commande.items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: 10,
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'rgba(245,158,11,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Package size={14} color="#F59E0B" />
                      </div>
                      <span style={{ color: '#CBD5E1', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.produit_nom}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                      <span style={{ color: '#64748B', fontSize: 12 }}>×{item.quantite}</span>
                      <span style={{ color: '#F59E0B', fontSize: 13, fontWeight: 600 }}>
                        {formatFCFA(item.prix_unitaire)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 20, padding: '80px 24px', textAlign: 'center',
      }}
    >
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'rgba(245,158,11,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ShoppingBag size={32} color="#F59E0B" />
      </div>
      <div>
        <p style={{ color: '#F1F5F9', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Aucune commande pour l&apos;instant
        </p>
        <p style={{ color: '#64748B', fontSize: 14 }}>
          Découvrez nos collections et passez votre première commande.
        </p>
      </div>
      <Link
        href="/collections"
        style={{
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          color: '#0F172A', fontWeight: 700, fontSize: 14,
          padding: '12px 28px', borderRadius: 10, textDecoration: 'none',
        }}
      >
        Explorer la boutique
      </Link>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface CommandesClientProps {
  commandes: Commande[];
  userEmail: string;
}

export default function CommandesClient({ commandes, userEmail }: CommandesClientProps) {
  const totalDepense = commandes
    .filter((c) => c.statut !== 'annulee')
    .reduce((sum, c) => sum + c.total_fcfa, 0);

  const livrees = commandes.filter((c) => c.statut === 'livree').length;

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0F172A 0%, #0d1829 60%, #0a1525 100%)',
        padding: '40px 16px 80px',
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(245,158,11,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Package size={20} color="#F59E0B" />
            </div>
            <h1 style={{ color: '#F1F5F9', fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>
              Mes commandes
            </h1>
          </div>
          <p style={{ color: '#64748B', fontSize: 14, margin: 0 }}>
            {userEmail} · {commandes.length} commande{commandes.length > 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
          <StatCard
            label="Total commandes"
            value={String(commandes.length)}
            icon={<ShoppingBag size={14} />}
            delay={0.05}
          />
          <StatCard
            label="Livraisons réussies"
            value={String(livrees)}
            icon={<CheckCircle2 size={14} />}
            delay={0.12}
          />
          <StatCard
            label="Montant total"
            value={formatFCFA(totalDepense)}
            icon={<TrendingUp size={14} />}
            delay={0.19}
          />
        </div>

        {/* Liste commandes ou empty state */}
        {commandes.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {commandes.map((commande, i) => (
              <CommandeCard key={commande.id} commande={commande} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
