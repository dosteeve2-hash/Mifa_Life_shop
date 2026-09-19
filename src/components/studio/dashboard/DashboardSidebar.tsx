'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  ChevronLeft,
  LayoutDashboard,
  Package,
  Settings,
  Store,
  Users,
} from 'lucide-react';
import { EASE, SPRING } from '@/lib/motion/presets';

const NAV = [
  { id: 'overview', label: 'Vue d’ensemble', icon: LayoutDashboard },
  { id: 'orders', label: 'Commandes', icon: Package, badge: 12 },
  { id: 'products', label: 'Produits', icon: Store },
  { id: 'sellers', label: 'Vendeurs', icon: Users, badge: 3 },
  { id: 'stats', label: 'Statistiques', icon: BarChart3 },
  { id: 'settings', label: 'Réglages', icon: Settings },
];

/** Barre latérale repliable ; la pastille active glisse entre les entrées. */
export default function DashboardSidebar() {
  const [active, setActive] = useState('overview');
  const [open, setOpen] = useState(true);

  return (
    <motion.aside
      animate={{ width: open ? 232 : 74 }}
      transition={{ duration: 0.4, ease: EASE.out }}
      className="hidden shrink-0 flex-col gap-2 rounded-2xl border border-gold/12 bg-white/[.03] p-3 lg:flex"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Replier le menu' : 'Déplier le menu'}
        className="mb-2 flex items-center gap-2 self-end rounded-lg border border-gold/15 p-2 text-[#93aacb] transition-colors hover:border-gold/40 hover:text-gold"
      >
        <motion.span animate={{ rotate: open ? 0 : 180 }} transition={{ duration: 0.35, ease: EASE.out }}>
          <ChevronLeft size={14} />
        </motion.span>
      </button>

      {NAV.map((item) => {
        const on = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setActive(item.id)}
            title={open ? undefined : item.label}
            className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-bold transition-colors ${
              on ? 'text-gold' : 'text-[#93aacb] hover:text-[#e8edf5]'
            }`}
          >
            {on && (
              <motion.span
                layoutId="forge-sidebar-active"
                transition={SPRING.glide}
                className="absolute inset-0 rounded-xl border border-gold/30 bg-gold/10"
              />
            )}
            <item.icon size={17} strokeWidth={2} className="relative shrink-0" />
            <AnimatePresence initial={false}>
              {open && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.2 }}
                  className="relative flex flex-1 items-center justify-between gap-2 whitespace-nowrap"
                >
                  {item.label}
                  {item.badge && (
                    <span className="rounded bg-gold/15 px-1.5 py-0.5 font-mono text-[10px] text-gold">
                      {item.badge}
                    </span>
                  )}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </motion.aside>
  );
}
