'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Fatoumata D.',
    location: 'Bamako',
    rating: 5,
    text: 'Livraison ultra rapide, j\'ai reçu ma commande le lendemain. Les produits sont exactement comme décrits. Je recommande vivement Mifa Life Shop !',
    initials: 'FD',
    color: '#7B1FA2',
    bg: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)',
    date: 'il y a 2 jours',
  },
  {
    id: 2,
    name: 'Oumar T.',
    location: 'Sikasso',
    rating: 5,
    text: 'Paiement via Wave très simple et sécurisé. Le service client m\'a bien accompagné pour choisir le bon produit. Expérience parfaite du début à la fin.',
    initials: 'OT',
    color: '#1565C0',
    bg: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
    date: 'il y a 1 semaine',
  },
  {
    id: 3,
    name: 'Aïssata K.',
    location: 'Mopti',
    rating: 4,
    text: 'Très belle sélection de produits maliens et africains. Le packaging est soigné et les prix sont compétitifs. Mon mari et moi sommes de fidèles clients.',
    initials: 'AK',
    color: '#009A00',
    bg: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
    date: 'il y a 2 semaines',
  },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          fill={i < rating ? '#FFD700' : 'none'}
          color={i < rating ? '#FFD700' : 'var(--bg3)'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function TestimonialsSection() {
  return (
    <section
      className="section"
      style={{ background: 'var(--bg2)', borderTop: '1px solid var(--bg3)' }}
    >
      <div className="wrap">
        <div className="sec-hd">
          <div>
            <div className="sec-eyebrow">Ce qu&apos;ils disent</div>
            <h2 className="sec-ti">Avis de nos clients</h2>
            <p style={{ fontSize: 13, color: 'var(--t3)', marginTop: 6, lineHeight: 1.55 }}>
              Plus de 500 clients satisfaits nous font confiance chaque jour
            </p>
          </div>
          {/* Overall rating badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 18px',
            background: 'var(--white)',
            border: '1.5px solid var(--bg3)',
            borderRadius: 'var(--rl)',
            flexShrink: 0,
          }}>
            <div style={{ textAlign: 'center' as const }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--t1)', lineHeight: 1, fontFamily: '"Playfair Display", serif' }}>4.9</div>
              <StarRow rating={5} />
              <div style={{ fontSize: 10, color: 'var(--t4)', marginTop: 3, fontWeight: 600 }}>500+ avis</div>
            </div>
          </div>
        </div>

        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(260px, 28vw, 360px), 1fr))',
            gap: 'clamp(14px, 2vw, 20px)',
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.id}
              variants={cardVariants}
              whileHover={{ y: -4, boxShadow: '0 14px 36px rgba(0,0,0,0.10)' }}
              transition={{ duration: 0.22 }}
              style={{
                background: 'var(--white)',
                border: '1.5px solid var(--bg3)',
                borderRadius: 'var(--rl)',
                padding: 'clamp(18px, 3vw, 26px)',
                display: 'flex',
                flexDirection: 'column' as const,
                gap: 16,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                position: 'relative' as const,
                overflow: 'hidden',
              }}
            >
              {/* Quote icon decorative */}
              <div style={{
                position: 'absolute',
                top: 16,
                right: 18,
                opacity: 0.07,
              }}>
                <Quote size={48} color="var(--t1)" />
              </div>

              {/* Stars + date */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <StarRow rating={t.rating} />
                <span style={{ fontSize: 10, color: 'var(--t4)', fontWeight: 600 }}>{t.date}</span>
              </div>

              {/* Text */}
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.7, flex: 1 }}>
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Avatar with initials */}
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: t.bg,
                  border: `2px solid ${t.color}44`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 800,
                  color: t.color,
                  flexShrink: 0,
                  letterSpacing: 0.5,
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--t4)', fontWeight: 600 }}>{t.location}, Mali</div>
                </div>
                {/* Verified badge */}
                <div style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 8px',
                  background: 'var(--em-l)',
                  border: '1px solid var(--em-g)',
                  borderRadius: 10,
                  fontSize: 9,
                  fontWeight: 700,
                  color: 'var(--em)',
                }}>
                  ✓ Vérifié
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
