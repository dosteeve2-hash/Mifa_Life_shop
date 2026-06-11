'use client';

import { useState } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  {
    id: 'commandes', label: '📦 Commandes', items: [
      { q: 'Comment passer une commande ?', a: 'Ajoutez les produits souhaités à votre panier, puis cliquez sur "Commander". Vous pouvez créer un compte ou commander en tant qu\'invité.' },
      { q: 'Puis-je modifier ma commande après validation ?', a: 'Vous pouvez annuler une commande dans les 2 heures suivant la validation. Contactez-nous rapidement via le formulaire de contact.' },
      { q: 'Comment suivre ma commande ?', a: 'Rendez-vous sur la page "Suivi de commande" et entrez votre numéro de commande (format ML-XXXXXX) reçu par email.' },
    ],
  },
  {
    id: 'livraison', label: '🚚 Livraison', items: [
      { q: 'Quels sont vos délais de livraison ?', a: 'Bamako : 1 à 2 jours ouvrés. Sikasso, Mopti, Kayes : 3 à 5 jours. Autres villes : 5 à 7 jours ouvrés.' },
      { q: 'Livrez-vous partout au Mali ?', a: 'Oui, nous livrons dans toutes les villes et communes du Mali. Les délais varient selon la localisation.' },
      { q: 'Combien coûte la livraison ?', a: 'La livraison est gratuite pour toute commande supérieure à 10 000 FCFA à Bamako. Au-delà, un forfait s\'applique selon la zone.' },
    ],
  },
  {
    id: 'paiement', label: '💳 Paiement', items: [
      { q: 'Quels modes de paiement acceptez-vous ?', a: 'Orange Money, Wave, Moov Money, paiement par carte bancaire (Visa/Mastercard) et paiement à la livraison (Bamako seulement).' },
      { q: 'Le paiement en ligne est-il sécurisé ?', a: 'Oui, toutes les transactions sont sécurisées via le protocole SSL/TLS. Vos données bancaires ne sont jamais stockées sur nos serveurs.' },
      { q: 'Puis-je payer à la livraison ?', a: 'Le paiement à la livraison est disponible uniquement pour Bamako et les zones périurbaines, pour les commandes inférieures à 50 000 FCFA.' },
    ],
  },
  {
    id: 'retours', label: '↩️ Retours', items: [
      { q: 'Quelle est la politique de retour ?', a: 'Vous disposez de 14 jours après réception pour retourner un article non utilisé et dans son emballage d\'origine.' },
      { q: 'Comment effectuer un retour ?', a: 'Contactez notre support avec votre numéro de commande. Nous organiserons la collecte ou vous fournirons une étiquette de retour.' },
      { q: 'Quand serai-je remboursé(e) ?', a: 'Le remboursement est effectué sous 5 à 7 jours ouvrés après réception et vérification de l\'article retourné.' },
    ],
  },
];

export default function FAQPage() {
  const [activeCat, setActiveCat] = useState('commandes');
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const cat = CATEGORIES.find((c) => c.id === activeCat) ?? CATEGORIES[0];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--sl3)', padding: 'clamp(28px,5vw,56px) 0' }}>
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>
            <Link href="/" style={{ color: 'inherit' }}>Accueil</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.65)' }}>Centre d&apos;aide</span>
          </div>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(24px,5vw,38px)', fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            Foire aux Questions
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
            Trouvez rapidement les réponses à vos questions.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 36, paddingBottom: 60 }}>
        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => { setActiveCat(c.id); setOpenIdx(null); }}
              style={{
                padding: '8px 16px', borderRadius: 22, fontSize: 12, fontWeight: 700,
                border: '1.5px solid', borderColor: activeCat === c.id ? 'var(--em)' : 'var(--bg3)',
                background: activeCat === c.id ? 'var(--em)' : 'var(--white)',
                color: activeCat === c.id ? '#fff' : 'var(--t2)',
                cursor: 'pointer', transition: 'all .2s',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cat.items.map((item, i) => (
            <div
              key={i}
              style={{ background: 'var(--white)', borderRadius: 12, border: '1.5px solid', borderColor: openIdx === i ? 'var(--em-g)' : 'var(--bg3)', overflow: 'hidden', transition: 'border-color .2s', boxShadow: openIdx === i ? 'var(--sh-s)' : 'none' }}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                style={{ width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)', flex: 1 }}>{item.q}</span>
                <span style={{ fontSize: 18, color: 'var(--em)', fontWeight: 300, flexShrink: 0, transition: 'transform .25s', transform: openIdx === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              {openIdx === i && (
                <div style={{ padding: '0 20px 16px', fontSize: 13, color: 'var(--t3)', lineHeight: 1.75, borderTop: '1px solid var(--bg3)' }}>
                  <div style={{ paddingTop: 14 }}>{item.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div style={{ marginTop: 48, background: 'var(--em-l)', border: '1px solid var(--em-g)', borderRadius: 14, padding: '24px', maxWidth: 720, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>Vous n&apos;avez pas trouvé votre réponse ?</div>
            <div style={{ fontSize: 13, color: 'var(--t3)' }}>Notre équipe répond sous 24h.</div>
          </div>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', background: 'var(--em)', color: '#fff', borderRadius: 9, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>
            ✉️ Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
