'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AuroraBackgroundProps {
  children?: ReactNode;
  /** Ajoute une trame de points par-dessus les halos. */
  grid?: boolean;
  className?: string;
}

const BLOBS = [
  { color: 'rgba(212,175,55,.38)', size: 620, top: '-18%', left: '-10%', dur: 18 },
  { color: 'rgba(0,188,212,.32)', size: 540, top: '35%', left: '62%', dur: 22 },
  { color: 'rgba(245,214,122,.24)', size: 420, top: '68%', left: '12%', dur: 26 },
];

/**
 * Fond aurore : trois halos qui dérivent lentement sous un flou.
 * Purement décoratif — masqué aux lecteurs d'écran, figé en reduced-motion.
 */
export default function AuroraBackground({
  children,
  grid = true,
  className = '',
}: AuroraBackgroundProps) {
  const reduced = useReducedMotion();

  return (
    <div className={`relative isolate overflow-hidden bg-[#0A1628] ${className}`}>
      <div aria-hidden className="absolute inset-0 blur-[90px]">
        {BLOBS.map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: b.size,
              height: b.size,
              top: b.top,
              left: b.left,
              background: `radial-gradient(circle, ${b.color}, transparent 68%)`,
            }}
            animate={
              reduced ? undefined : { x: [0, 70, -40, 0], y: [0, -50, 40, 0], scale: [1, 1.12, 0.95, 1] }
            }
            transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {grid && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-[.5]"
          style={{
            backgroundImage: 'radial-gradient(rgba(212,175,55,.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #000, transparent)',
          }}
        />
      )}

      <div className="relative">{children}</div>
    </div>
  );
}
