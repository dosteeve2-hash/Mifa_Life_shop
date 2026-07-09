'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePostHog } from 'posthog-js/react';

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const posthog = usePostHog();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // No real backend — simulate a brief delay then success
    setTimeout(() => {
      console.log('[MIFA Life Newsletter] New subscriber:', email.trim());
      posthog?.capture('newsletter_signup', { email: email.trim() });
      setSubmitted(true);
      setLoading(false);
    }, 600);
  }

  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #0a1220 0%, #050810 100%)',
        borderTop: '1px solid rgba(212,175,55,0.10)',
        borderBottom: '1px solid rgba(212,175,55,0.10)',
        padding: 'clamp(56px, 8vw, 96px) 0',
      }}
    >
      <div className="wrap">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{
            maxWidth: 580,
            margin: '0 auto',
            textAlign: 'center' as const,
          }}
        >
          {/* Eyebrow */}
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
            marginBottom: 20,
          }}>
            Newsletter
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: 'clamp(22px, 4vw, 36px)',
            fontWeight: 800,
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            color: '#f5ede0',
            lineHeight: 1.2,
            margin: '0 0 14px',
          }}>
            Rejoignez la communauté{' '}
            <span style={{ color: '#d4af37' }}>MIFA Life</span>
          </h2>

          {/* Subtitle */}
          <p style={{
            fontSize: 14,
            color: 'rgba(245,237,224,0.55)',
            lineHeight: 1.7,
            margin: '0 auto 36px',
            maxWidth: 440,
          }}>
            Nouvelles collections, offres exclusives et histoires de l&apos;Afrique créative
            — directement dans votre boîte mail.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 28px',
                background: 'rgba(212,175,55,0.10)',
                border: '1.5px solid rgba(212,175,55,0.35)',
                borderRadius: 10,
                color: '#d4af37',
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              <span>✓</span>
              <span>Merci&nbsp;! Vous êtes dans la liste.</span>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                gap: 0,
                maxWidth: 440,
                margin: '0 auto',
                borderRadius: 10,
                overflow: 'hidden',
                border: '1.5px solid rgba(212,175,55,0.25)',
                background: 'rgba(30,58,95,0.35)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#f5ede0',
                  fontSize: 14,
                  fontFamily: "'Outfit', sans-serif",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '14px 24px',
                  background: loading ? 'rgba(212,175,55,0.5)' : '#d4af37',
                  border: 'none',
                  color: '#0a1220',
                  fontSize: 13,
                  fontWeight: 800,
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: '.04em',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s ease, opacity 0.2s ease',
                  whiteSpace: 'nowrap' as const,
                }}
                onMouseEnter={(e) => {
                  if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#c9a227';
                }}
                onMouseLeave={(e) => {
                  if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#d4af37';
                }}
              >
                {loading ? '…' : "S'abonner"}
              </button>
            </form>
          )}

          {/* Trust note */}
          {!submitted && (
            <p style={{
              fontSize: 11,
              color: 'rgba(245,237,224,0.3)',
              marginTop: 14,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              Pas de spam. Désabonnement en un clic.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
