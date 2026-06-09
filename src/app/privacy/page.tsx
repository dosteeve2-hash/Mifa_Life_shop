import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Confidentialité & CGU — Mifa Life',
  description: 'Politique de confidentialité et conditions générales d\'utilisation de Mifa Life.',
};

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'var(--sl3)',
        padding: 'clamp(24px,4vw,48px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(0,137,123,0.06)', pointerEvents: 'none' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 14 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Confidentialité &amp; CGU</span>
          </nav>
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(22px,4vw,34px)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            marginBottom: 8,
          }}>
            Confidentialité &amp; Conditions générales
          </h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            Dernière mise à jour : juin 2025
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ maxWidth: 760 }}>

          {/* Tab nav */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, borderBottom: '1px solid var(--bg3)', paddingBottom: 0 }}>
            {['Confidentialité', 'CGU', 'Cookies'].map((tab, i) => (
              <div
                key={tab}
                style={{
                  padding: '10px 18px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: i === 0 ? 'var(--em)' : 'var(--t3)',
                  borderBottom: i === 0 ? '2px solid var(--em)' : '2px solid transparent',
                  cursor: 'default',
                  marginBottom: -1,
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {[
            {
              title: '1. Qui sommes-nous ?',
              content: 'Mifa Life est une marketplace en ligne opérée par une équipe basée entre Bamako (Mali) et Tokat (Turquie). Nous proposons des produits à la vente et facilitons leur livraison partout au Mali. Contact DPO : privacy@mifa.life',
            },
            {
              title: '2. Données collectées',
              content: 'Nous collectons uniquement les données nécessaires au traitement de vos commandes : nom, prénom, numéro de téléphone, adresse de livraison, historique des commandes. Aucune carte bancaire n\'est stockée sur nos serveurs. Les paiements Orange Money et Wave sont traités directement par ces opérateurs.',
            },
            {
              title: '3. Utilisation des données',
              content: 'Vos données sont utilisées pour : traiter et livrer vos commandes, vous contacter en cas de problème avec votre commande, améliorer nos services et vous proposer des offres personnalisées (si vous y consentez). Nous ne vendons ni ne louons vos données à des tiers.',
            },
            {
              title: '4. Conservation des données',
              content: 'Vos données de commande sont conservées pendant 5 ans conformément aux obligations légales maliennes. Vous pouvez demander la suppression de votre compte et de vos données personnelles à tout moment en contactant notre support.',
            },
            {
              title: '5. Vos droits',
              content: 'Conformément à la législation applicable, vous disposez du droit d\'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à privacy@mifa.life ou via notre formulaire de contact.',
            },
            {
              title: '6. Cookies',
              content: 'Nous utilisons des cookies techniques nécessaires au fonctionnement du site (session, panier) et des cookies analytiques anonymes pour améliorer l\'expérience utilisateur. Aucun cookie de tracking publicitaire n\'est utilisé sans votre consentement explicite.',
            },
            {
              title: '7. Conditions générales d\'utilisation',
              content: 'En utilisant Mifa Life, vous acceptez nos CGU. Les produits sont vendus sous réserve de disponibilité. Les prix sont indiqués en FCFA, toutes taxes comprises. Mifa Life se réserve le droit de modifier ses prix à tout moment. Les commandes sont confirmées par email ou SMS après validation du paiement.',
            },
            {
              title: '8. Responsabilité',
              content: 'Mifa Life s\'engage à proposer des produits conformes à leur description. En cas de non-conformité ou de défaut, notre politique de retour s\'applique. Mifa Life ne saurait être tenu responsable des retards de livraison dus à des événements de force majeure.',
            },
            {
              title: '9. Contact',
              content: 'Pour toute question relative à vos données personnelles ou à nos conditions générales, contactez-nous : Email : privacy@mifa.life | WhatsApp : +223 XX XX XX XX | Adresse : Bamako, Mali',
            },
          ].map((section) => (
            <div key={section.title} style={{ marginBottom: 28 }}>
              <h2 style={{
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--sl)',
                marginBottom: 10,
                paddingBottom: 8,
                borderBottom: '1px solid var(--bg2)',
              }}>
                {section.title}
              </h2>
              <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.8, margin: 0 }}>
                {section.content}
              </p>
            </div>
          ))}

          <div style={{
            marginTop: 40,
            padding: 20,
            background: 'var(--em-l)',
            borderRadius: 12,
            border: '1px solid var(--em-g)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 14,
          }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>🔒</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--em)', marginBottom: 6 }}>
                Votre vie privée nous tient à cœur
              </div>
              <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.7, margin: 0 }}>
                Nous appliquons des standards de sécurité stricts pour protéger vos informations. Si vous avez des questions, notre équipe est disponible pour vous répondre.
              </p>
              <Link href="/contact" style={{ display: 'inline-block', marginTop: 10, fontSize: 12, fontWeight: 700, color: 'var(--em)', textDecoration: 'none' }}>
                Nous contacter →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
