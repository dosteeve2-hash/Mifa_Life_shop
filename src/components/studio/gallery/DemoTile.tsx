'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion/presets';

interface DemoTileProps {
  name: string;
  /** Ce que fait la primitive, en une phrase. */
  note: string;
  /** Nom du fichier source, pour la reprise dans un autre projet. */
  source: string;
  children: ReactNode;
  className?: string;
}

/** Vignette de démonstration : la primitive en vie, puis son étiquette. */
export default function DemoTile({ name, note, source, children, className = '' }: DemoTileProps) {
  return (
    <motion.figure
      variants={fadeUp}
      className={`flex flex-col overflow-hidden rounded-2xl border border-gold/12 bg-white/[.02] ${className}`}
    >
      <div className="flex min-h-[190px] flex-1 items-center justify-center p-6">{children}</div>
      <figcaption className="border-t border-gold/12 bg-[#0c1a30]/60 px-5 py-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[13px] font-bold text-[#e8edf5]">{name}</h3>
          <code className="shrink-0 font-mono text-[10px] text-[#4f6d8e]">{source}</code>
        </div>
        <p className="mt-0.5 text-[11.5px] leading-relaxed text-[#93aacb]">{note}</p>
      </figcaption>
    </motion.figure>
  );
}
