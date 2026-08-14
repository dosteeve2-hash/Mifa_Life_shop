'use client';

import { useRef, type ReactNode } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';

interface SpotlightCardProps {
  children: ReactNode;
  /** Rayon du halo qui suit le curseur, en px. */
  spotlightSize?: number;
  /** Amplitude de l'inclinaison 3D, en degrés. 0 pour désactiver. */
  tilt?: number;
  className?: string;
}

/**
 * Carte qui s'incline vers le curseur et allume un halo sous lui.
 * Tout passe par des MotionValues : zéro re-render React pendant le mouvement.
 */
export default function SpotlightCard({
  children,
  spotlightSize = 320,
  tilt = 6,
  className = '',
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 22 });

  const glow = useMotionTemplate`radial-gradient(${spotlightSize}px circle at ${mx}px ${my}px, rgba(212,175,55,.16), transparent 72%)`;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    mx.set(x);
    my.set(y);
    if (tilt > 0) {
      ry.set(((x / r.width) - 0.5) * tilt * 2);
      rx.set(((y / r.height) - 0.5) * -tilt * 2);
    }
  };

  const handleLeave = () => {
    mx.set(-9999);
    my.set(-9999);
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`group relative overflow-hidden rounded-2xl border border-gold/12 bg-white/[.03] transition-colors duration-300 hover:border-gold/35 ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
