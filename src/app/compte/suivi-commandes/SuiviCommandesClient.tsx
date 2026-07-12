'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { Commande, EtapeLivraison } from './page';

/* ── Charte Mifa Life ── */
const NAVY   = '#0A1628';
const GOLD   = '#D4AF37';
const CYAN   = '#00BCD4';
const GRAY   = '#6B7280';
const WHITE  = '#FFFFFF';

/* ── Types ── */
type Filtre = 'tous' | 'en-cours' | 'livrees';

type Props = {
  commandes: Commande[];
  user: { id: string; email: string };
};

/* ── Icône par étape ── */
function iconeEtape(label: string, completee: boolean, active: boolean) {
  const color = completee ? GOLD : active ? CYAN : GRAY;
  const size = 20;
  if (label === 'Commandé')   return <ShoppingBag size={size} color={color} />;
  if (label === 'Préparé')    return <Package     size={size} color={color} />;
  if (label === 'Expédié')    return <Truck       size={size} color={color} />;
  if (label === 'En transit') return <MapPin      size={size} color={color} />;
  if (label === 'Livré')      return <CheckCircle2 size={size} color={color} />;
  return <Clock size={size} color={color} />;
}

/* ── Badge statut ── */
function BadgeStatut({ statut }: { statut: string }) {
  const isLivre  = statut === 'Livré';
  const bg       = isLivre ? `${CYAN}22` : `${GOLD}22`;
  const border   = isLivre ? CYAN : GOLD;
  const text     = isLivre ? CYAN : GOLD;
  return (
    <span
      style={{ background: bg, border: `1px solid ${border}`, color: text }}
      className="text-xs font-semibold px-3 py-1 rounded-full"
    >
      {statut}
    </span>
  );
}

