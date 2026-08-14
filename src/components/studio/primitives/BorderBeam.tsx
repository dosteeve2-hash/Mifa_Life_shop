'use client';

import type { CSSProperties, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface BorderBeamProps {
  children: ReactNode;
  /** Épaisseur du liseré animé, en px. */
  thickness?: number;
  /** Durée d'un tour complet, en secondes. */
  duration?: number;
  /** Décalage de départ, en secondes — désynchronise plusieurs cartes côte à côte. */
  delay?: number;
  radius?: number;
  className?: string;
}

/**
 * Carte cerclée d'un faisceau qui tourne le long du bord.
 * Le dégradé conique tourne sous un masque annulaire : aucun repaint de layout.
 */
export default function BorderBeam({
  children,
  thickness = 1.5,
  duration = 6,
  delay = 0,
  radius = 18,
  className = '',
}: BorderBeamProps) {
  const reduced = useReducedMotion();

  const beamStyle: CSSProperties = {
    background:
      'conic-gradient(from 0deg, transparent 0deg, transparent 250deg, #00BCD4 300deg, #D4AF37 340deg, #F5D67A 360deg)',
    inset: -100,
  };

  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      style={{ borderRadius: radius, padding: thickness }}
    >
      {/* Faisceau rotatif */}
      {reduced ? (
        <div
          aria-hidden
          className="absolute"
          style={{ ...beamStyle, opacity: 0.35 }}
        />
      ) : (
        <motion.div
          aria-hidden
          className="absolute"
          style={beamStyle}
          animate={{ rotate: 360 }}
          transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Halo statique pour que le bord reste lisible quand le faisceau est ailleurs */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ borderRadius: radius, boxShadow: 'inset 0 0 0 1px rgba(212,175,55,.14)' }}
      />

      {/* Contenu */}
      <div
        className="relative h-full w-full bg-[#0c1a30]"
        style={{ borderRadius: radius - thickness }}
      >
        {children}
      </div>
    </div>
  );
}
