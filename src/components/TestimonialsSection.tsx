'use client';

import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Aminata K.',
    initials: 'AK',
    rating: 5,
    text: "Les tissus kente revisités sont absolument magnifiques. Qualité impeccable, livraison rapide à Abidjan.",
    accentBg: 'rgba(212,175,55,0.15)',
    accentBorder: 'rgba(212,175,55,0.4)',
    accentText: '#d4af37',
  },
  {
    id: 2,
    name: 'Kwame D.',
    initials: 'KD',
    rating: 5,
    text: "Enfin une marque africaine qui allie tradition et modernité. Je porte leur dashiki chaque weekend.",
    accentBg: 'rgba(0,180,216,0.12)',
    accentBorder: 'rgba(0,180,216,0.35)',
    accentText: '#00b4d8',
  },
  {
    id: 3,
    name: 'Fatoumata S.',
    initials: 'FS',
    rating: 5,
    text: "Service impeccable. La robe wax que j'ai commandée était exactement comme sur les photos.",
    accentBg: 'rgba(212,175,55,0.15)',
    accentBorder: 'rgba(212,175,55,0.4)',
    accentText: '#d4af37',
  },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < rating ? '#d4af37' : 'none'}
          stroke={i < rating ? '#d4af37' : '#3a4a6b'}
          strokeWidth="1.5"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const headVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function TestimonialsSection() {
  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #0d1b2e 0%, #0a1220 100%)',
        borderTop: '1px solid rgba(212,175,55,0.12)',
        padding: 'clamp(56px, 8vw, 96px) 0',
      }}
    >
      <div className="wrap">
        <motion.div
          variants={headVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{ marginBottom: 'clamp(32px,5vw,56px)' }}
        >
          <div style={{
            display: 'inline-block',
            fontSize: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            letterSpacing: '.12em',
            textTransform: 'uppercase' as const,
            color: '#d4af37',
            background: 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: 4,
            padding: '4px 10px',
            marginBottom: 14,
          }}>
            Avis clients
          </div>
          <h2 style={{
            fontSize: 'clamp(24px,4vw,38px)',
            fontWeight: 800,
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            color: '#f5ede0',
            lineHeight: 1.15,
            margin: 0,
          }}>
            Ce qu&apos;ils portent.<br />
            <span style={{ color: '#d4af37' }}>Ce qu&apos;ils disent.</span>
          </h2>
          <p style={{
            fontSize: 13,
            color: 'rgba(245,237,224,0.55)',
            marginTop: 12,
            lineHeight: 1.65,
            maxWidth: 460,
          }}>
            Mode africaine contemporaine — des vêtements qui parlent, des clients qui témoignent.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(260px, 28vw, 360px), 1fr))',
            gap: 'clamp(14px, 2vw, 22px)',
          }}
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.id}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.22 }}
              style={{
                background: '#1e3a5f',
                border: '1.5px solid rgba(212,175,55,0.14)',
                borderRadius: 14,
                padding: 'clamp(20px, 3vw, 28px)',
                display: 'flex',
                flexDirection: 'column' as const,
                gap: 18,
                position: 'relative' as const,
                overflow: 'hidden',
                transition: 'border-color 0.22s ease, box-shadow 0.22s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,175,55,0.35)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.45)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,175,55,0.14)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              {/* Decorative top glow */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)',
              }} />

              {/* Stars */}
              <StarRow rating={t.rating} />

              {/* Quote */}
              <p style={{
                fontSize: 14,
                color: '#d4af37',
                lineHeight: 1.75,
                fontStyle: 'italic',
                flex: 1,
                margin: 0,
              }}>
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: t.accentBg,
                  border: `1.5px solid ${t.accentBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 800,
                  color: t.accentText,
                  flexShrink: 0,
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: 0.5,
                }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#f5ede0',
                    fontFamily: "'Outfit', sans-serif",
                  }}>
                    {t.name}
                  </div>
                  <div style={{
                    fontSize: 9,
                    fontFamily: "'JetBrains Mono', monospace",
                    color: 'rgba(245,237,224,0.4)',
                    fontWeight: 700,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '.07em',
                    marginTop: 2,
                  }}>
                    Client vérifié ✓
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
