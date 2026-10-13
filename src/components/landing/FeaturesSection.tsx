'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Truck, Shield, RotateCcw, Headphones, Package, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 'Catalogue', label: 'Produits et catégories', color: '#D4AF37' },
  { value: 'FCFA', label: 'Devise des prix', color: '#00BCD4' },
  { value: 'Panier', label: 'Articles regroupés avant commande', color: '#D4AF37' },
  { value: 'MVP', label: 'Pilote recherché', color: '#00BCD4' },
];

const FEATURES = [
  { icon: Truck,       title: 'Catalogue produits', desc: 'Consultez les produits et catégories disponibles sur la boutique.', color: '#D4AF37' },
  { icon: Shield,      title: 'Prix en FCFA', desc: 'Les prix des produits sont affichés en francs CFA.', color: '#00BCD4' },
  { icon: RotateCcw,   title: 'Panier', desc: 'Regroupez des articles avant de passer commande.', color: '#D4AF37' },
  { icon: Headphones,  title: 'Compte client', desc: 'Créez un compte pour accéder à votre espace client.', color: '#00BCD4' },
  { icon: Package,     title: 'Recherche', desc: 'Recherchez des produits dans le catalogue.', color: '#D4AF37' },
  { icon: Globe,       title: 'MVP — pilote recherché', desc: 'Le produit est en phase de MVP et recherche un pilote.', color: '#00BCD4' },
];

export default function FeaturesSection() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      onEnter: () => gsap.to(el, { scaleX: 1, duration: 1.2, ease: 'power3.out' }),
    });
    gsap.set(el, { scaleX: 0, transformOrigin: 'left center' });
    return () => trigger.kill();
  }, []);

  return (
    <section style={{ background: '#0A1628', padding: 'clamp(64px,10vw,120px) 0', position: 'relative', overflow: 'hidden' }}>
      {/* Background pattern */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(212,175,55,.06) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(212,175,55,.3),transparent)' }} />

      <div className="wrap">

        {/* ── Stats ── */}
        <ScrollReveal direction="up" duration={0.7}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(48px,8vw,80px)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99, border: '1px solid rgba(212,175,55,.3)', background: 'rgba(212,175,55,.06)', fontSize: 11, fontWeight: 700, color: '#D4AF37', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>
              ✦ Le produit
            </div>
            <h2 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 900, color: '#fff', fontFamily: "'Playfair Display',serif", letterSpacing: '-0.02em', marginBottom: 8 }}>
              MIFA Life en pratique
            </h2>
            <div ref={lineRef} style={{ width: 80, height: 3, background: 'linear-gradient(90deg,#D4AF37,#00BCD4)', borderRadius: 99, margin: '20px auto 0' }} />
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 'clamp(16px,3vw,28px)', marginBottom: 'clamp(64px,10vw,100px)' }}>
          {STATS.map((s, i) => (
            <ScrollReveal key={s.label} direction="up" delay={i * 0.12}>
              <div style={{ textAlign: 'center', padding: 'clamp(24px,4vw,36px) 20px', borderRadius: 20, border: '1px solid rgba(255,255,255,.06)', background: 'rgba(255,255,255,.02)', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontSize: 'clamp(30px,4vw,48px)', fontWeight: 900, fontFamily: "'Playfair Display',serif", color: s.color, lineHeight: 1, marginBottom: 8 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* ── Features grid ── */}
        <ScrollReveal direction="up" duration={0.6}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, color: '#fff', fontFamily: "'Playfair Display',serif", textAlign: 'center', marginBottom: 'clamp(32px,5vw,52px)' }}>
            Pourquoi choisir <span style={{ color: '#D4AF37' }}>MIFA Life</span> ?
          </h2>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'clamp(14px,2.5vw,24px)' }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <ScrollReveal key={f.title} direction="up" delay={i * 0.08}>
                <div
                  style={{ padding: 'clamp(20px,3vw,32px)', borderRadius: 20, border: '1px solid rgba(255,255,255,.06)', background: 'rgba(255,255,255,.02)', display: 'flex', flexDirection: 'column', gap: 16, transition: 'border-color 0.22s,box-shadow 0.22s, background 0.22s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${f.color}33`; (e.currentTarget as HTMLDivElement).style.background = `${f.color}06`; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px rgba(0,0,0,.4)`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,.06)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,.02)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}15`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={22} color={f.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{f.title}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', lineHeight: 1.65 }}>{f.desc}</div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
