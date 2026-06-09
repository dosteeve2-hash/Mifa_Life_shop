import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cartes cadeaux — Mifa Life',
  description: 'Offrez une carte cadeau Mifa Life à vos proches.',
};

const AMOUNTS = [
  { value: 5000, label: '5 000', popular: false },
  { value: 10000, label: '10 000', popular: false },
  { value: 25000, label: '25 000', popular: true },
  { value: 50000, label: '50 000', popular: false },
  { value: 100000, label: '100 000', popular: false },
];

export default function GiftCardsPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--sl3) 0%, #1a3a2e 100%)', padding: 'clamp(28px,5vw,56px) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(0,151,57,0.08)', pointerEvents: 'none' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 18 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Cartes cadeaux</span>
          </nav>
          <div style={{ fontSize: 36, marginBottom: 14 }}>🎁</div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(26px,5vw,42px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 12 }}>
            Cartes cadeaux Mifa Life
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', maxWidth: 460, lineHeight: 1.65 }}>
            Faites plaisir à vos proches avec une carte cadeau Mifa Life. Utilisable sur l&apos;ensemble de notre catalogue.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 48, paddingBottom: 60 }}>
        {/* Coming soon banner */}
        <div style={{ background: '#FFF9C4', border: '1.5px solid #FFD700', borderRadius: 14, padding: '20px 24px', marginBottom: 40, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <span style={{ fontSize: 24, flexShrink: 0 }}>🚧</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#E65100', marginBottom: 4 }}>Fonctionnalité en cours de développement</div>
            <p style={{ fontSize: 13, color: '#5D4037', lineHeight: 1.65, margin: 0 }}>
              Les cartes cadeaux numériques seront bientôt disponibles. En attendant, vous pouvez offrir directement des produits à vos proches.
            </p>
          </div>
        </div>

        {/* Denominations */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(20px,3vw,26px)', fontWeight: 700, color: 'var(--sl)', marginBottom: 24 }}>
            Montants disponibles
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {AMOUNTS.map((a) => (
              <div key={a.value} style={{
                background: 'var(--white)',
                borderRadius: 14,
                padding: '24px 20px',
                textAlign: 'center',
                border: a.popular ? '2px solid var(--em)' : '1px solid var(--bg3)',
                boxShadow: a.popular ? '0 4px 20px rgba(0,137,123,0.15)' : '0 2px 10px rgba(0,0,0,0.05)',
                position: 'relative',
              }}>
                {a.popular && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--em)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 12px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                    POPULAIRE
                  </div>
                )}
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--sl)', marginBottom: 4 }}>{a.label}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>FCFA</div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div style={{ background: 'var(--white)', borderRadius: 16, padding: 'clamp(24px,4vw,40px)', border: '1px solid var(--bg3)', marginBottom: 40 }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 700, color: 'var(--sl)', marginBottom: 24 }}>
            Comment ça marche ?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { n: '1', emoji: '🛒', title: 'Choisissez le montant', desc: 'Sélectionnez la valeur qui correspond à votre budget.' },
              { n: '2', emoji: '💳', title: 'Payez en ligne', desc: 'Orange Money, Wave ou à la livraison.' },
              { n: '3', emoji: '📩', title: 'Recevez le code', desc: 'Le code cadeau est envoyé par SMS ou email.' },
              { n: '4', emoji: '🎁', title: 'Offrez-le', desc: 'Le bénéficiaire l\'utilise sur Mifa Life.' },
            ].map((step) => (
              <div key={step.n} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{step.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--sl)', marginBottom: 6 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', marginRight: 12 }}>
            Nous contacter →
          </Link>
          <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'var(--white)', color: 'var(--t2)', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', border: '1.5px solid var(--bg3)' }}>
            Explorer la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}
