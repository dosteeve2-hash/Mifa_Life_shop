'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { SPRING } from '@/lib/motion/presets';

interface MagneticButtonProps {
  children: ReactNode;
  /** Distance max dont le bouton se déplace vers le curseur, en px. */
  pull?: number;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

/**
 * Bouton attiré par le curseur, avec un reflet qui balaie la surface au survol.
 */
export default function MagneticButton({
  children,
  pull = 14,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  const x = useSpring(useMotionValue(0), SPRING.magnetic);
  const y = useSpring(useMotionValue(0), SPRING.magnetic);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * pull * 2);
    y.set(((e.clientY - r.top) / r.height - 0.5) * pull * 2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gold px-6 py-3 text-sm font-bold text-navy shadow-[0_8px_28px_rgba(212,175,55,.28)] disabled:pointer-events-none disabled:opacity-50 ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden"
      />
      <span className="relative flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