/* ── Stepper horizontal ── */
function StepperHorizontal({ etapes }: { etapes: EtapeLivraison[] }) {
  const total = etapes.length;
  const completees = etapes.filter((e) => e.completee).length;
  const activeIdx  = completees < total ? completees : total - 1;

  return (
    <div className="flex items-center w-full mt-4 mb-2">
      {etapes.map((etape, idx) => {
        const isActive = idx === activeIdx && !etape.completee;
        return (
          <div key={etape.id} className="flex items-center flex-1">
            {/* Cercle étape */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.08, type: 'spring', stiffness: 300, damping: 24 }}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: etape.completee ? `${GOLD}22` : isActive ? `${CYAN}22` : `${NAVY}44`,
                  border: `2px solid ${etape.completee ? GOLD : isActive ? CYAN : GRAY}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {iconeEtape(etape.label, etape.completee, isActive)}
              </motion.div>
              <span
                className="text-[10px] mt-1 text-center leading-tight max-w-[52px]"
                style={{ color: etape.completee ? GOLD : isActive ? CYAN : GRAY }}
              >
                {etape.label}
              </span>
            </div>
            {/* Ligne de connexion */}
            {idx < total - 1 && (
              <motion.div
                className="flex-1 h-[2px] mx-1"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: idx * 0.1 + 0.2, duration: 0.4 }}
                style={{
                  background: etape.completee && etapes[idx + 1].completee
                    ? GOLD
                    : etape.completee ? `linear-gradient(90deg, ${GOLD}, ${GRAY})` : GRAY,
                  transformOrigin: 'left',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Timeline verticale (détail commande) ── */
function TimelineDetail({ etapes }: { etapes: EtapeLivraison[] }) {
  return (
    <div className="flex flex-col gap-0 mt-4">
      {etapes.map((etape, idx) => {
        const isLast = idx === etapes.length - 1;
        const completees = etapes.filter((e) => e.completee).length;
        const isActive = idx === completees && !etape.completee;
        return (
          <div key={etape.id} className="flex gap-4 relative">
            {/* Colonne gauche : icône + trait vertical */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1, type: 'spring', stiffness: 320, damping: 22 }}
                style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: etape.completee ? `${GOLD}22` : isActive ? `${CYAN}22` : `${NAVY}66`,
                  border: `2px solid ${etape.completee ? GOLD : isActive ? CYAN : GRAY}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {iconeEtape(etape.label, etape.completee, isActive)}
              </motion.div>
              {!isLast && (
                <motion.div
                  className="w-[2px] flex-1 min-h-[32px]"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: idx * 0.12 + 0.15, duration: 0.35 }}
                  style={{
                    background: etape.completee ? GOLD : GRAY,
                    transformOrigin: 'top', opacity: etape.completee ? 0.8 : 0.3,
                  }}
                />
              )}
            </div>
            {/* Colonne droite : texte */}
            <motion.div
              className="pb-6"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 + 0.05 }}
            >
              <p
                className="font-semibold text-sm"
                style={{ color: etape.completee ? WHITE : isActive ? CYAN : GRAY }}
              >
                {etape.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: `${GRAY}` }}>
                {etape.description}
              </p>
              {etape.date && (
                <p className="text-xs mt-1 font-mono" style={{ color: `${GOLD}bb` }}>
                  {etape.date}
                </p>
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Carte Commande ── */
function CarteCommande({ commande }: { commande: Commande }) {
  const [ouvert, setOuvert] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      style={{
        background: `${NAVY}cc`,
        border: `1px solid ${GOLD}33`,
        backdropFilter: 'blur(12px)',
        borderRadius: 16,
        overflow: 'hidden',
      }}
      className="mb-5"
    >
      {/* Header cliquable */}
      <button
        onClick={() => setOuvert((v) => !v)}
        className="w-full text-left p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-mono" style={{ color: `${GOLD}99` }}>
                #{commande.numero}
              </span>
              <BadgeStatut statut={commande.statutActuel} />
            </div>
            <p className="font-semibold text-sm truncate" style={{ color: WHITE }}>
              {commande.produit}
            </p>
            <p className="text-xs mt-1" style={{ color: GRAY }}>
              {new Intl.NumberFormat('fr-FR').format(commande.prix)} XOF · {commande.date}
            </p>
          </div>
          <span style={{ color: GOLD }}>
            {ouvert ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </span>
        </div>

        {/* Stepper toujours visible */}
        <StepperHorizontal etapes={commande.etapes} />
      </button>

      {/* Timeline dépliable */}
      <AnimatePresence>
        {ouvert && (
          <motion.div
            key="timeline"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="px-5 pb-5 pt-2"
              style={{ borderTop: `1px solid ${GOLD}22` }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: `${GOLD}99` }}>
                HISTORIQUE DE LIVRAISON
              </p>
              <TimelineDetail etapes={commande.etapes} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Empty State ── */
function EmptyState({ filtre }: { filtre: Filtre }) {
  const msg =
    filtre === 'en-cours'
      ? 'Aucune commande en cours pour le moment.'
      : filtre === 'livrees'
      ? 'Aucune commande livrée pour le moment.'
      : 'Vous n\'avez pas encore passé de commande.';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 gap-4"
    >
      <div
        style={{
          width: 80, height: 80, borderRadius: '50%',
          background: `${GOLD}11`, border: `2px dashed ${GOLD}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Package size={36} color={`${GOLD}88`} />
      </div>
      <p className="text-center text-sm" style={{ color: GRAY }}>
        {msg}
      </p>
    </motion.div>
  );
}

/* ── Composant principal ── */
export default function SuiviCommandesClient({ commandes }: Props) {
  const [filtre, setFiltre] = useState<Filtre>('tous');

  const commandesFiltrees = commandes.filter((c) => {
    if (filtre === 'en-cours') return c.statutActuel !== 'Livré';
    if (filtre === 'livrees')  return c.statutActuel === 'Livré';
    return true;
  });

  const filtres: { key: Filtre; label: string }[] = [
    { key: 'tous',     label: 'Toutes' },
    { key: 'en-cours', label: 'En cours' },
    { key: 'livrees',  label: 'Livrées' },
  ];

  return (
    <div
      className="min-h-screen px-4 py-8 md:px-8 md:py-12"
      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0d1f3c 100%)` }}
    >
      <div className="max-w-2xl mx-auto">

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold" style={{ color: WHITE }}>
            Suivi des commandes
          </h1>
          <p className="text-sm mt-1" style={{ color: GRAY }}>
            Tracking en temps réel de vos livraisons
          </p>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6 flex-wrap"
        >
          {filtres.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltre(f.key)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: filtre === f.key ? GOLD : `${GOLD}11`,
                color:      filtre === f.key ? NAVY  : GOLD,
                border:     `1px solid ${GOLD}44`,
              }}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Liste ou empty state */}
        <AnimatePresence mode="wait">
          {commandesFiltrees.length === 0 ? (
            <EmptyState key="empty" filtre={filtre} />
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {commandesFiltrees.map((cmd) => (
                <CarteCommande key={cmd.id} commande={cmd} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
