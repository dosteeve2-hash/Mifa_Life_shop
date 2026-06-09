import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Retours & Remboursements — Mifa Life',
  description: 'Politique de retour et remboursement de Mifa Life. 14 jours pour changer d\'avis.',
};

const STEPS = [
  {
    num: '1',
    title: 'Contactez-nous',
    desc: 'Envoyez-nous un message via WhatsApp, email ou notre formulaire de contact dans les 14 jours suivant la réception.',
    icon: '📩',
  },
  {
    num: '2',
    title: 'Organisez le retour',
    desc: 'Pour les produits défectueux ou non conformes, nous organisons le retour à notre charge. Pour les autres cas, les frais de retour sont à votre charge.',
    icon: '📦',
  },
  {
    num: '3',
    title: 'Validation',
    desc: 'Une fois le produit réceptionné et inspecté (2 à 3 jours ouvrés), nous validons le retour et traitons le remboursement.',
    icon: '✅',
  },
  {
    num: '4',
    title: 'Remboursement',
    desc: 'Le remboursement est effectué sur le même moyen de paiement (Orange Money, Wave, ou espèces) sous 3 à 5 jours ouvrés.',
    icon: '💰',
  },
];

const FAQS = [
  {
    q: 'Dans quel état dois-je retourner le produit ?',
    a: 'Le produit doit être dans son état d\'origine, non utilisé, avec tous ses accessoires et son emballage d\'origine si possible.',
  },
  {
    q: 'Que faire si le produit est défectueux ?',
    a: 'Contactez-nous immédiatement avec des photos ou vidéos du défaut. Nous prendrons en charge tous les frais de retour et prioritiserons votre dossier.',
  },
  {
    q: 'Puis-je changer mon produit contre un autre ?',
    a: 'Oui ! Les échanges (taille, couleur, modèle) sont possibles dans la limite des stocks disponibles. Délai de traitement : 2 à 4 jours ouvrés.',
  },
  {
    q: 'Et si le colis est arrivé endommagé ?',
    a: 'Prenez des photos du colis et du produit à la réception, puis contactez-nous dans les 24h. Nous gérons directement le litige avec notre transporteur.',
  },
  {
    q: 'Les promotions sont-elles remboursées au prix soldé ou original ?',
    a: 'Les remboursements sont effectués au prix payé lors de la commande, incluant toute réduction appliquée.',
  },
];

export default function ReturnsPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'var(--sl3)',
        padding: 'clamp(28px,5vw,52px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(0,137,123,0.06)', pointerEvents: 'none' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 16 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Retours &amp; Remboursements</span>
          </nav>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--em)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Politique de retour
          </div>
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(24px,4vw,38px)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            marginBottom: 12,
          }}>
            Retours &amp; Remboursements
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', maxWidth: 480, lineHeight: 1.65 }}>
            Votre satisfaction est notre priorité. Vous disposez de <strong style={{ color: '#6ee7b7' }}>14 jours</strong> pour retourner un article sans justification.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 48, paddingBottom: 60 }}>
        {/* Key info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 52 }}>
          {[
            { icon: '📅', title: '14 jours', sub: 'pour retourner un article' },
            { icon: '🚚', title: 'Retour gratuit', sub: 'pour produits défectueux' },
            { icon: '⚡', title: '3-5 jours', sub: 'pour être remboursé' },
            { icon: '📱', title: 'Orange Money & Wave', sub: 'remboursement sur votre compte' },
          ].map((card) => (
            <div key={card.title} style={{
              background: 'var(--white)',
              borderRadius: 14,
              padding: '20px 18px',
              textAlign: 'center',
              border: '1px solid var(--bg3)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{card.icon}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--sl)', marginBottom: 5 }}>{card.title}</div>
              <div style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.5 }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--em)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Processus
          </div>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 700, color: 'var(--sl)', marginBottom: 28 }}>
            Comment retourner un produit ?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {STEPS.map((step) => (
              <div key={step.num} style={{
                background: 'var(--white)',
                borderRadius: 14,
                padding: '24px 20px',
                border: '1px solid var(--bg3)',
                position: 'relative',
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{step.icon}</div>
                <div style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--em-l)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 800,
                  color: 'var(--em)',
                }}>
                  {step.num}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--sl)', marginBottom: 8 }}>{step.title}</div>
                <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--em)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Questions fréquentes
          </div>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 700, color: 'var(--sl)', marginBottom: 24 }}>
            Vos questions, nos réponses
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                background: 'var(--white)',
                borderRadius: 12,
                padding: '18px 20px',
                border: '1px solid var(--bg3)',
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--sl)', marginBottom: 8 }}>
                  ❓ {faq.q}
                </div>
                <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div style={{
          background: 'linear-gradient(135deg, var(--sl3) 0%, #004D40 100%)',
          borderRadius: 16,
          padding: 'clamp(24px,4vw,40px)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 14 }}>💬</div>
          <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(18px,3vw,24px)', fontWeight: 700, color: '#fff', marginBottom: 10 }}>
            Une question sur votre retour ?
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 22 }}>
            Notre équipe est disponible 7j/7 pour vous accompagner.
          </p>
          <Link
            href="/contact"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 26px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
          >
            Nous contacter →
          </Link>
        </div>
      </div>
    </div>
  );
}
