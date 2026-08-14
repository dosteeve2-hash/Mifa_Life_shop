'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import AuroraBackground from '@/components/studio/primitives/AuroraBackground';
import RevealText from '@/components/studio/primitives/RevealText';
import GradientText from '@/components/studio/primitives/GradientText';
import MagneticButton from '@/components/studio/primitives/MagneticButton';
import Marquee from '@/components/studio/primitives/Marquee';
import NumberTicker from '@/components/studio/primitives/NumberTicker';
import { EASE, fadeUp, stagger } from '@/lib/motion/presets';

const STACK = [
  'Motion', 'Tailwind v4', 'Next 16', 'TypeScript', 'Recharts',
  'Better Auth', 'GSAP', 'Lucide', 'React 19',
];

const FACTS = [
  { value: 12, suffix: '', label: 'Primitives animées' },
  { value: 0, suffix: '', label: 'Dépendance ajoutée' },
  { value: 60, suffix: ' fps', label: 'Transform & opacity' },
];

/** En-tête du studio : aurore animée, titre dévoilé mot à mot, chiffres clés. */
export default function StudioHero() {
  return (
    <AuroraBackground className="border-b border-gold/12">
      <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-7 sm:py-28">
        <motion.div initial="hidden" animate="show" variants={stagger(0.1)}>
          <motion.span
            variants={fadeUp}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/[.07] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[.14em] text-gold"
          >
            <Sparkles size={12} />
            FORGE UI — Kit d’interface
          </motion.span>

          <h1 className="max-w-[860px] text-[clamp(34px,6vw,64px)] font-extrabold leading-[1.05] tracking-[-.03em] text-[#e8edf5]">
            <RevealText text="Des interfaces qui bougent" />{' '}
            <GradientText>comme il faut.</GradientText>
          </h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-[560px] text-[15px] leading-relaxed text-[#93aacb]"
          >
            Douze primitives animées, un dashboard et des écrans d’authentification, taillés
            dans la palette Navy × Gold × Cyan. Chaque composant est autonome : un fichier,
            aucune dépendance interne, copiable tel quel dans un autre projet.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton onClick={() => document.getElementById('primitives')?.scrollIntoView({ behavior: 'smooth' })}>
              Explorer les composants
              <ArrowRight size={15} />
            </MagneticButton>
            <Link
              href="/studio/dashboard"
              className="text-sm font-bold text-[#93aacb] underline-offset-4 transition-colors hover:text-gold hover:underline"
            >
              Voir le dashboard →
            </Link>
          </motion.div>

          <motion.dl variants={fadeUp} className="mt-14 flex flex-wrap gap-x-12 gap-y-6">
            {FACTS.map((f) => (
              <div key={f.label}>
                <dt className="font-mono text-[28px] font-bold text-gold">
                  <NumberTicker value={f.value} suffix={f.suffix} />
                </dt>
                <dd className="text-[11px] font-bold uppercase tracking-[.1em] text-[#4f6d8e]">
                  {f.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: EASE.out }}
        className="border-t border-gold/10 py-5"
      >
        <Marquee duration={30}>
          {STACK.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-gold/12 bg-white/[.03] px-4 py-2 text-xs font-bold text-[#93aacb]"
            >
              {tech}
            </span>
          ))}
        </Marquee>
      </motion.div>
    </AuroraBackground>
  );
}
