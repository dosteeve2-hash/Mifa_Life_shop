'use client';

import { useEffect, useRef } from 'react';
import { useInView, useMotionValueEvent, useReducedMotion, useSpring } from 'framer-motion';
import { SPRING } from '@/lib/motion/presets';

interface NumberTickerProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Locale de formatage des milliers. */
  locale?: string;
  className?: string;
}

/**
 * Compteur qui démarre quand il entre à l'écran et rejoint sa valeur en ressort.
 * Écrit directement dans le DOM : aucun re-render pendant l'animation.
 */
export default function NumberTicker({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  locale = 'fr-FR',
  className = '',
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const reduced = useReducedMotion();
  const spring = useSpring(0, SPRING.counter);

  const format = (n: number) =>
    prefix +
    n.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) +
    suffix;

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      spring.jump(value);
      return;
    }
    spring.set(value);
  }, [inView, reduced, value, spring]);

  useMotionValueEvent(spring, 'change', (latest) => {
    if (ref.current) ref.current.textContent = format(latest);
  });

  return (
    <span ref={ref} className={className}>
      {format(0)}
    </span>
  );
}
