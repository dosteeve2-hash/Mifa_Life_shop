'use client';

import { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { SPRING } from '@/lib/motion/presets';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface AnimatedTabsProps {
  items: TabItem[];
  value?: string;
  onChange?: (id: string) => void;
  className?: string;
}

/**
 * Onglets dont la pastille active glisse d'un onglet à l'autre (`layoutId`).
 * Contrôlé si `value` est fourni, autonome sinon.
 */
export default function AnimatedTabs({
  items,
  value,
  onChange,
  className = '',
}: AnimatedTabsProps) {
  const layoutId = useId();
  const [internal, setInternal] = useState(items[0]?.id ?? '');
  const active = value ?? internal;

  const select = (id: string) => {
    if (value === undefined) setInternal(id);
    onChange?.(id);
  };

  return (
    <div
      role="tablist"
      className={`inline-flex flex-wrap items-center gap-1 rounded-xl border border-gold/12 bg-white/[.03] p-1 ${className}`}
    >
      {items.map((item) => {
        const on = item.id === active;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={on}
            onClick={() => select(item.id)}
            className={`relative rounded-lg px-4 py-2 text-xs font-bold transition-colors duration-200 ${
              on ? 'text-navy' : 'text-[#93aacb] hover:text-gold'
            }`}
          >
            {on && (
              <motion.span
                layoutId={layoutId}
                transition={SPRING.glide}
                className="absolute inset-0 rounded-lg bg-gold"
              />
            )}
            <span className="relative flex items-center gap-2">
              {item.label}
              {item.count !== undefined && (
                <span
                  className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                    on ? 'bg-navy/15 text-navy' : 'bg-gold/10 text-gold'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
