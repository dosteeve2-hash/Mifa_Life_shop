'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Barre de progression de lecture, collée en haut de la fenêtre.
 * `scaleX` est lissé par un ressort pour éviter les à-coups du scroll inertiel.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[900] h-[3px] origin-left bg-gradient-to-r from-gold via-gold2 to-cyan"
    />
  );
}
