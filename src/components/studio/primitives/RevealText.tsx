'use client';

import { motion } from 'framer-motion';
import { EASE, IN_VIEW } from '@/lib/motion/presets';

interface RevealTextProps {
  text: string;
  /** Délai entre deux mots, en secondes. */
  stagger?: number;
  delay?: number;
  className?: string;
}

/**
 * Titre qui se dévoile mot par mot depuis le bas, derrière un masque.
 * Chaque mot reste un mot entier : le texte demeure sélectionnable et lisible
 * par un lecteur d'écran (le libellé complet est porté par l'élément parent).
 */
export default function RevealText({
  text,
  stagger = 0.05,
  delay = 0,
  className = '',
}: RevealTextProps) {
  const words = text.split(' ');

  return (
    <motion.span
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={IN_VIEW}
      variants={{ show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      className={`inline-flex flex-wrap ${className}`}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden className="inline-block overflow-hidden pb-[0.12em]">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '110%', opacity: 0 },
              show: { y: '0%', opacity: 1, transition: { duration: 0.65, ease: EASE.out } },
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
