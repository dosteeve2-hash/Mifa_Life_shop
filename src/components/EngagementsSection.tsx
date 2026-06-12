'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Headphones, Smartphone } from 'lucide-react';

const ENGAGEMENTS = [
  {
    icon: <ShieldCheck size={24} />,
    title: 'Qualité africaine',
    desc: 'Produits soigneusement sélectionnés auprès de fournisseurs de confiance.',
    accent: 'var(--green)',
    glow: 'rgba(34,217,138,0.10)',
    border: 'rgba(34,217,138,0.20)',
  },
  {
    icon: <Truck size={24} />,
    title: 'Livraison rapide',
    desc: 'Bamako J+1 à J+2, reste du Mali 2 à 5 jours. Suivi en temps réel.',
    accent: 'var(--cyan)',
    glow: 'rgba(45,212,255,0.10)',
    border: 'rgba(45,212,255,0.20)',
  },
  {
    icon: <Headphones size={24} />,
    title: 'Support client 7j/7',
    desc: 'Notre équipe disponible tous les jours pour vous accompagner.',
    accent: '#e879f9',
    glow: 'rgba(232,121,249,0.10)',
    border: 'rgba(232,121,249,0.20)',
  },
  {
    icon: <Smartphone size={24} />,
    title: 'Paiement mobile',
    desc: 'Payez via Orange Money, Wave ou à la livraison. Simple et sécurisé.',
    accent: 'var(--gold)',
    glow: 'rgba(240,168,50,0.10)',
    border: 'rgba(240,168,50,0.20)',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

export default function EngagementsSection() {
  return (
    <section
      className="section"
      style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="wrap">
        <div className="sec-hd">
          <div>
            <div className="sec-eyebrow">Notre promesse</div>
            <h2 className="sec-ti">Nos engagements.</h2>
            <p style={{ fontSize: 13, color: 'var(--t2)', marginTop: 6, lineHeight: 1.55, fontStyle: 'normal' }}>
              Ce qui nous distingue et vous garantit une expérience d&apos;achat exceptionnelle
            </p>
          </div>
        </div>

        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(clamp(200px,22vw,260px),1fr))',
            gap: 'clamp(12px,2vw,18px)',
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
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              style={{
                background: 'var(--bg3)',
                border: '1.5px solid var(--border2)',
                borderRadius: 'var(--rl)',
                padding: 'clamp(18px,3vw,26px)',
                display: 'flex',
                flexDirection: 'column' as const,
                gap: 14,
                transition: 'border-color 0.22s ease, box-shadow 0.22s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = item.border;
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 1px ${item.glow.replace('0.10', '0.15')}, 0 8px 28px rgba(0,0,0,0.4)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border2)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: item.glow,
                border: `1px solid ${item.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: item.accent,
                flexShrink: 0,
              }}>
                {item.icon}
              </div>

              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>
                  {item.title}
                </div>
                <p style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.65, fontStyle: 'normal' }}>
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
