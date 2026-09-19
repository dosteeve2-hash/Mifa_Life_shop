'use client';

import { motion } from 'framer-motion';
import { EASE, IN_VIEW, fadeUp, stagger } from '@/lib/motion/presets';
import { TOP_PRODUCTS } from './data';

/** Classement produits : chaque jauge se remplit à l'entrée à l'écran. */
export default function TopProducts() {
  return (
    <div className="rounded-2xl border border-gold/12 bg-white/[.03] p-5">
      <h2 className="mb-4 text-base font-bold text-[#e8edf5]">Meilleures ventes</h2>

      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={IN_VIEW}
        variants={stagger(0.09)}
        className="space-y-4"
      >
        {TOP_PRODUCTS.map((p, i) => (
          <motion.li key={p.id} variants={fadeUp}>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <p className="flex min-w-0 items-baseline gap-2">
                <span className="font-mono text-[11px] text-[#4f6d8e]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="truncate text-[13px] font-bold text-[#e8edf5]">{p.name}</span>
                <span className="shrink-0 text-[10px] uppercase tracking-[.08em] text-[#4f6d8e]">
                  {p.category}
                </span>
              </p>
              <span className="shrink-0 font-mono text-xs font-bold text-gold">{p.sold}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[.05]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold3 via-gold to-gold2"
                variants={{
                  hidden: { scaleX: 0 },
                  show: {
                    scaleX: p.share,
                    transition: { duration: 0.9, ease: EASE.out },
                  },
                }}
                style={{ originX: 0 }}
              />
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
