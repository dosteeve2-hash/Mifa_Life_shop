import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'À propos | Mifa Life',
  description: 'Découvrez l\'histoire et la mission de Mifa Life, la boutique e-commerce malienne.',
};

const VALUES = [
  { icon: '🌍', title: 'Ancrage local', desc: 'Nous sélectionnons des produits qui correspondent aux besoins réels des familles maliennes.' },
  { icon: '✨', title: 'Qualité garantie', desc: 'Chaque produit est vérifié avant d\'être proposé à la vente sur notre plateforme.' },
  { icon: '🤝', title: 'Ensemble', desc: 'Notre devise est « Vivez mieux, ensemble ». Nous croyons en la force collective.' },
  { icon: '🚀', title: 'Innovation', desc: 'Nous utilisons les dernières technologies pour simplifier le commerce au Mali.' },
];

const TEAM = [
  { name: 'Donald', role: 'Fondateur & Dev Lead', initials: 'D' },
  { name: 'Équipe Mifa', role: '11 étudiants maliens à Tokat', initials: '11' },
];

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--sl3)', padding: 'clamp(28px,5vw,64px) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(0,151,57,0.07)', pointerEvents: 'none' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>
            <Link href="/" style={{ color: 'inherit' }}>Accueil</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.65)' }}>À propos</span>
          </div>
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(0,151,57,0.15)', border: '1px solid rgba(0,151,57,0.3)', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#6ee7b7', marginBottom: 16, letterSpacing: '.06em' }}>
              🌍 MALI PREMIUM
            </div>
            <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(28px,5.5vw,48px)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
              L&apos;âme de Mifa Life
            </h1>
            <p style={{ fontSize: 'clamp(14px,2.5vw,16px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: 560 }}>
              Mifa Life est né d&apos;une conviction : chaque Malien mérite accès aux meilleurs produits,
              avec une expérience d&apos;achat simple, sécurisée et locale. <em style={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>Vivez mieux, ensemble.</em>
            </p>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 52, paddingBottom: 64 }}>
        {/* Origin story */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 32, marginBottom: 60 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--em)', marginBottom: 10 }}>Notre histoire</div>
            <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: 'var(--sl)', lineHeight: 1.2, marginBottom: 16 }}>
              Nés au Mali,<br />étudiants en Turquie
            </h2>
            <p style={{ fontSize: 14, color: 'var(--t3)', lineHeight: 1.8, marginBottom: 14 }}>
              Nous sommes 11 étudiants maliens basés à Tokat, en Turquie, qui avons décidé de
              construire quelque chose de concret pour notre pays. Mifa Life est notre projet
              de fin d&apos;études — et notre engagement envers le Mali.
            </p>
            <p style={{ fontSize: 14, color: 'var(--t3)', lineHeight: 1.8 }}>
              Le mot <strong style={{ color: 'var(--t1)' }}>Mifa</strong> vient de notre désir de créer des ponts entre
              le Mali et le monde, en apportant les meilleurs produits directement
              dans les foyers maliens via le e-commerce.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { n: '500+', label: 'Clients satisfaits', icon: '😊' },
              { n: '11', label: 'Étudiants fondateurs', icon: '🎓' },
              { n: '2', label: 'Pays (Mali & Turquie)', icon: '🌍' },
              { n: '7j/7', label: 'Support client', icon: '📞' },
            ].map((stat) => (
              <div key={stat.n} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--white)', borderRadius: 12, padding: '14px 18px', boxShadow: 'var(--sh-s)', border: '1px solid var(--bg3)' }}>
                <div style={{ fontSize: 22 }}>{stat.icon}</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--em)', fontFamily: '"Playfair Display",serif', lineHeight: 1 }}>{stat.n}</div>
                  <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 2 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--em)', marginBottom: 8 }}>Ce qui nous guide</div>
          <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 700, color: 'var(--sl)', marginBottom: 28 }}>Nos valeurs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
            {VALUES.map((v) => (
              <div key={v.title} style={{ background: 'var(--white)', borderRadius: 14, padding: '22px', border: '1.5px solid var(--bg3)', transition: 'all .22s' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{v.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 8 }}>{v.title}</div>
                <div style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.7 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div style={{ background: 'var(--em)', borderRadius: 20, padding: 'clamp(28px,5vw,48px)', textAlign: 'center', marginBottom: 56, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(20px,4vw,32px)', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: 14 }}>
              &ldquo;Vivez mieux, ensemble.&rdquo;
            </div>
            <p style={{ fontSize: 'clamp(13px,2.5vw,15px)', color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, maxWidth: 520, margin: '0 auto 24px' }}>
              Notre mission est de démocratiser le e-commerce au Mali en offrant une
              plateforme simple, accessible et de confiance pour tous les Maliens.
            </p>
            <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 24px', background: '#fff', color: 'var(--em)', borderRadius: 10, fontSize: 13, fontWeight: 700, transition: 'all .2s' }}>
              🛍️ Découvrir la boutique
            </Link>
          </div>
        </div>

        {/* CTA contact */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--t3)', marginBottom: 16 }}>Une question, une idée, un projet ?</p>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 24px', background: 'var(--sl)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>
            ✉️ Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
