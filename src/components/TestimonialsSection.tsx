'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Fatoumata D.',
    location: 'BAMAKO',
    rating: 5,
    text: 'Livraison ultra rapide, j\'ai reçu ma commande le lendemain. Les produits sont exactement comme décrits. Je recommande vivement Mifa Life Shop !',
    initials: 'FD',
    accent: '#e879f9',
    date: 'il y a 2 jours',
  },
  {
    id: 2,
    name: 'Oumar T.',
    location: 'SIKASSO',
    rating: 5,
    text: 'Paiement via Wave très simple et sécurisé. Le service client m\'a bien accompagné pour choisir le bon produit. Expérience parfaite du début à la fin.',
    initials: 'OT',
    accent: 'var(--cyan)',
    date: 'il y a 1 semaine',
  },
  {
    id: 3,
    name: 'Aïssata K.',
    location: 'MOPTI',
    rating: 4,
    text: 'Très belle sélection de produits maliens et africains. Le packaging est soigné et les prix sont compétitifs. Mon mari et moi sommes de fidèles clients.',
    initials: 'AK',
    accent: 'var(--green)',
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
          fill={i < rating ? '#f0a832' : 'none'}
          color={i < rating ? '#f0a832' : 'var(--border2)'}
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
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function TestimonialsSection() {
  return (
    <section
      className="section"
      style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}
    >
      <div className="wrap">
        <div className="sec-hd">
          <div>
            <div className="sec-eyebrow">Ce qu&apos;ils disent</div>
            <h2 className="sec-ti">Ils nous font confiance.</h2>
            <p style={{ fontSize: 13, color: 'var(--t2)', marginTop: 6, lineHeight: 1.55, fontStyle: 'normal' }}>
              Plus de 500 clients satisfaits nous font confiance chaque jour
            </p>
          </div>
          {/* Rating badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 20px',
            background: 'var(--bg3)',
            border: '1.5px solid var(--border2)',
            borderRadius: 'var(--rl)',
            flexShrink: 0,
          }}>
            <div style={{ textAlign: 'center' as const }}>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: 'var(--gold)', lineHeight: 1 }}>4.9</div>
              <StarRow rating={5} />
              <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--t3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '.06em' }}>
                500+ avis
              </div>
            </div>
          </div>
        </div>

        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(clamp(260px,28vw,360px),1fr))',
            gap: 'clamp(14px,2vw,20px)',
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
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              style={{
                background: 'rgba(17,29,52,0.6)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1.5px solid var(--border2)',
                borderRadius: 'var(--rl)',
                padding: 'clamp(18px,3vw,26px)',
                display: 'flex',
                flexDirection: 'column' as const,
                gap: 16,
                position: 'relative' as const,
                overflow: 'hidden',
                transition: 'border-color 0.22s ease, box-shadow 0.22s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(240,168,50,0.3)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 14px 36px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border2)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              {/* Decorative quote */}
              <div style={{ position: 'absolute', top: 16, right: 18, opacity: 0.05 }}>
                <Quote size={48} color="var(--gold)" />
              </div>

              {/* Stars + date */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <StarRow rating={t.rating} />
                <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--t3)', fontWeight: 600 }}>{t.date}</span>
              </div>

              {/* Quote */}
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.72, flex: 1, fontStyle: 'italic' }}>
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: `${t.accent === 'var(--cyan)' ? 'rgba(45,212,255,0.12)' : t.accent === 'var(--green)' ? 'rgba(34,217,138,0.12)' : 'rgba(232,121,249,0.12)'}`,
                  border: `1.5px solid ${t.accent === 'var(--cyan)' ? 'rgba(45,212,255,0.3)' : t.accent === 'var(--green)' ? 'rgba(34,217,138,0.3)' : 'rgba(232,121,249,0.3)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 800,
                  color: t.accent,
                  flexShrink: 0,
                  letterSpacing: 0.5,
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', fontFamily: "'Outfit', sans-serif" }}>{t.name}</div>
                  <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '.07em' }}>{t.location}, Mali</div>
                </div>
                {/* Verified */}
                <div style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 8px',
                  background: 'rgba(240,168,50,0.08)',
                  border: '1px solid rgba(240,168,50,0.2)',
                  borderRadius: 10,
                  fontSize: 9,
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: 'var(--gold)',
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
