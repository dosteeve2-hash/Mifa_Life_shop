'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Loader2, Circle, ShoppingBag,
  CreditCard, Settings, Truck, Home } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

interface Etape {
  label: string;
  description: string;
  Icon: LucideIcon;
  date: string | null;
}

interface Article {
  nom: string;
  quantite: number;
  prix: number;
}

interface MockOrder {
  numero: string;
  dateCommande: string;
  total: number;
  currentStep: number;
  etapes: Etape[];
  articles: Article[];
  adresse: string;
  methode: string;
}

// ── Mock data generator ───────────────────────────────────────────────────────

function generateOrder(orderId: string): MockOrder {
  const hash = orderId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const suffix = (hash % 9000 + 1000).toString(16).toUpperCase();

  const etapes: Etape[] = [
    {
      label: 'Commande passée',
      description: 'Votre commande a bien été reçue et enregistrée dans notre système.',
      Icon: ShoppingBag,
      date: '12 Jul 2026 — 09:14',
    },
    {
      label: 'Paiement validé',
      description: 'Votre paiement a été confirmé avec succès. Merci !',
      Icon: CreditCard,
      date: '12 Jul 2026 — 10:32',
    },
    {
      label: 'Préparation en cours',
      description: 'Le vendeur prépare soigneusement votre colis.',
      Icon: Settings,
      date: '13 Jul 2026 — 08:15',
    },
    {
      label: 'Expédié',
      description: 'Votre colis a été remis au transporteur pour livraison.',
      Icon: Truck,
      date: null,
    },
    {
      label: 'Livré',
      description: 'Votre commande a été livrée. Merci pour votre achat !',
      Icon: Home,
      date: null,
    },
  ];

  const articles: Article[] = [
    { nom: 'Boubou traditionnel homme', quantite: 1, prix: 25000 },
    { nom: 'Tissu bogolan 6 yards', quantite: 2, prix: 18000 },
  ];

  return {
    numero: `ML-${suffix}`,
    dateCommande: '12 Juillet 2026',
    total: articles.reduce((s, a) => s + a.quantite * a.prix, 0),
    currentStep: 2,
    etapes,
    articles,
    adresse: '42 Rue de la Paix, Ouagadougou, Burkina Faso',
    methode: 'Livraison à domicile (Chronopost BF)',
  };
}

function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

// ── Animation variants ────────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 28 },
  },
};

const fadeUp = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 280, damping: 28, delay },
  },
});

// ── Main component ────────────────────────────────────────────────────────────

