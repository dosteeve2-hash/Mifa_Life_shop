import type { Metadata } from 'next';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const ARTICLES: Record<string, {
  category: string;
  categoryColor: string;
  date: string;
  readTime: string;
  emoji: string;
  title: string;
  content: string[];
}> = {
  'histoire-mifa-life': {
    category: 'Notre histoire',
    categoryColor: '#00897B',
    date: '12 mai 2025',
    readTime: '5 min',
    emoji: '🌍',
    title: 'Comment 11 étudiants maliens ont créé la boutique de demain',
    content: [
      'Tout a commencé à Tokat, une ville universitaire au cœur de la Turquie. Onze étudiants maliens, venus poursuivre leurs études loin de chez eux, partageaient un constat : commander des produits de qualité et les recevoir au Mali relevait du parcours du combattant.',
      'Entre les frais de douane imprévisibles, les délais de livraison interminables et le manque de confiance des commerçants locaux envers les paiements en ligne, les options étaient limitées. Nous avons décidé de changer ça.',
      'Mifa Life est né de cette frustration collective et de la conviction que le commerce en ligne au Mali méritait mieux. Nous avons passé des mois à étudier les meilleures pratiques des marketplaces mondiales, à comprendre les spécificités du marché malien et à bâtir les relations avec les fournisseurs qu\'il fallait.',
      'Aujourd\'hui, notre plateforme propose des centaines de produits soigneusement sélectionnés, avec une livraison fiable partout au Mali et des modes de paiement adaptés : Orange Money, Wave ou paiement à la livraison.',
      'Notre mission reste la même qu\'au premier jour : rendre le commerce en ligne accessible, fiable et agréable pour chaque Malien, qu\'il soit à Bamako, Sikasso ou Kayes.',
    ],
  },
  'guide-orange-money-wave': {
    category: 'Guide paiement',
    categoryColor: '#FF6B00',
    date: '3 juin 2025',
    readTime: '4 min',
    emoji: '📱',
    title: 'Orange Money & Wave : comment payer en toute sécurité sur Mifa Life',
    content: [
      'Plus besoin de carte bancaire pour faire vos achats sur Mifa Life. Nos deux méthodes de paiement mobile préférées des Maliens sont Orange Money et Wave.',
      'Étape 1 : Choisissez vos produits et ajoutez-les au panier. Une fois prêt, cliquez sur "Passer la commande".',
      'Étape 2 : Sélectionnez "Orange Money" ou "Wave" comme mode de paiement. Vous recevrez un code USSD ou un lien de paiement directement sur votre téléphone.',
      'Étape 3 : Confirmez le paiement depuis votre application mobile. La transaction est sécurisée et vous recevez une confirmation par SMS.',
      'Votre commande est ensuite prise en charge par notre équipe logistique et expédiée dans les 24h ouvrées. Vous recevez un SMS de suivi avec le numéro de votre colis.',
      'En cas de problème avec votre paiement, notre équipe support est disponible 7j/7 pour vous aider.',
    ],
  },
  'tendances-mode-2025': {
    category: 'Mode & Style',
    categoryColor: '#9C27B0',
    date: '28 mai 2025',
    readTime: '6 min',
    emoji: '👗',
    title: 'Les tendances mode 2025 qui font fureur au Mali',
    content: [
      'La mode malienne 2025 est un mélange vibrant entre traditions ancestrales et influences contemporaines. Le wax revisité fait son grand retour, mais dans des coupes modernes et des silhouettes plus épurées.',
      'Les sneakers premium continuent de dominer les tenues urbaines à Bamako. Les marques internationales se mêlent aux créations locales pour des looks uniques.',
      'Du côté des vêtements féminins, les robes à motifs bogolan connaissent un regain d\'intérêt considérable. Les femmes malaffirment leur identité culturelle avec fierté, tout en adoptant des coupes contemporaines.',
      'Pour les hommes, le "Bamako business casual" s\'impose : chemise en tissu local bien coupée, pantalon chino et mocassins. Un style professionnel ancré dans la culture locale.',
      'Chez Mifa Life, nous proposons une sélection actualisée chaque semaine pour refléter ces tendances. Parcourez notre catégorie Mode pour découvrir les dernières arrivées.',
    ],
  },
  'livraison-mali-guide': {
    category: 'Livraison',
    categoryColor: '#0087C3',
    date: '20 mai 2025',
    readTime: '3 min',
    emoji: '🚚',
    title: 'Livraison partout au Mali : zones couvertes et délais réels',
    content: [
      'Nous livrons dans toutes les régions du Mali. Voici les délais moyens selon votre localisation :',
      'Bamako : J+1 à J+2 ouvrés. Nos partenaires logistiques couvrent toutes les communes du district.',
      'Sikasso, Ségou, Mopti : 2 à 3 jours ouvrés. Livraison directe à domicile ou en point relais.',
      'Kayes, Koulikoro, Gao, Tombouctou, Kidal : 3 à 5 jours ouvrés selon l\'accessibilité de la zone.',
      'Chaque commande est suivie via SMS. Vous recevez un message à chaque étape : confirmation, expédition, puis livraison imminente.',
      'En cas de difficultés de livraison dans votre zone, notre équipe vous contacte pour trouver la meilleure solution.',
    ],
  },
  'electronique-2025': {
    category: 'Électronique',
    categoryColor: '#1565C0',
    date: '15 mai 2025',
    readTime: '7 min',
    emoji: '💻',
    title: 'Top 10 des produits électroniques les plus vendus en 2025',
    content: [
      'L\'électronique est la catégorie la plus dynamique de Mifa Life. Voici les 10 produits qui cartonnent le plus en 2025 :',
      '1. Smartphones Android milieu de gamme — Le rapport qualité/prix imbattable séduit toujours autant.',
      '2. Écouteurs Bluetooth sans fil — Devenus indispensables pour les déplacements en transport.',
      '3. Chargeurs solaires portables — Très plébiscités dans les zones avec coupures de courant fréquentes.',
      '4. Tablettes tactiles — Idéales pour les étudiants et les professionnels.',
      '5. Batteries externes haute capacité — Pour ne jamais tomber à court de batterie.',
      '6. Montres connectées — Mode et fonctionnalité réunis.',
      '7. Haut-parleurs Bluetooth portables — Pour la musique en toute circonstance.',
      '8. Câbles et accessoires de charge — Toujours utiles à avoir en stock.',
      '9. Lampes LED solaires — Pour un éclairage économique et fiable.',
      '10. Mini-ventilateurs USB — Pour les chaudes journées maliennes.',
    ],
  },
  'retours-remboursements': {
    category: 'Service client',
    categoryColor: '#2E7D32',
    date: '8 mai 2025',
    readTime: '4 min',
    emoji: '↩️',
    title: 'Retours et remboursements : notre politique en toute transparence',
    content: [
      'Nous voulons que chaque achat sur Mifa Life soit une expérience positive. C\'est pourquoi nous offrons une politique de retour simple et transparente.',
      'Délai de retour : vous avez 14 jours à partir de la réception de votre commande pour initier un retour, sans avoir à vous justifier.',
      'Conditions : le produit doit être dans son état d\'origine, non utilisé, et dans son emballage d\'origine si possible.',
      'Comment retourner : contactez notre service client via WhatsApp ou email. Nous organisons le retour à notre charge pour les produits défectueux ou non conformes.',
      'Remboursement : une fois le retour réceptionné et validé, le remboursement est effectué sur le même moyen de paiement utilisé lors de l\'achat, sous 3 à 5 jours ouvrés.',
      'Pour les échanges (taille, couleur), le délai de traitement est de 2 à 4 jours ouvrés selon la disponibilité du produit.',
    ],
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) return { title: 'Article introuvable — Mifa Life Blog' };
  return {
    title: `${article.title} — Mifa Life Blog`,
    description: article.content[0]?.slice(0, 160),
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const article = ARTICLES[slug];

  if (!article) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <div className="wrap" style={{ paddingTop: 60, paddingBottom: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 700, color: 'var(--sl)', marginBottom: 14 }}>
            Article introuvable
          </h1>
          <p style={{ fontSize: 14, color: 'var(--t3)', marginBottom: 28 }}>
            Cet article n&apos;existe pas ou a été déplacé.
          </p>
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            ← Retour au blog
          </Link>
        </div>
      </div>
    );
  }

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
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 14, flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span style={{ opacity: 0.5 }}>›</span>
            <Link href="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</Link>
            <span style={{ opacity: 0.5 }}>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{article.category}</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: article.categoryColor, padding: '3px 10px', borderRadius: 20 }}>
              {article.category}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>📅 {article.date}</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>⏱ {article.readTime}</span>
          </div>
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(22px,4vw,36px)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            maxWidth: 640,
          }}>
            {article.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) clamp(0px, 30%, 280px)',
          gap: 40,
          alignItems: 'start',
        }}>
          {/* Article body */}
          <article>
            {/* Emoji hero */}
            <div style={{
              height: 220,
              background: `linear-gradient(135deg, ${article.categoryColor}22 0%, ${article.categoryColor}44 100%)`,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 80,
              marginBottom: 32,
            }}>
              {article.emoji}
            </div>

            {article.content.map((para, i) => (
              <p key={i} style={{
                fontSize: 15,
                color: 'var(--t2)',
                lineHeight: 1.8,
                marginBottom: 20,
              }}>
                {para}
              </p>
            ))}

            <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700, color: 'var(--em)', textDecoration: 'none' }}>
                ← Retour au blog
              </Link>
              <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', background: 'var(--em)', color: '#fff', borderRadius: 9, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                Visiter la boutique →
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* About us */}
            <div style={{ background: 'var(--white)', borderRadius: 14, padding: 20, border: '1px solid var(--bg3)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--em)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                À propos
              </div>
              <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.7 }}>
                Mifa Life est la marketplace malienne fondée par 11 étudiants à Tokat, Turquie. Notre mission : rendre le shopping en ligne fiable et accessible au Mali.
              </p>
              <Link href="/about" style={{ display: 'inline-block', marginTop: 12, fontSize: 12, fontWeight: 700, color: 'var(--em)', textDecoration: 'none' }}>
                Notre histoire →
              </Link>
            </div>

            {/* CTA */}
            <div style={{ background: 'linear-gradient(135deg, var(--sl3), #004D40)', borderRadius: 14, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🛍️</div>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                Découvrez nos produits
              </h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 14 }}>
                Des centaines d&apos;articles sélectionnés avec soin.
              </p>
              <Link href="/shop" style={{ display: 'block', padding: '10px 16px', background: 'var(--em)', color: '#fff', borderRadius: 9, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                Boutique →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
