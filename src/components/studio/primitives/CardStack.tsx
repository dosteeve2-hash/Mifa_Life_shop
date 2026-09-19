'use client';

import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from '@/lib/motion/presets';

export interface StackCard {
  id: string;
  content: ReactNode;
}

interface CardStackProps {
  cards: StackCard[];
  className?: string;
}

/** Décalage vertical et réduction d'échelle par carte enfouie. */
const OFFSET = 14;
const SCALE_STEP = 0.05;
/** Déplacement horizontal (px) au-delà duquel la carte est éjectée. */
const THRESHOLD = 110;

/**
 * Pile de cartes : la carte du dessus se jette à gauche ou à droite et passe
 * au fond de la pile. Les cartes enfouies remontent en cascade.
 */
export default function CardStack({ cards, className = '' }: CardStackProps) {
  const [order, setOrder] = useState(cards);

  const sendToBack = () => setOrder((prev) => [...prev.slice(1), prev[0]]);

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence initial={false}>
        {order.slice(0, 3).map((card, i) => (
          <motion.div
            key={card.id}
            drag={i === 0 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > THRESHOLD) sendToBack();
            }}
            initial={{ opacity: 0, y: OFFSET * i + 10, scale: 1 - SCALE_STEP * i }}
            style={{ zIndex: 10 - i }}
            animate={{
              opacity: 1,
              y: OFFSET * i,
              scale: 1 - SCALE_STEP * i,
              transition: { duration: 0.4, ease: EASE.out },
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={i === 0 ? 'relative cursor-grab active:cursor-grabbing' : 'absolute inset-x-0 top-0'}
          >
            {card.content}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