export default function TrackingClient({ orderId }: { orderId: string }) {
  const order = generateOrder(orderId);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0d1f3c 100%)',
        padding: 'clamp(24px,4vw,40px) 0' }}>
        <div className="wrap">
          <nav style={{ display: 'flex', gap: 6, fontSize: 12,
            color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
            <Link href="/" style={{ color: 'inherit' }}>Accueil</Link>
            <span>›</span>
            <Link href="/track" style={{ color: 'inherit' }}>Suivi</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'JetBrains Mono, monospace' }}>
              {order.numero}
            </span>
          </nav>
          <h1 style={{ fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: '#fff', marginBottom: 10 }}>
            Suivi de commande
          </h1>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
              N°&nbsp;
              <span style={{ fontFamily: 'JetBrains Mono, monospace',
                color: '#D4AF37', fontWeight: 700 }}>{order.numero}</span>
            </span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
              Passée le&nbsp;
              <span style={{ color: 'rgba(255,255,255,0.8)' }}>{order.dateCommande}</span>
            </span>
            <span style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace',
              color: '#D4AF37', fontWeight: 700 }}>{fmt(order.total)}</span>
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="wrap" style={{ paddingTop: 36, paddingBottom: 60, maxWidth: 740 }}>

        {/* Timeline */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible"
          style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)',
            boxShadow: 'var(--sh-m)', padding: '28px 24px', marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)', marginBottom: 28 }}>
            Suivi en temps réel
          </h2>

          <div style={{ position: 'relative' }}>
            {/* Vertical connector */}
            <div style={{ position: 'absolute', left: 19, top: 22, bottom: 22,
              width: 2, background: 'var(--border)', borderRadius: 2, zIndex: 0 }} />

            {order.etapes.map((etape, i) => {
              const isPast = i < order.currentStep;
              const isCurrent = i === order.currentStep;
              const isFuture = i > order.currentStep;
              const EtapeIcon = etape.Icon;

              return (
                <motion.div key={i} variants={itemVariants}
                  style={{ display: 'flex', gap: 16, marginBottom: i < order.etapes.length - 1 ? 28 : 0,
                    position: 'relative', zIndex: 1 }}>
                  {/* Step circle */}
                  <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isPast ? '#00BCD4' : isCurrent ? '#0A1628' : '#f0f4f9',
                    border: `2px solid ${isPast ? '#00BCD4' : isCurrent ? '#D4AF37' : '#e4ebf5'}`,
                    color: isPast ? '#fff' : isCurrent ? '#D4AF37' : '#b0c0d0',
                    boxShadow: isCurrent ? '0 0 0 5px rgba(212,175,55,0.15)' : 'none' }}>
                    {isPast
                      ? <CheckCircle size={18} />
                      : isCurrent
                        ? <Loader2 size={18} style={{ animation: 'tc-spin 1.2s linear infinite' }} />
                        : <Circle size={18} />}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingTop: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start',
                      justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ fontSize: 14, fontWeight: 700,
                          color: isFuture ? 'var(--t3)' : 'var(--t1)' }}>{etape.label}</span>
                        {!isFuture && (
                          <span style={{ color: isCurrent ? '#D4AF37' : '#00BCD4', opacity: 0.7 }}>
                            <EtapeIcon size={13} />
                          </span>
                        )}
                      </div>
                      {etape.date && (
                        <span style={{ fontSize: 11, color: 'var(--t3)',
                          fontFamily: 'JetBrains Mono, monospace' }}>{etape.date}</span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: isFuture ? 'var(--t3)' : 'var(--t2)',
                      lineHeight: 1.6, margin: 0 }}>{etape.description}</p>
                    {isCurrent && (
                      <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center',
                        gap: 6, fontSize: 11, fontWeight: 700, color: '#D4AF37',
                        background: 'rgba(212,175,55,0.1)', padding: '4px 10px',
                        borderRadius: 20, border: '1px solid rgba(212,175,55,0.3)' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%',
                          background: '#D4AF37', animation: 'tc-pulse 1.5s ease-in-out infinite' }} />
                        En cours
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Articles */}
        <motion.div variants={fadeUp(0.3)} initial="hidden" animate="visible"
          style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)',
            boxShadow: 'var(--sh-s)', overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>Votre commande</h2>
          </div>
          <div style={{ padding: '0 24px' }}>
            {order.articles.map((a, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '14px 0',
                borderBottom: i < order.articles.length - 1 ? '1px solid var(--border)' : 'none',
                gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--bg)',
                    border: '1px solid var(--border)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🛍️</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>
                      {a.nom}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--t3)',
                      fontFamily: 'JetBrains Mono, monospace' }}>Qté : {a.quantite}</div>
                  </div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#D4AF37',
                  fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>
                  {fmt(a.quantite * a.prix)}
                </span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 0', borderTop: '2px solid var(--border)' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>Total</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#D4AF37',
                fontFamily: 'JetBrains Mono, monospace' }}>{fmt(order.total)}</span>
            </div>
          </div>
        </motion.div>

        {/* Livraison */}
        <motion.div variants={fadeUp(0.45)} initial="hidden" animate="visible"
          style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)',
            boxShadow: 'var(--sh-s)', padding: '20px 24px', marginBottom: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)', marginBottom: 16 }}>
            Informations de livraison
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '12px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '.07em', color: 'var(--t3)', marginBottom: 6 }}>Adresse</div>
              <p style={{ fontSize: 13, color: 'var(--t1)', lineHeight: 1.55, margin: 0 }}>
                {order.adresse}
              </p>
            </div>
            <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '12px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '.07em', color: 'var(--t3)', marginBottom: 6 }}>Méthode</div>
              <p style={{ fontSize: 13, color: 'var(--t1)', lineHeight: 1.55, margin: 0 }}>
                {order.methode}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Help buttons */}
        <motion.div variants={fadeUp(0.6)} initial="hidden" animate="visible"
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a
            href={`https://wa.me/22600000000?text=Bonjour%2C%20ma%20commande%20${order.numero}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, padding: '13px 20px', background: '#25D366', color: '#fff',
              borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none',
              minWidth: 180 }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.122 1.524 5.855L0 24l6.29-1.505A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.003-1.37l-.359-.212-3.733.893.927-3.638-.233-.374A9.818 9.818 0 0 1 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
            </svg>
            Besoin d&apos;aide ?
          </a>
          <Link href="/contact"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 8, padding: '13px 20px', background: 'var(--bg)', color: 'var(--t2)',
              borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none',
              border: '1.5px solid var(--border)', minWidth: 180 }}>
            📧 Contacter le support
          </Link>
        </motion.div>

      </div>

      <style>{`
        @keyframes tc-spin  { to { transform: rotate(360deg); } }
        @keyframes tc-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
      `}</style>
    </div>
  );
}
