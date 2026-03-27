import Image from 'next/image';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// ─── Types ───────────────────────────────────────
type Product = {
  id: number;
  name: string;
  price_cfa: number;
  image_url: string | null;
  category: string | null;
};

// ─── Catégories statiques ────────────────────────
const CATEGORIES = [
  { slug: 'electronique',  label: 'Électronique',   icon: '💻' },
  { slug: 'mode',          label: 'Mode',            icon: '👗' },
  { slug: 'maison',        label: 'Maison & Déco',   icon: '🏠' },
  { slug: 'sport',         label: 'Sport',           icon: '⚽' },
  { slug: 'beaute',        label: 'Beauté',          icon: '💄' },
  { slug: 'enfants',       label: 'Enfants',         icon: '🧸' },
  { slug: 'auto',          label: 'Auto & Moto',     icon: '🚗' },
  { slug: 'alimentation',  label: 'Alimentation',    icon: '🛒' },
];

// ─── Page principale ─────────────────────────────
export default async function HomePage() {
  // Fetch produits mis en avant
  let featuredProducts: Product[] = [];
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from('products')
      .select('id, name, price_cfa, image_url, category')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(8);
    featuredProducts = data ?? [];
  } catch (err) {
    console.error('[HomePage] fetch error:', err);
  }

  return (
    <main>

      {/* ══ HERO ══════════════════════════════════ */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-inner">
          <div className="hero-content">

            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              Marketplace · Bamako, Mali
            </div>

            <h1 className="hero-title">
              Tout ce que vous voulez,{' '}
              <em className="hero-title-em">livré au Mali</em>
            </h1>

            <p className="hero-sub">
              Électronique, mode, maison, sport et bien plus —
              commandé depuis votre téléphone, payé par Orange Money ou Wave.
            </p>

            {/* Barre de recherche */}
            <form action="/shop" method="GET" className="hero-search">
              <select name="cat" className="hero-search-cat" aria-label="Catégorie">
                <option value="">Tout</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.label}</option>
                ))}
              </select>
              <input
                name="q"
                type="search"
                placeholder="Rechercher un produit…"
                className="hero-search-input"
                aria-label="Rechercher"
              />
              <button type="submit" className="hero-search-btn" aria-label="Rechercher">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Chercher
              </button>
            </form>

            {/* Chips recherches populaires */}
            <div className="hero-chips">
              {['Téléphone','Ventilateur','Casque audio','Chaussures','Sac'].map((t) => (
                <Link
                  key={t}
                  href={`/shop?q=${encodeURIComponent(t)}`}
                  className="hero-chip"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ BANDE MALI ════════════════════════════ */}
      <div className="mali-stripe-full">
        <span style={{ background: 'var(--mg)' }} />
        <span style={{ background: 'var(--my)' }} />
        <span style={{ background: 'var(--mr)' }} />
      </div>

      {/* ══ CATÉGORIES ════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Explorer</p>
              <h2 className="section-title">Toutes les catégories</h2>
            </div>
            <Link href="/shop" className="section-link">
              Voir tout
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>

          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?cat=${cat.slug}`}
                className="cat-card"
              >
                <div className="cat-icon">{cat.icon}</div>
                <span className="cat-label">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRODUITS EN AVANT ════════════════════ */}
      {featuredProducts.length > 0 && (
        <section className="section section-tinted">
          <div className="container">
            <div className="section-header">
              <div>
                <p className="section-eyebrow">Sélection</p>
                <h2 className="section-title">Nouveautés</h2>
              </div>
              <Link href="/shop" className="section-link">
                Tout voir
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>

            <div className="products-grid">
              {featuredProducts.map((p) => (
                <Link key={p.id} href={`/shop/${p.id}`} className="product-card">
                  <div className="product-card-img">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="product-card-img-placeholder">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="1.2">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                    {p.category && (
                      <span className="product-badge">{p.category}</span>
                    )}
                  </div>
                  <div className="product-card-body">
                    <h3 className="product-card-name">{p.name}</h3>
                    <p className="product-card-price">
                      {new Intl.NumberFormat('fr-FR').format(p.price_cfa)}
                      {' '}<span className="product-card-currency">FCFA</span>
                    </p>
                  </div>
                  <div className="product-card-footer">
                    <span className="btn-buy">Voir le produit</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ COMMENT ÇA MARCHE ════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div>
              <p className="section-eyebrow">Simple & rapide</p>
              <h2 className="section-title">Comment ça marche</h2>
            </div>
          </div>

          <div className="how-grid">
            {[
              {
                n: '1',
                title: 'Choisissez un produit',
                desc: 'Parcourez le catalogue et ajoutez vos articles au panier en un clic.',
              },
              {
                n: '2',
                title: 'Payez en sécurité',
                desc: 'Orange Money, Wave, Moov ou carte bancaire. Paiement sécurisé par escrow.',
              },
              {
                n: '3',
                title: 'Suivi en temps réel',
                desc: 'Suivez votre commande étape par étape jusqu\'à livraison à Bamako.',
              },
              {
                n: '4',
                title: 'Réception garantie',
                desc: 'Votre argent est libéré au vendeur seulement après votre confirmation.',
              },
            ].map((step) => (
              <div key={step.n} className="how-card">
                <div className="how-num">{step.n}</div>
                <h3 className="how-title">{step.title}</h3>
                <p className="how-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PAIEMENTS ════════════════════════════ */}
      <div className="payments-bar">
        <div className="container">
          <p className="payments-label">Paiements acceptés</p>
          <div className="payments-row">
            <div className="pay-item">
              <span className="pay-chip" style={{ background: '#FF6600' }}>Orange Money</span>
            </div>
            <div className="pay-sep" />
            <div className="pay-item">
              <span className="pay-chip" style={{ background: '#00AAFF' }}>Wave</span>
            </div>
            <div className="pay-sep" />
            <div className="pay-item">
              <span className="pay-chip" style={{ background: '#0099CC' }}>Moov Money</span>
            </div>
            <div className="pay-sep" />
            <div className="pay-item">
              <span className="pay-chip" style={{ background: '#1A1F71' }}>Carte bancaire</span>
            </div>
            <div className="pay-sep" />
            <div className="pay-item">
              <span className="pay-chip" style={{ background: 'var(--mg)' }}>
                🔒 Escrow sécurisé
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ CONFIANCE ════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="trust-grid">
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="var(--mg)" strokeWidth="1.8">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                title: 'Paiement escrow',
                desc: 'Votre argent est sécurisé jusqu\'à confirmation de réception.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="var(--mg)" strokeWidth="1.8">
                    <rect x="1" y="3" width="15" height="13" />
                    <path d="M16 8h4l3 5v4h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                ),
                title: 'Livraison au Mali',
                desc: 'Livraison à Bamako et communes. Suivi en temps réel.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="var(--mg)" strokeWidth="1.8">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 .49-3.36" />
                  </svg>
                ),
                title: 'Retour sous 7 jours',
                desc: 'Produit non conforme ? Remboursement garanti.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="var(--mg)" strokeWidth="1.8">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                ),
                title: 'Support local',
                desc: 'Notre équipe est à Bamako, disponible 6j/7.',
              },
            ].map((item, i) => (
              <div key={i} className="trust-card">
                <div className="trust-icon">{item.icon}</div>
                <div>
                  <h3 className="trust-title">{item.title}</h3>
                  <p className="trust-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ════════════════════════════ */}
      <section className="cta-section">
        <div className="cta-geo cta-geo-a" />
        <div className="cta-geo cta-geo-b" />
        <div className="container cta-inner">
          <div className="mali-bar" style={{ margin: '0 auto 1.25rem' }}>
            <span style={{ background: 'var(--mg)' }} />
            <span style={{ background: 'var(--my)' }} />
            <span style={{ background: 'var(--mr)' }} />
          </div>
          <h2 className="cta-title">Commencez à commander aujourd&apos;hui</h2>
          <p className="cta-sub">
            Créez votre compte gratuitement et accédez à des milliers de produits
            livrés directement au Mali.
          </p>
          <div className="cta-btns">
            <Link href="/login" className="cta-btn-white">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Créer un compte gratuit
            </Link>
            <Link href="/shop" className="cta-btn-outline">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Parcourir le catalogue
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
