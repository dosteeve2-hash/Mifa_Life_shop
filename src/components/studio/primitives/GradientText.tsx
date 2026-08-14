'use client';

import type { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  /** Durée d'un passage complet du reflet, en secondes. */
  duration?: number;
  className?: string;
}

/**
 * Texte en dégradé Gold × Cyan parcouru par un reflet.
 * Animé en CSS pur (`background-position`) : rien à monter côté JS.
 */
export default function GradientText({
  children,
  duration = 4,
  className = '',
}: GradientTextProps) {
  return (
    <span
      className={`forge-gradient-text bg-clip-text text-transparent ${className}`}
      style={{ animationDuration: `${duration}s` }}
    >
      {children}
    </span>
  );
}
