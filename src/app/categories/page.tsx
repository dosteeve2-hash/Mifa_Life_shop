import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Catégories — Mifa Life',
  description: 'Parcourez toutes les catégories de produits disponibles sur Mifa Life.',
};

const FALLBACK_CATS = [
  { name: 'Électronique', slug: 'electronique', icon: '💻', description: 'Smartphones, accessoires, gadgets et plus' },
  { name: 'Mode & Vêtements', slug: 'mode', icon: '👗', description: 'Tenues pour hommes, femmes et enfants' },
  { name: 'Maison & Déco', slug: 'maison', icon: '🏠', description: 'Meubles, décoration et équipements' },
  { name: 'Sport & Loisirs', slug: 'sport', icon: '⚽', description: 'Équipement sportif et articles de loisirs' },
  { name: 'Beauté & Bien-être', slug: 'beaute', icon: '💄', description: 'Cosmétiques, soins et parfums' },
  { name: 'Enfants & Jouets', slug: 'enfants', icon: '🧸', description: 'Jouets, vêtements et accessoires bébé' },
  { name: 'Auto & Moto', slug: 'auto', icon: '🚗', description: 'Accessoires automobiles et deux-roues' },
  { name: 'Alimentation', slug: 'alimentation', icon: '🛒', description: 'Produits alimentaires et boissons' },
];

const GRAD_STARTS = ['#00897B', '#9C27B0', '#1565C0', '#E65100', '#2E7D32', '#F57200', '#37474F', '#0087C3'];

export default async function CategoriesPage() {
  let categories: { name: string; slug: string; icon?: string; description?: string }[] = [];

  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from('mifa_categories')
      .select('name,slug,icon,description')
      .eq('active', true)
      .order('sort_order', { ascending: true });
    if (data && data.length > 0) categories = data as typeof categories;
  } catch { /* fallback */ }

  if (categories.length === 0) categories = FALLBACK_CATS;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--sl3)', padding: 'clamp(28px,5vw,52px) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(0,137,123,0.07)', pointerEvents: 'none' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 16 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <Link href="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>Boutique</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Catégories</span>
          </nav>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(24px,4vw,38px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 10 }}>
            Toutes les catégories
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', maxWidth: 460, lineHeight: 1.65 }}>
            {categories.length} catégories — des milliers de produits soigneusement sélectionnés.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
          {categories.map((cat, i) => {
            const color = GRAD_STARTS[i % GRAD_STARTS.length];
            return (
              <Link key={cat.slug} href={`/shop?cat=${cat.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="blog-card">
                  <div style={{ height: 110, background: `linear-gradient(135deg, ${color}20 0%, ${color}40 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                    {cat.icon ?? '📦'}
                  </div>
                  <div style={{ padding: '16px 18px 20px' }}>
                    <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 17, fontWeight: 700, color: 'var(--sl)', marginBottom: 6 }}>{cat.name}</h2>
                    {cat.description && <p style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.6, marginBottom: 10 }}>{cat.description}</p>}
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--em)' }}>Explorer →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Voir tous les produits →
          </Link>
        </div>
      </div>
    </div>
  );
}
