'use client';

import { motion } from 'framer-motion';
import { Compass, Heart, Home, Package, Settings, ShoppingBag } from 'lucide-react';
import DemoTile from './DemoTile';
import SpotlightCard from '@/components/studio/primitives/SpotlightCard';
import BorderBeam from '@/components/studio/primitives/BorderBeam';
import MagneticButton from '@/components/studio/primitives/MagneticButton';
import GradientText from '@/components/studio/primitives/GradientText';
import NumberTicker from '@/components/studio/primitives/NumberTicker';
import AnimatedTabs from '@/components/studio/primitives/AnimatedTabs';
import Dock from '@/components/studio/primitives/Dock';
import CardStack from '@/components/studio/primitives/CardStack';
import RevealText from '@/components/studio/primitives/RevealText';
import Marquee from '@/components/studio/primitives/Marquee';
import { IN_VIEW, stagger } from '@/lib/motion/presets';

const DOCK_ITEMS = [
  { id: 'home', label: 'Accueil', icon: <Home size={19} /> },
  { id: 'shop', label: 'Boutique', icon: <ShoppingBag size={19} /> },
  { id: 'explore', label: 'Explorer', icon: <Compass size={19} /> },
  { id: 'orders', label: 'Commandes', icon: <Package size={19} /> },
  { id: 'settings', label: 'Réglages', icon: <Settings size={19} /> },
];

const STACK_CARDS = [
  { id: 's1', title: 'Bazin riche brodé', price: '24 000 FCFA', tone: '#D4AF37' },
  { id: 's2', title: 'Panier bogolan', price: '15 500 FCFA', tone: '#00BCD4' },
  { id: 's3', title: 'Boubou indigo', price: '32 000 FCFA', tone: '#22c55e' },
];

/** Galerie : chaque vignette montre une primitive en fonctionnement réel. */
export default function PrimitivesGrid() {
  return (
    <section id="primitives" className="mx-auto max-w-[1280px] px-4 py-20 sm:px-7">
      <div className="mb-10">
        <p className="text-[11px] font-bold uppercase tracking-[.14em] text-gold">Primitives</p>
        <h2 className="mt-2 text-[clamp(24px,4vw,36px)] font-extrabold tracking-[-.025em] text-[#e8edf5]">
          <RevealText text="Survolez, glissez, cliquez." />
        </h2>
        <p className="mt-3 max-w-[540px] text-sm text-[#93aacb]">
          Toutes les démonstrations ci-dessous sont vivantes. Chaque animation se limite à{' '}
          <code className="font-mono text-gold">transform</code> et{' '}
          <code className="font-mono text-gold">opacity</code>, et se coupe si le système demande
          moins de mouvement.
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={IN_VIEW}
        variants={stagger(0.07)}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <DemoTile
          name="SpotlightCard"
          source="primitives/SpotlightCard.tsx"
          note="Halo qui suit le curseur et inclinaison 3D, pilotés par MotionValues — zéro re-render."
        >
          <SpotlightCard className="w-full">
            <div className="p-6">
              <p className="text-sm font-bold text-[#e8edf5]">Passez la souris ici</p>
              <p className="mt-1 text-xs text-[#93aacb]">La carte s’incline vers le curseur.</p>
            </div>
          </SpotlightCard>
        </DemoTile>

        <DemoTile
          name="BorderBeam"
          source="primitives/BorderBeam.tsx"
          note="Un dégradé conique tourne sous un masque annulaire : le bord s’illumine sans repaint."
        >
          <BorderBeam className="w-full">
            <div className="p-6">
              <p className="text-sm font-bold text-[#e8edf5]">Faisceau rotatif</p>
              <p className="mt-1 text-xs text-[#93aacb]">Vitesse et épaisseur réglables.</p>
            </div>
          </BorderBeam>
        </DemoTile>

        <DemoTile
          name="MagneticButton"
          source="primitives/MagneticButton.tsx"
          note="Le bouton est attiré par le curseur sur ressort, et un reflet balaie sa surface."
        >
          <MagneticButton>Commander maintenant</MagneticButton>
        </DemoTile>

        <DemoTile
          name="Dock"
          source="primitives/Dock.tsx"
          note="Loupe façon macOS : la taille de chaque icône dérive de sa distance au curseur."
        >
          <Dock items={DOCK_ITEMS} />
        </DemoTile>

        <DemoTile
          name="CardStack"
          source="primitives/CardStack.tsx"
          note="Glissez la carte du dessus vers la gauche ou la droite : elle repart au fond."
        >
          <CardStack
            className="w-full max-w-[230px]"
            cards={STACK_CARDS.map((c) => ({
              id: c.id,
              content: (
                <div
                  className="rounded-2xl border p-5"
                  style={{
                    borderColor: `${c.tone}55`,
                    // Fond opaque : sinon les cartes enfouies se lisent par transparence.
                    background: `linear-gradient(${c.tone}1f, ${c.tone}1f), #0d1c36`,
                  }}
                >
                  <Heart size={16} style={{ color: c.tone }} />
                  <p className="mt-3 text-sm font-bold text-[#e8edf5]">{c.title}</p>
                  <p className="font-mono text-xs" style={{ color: c.tone }}>
                    {c.price}
                  </p>
                </div>
              ),
            }))}
          />
        </DemoTile>

        <DemoTile
          name="AnimatedTabs"
          source="primitives/AnimatedTabs.tsx"
          note="La pastille active glisse d’un onglet à l’autre via layoutId, sur ressort partagé."
        >
          <AnimatedTabs
            items={[
              { id: 'all', label: 'Tout', count: 248 },
              { id: 'mode', label: 'Mode', count: 96 },
              { id: 'art', label: 'Art', count: 61 },
            ]}
          />
        </DemoTile>

        <DemoTile
          name="NumberTicker"
          source="primitives/NumberTicker.tsx"
          note="Démarre à l’entrée à l’écran et rejoint sa valeur en ressort, sans re-render."
        >
          <p className="text-center font-mono text-[34px] font-bold text-gold">
            <NumberTicker value={6_980_000} suffix=" F" />
          </p>
        </DemoTile>

        <DemoTile
          name="GradientText"
          source="primitives/GradientText.tsx"
          note="Reflet Gold × Cyan animé en CSS pur sur background-position — rien côté JS."
        >
          <p className="text-center text-[30px] font-extrabold tracking-[-.02em]">
            <GradientText>Premium</GradientText>
          </p>
        </DemoTile>

        <DemoTile
          name="Marquee"
          source="primitives/Marquee.tsx"
          note="Boucle sans couture, bords estompés, pause au survol."
          className="sm:col-span-2 lg:col-span-1"
        >
          <Marquee duration={16} className="w-full">
            {['Orange Money', 'Wave', 'Moov', 'Visa', 'Espèces'].map((p) => (
              <span
                key={p}
                className="whitespace-nowrap rounded-lg border border-gold/12 bg-white/[.03] px-4 py-2 text-xs font-bold text-[#93aacb]"
              >
                {p}
              </span>
            ))}
          </Marquee>
        </DemoTile>
      </motion.div>

      <p className="mt-8 text-xs text-[#4f6d8e]">
        Également dans le kit et visibles sur cette page :{' '}
        <code className="font-mono text-gold">AuroraBackground</code> (le fond de l’en-tête),{' '}
        <code className="font-mono text-gold">RevealText</code> (les titres) et{' '}
        <code className="font-mono text-gold">ScrollProgress</code> (la barre tout en haut).
      </p>
    </section>
  );
}
