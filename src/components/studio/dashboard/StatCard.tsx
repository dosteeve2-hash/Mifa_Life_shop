'use client';

import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import SpotlightCard from '@/components/studio/primitives/SpotlightCard';
import NumberTicker from '@/components/studio/primitives/NumberTicker';
import Sparkline from './Sparkline';
import { fadeUp } from '@/lib/motion/presets';
import type { Kpi } from './data';

interface StatCardProps {
  kpi: Kpi;
}

/** Carte KPI : valeur qui s'incrémente, variation colorée, courbe qui se trace. */
export default function StatCard({ kpi }: StatCardProps) {
  const up = kpi.delta >= 0;
  const Arrow = up ? ArrowUpRight : ArrowDownRight;
  const accent = up ? '#22c55e' : '#ef4444';

  return (
    <motion.div variants={fadeUp}>
      <SpotlightCard tilt={4} className="h-full">
        <div className="flex h-full flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[.1em] text-[#4f6d8e]">
              {kpi.label}
            </p>
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] font-bold"
              style={{ color: accent, background: `${accent}14`, border: `1px solid ${accent}33` }}
            >
              <Arrow size={12} strokeWidth={2.5} />
              {Math.abs(kpi.delta).toFixed(1)} %
            </span>
          </div>

          <p className="font-mono text-2xl font-bold tracking-tight text-[#e8edf5]">
            <NumberTicker
              value={kpi.value}
              decimals={kpi.decimals}
              prefix={kpi.prefix}
              suffix={kpi.suffix}
            />
          </p>

          <div className="mt-auto">
            <Sparkline points={kpi.spark} color={accent} width={160} height={40} className="w-full" />
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
