import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vendeurs | Mifa Life',
  description:
    'La marketplace artisans de MIFA Life est en préparation. Nous recherchons nos premiers vendeurs pilotes.',
};

const POINTS = [
  'Créateurs, artisans et petites marques africaines',
  'Vous gardez la main sur vos prix et vos produits',
  'Nous construisons la plateforme avec nos premiers vendeurs',
];

export default function VendeursPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)',
          padding: 'clamp(32px,5vw,64px) 0',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="wrap">
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'var(--text3)', marginBottom: 16 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <span style={{ color: 'var(--text2)' }}>Vendeurs</span>
          </nav>
          <h1
            style={{
              fontFamily: '"Playfair Display", serif',
              fontStyle: 'italic',
              fontSize: 'clamp(26px,4vw,44px)',
              fontWeight: 900,
              color: 'var(--text)',
              lineHeight: 1.1,
              marginBottom: 12,
            }}
          >
            Marketplace <span style={{ color: 'var(--gold)' }}>Artisans</span>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text2)', maxWidth: 560, lineHeight: 1.7 }}>
            La marketplace est en préparation : aucun vendeur n&apos;est encore référencé. Nous
            recherchons nos premiers vendeurs pilotes.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'grid', gap: 12, maxWidth: 560 }}>
          {POINTS.map((point) => (
            <li
              key={point}
              style={{
                padding: '14px 18px',
                borderRadius: 12,
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                color: 'var(--text2)',
                fontSize: 14,
              }}
            >
              {point}
            </li>
          ))}
        </ul>
        <Link
          href="/seller-register"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            borderRadius: 10,
            background: 'var(--gold)',
            color: 'var(--bg)',
            fontWeight: 700,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          Devenir vendeur pilote
        </Link>
      </div>
    </div>
  );
}
