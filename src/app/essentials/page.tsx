import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Mes essentiels — Mifa Life',
  description: 'Les produits essentiels du quotidien — soigneusement sélectionnés pour vous.',
};

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url?: string;
  category?: string;
  rating?: number;
}

const ESSENTIAL_CATEGORIES = [
  { slug: 'alimentation',   label: 'Alimentation',      icon: '🛒', color: '#2E7D32' },
  { slug: 'beaute',         label: 'Beauté & Soins',    icon: '💄', color: '#AD1457' },
  { slug: 'maison',         label: 'Maison',            icon: '🏠', color: '#E65100' },
  { slug: 'electronique',   label: 'High-tech',         icon: '📱', color: '#1565C0' },
];

const FALLBACK_PRODUCTS: Product[] = [
  { id: '1', name: 'Savon naturel karité', price: 2500, original_price: 3500, category: 'beaute', rating: 4.7 },
  { id: '2', name: 'Huile de cuisine 5L', price: 8500, category: 'alimentation', rating: 4.4 },
  { id: '3', name: 'Chargeur multi-USB', price: 7500, original_price: 9500, category: 'electronique', rating: 4.2 },
  { id: '4', name: 'Savon de Marseille 400g', price: 1800, category: 'beaute', rating: 4.6 },
  { id: '5', name: 'Bougie parfumée', price: 4500, original_price: 6000, category: 'maison', rating: 4.8 },
  { id: '6', name: 'Riz local 25kg', price: 18000, category: 'alimentation', rating: 4.5 },
  { id: '7', name: 'Brosse à dents électrique', price: 15000, original_price: 19000, category: 'beaute', rating: 4.3 },
  { id: '8', name: 'Lampe solaire LED', price: 12500, category: 'electronique', rating: 4.6 },
];

export default async function EssentialsPage() {
  let products: Product[] = [];

  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from('mifa_products')
      .select('id,name,price,original_price,image_url,category,rating')
      .in('category', ['alimentation', 'beaute', 'maison', 'electronique'])
      .order('rating', { ascending: false })
      .limit(12);
    if (data && data.length > 0) products = data as Product[];
  } catch { /* fallback */ }

  if (products.length === 0) products = FALLBACK_PRODUCTS;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--sl3) 0%, #1e3c28 100%)', padding: 'clamp(28px,5vw,52px) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(0,151,57,0.07)', pointerEvents: 'none' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 16 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Mes essentiels</span>
          </nav>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--em)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Sélection quotidienne</div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(24px,4vw,38px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 10 }}>
            Mes essentiels
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', maxWidth: 460, lineHeight: 1.65 }}>
            Les produits indispensables du quotidien — alimentaires, beauté, maison et high-tech.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 36, paddingBottom: 60 }}>
        {/* Category filters */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
          <Link href="/essentials" style={{ padding: '8px 16px', background: 'var(--em)', color: '#fff', borderRadius: 20, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>Tout</Link>
          {ESSENTIAL_CATEGORIES.map(({ slug, label, icon, color }) => (
            <Link key={slug} href={`/shop?cat=${slug}`} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--white)', border: '1.5px solid var(--bg3)', color: 'var(--t2)', borderRadius: 20, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
              {icon} {label}
            </Link>
          ))}
        </div>

        {/* Highlight banner */}
        <div style={{ background: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%)', borderRadius: 16, padding: '20px 24px', marginBottom: 36, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', border: '1px solid #C8E6C9' }}>
          <div style={{ fontSize: 36 }}>🌿</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#2E7D32', marginBottom: 4 }}>Produits locaux à l&apos;honneur</div>
            <p style={{ fontSize: 13, color: '#388E3C', lineHeight: 1.6, margin: 0 }}>Découvrez notre sélection de produits fabriqués au Mali — qualité garantie, prix justes.</p>
          </div>
          <Link href="/shop?local=true" style={{ padding: '9px 18px', background: '#2E7D32', color: '#fff', borderRadius: 9, fontSize: 12, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>Voir les produits locaux</Link>
        </div>

        {/* Products grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 18, marginBottom: 44 }}>
          {products.map((p) => {
            const discount = p.original_price && p.original_price > p.price
              ? Math.round((1 - p.price / p.original_price) * 100)
              : null;
            return (
              <Link key={p.id} href={`/shop/${p.id}`} style={{ textDecoration: 'none' }}>
                <div className="blog-card">
                  <div style={{ height: 160, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52, position: 'relative' }}>
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ opacity: 0.4 }}>📦</span>
                    }
                    {discount && (
                      <span style={{ position: 'absolute', top: 8, left: 8, background: '#E53935', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 6 }}>-{discount}%</span>
                    )}
                  </div>
                  <div style={{ padding: '12px 14px 16px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t2)', marginBottom: 6, lineHeight: 1.4 }}>{p.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--em)' }}>{p.price.toLocaleString('fr')} F</span>
                      {p.original_price && p.original_price > p.price && (
                        <span style={{ fontSize: 12, color: 'var(--t4)', textDecoration: 'line-through' }}>{p.original_price.toLocaleString('fr')} F</span>
                      )}
                    </div>
                    {p.rating && (
                      <div style={{ fontSize: 12, color: 'var(--t4)' }}>⭐ {p.rating.toFixed(1)}</div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Categories showcase */}
        <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 700, color: 'var(--sl)', marginBottom: 20 }}>Explorer par catégorie</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 40 }}>
          {ESSENTIAL_CATEGORIES.map(({ slug, label, icon, color }) => (
            <Link key={slug} href={`/shop?cat=${slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: 'var(--white)', borderRadius: 14, padding: '22px 18px', border: '1px solid var(--bg3)', display: 'flex', alignItems: 'center', gap: 14, transition: 'border-color 0.2s' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--sl)', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 12, color: 'var(--em)', fontWeight: 600 }}>Explorer →</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Voir tous les produits →
          </Link>
        </div>
      </div>
    </div>
  );
}
