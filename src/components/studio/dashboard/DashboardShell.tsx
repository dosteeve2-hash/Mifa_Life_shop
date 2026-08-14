'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Download } from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';
import ActivityFeed from './ActivityFeed';
import TopProducts from './TopProducts';
import { KPIS } from './data';
import AnimatedTabs from '@/components/studio/primitives/AnimatedTabs';
import GradientText from '@/components/studio/primitives/GradientText';
import { IN_VIEW, fadeUp, stagger } from '@/lib/motion/presets';

/** Assemblage du dashboard : barre latérale, KPI en cascade, courbes et listes. */
export default function DashboardShell() {
  return (
    <div className="mx-auto flex max-w-[1280px] gap-5 px-4 py-8 sm:px-7">
      <DashboardSidebar />

      <div className="min-w-0 flex-1 space-y-5">
        <motion.header
          initial="hidden"
          animate="show"
          variants={stagger(0.08)}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <motion.div variants={fadeUp}>
            <h1 className="text-[clamp(22px,3.5vw,30px)] font-extrabold tracking-[-.025em] text-[#e8edf5]">
              Tableau de bord <GradientText>marketplace</GradientText>
            </h1>
            <p className="mt-1 flex items-center gap-2 text-xs text-[#93aacb]">
              <CalendarDays size={13} />
              Année 2024 — données de démonstration
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
            <AnimatedTabs
              items={[
                { id: '12m', label: '12 mois' },
                { id: '30j', label: '30 jours' },
                { id: '7j', label: '7 jours' },
              ]}
            />
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-gold/25 bg-gold/[.07] px-4 py-2.5 text-xs font-bold text-gold transition-colors hover:border-gold/50 hover:bg-gold/[.12]"
            >
              <Download size={14} />
              Exporter
            </button>
          </motion.div>
        </motion.header>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={IN_VIEW}
          variants={stagger(0.08)}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {KPIS.map((kpi) => (
            <StatCard key={kpi.id} kpi={kpi} />
          ))}
        </motion.div>

        <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
          <RevenueChart />
          <TopProducts />
        </div>

        <ActivityFeed />
      </div>
    </div>
  );
}
