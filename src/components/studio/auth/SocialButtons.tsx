'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion/presets';

/**
 * Fournisseurs OAuth. `id` correspond aux identifiants attendus par
 * `authClient.signIn.social({ provider })` de Better Auth.
 */
const PROVIDERS = [
  { id: 'google', label: 'Google', path: 'M12 11v2.8h6.5c-.3 1.7-2 5-6.5 5a7 7 0 1 1 0-14c2 0 3.4.9 4.2 1.6l2.9-2.8A11 11 0 0 0 12 1a11 11 0 1 0 0 22c6.4 0 10.6-4.5 10.6-10.8 0-.7-.1-1.3-.2-1.9z' },
  { id: 'github', label: 'GitHub', path: 'M12 1a11 11 0 0 0-3.5 21.4c.6.1.8-.2.8-.5v-2c-3 .6-3.7-1.4-3.7-1.4-.5-1.3-1.2-1.6-1.2-1.6-1-.7 0-.7 0-.7 1 0 1.6 1.1 1.6 1.1 1 1.7 2.6 1.2 3.2.9 0-.7.4-1.2.7-1.5-2.4-.3-5-1.2-5-5.4 0-1.2.4-2.2 1.1-3 0-.3-.5-1.4.1-2.9 0 0 .9-.3 3 1.1a10.4 10.4 0 0 1 5.5 0c2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.6.1 2.9.7.8 1.1 1.8 1.1 3 0 4.2-2.6 5.1-5 5.4.4.3.8 1 .8 2.1v3.1c0 .3.2.6.8.5A11 11 0 0 0 12 1z' },
] as const;

interface SocialButtonsProps {
  onSelect?: (provider: string) => void;
  disabled?: boolean;
}

/** Boutons fournisseur, avec un liseré doré qui s'allume au survol. */
export default function SocialButtons({ onSelect, disabled = false }: SocialButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {PROVIDERS.map((p) => (
        <motion.button
          key={p.id}
          type="button"
          variants={fadeUp}
          disabled={disabled}
          onClick={() => onSelect?.(p.id)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 rounded-xl border border-gold/15 bg-white/[.04] px-4 py-3 text-[13px] font-bold text-[#e8edf5] transition-colors hover:border-gold/45 hover:bg-gold/[.07] disabled:pointer-events-none disabled:opacity-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d={p.path} />
          </svg>
          {p.label}
        </motion.button>
      ))}
    </div>
  );
}
