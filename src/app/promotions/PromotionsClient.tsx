"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tag,
  Copy,
  Check,
  Truck,
  Percent,
  DollarSign,
  Clock,
  Gift,
  Sparkles,
} from "lucide-react";
import type { Promotion } from "./page";

type FilterType = "tous" | "pourcentage" | "montant_fixe" | "livraison_gratuite";

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface Props {
  promotions: Promotion[];
}

export default function PromotionsClient({ promotions }: Props) {
  const [filter, setFilter] = useState<FilterType>("tous");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toast, setToast] = useState(false);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const actifs = promotions.filter((p) => p.actif);

  const totalEconomise = actifs.reduce((acc, p) => {
    if (p.type_reduction === "pourcentage") {
      return acc + (p.valeur / 100) * p.min_commande * p.nb_utilisations_actuelles;
    }
    if (p.type_reduction === "montant_fixe") {
      return acc + p.valeur * p.nb_utilisations_actuelles;
    }
    return acc;
  }, 0);

  const prochaine = actifs
    .filter((p) => p.date_fin !== null)
    .sort(
      (a, b) =>
        new Date(a.date_fin!).getTime() - new Date(b.date_fin!).getTime()
    )[0];

  // ── Filtre ─────────────────────────────────────────────────────────────────
  const filtered =
    filter === "tous" ? actifs : actifs.filter((p) => p.type_reduction === filter);

  // ── Copie clipboard ────────────────────────────────────────────────────────
  async function handleCopy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedCode(code);
    setToast(true);
    setTimeout(() => {
      setCopiedCode(null);
      setToast(false);
    }, 2000);
  }

  // ── Badge type ─────────────────────────────────────────────────────────────
  function TypeBadge({ type }: { type: Promotion["type_reduction"] }) {
    const map: Record<
      Promotion["type_reduction"],
      { label: string; color: string; Icon: typeof Tag }
    > = {
      pourcentage: { label: "% Réduction", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30", Icon: Percent },
      montant_fixe: { label: "Montant fixe", color: "bg-amber-500/20 text-amber-300 border-amber-500/30", Icon: DollarSign },
      livraison_gratuite: { label: "Livraison gratuite", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", Icon: Truck },
    };
    const { label, color, Icon } = map[type];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${color}`}>
        <Icon size={11} />
        {label}
      </span>
    );
  }

  // ── Valeur affichée ────────────────────────────────────────────────────────
  function PromoValue({ p }: { p: Promotion }) {
    if (p.type_reduction === "pourcentage")
      return <span className="text-3xl font-black text-amber-400">{p.valeur}%</span>;
    if (p.type_reduction === "montant_fixe")
      return <span className="text-2xl font-black text-amber-400">{formatPrice(p.valeur)}</span>;
    return (
      <span className="inline-flex items-center gap-1 text-emerald-400 font-black text-xl">
        <Truck size={20} /> Gratuite
      </span>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#0F172A] text-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/10 py-16 px-4 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-400">
            <Gift size={14} /> Codes promo exclusifs MIFA Life
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Nos{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              promotions
            </span>
          </h1>
          <p className="mt-3 text-slate-400 text-lg max-w-xl mx-auto">
            Copiez votre code, appliquez-le au panier et profitez de vos réductions sur les créations africaines MIFA Life.
          </p>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Codes actifs",
              value: actifs.length.toString(),
              icon: <Tag size={20} className="text-amber-400" />,
            },
            {
              label: "Total économisé (estimé)",
              value: formatPrice(Math.round(totalEconomise)),
              icon: <Sparkles size={20} className="text-cyan-400" />,
            },
            {
              label: "Prochaine expiration",
              value: prochaine ? formatDate(prochaine.date_fin!) : "Illimitée",
              icon: <Clock size={20} className="text-rose-400" />,
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-slate-400">{stat.label}</p>
                <p className="text-lg font-bold text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Filtres ── */}
      <section className="mx-auto max-w-5xl px-4 pb-6">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "tous", label: "Tous" },
              { key: "pourcentage", label: "% Réduction" },
              { key: "montant_fixe", label: "Montant fixe" },
              { key: "livraison_gratuite", label: "Livraison gratuite" },
            ] as { key: FilterType; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                filter === key
                  ? "bg-amber-400 text-[#0F172A] shadow-lg shadow-amber-400/30"
                  : "border border-white/20 text-slate-300 hover:border-amber-400/50 hover:text-amber-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Cards ── */}
      <section className="mx-auto max-w-5xl px-4 pb-20">
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length === 0 && (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center text-slate-500 py-12"
              >
                Aucun code promo dans cette catégorie.
              </motion.p>
            )}
            {filtered.map((promo, i) => {
              const isCopied = copiedCode === promo.code;
              const pct =
                promo.nb_utilisations_max && promo.nb_utilisations_max > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (promo.nb_utilisations_actuelles / promo.nb_utilisations_max) * 100
                      )
                    )
                  : null;

              return (
                <motion.div
                  key={promo.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.07, duration: 0.35 }}
                  className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur hover:border-amber-400/30 transition-colors"
                >
                  {/* Badge type */}
                  <div className="flex items-center justify-between mb-3">
                    <TypeBadge type={promo.type_reduction} />
                    {promo.date_fin && (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock size={11} />
                        {formatDate(promo.date_fin)}
                      </span>
                    )}
                  </div>

                  {/* Valeur */}
                  <div className="mb-2">
                    <PromoValue p={promo} />
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-300 mb-4 flex-1">{promo.description}</p>

                  {/* Code + copier */}
                  <div className="flex items-center gap-2 mb-4 rounded-xl border border-amber-400/30 bg-amber-400/5 p-3">
                    <code className="flex-1 font-mono text-lg font-bold tracking-widest text-amber-400 select-all">
                      {promo.code}
                    </code>
                    <button
                      onClick={() => handleCopy(promo.code)}
                      className={`flex-shrink-0 flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                        isCopied
                          ? "bg-emerald-500 text-white"
                          : "bg-amber-400 text-[#0F172A] hover:bg-amber-300"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check size={13} /> Copié !
                        </>
                      ) : (
                        <>
                          <Copy size={13} /> Copier
                        </>
                      )}
                    </button>
                  </div>

                  {/* Commande minimum */}
                  {promo.min_commande > 0 && (
                    <p className="text-xs text-slate-500 mb-3">
                      Commande minimum :{" "}
                      <span className="text-slate-300 font-medium">
                        {formatPrice(promo.min_commande)}
                      </span>
                    </p>
                  )}

                  {/* Barre de progression */}
                  {pct !== null && (
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>{promo.nb_utilisations_actuelles} utilisations</span>
                        <span>{promo.nb_utilisations_max} max</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.07 + 0.3 }}
                          className={`h-full rounded-full ${
                            pct >= 100
                              ? "bg-rose-500"
                              : pct >= 75
                              ? "bg-amber-400"
                              : "bg-cyan-400"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </section>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-[#0F172A] px-5 py-3 shadow-2xl shadow-emerald-500/20 text-emerald-400 font-semibold text-sm"
          >
            <Check size={16} />
            Code copié dans le presse-papier !
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
