'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SPRING } from '@/lib/motion/presets';

interface OtpInputProps {
  length?: number;
  onComplete?: (code: string) => void;
}

/**
 * Saisie de code à usage unique : une case par chiffre, avance automatique,
 * retour arrière sur case vide, et collage d'un code complet en une fois.
 */
export default function OtpInput({ length = 6, onComplete }: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(''));
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const commit = (next: string[]) => {
    setDigits(next);
    const code = next.join('');
    if (code.length === length && !next.includes('')) onComplete?.(code);
  };

  const handleChange = (i: number, raw: string) => {
    const value = raw.replace(/\D/g, '');
    if (!value) {
      commit(digits.map((d, k) => (k === i ? '' : d)));
      return;
    }
    // Collage d'un code entier : on remplit à partir de la case courante.
    const next = [...digits];
    for (let k = 0; k < value.length && i + k < length; k++) next[i + k] = value[k];
    commit(next);
    refs.current[Math.min(i + value.length, length - 1)]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus();
  };

  return (
    <div className="flex gap-2">
      {digits.map((digit, i) => (
        <motion.input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={length}
          value={digit}
          aria-label={`Chiffre ${i + 1} sur ${length}`}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          animate={digit ? { scale: [1, 1.12, 1] } : { scale: 1 }}
          transition={SPRING.magnetic}
          className={`h-12 w-full min-w-0 rounded-xl border bg-white/[.04] text-center font-mono text-lg font-bold text-[#e8edf5] transition-colors focus:border-gold focus:bg-gold/[.06] focus:outline-none ${
            digit ? 'border-gold/50' : 'border-gold/15'
          }`}
        />
      ))}
    </div>
  );
}
