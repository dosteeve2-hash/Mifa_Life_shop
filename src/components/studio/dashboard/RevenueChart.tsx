'use client';

import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts';
import AnimatedTabs from '@/components/studio/primitives/AnimatedTabs';
import { REVENUE_2024 } from './data';

type Metric = 'revenu' | 'commandes';

const METRICS: Record<Metric, { label: string; color: string; format: (n: number) => string }> = {
  revenu: {
    label: 'Revenu',
    color: '#D4AF37',
    format: (n) => `${(n / 1_000_000).toFixed(2)} M FCFA`,
  },
  commandes: {
    label: 'Commandes',
    color: '#00BCD4',
    format: (n) => `${n.toLocaleString('fr-FR')} commandes`,
  },
};

function ChartTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const key = payload[0].dataKey as Metric;
  const value = Number(payload[0].value ?? 0);

  return (
    <div className="rounded-xl border border-gold/25 bg-[#0A1628]/95 px-3 py-2 shadow-[0_8px_28px_rgba(0,0,0,.5)] backdrop-blur">
      <p className="text-[10px] font-bold uppercase tracking-[.1em] text-[#4f6d8e]">{label}</p>
      <p className="mt-1 font-mono text-sm font-bold" style={{ color: METRICS[key].color }}>
        {METRICS[key].format(value)}
      </p>
    </div>
  );
}

/** Aire de revenus animée, avec bascule entre deux métriques. */
export default function RevenueChart() {
  const [metric, setMetric] = useState<Metric>('revenu');
  const active = METRICS[metric];

  return (
    <div className="rounded-2xl border border-gold/12 bg-white/[.03] p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#e8edf5]">Performance annuelle</h2>
          <p className="text-xs text-[#93aacb]">12 derniers mois — données de démonstration</p>
        </div>
        <AnimatedTabs
          items={[
            { id: 'revenu', label: 'Revenu' },
            { id: 'commandes', label: 'Commandes' },
          ]}
          value={metric}
          onChange={(id) => setMetric(id as Metric)}
        />
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={REVENUE_2024} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="forge-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={active.color} stopOpacity={0.45} />
                <stop offset="100%" stopColor={active.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(212,175,55,.08)" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#4f6d8e', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={62}
              tick={{ fill: '#4f6d8e', fontSize: 11 }}
              tickFormatter={(v: number) => (metric === 'revenu' ? `${v / 1_000_000}M` : `${v}`)}
            />
            <Tooltip
              content={(props) => <ChartTooltip {...props} />}
              cursor={{ stroke: 'rgba(212,175,55,.3)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={active.color}
              strokeWidth={2.25}
              fill="url(#forge-area)"
              activeDot={{ r: 5, fill: active.color, stroke: '#0A1628', strokeWidth: 2 }}
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
