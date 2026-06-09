import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog & Actualités — Mifa Life',
  description: 'Actualités, guides et tendances du commerce en ligne au Mali.',
};

const ARTICLES = [
  {
    slug: 'histoire-mifa-life',
    category: 'Notre histoire',
    categoryColor: '#00897B',
    date: '12 mai 2025',
    readTime: '5 min',
    title: 'Comment 11 étudiants maliens ont créé la boutique de demain',
    excerpt: 'Partis étudier en Turquie à Tokat, nous avons rêvé d\'une marketplace qui réunit qualité internationale et livraison fiable au Mali. Voici notre aventure.',
    image: null,
    emoji: '🌍',
    featured: true,
  },
  {
    slug: 'guide-orange-money-wave',
    category: 'Guide paiement',
    categoryColor: '#FF6B00',
    date: '3 juin 2025',
    readTime: '4 min',
    title: 'Orange Money & Wave : comment payer en toute sécurité sur Mifa Life',
    excerpt: 'Pas de carte bancaire ? Pas de problème. Voici le guide complet pour régler vos achats avec Orange Money ou Wave en 3 étapes simples.',
    image: null,
    emoji: '📱',
    featured: false,
  },
  {
    slug: 'tendances-mode-2025',
    category: 'Mode & Style',
    categoryColor: '#9C27B0',
    date: '28 mai 2025',
    readTime: '6 min',
    title: 'Les tendances mode 2025 qui font fureur au Mali',
    excerpt: 'Du wax revisité aux sneakers premium, découvrez les styles qui animent Bamako, Sikasso et Ségou cette saison.',
    image: null,
    emoji: '👗',
    featured: false,
  },
  {
    slug: 'livraison-mali-guide',
    category: 'Livraison',
    categoryColor: '#0087C3',
    date: '20 mai 2025',
    readTime: '3 min',
    title: 'Livraison partout au Mali : zones couvertes et délais réels',
    excerpt: 'Bamako en J+1, régions en 2 à 5 jours. On vous explique comment nous gérons la logistique pour que votre colis arrive intact, même à Kayes.',
    image: null,
    emoji: '🚚',
    featured: false,
  },
  {
    slug: 'electronique-2025',
    category: 'Électronique',
    categoryColor: '#1565C0',
    date: '15 mai 2025',
    readTime: '7 min',
    title: 'Top 10 des produits électroniques les plus vendus en 2025',
    excerpt: 'Smartphones, écouteurs, chargeurs solaires… notre sélection des gadgets qui font le succès de la catégorie électronique sur Mifa Life.',
    image: null,
    emoji: '💻',
    featured: false,
  },
  {
    slug: 'retours-remboursements',
    category: 'Service client',
    categoryColor: '#2E7D32',
    date: '8 mai 2025',
    readTime: '4 min',
    title: 'Retours et remboursements : notre politique en toute transparence',
    excerpt: 'Vous avez 14 jours pour changer d\'avis. Voici exactement comment fonctionne notre procédure de retour, étape par étape.',
    image: null,
    emoji: '↩️',
    featured: false,
  },
];

const CATEGORIES = [
  { label: 'Tous', value: '' },
  { label: 'Notre histoire', value: 'Notre histoire' },
  { label: 'Guides', value: 'Guide' },
  { label: 'Mode', value: 'Mode' },
  { label: 'Tech', value: 'Électronique' },
];

