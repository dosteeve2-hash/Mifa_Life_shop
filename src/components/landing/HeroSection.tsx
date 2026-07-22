'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Star, Truck } from 'lucide-react';

const HERO_IMG = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=85&auto=format&fit=crop';
const BADGES = [
  { icon: '🚀', text: 'Livraison rapide' },
  { icon: '✨', text: 'Produits authentiques' },
  { icon: '🛡️', text: 'Paiement sécurisé' },
  { icon: '🌍', text: '50+ pays livrés' },
];
const AVATARS = [
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=60&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=60&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&q=80',
];

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef   = useRef<HTMLParagraphElement>(null);
  const ctaRef   = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLDivElement>(null);
  const [badge, setBadge] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(titleRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 })
        .fromTo(subRef.current,   { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.55')
        .fromTo(ctaRef.current,   { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.4')
        .fromTo(imgRef.current,   { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 1   }, '-=0.8');
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setBadge((i) => (i + 1) % BADGES.length), 2500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;
    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const rx = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
      const ry = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
      gsap.to(img, { rotateY: rx, rotateX: ry, duration: 0.6, ease: 'power2.out' });
    };
    const onLeave = () => gsap.to(img, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1,0.5)' });
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    return () => {
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section ref={containerRef} style={{ background:'linear-gradient(135deg,#0A1628 0%,#0d1f3c 50%,#0A1628 100%)', minHeight:'clamp(560px,90vh,820px)', position:'relative', overflow:'hidden', display:'flex', alignItems:'center' }}>
      {/* Ambient orbs */}
      <div style={{ position:'absolute', top:'-10%', left:'-5%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(212,175,55,.12) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-10%', right:'10%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,188,212,.10) 0%,transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(212,175,55,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,.03) 1px,transparent 1px)', backgroundSize:'60px 60px', pointerEvents:'none' }} />

      <div className="wrap" style={{ width:'100%', position:'relative', zIndex:1 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,480px),1fr))', gap:'clamp(32px,6vw,80px)', alignItems:'center', padding:'clamp(48px,8vw,96px) 0' }}>

          {/* ── Left: copy ── */}
          <div>
            <div style={{ marginBottom:28 }}>
              <AnimatePresence mode="wait">
                <motion.div key={badge} initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:10 }} transition={{ duration:0.35 }}
                  style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 18px', borderRadius:99, border:'1px solid rgba(212,175,55,.35)', background:'rgba(212,175,55,.08)', fontSize:12, fontWeight:700, color:'#D4AF37', letterSpacing:'0.05em', textTransform:'uppercase', position:'relative', overflow:'hidden' }}>
                  <motion.span animate={{ x:['-150%','250%'] }} transition={{ duration:1.8, repeat:Infinity, ease:'linear', repeatDelay:1 }}
                    style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,transparent,rgba(212,175,55,.3),transparent)', pointerEvents:'none' }} />
                  <span style={{ fontSize:14 }}>{BADGES[badge].icon}</span>
                  {BADGES[badge].text}
                </motion.div>
              </AnimatePresence>
            </div>

            <h1 ref={titleRef} style={{ fontSize:'clamp(36px,6vw,72px)', fontWeight:900, lineHeight:1.05, letterSpacing:'-0.03em', color:'#fff', marginBottom:24, fontFamily:"'Playfair Display',serif" }}>
              La boutique africaine<br />
              <span style={{ background:'linear-gradient(135deg,#D4AF37,#F5D67A,#D4AF37)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>qui vous ressemble</span>
            </h1>

            <p ref={subRef} style={{ fontSize:'clamp(14px,2vw,18px)', color:'rgba(255,255,255,.65)', lineHeight:1.75, maxWidth:480, marginBottom:40 }}>
              Mode africaine authentique, artisanat premium, livraison rapide partout en Afrique. Paiement Orange Money & Wave.
            </p>

            <div ref={ctaRef} style={{ display:'flex', flexWrap:'wrap', gap:16, alignItems:'center' }}>
              <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
                <Link href="/shop" style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'14px 32px', borderRadius:14, background:'linear-gradient(135deg,#D4AF37,#b8962e)', color:'#0A1628', fontWeight:800, fontSize:15, boxShadow:'0 0 32px rgba(212,175,55,.35),0 8px 24px rgba(0,0,0,.3)' }}>
                  <ShoppingBag size={18} />Découvrir la boutique<ArrowRight size={16} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
                <Link href="/categories" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 28px', borderRadius:14, border:'1.5px solid rgba(212,175,55,.35)', color:'rgba(255,255,255,.85)', fontWeight:600, fontSize:15, backdropFilter:'blur(8px)' }}>
                  Explorer les catégories
                </Link>
              </motion.div>
            </div>

            <div style={{ marginTop:40, display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ display:'flex' }}>
                {AVATARS.map((src, i) => (
                  <div key={i} style={{ width:36, height:36, borderRadius:'50%', border:'2px solid #0A1628', overflow:'hidden', marginLeft:i>0?-10:0, position:'relative' }}>
                    <Image src={src} alt="client" fill sizes="36px" style={{ objectFit:'cover' }} />
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display:'flex', gap:2, marginBottom:2 }}>
                  {[1,2,3,4,5].map((s) => <Star key={s} size={11} fill="#D4AF37" color="#D4AF37" />)}
                </div>
                <p style={{ fontSize:12, color:'rgba(255,255,255,.55)', fontWeight:600 }}><span style={{ color:'#D4AF37' }}>25 000+</span> clients satisfaits</p>
              </div>
            </div>
          </div>

          {/* ── Right: image ── */}
          <div style={{ position:'relative', display:'flex', justifyContent:'center', perspective:1200 }}>
            <div ref={imgRef} style={{ position:'relative', width:'100%', maxWidth:460, aspectRatio:'4/5', borderRadius:28, overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,.6),0 0 0 1px rgba(212,175,55,.15)', transformStyle:'preserve-3d' }}>
              <Image src={HERO_IMG} alt="Mode africaine premium" fill sizes="(max-width:900px) 90vw,460px" style={{ objectFit:'cover' }} priority />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(10,22,40,.55) 0%,transparent 50%)' }} />
              <div style={{ position:'absolute', top:20, left:20, display:'flex', alignItems:'center', gap:7, padding:'7px 14px', borderRadius:99, background:'rgba(10,22,40,.85)', backdropFilter:'blur(12px)', border:'1px solid rgba(212,175,55,.25)' }}>
                <motion.span animate={{ scale:[1,1.4,1] }} transition={{ repeat:Infinity, duration:1.5 }} style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e', display:'inline-block' }} />
                <span style={{ fontSize:11, fontWeight:700, color:'#fff', letterSpacing:'0.05em' }}>EN LIGNE · 1 200 actifs</span>
              </div>
              <div style={{ position:'absolute', bottom:20, left:20, right:20, display:'flex', alignItems:'center', gap:10, padding:'12px 16px', borderRadius:16, background:'rgba(10,22,40,.88)', backdropFilter:'blur(12px)', border:'1px solid rgba(212,175,55,.2)' }}>
                <Truck size={20} color="#D4AF37" />
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:'#fff' }}>Livraison express disponible</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,.5)' }}>Bamako J+1 · Afrique 3–7 jours</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
