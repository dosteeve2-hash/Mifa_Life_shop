'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Headphones, Smartphone } from 'lucide-react';

const ENGAGEMENTS = [
  {
    icon: <ShieldCheck size={26} />,
    title: 'Qualité africaine',
    desc: 'Produits soigneusement sélectionnés auprès de fournisseurs de confiance au Mali et en Afrique de l\'Ouest.',
    color: '#009A00',
    bg: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
    border: '#A5D6A7',
  },
  {
    icon: <Truck size={26} />,
    title: 'Livraison rapide',
    desc: 'Bamako J+1 à J+2, reste du Mali en 2 à 5 jours. Suivi de commande en temps réel.',
    color: '#1565C0',
    bg: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
    border: '#90CAF9',
  },
  {
    icon: <Headphones size={26} />,
    title: 'Support client 7j/7',
    desc: 'Notre équipe est disponible tous les jours pour vous accompagner avant et après votre achat.',
    color: '#7B1FA2',
    bg: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
    border: '#CE93D8',
  },
  {
    icon: <Smartphone size={26} />,
    title: 'Paiement mobile',
    desc: 'Payez facilement via Orange Money, Wave ou à la livraison. Simple, rapide et sécurisé.',
    color: '#E65100',
    bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
    border: '#FFCC80',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

export default function EngagementsSection() {
  return (
    <section
      className="section"
      style={{ background: 'var(--white)', borderTop: '1px solid var(--bg3)', borderBottom: '1px solid var(--bg3)' }}
    >
      <div className="wrap">
        <div className="sec-hd">
          <div>
            <div className="sec-eyebrow">Notre promesse</div>
            <h2 className="sec-ti">Nos engagements</h2>
            <p style={{ fontSize: 13, color: 'var(--t3)', marginTop: 6, lineHeight: 1.55 }}>
              Ce qui nous distingue et vous garantit une expérience d&apos;achat exceptionnelle
            </p>
          </div>
        </div>

        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 22vw, 260px), 1fr))',
            gap: 'clamp(12px, 2vw, 20px)',
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {ENGAGEMENTS.map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              whileHover={{ y: -5, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
              transition={{ duration: 0.22 }}
              style={{
                background: item.bg,
                border: `1.5px solid ${item.border}`,
                borderRadius: 'var(--rl)',
                padding: 'clamp(18px, 3vw, 26px)',
                display: 'flex',
                flexDirection: 'column' as const,
                gap: 14,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                position: 'relative' as const,
                overflow: 'hidden',
              }}
            >
              {/* Decorative corner circle */}
              <div style={{
                position: 'absolute',
                top: -24,
                right: -24,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `${item.border}66`,
                pointerEvents: 'none',
              }} />

              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.85)',
                border: `1.5px solid ${item.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.color,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                position: 'relative' as const,
                zIndex: 1,
                flexShrink: 0,
              }}>
                {item.icon}
              </div>

              <div style={{ position: 'relative' as const, zIndex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: item.color, marginBottom: 6 }}>
                  {item.title}
                </div>
                <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', lineHeight: 1.65 }}>
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
