'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Banknote, Package, Store } from 'lucide-react';
import { IN_VIEW, fadeUp, stagger } from '@/lib/motion/presets';
import { ACTIVITY, type ActivityKind } from './data';

const KIND: Record<ActivityKind, { icon: typeof Package; color: string }> = {
  order: { icon: Package, color: '#D4AF37' },
  payout: { icon: Banknote, color: '#22c55e' },
  seller: { icon: Store, color: '#00BCD4' },
  stock: { icon: AlertTriangle, color: '#ef4444' },
};

const formatAgo = (minutes: number) =>
  minutes < 60 ? `il y a ${minutes} min` : `il y a ${Math.floor(minutes / 60)} h`;

/** Fil d'activité : chaque ligne entre en cascade, reliée par un rail vertical. */
export default function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-gold/12 bg-white/[.03] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-[#e8edf5]">Activité récente</h2>
        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.08em] text-[#22c55e]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-70 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
          </span>
          En direct
        </span>
      </div>

      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={IN_VIEW}
        variants={stagger(0.08)}
        className="relative space-y-1 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-px before:bg-gold/12"
      >
        {ACTIVITY.map((item) => {
          const { icon: Icon, color } = KIND[item.kind];
          return (
            <motion.li
              key={item.id}
              variants={fadeUp}
              className="relative flex gap-3 rounded-xl p-2 transition-colors hover:bg-gold/[.05]"
            >
              <span
                className="z-10 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl border"
                style={{ color, background: `${color}14`, borderColor: `${color}33` }}
              >
                <Icon size={16} strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-[13px] font-bold text-[#e8edf5]">{item.title}</p>
                  <span className="shrink-0 font-mono text-[10px] text-[#4f6d8e]">
                    {formatAgo(item.ago)}
                  </span>
                </div>
                <p className="truncate text-xs text-[#93aacb]">{item.detail}</p>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}
