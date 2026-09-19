/**
 * Socle motion partagé — FORGE UI.
 * Portable : aucune dépendance au projet, copiable tel quel dans un autre repo.
 */
import type { Transition, Variants } from 'framer-motion';

/** Courbes signature. */
export const EASE = {
  /** Sortie franche, arrivée douce — le défaut pour les entrées. */
  out: [0.16, 1, 0.3, 1],
  /** Symétrique — pour les allers-retours (tabs, toggles). */
  inOut: [0.65, 0, 0.35, 1],
  /** Léger dépassement — pour les micro-interactions. */
  back: [0.34, 1.56, 0.64, 1],
} as const;

/** Ressorts signature. */
export const SPRING = {
  /** Indicateurs qui glissent (layoutId). */
  glide: { type: 'spring', stiffness: 380, damping: 32 } as const,
  /** Boutons magnétiques, dock. */
  magnetic: { type: 'spring', stiffness: 260, damping: 18, mass: 0.6 } as const,
  /** Compteurs, jauges. */
  counter: { type: 'spring', stiffness: 90, damping: 26 } as const,
} satisfies Record<string, Transition>;

/** Entrée verticale standard. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE.out } },
};

/** Entrée avec échelle — cartes, modals. */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 14 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: EASE.out } },
};

/**
 * Conteneur qui cascade ses enfants.
 * @param stagger délai entre enfants (s)
 * @param delay   délai avant le premier enfant (s)
 */
export const stagger = (stagger = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/** Réglages `whileInView` réutilisés partout — évite les re-déclenchements au scroll. */
export const IN_VIEW = { once: true, amount: 0.25 } as const;