export default function BlogPage() {
  const featured = ARTICLES.find((a) => a.featured);
  const rest = ARTICLES.filter((a) => !a.featured);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'var(--sl3)',
        padding: 'clamp(28px,5vw,56px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(0,137,123,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(0,137,123,0.04)', pointerEvents: 'none' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 16 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span style={{ opacity: 0.5 }}>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Blog</span>
          </nav>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--em)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Actualités &amp; Guides
          </div>
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(26px,5vw,42px)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: 12,
            maxWidth: 560,
          }}>
            Le blog Mifa Life
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, maxWidth: 480 }}>
            Conseils, tendances, guides pratiques et les coulisses de votre marketplace préférée du Mali.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 36, paddingBottom: 60 }}>

        {/* Category filter (cosmetic — no JS routing needed for static blog) */}
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 32 }}>
          {CATEGORIES.map((c) => (
            <span
              key={c.label}
              style={{
                padding: '6px 16px',
                borderRadius: 22,
                fontSize: 12,
                fontWeight: 700,
                border: '1.5px solid',
                borderColor: c.value === '' ? 'var(--em)' : 'var(--bg3)',
                background: c.value === '' ? 'var(--em)' : 'var(--white)',
                color: c.value === '' ? '#fff' : 'var(--t2)',
                cursor: 'pointer',
              }}
            >
              {c.label}
            </span>
          ))}
        </div>

        {/* Featured article */}
        {featured && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 0,
            marginBottom: 40,
            borderRadius: 16,
            overflow: 'hidden',
            background: 'var(--white)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
            border: '1px solid var(--bg3)',
          }}>
            {/* Image placeholder */}
            <div style={{
              minHeight: 280,
              background: 'linear-gradient(135deg, var(--sl3) 0%, #004D40 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 80,
            }}>
              {featured.emoji}
            </div>

            {/* Content */}
            <div style={{ padding: 'clamp(24px,4vw,40px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: featured.categoryColor, padding: '3px 10px', borderRadius: 20 }}>
                  {featured.category}
                </span>
                <span style={{ fontSize: 11, color: 'var(--t4)', fontWeight: 600 }}>
                  Article à la une
                </span>
              </div>
              <h2 style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 'clamp(20px,3vw,28px)',
                fontWeight: 700,
                color: 'var(--sl)',
                lineHeight: 1.25,
                marginBottom: 14,
              }}>
                {featured.title}
              </h2>
              <p style={{ fontSize: 14, color: 'var(--t3)', lineHeight: 1.75, marginBottom: 22 }}>
                {featured.excerpt}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--t4)' }}>
                  <span>📅 {featured.date}</span>
                  <span>⏱ {featured.readTime} de lecture</span>
                </div>
                <Link
                  href={`/blog/${featured.slug}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '10px 20px',
                    background: 'var(--em)',
                    color: '#fff',
                    borderRadius: 9,
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Lire l&apos;article →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Articles grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {rest.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article className="blog-card">
                {/* Image area */}
                <div style={{
                  height: 160,
                  background: `linear-gradient(135deg, ${article.categoryColor}22 0%, ${article.categoryColor}44 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 56,
                }}>
                  {article.emoji}
                </div>

                {/* Body */}
                <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: article.categoryColor,
                      background: `${article.categoryColor}18`,
                      padding: '2px 9px',
                      borderRadius: 20,
                    }}>
                      {article.category}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--t4)' }}>⏱ {article.readTime}</span>
                  </div>

                  <h3 style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--sl)',
                    lineHeight: 1.35,
                    marginBottom: 10,
                    flex: 1,
                  }}>
                    {article.title}
                  </h3>

                  <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.6, marginBottom: 14, WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.excerpt}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--t4)' }}>
                    <span>📅 {article.date}</span>
                    <span style={{ color: 'var(--em)', fontWeight: 700 }}>Lire →</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Newsletter banner */}
        <div style={{
          marginTop: 52,
          padding: 'clamp(28px,5vw,44px)',
          background: 'linear-gradient(135deg, var(--sl3) 0%, #004D40 100%)',
          borderRadius: 18,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📩</div>
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(18px,3vw,24px)', fontWeight: 700, color: '#fff', marginBottom: 10 }}>
              Ne manquez aucun article
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 22, maxWidth: 400, margin: '0 auto 22px' }}>
              Recevez nos guides et actualités directement sur WhatsApp ou par e-mail.
            </p>
            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 28px',
                background: 'var(--em)',
                color: '#fff',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Nous contacter →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
