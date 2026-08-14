'use client';

import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from '@/lib/motion/presets';

interface SparklineProps {
  points: number[];
  /** Teinte de la courbe et de son remplissage. */
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Mini-courbe qui se trace de gauche à droite (`pathLength`) au montage,
 * avec une aire dégradée qui apparaît derrière une fois le tracé lancé.
 */
export default function Sparkline({
  points,
  color = '#D4AF37',
  width = 120,
  height = 36,
  className = '',
}: SparklineProps) {
  const gradientId = useId();
  const reduced = useReducedMotion();

  if (points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / span) * (height - 4) - 2;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  const line = `M ${coords.join(' L ')}`;
  const area = `${line} L ${width},${height} L 0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      fill="none"
      aria-hidden
      className={className}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <motion.path
        d={area}
        fill={`url(#${gradientId})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: reduced ? 0 : 0.5 }}
      />
      <motion.path
        d={line}
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduced ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: EASE.out }}
      />
    </svg>
  );
}
