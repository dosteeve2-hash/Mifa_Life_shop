'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Fatoumata Diallo',
    location: 'Bamako, Mali',
    rating: 5,
    text: "Livraison ultra rapide, j'ai reçu ma commande le lendemain. Les tissus sont d'une qualité exceptionnelle. MIFA Life a révolutionné ma façon de m'habiller !",
    img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&q=80',
    tag: 'Cliente depuis 2023',
    accent: '#D4AF37',
  },
  {
    id: 2,
    name: 'Oumar Traoré',
    location: 'Sikasso, Mali',
    rating: 5,
    text: "Paiement Wave très simple. Le service client m'a accompagné parfaitement. Les boubous sont identiques aux photos, broderies magnifiques.",
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&q=80',
    tag: 'Client vérifié',
    accent: '#00BCD4',
  },
  {
    id: 3,
    name: 'Aminata Koné',
    location: 'Abidjan, Côte d\'Ivoire',
    rating: 5,
    text: "Je commande depuis l'étranger et tout est parfait. L'emballage est soigné, les délais respectés. La sélection de mode africaine est incroyable !",
    img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=120&q=80',
    tag: 'Cliente internationale',
    accent: '#D4AF37',
  },
  {
    id: 4,
    name: 'Ibrahim Coulibaly',
    location: 'Mopti, Mali',
    rating: 4,
    text: "Très belle plateforme, variété incroyable. Les prix sont honnêtes et les produits sont authentiques. Je recommande à toute ma famille.",
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
    tag: 'Client vérifié',
    accent: '#00BCD4',
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} fill={i < rating ? '#D4AF37' : 'none'} color={i < rating ? '#D4AF37' : 'rgba(255,255,255,.2)'} strokeWidth={1.5} />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [idx, setIdx]   = useState(0);
  const [dir, setDir]   = useState(1);
  const count = TESTIMONIALS.length;

  const go = useCallback((step: number) => {
    setDir(step);
    setIdx((i) => (i + step + count) % count);
  }, [count]);

  const t = TESTIMONIALS[idx];

  return (
    <section style={{ background: 'linear-gradient(180deg,#0A1628 0%,#0c1a30 100%)', padding: 'clamp(64px,10vw,120px) 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(0,188,212,.3),transparent)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,188,212,.05) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      <div className="wrap">
        <ScrollReveal direction="up">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,7vw,72px)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99, border: '1px solid rgba(0,188,212,.3)', background: 'rgba(0,188,212,.06)', fontSize: 11, fontWeight: 700, color: '#00BCD4', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>
              ✦ Témoignages clients
            </div>
            <h2 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900, color: '#fff', fontFamily: "'Playfair Display',serif", letterSpacing: '-0.02em' }}>
              Ils nous font <span style={{ color: '#D4AF37' }}>confiance</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Main carousel */}
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={t.id}
              custom={dir}
              initial={{ x: dir * 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: dir * -60, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ borderRadius: 24, border: `1px solid ${t.accent}30`, background: 'rgba(255,255,255,.03)', backdropFilter: 'blur(12px)', padding: 'clamp(28px,5vw,52px)', position: 'relative', overflow: 'hidden' }}
            >
              {/* Quote icon */}
              <Quote size={60} color={t.accent} style={{ position: 'absolute', top: 24, right: 28, opacity: 0.07 }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <Stars rating={t.rating} />

                <p style={{ fontSize: 'clamp(15px,2.5vw,20px)', color: 'rgba(255,255,255,.85)', lineHeight: 1.75, fontStyle: 'italic', fontFamily: "'Playfair Display',serif" }}>
                  &ldquo;{t.text}&rdquo;
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', position: 'relative', border: `2.5px solid ${t.accent}`, flexShrink: 0 }}>
                    <Image src={t.img} alt={t.name} fill sizes="56px" style={{ objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginBottom: 4 }}>{t.location}</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 99, background: `${t.accent}15`, border: `1px solid ${t.accent}30`, fontSize: 10, fontWeight: 700, color: t.accent, letterSpacing: '0.04em' }}>
                      ✓ {t.tag}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 32 }}>
            <button onClick={() => go(-1)} aria-label="Précédent" style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.04)', color: 'rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#D4AF37'; (e.currentTarget as HTMLButtonElement).style.color = '#D4AF37'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,.12)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,.6)'; }}>
              <ChevronLeft size={20} />
            </button>

            <div style={{ display: 'flex', gap: 8 }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }} aria-label={`Avis ${i + 1}`}
                  style={{ width: i === idx ? 24 : 8, height: 8, borderRadius: 4, background: i === idx ? '#D4AF37' : 'rgba(255,255,255,.2)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
              ))}
            </div>

            <button onClick={() => go(1)} aria-label="Suivant" style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.04)', color: 'rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#D4AF37'; (e.currentTarget as HTMLButtonElement).style.color = '#D4AF37'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,.12)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,.6)'; }}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
