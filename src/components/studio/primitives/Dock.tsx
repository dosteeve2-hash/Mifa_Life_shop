'use client';

import { useRef, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

export interface DockItem {
  id: string;
  label: string;
  icon: ReactNode;
  onSelect?: () => void;
}

interface DockProps {
  items: DockItem[];
  className?: string;
}

const BASE = 46;
const MAX = 78;
/** Portée de la loupe autour du curseur, en px. */
const RANGE = 130;

/**
 * Dock façon macOS : les icônes grossissent selon leur distance au curseur.
 * La distance vient d'une MotionValue partagée — aucun state React au survol.
 */
export default function Dock({ items, className = '' }: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const reduced = useReducedMotion();

  return (
    <div
      onMouseMove={(e) => !reduced && mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`flex items-end gap-3 rounded-2xl border border-gold/15 bg-[#0c1a30]/85 px-4 pb-3 pt-2 backdrop-blur-xl ${className}`}
    >
      {items.map((item) => (
        <DockIcon key={item.id} mouseX={mouseX} item={item} />
      ))}
    </div>
  );
}

function DockIcon({
  mouseX,
  item,
}: {
  mouseX: MotionValue<number>;
  item: DockItem;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (x) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return Infinity;
    return x - (box.left + box.width / 2);
  });

  const size = useSpring(
    useTransform(distance, [-RANGE, 0, RANGE], [BASE, MAX, BASE], { clamp: true }),
    { stiffness: 260, damping: 20, mass: 0.4 },
  );

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={item.onSelect}
      aria-label={item.label}
      style={{ width: size, height: size }}
      whileTap={{ scale: 0.9 }}
      className="group relative flex shrink-0 items-center justify-center rounded-xl border border-gold/15 bg-white/[.04] text-gold transition-colors hover:border-gold/45 hover:bg-gold/10"
    >
      {item.icon}
      <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md border border-gold/20 bg-[#0A1628] px-2 py-1 text-[10px] font-bold text-[#e8edf5] opacity-0 transition-opacity group-hover:opacity-100">
        {item.label}
      </span>
    </motion.button>
  );
}
