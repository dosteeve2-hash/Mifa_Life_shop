'use client';

import type { ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  /** Durée d'un cycle complet, en secondes. Plus grand = plus lent. */
  duration?: number;
  reverse?: boolean;
  /** Estompe les deux bords pour que le défilement n'ait pas de début visible. */
  fade?: boolean;
  className?: string;
}

/**
 * Bandeau défilant en boucle. Le contenu est dupliqué une fois et la piste
 * translate de -50 % : la couture est invisible quel que soit le contenu.
 * Se met en pause au survol et s'arrête si l'utilisateur réduit les animations.
 */
export default function Marquee({
  children,
  duration = 26,
  reverse = false,
  fade = true,
  className = '',
}: MarqueeProps) {
  return (
    <div
      className={`group relative overflow-hidden ${className}`}
      style={
        fade
          ? {
              maskImage:
                'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
              WebkitMaskImage:
                'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
            }
          : undefined
      }
    >
      <div
        className="forge-marquee-track flex w-max gap-4 group-hover:[animation-play-state:paused]"
        style={{
          animationDuration: `${duration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        <div className="flex shrink-0 gap-4">{children}</div>
        <div className="flex shrink-0 gap-4" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
