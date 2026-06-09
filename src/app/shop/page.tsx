import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import FeaturedProducts, { type Product } from '@/components/FeaturedProducts';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Boutique — Mifa Life Shop' };

const CATS = [
  { label: 'Tous', value: '', icon: '🛍️' },
  { label: 'Électronique', value: 'electronique', icon: '💻' },
  { label: 'Mode', value: 'mode', icon: '👗' },
  { label: 'Maison', value: 'maison', icon: '🏠' },
  { label: 'Sport', value: 'sport', icon: '⚽' },
  { label: 'Beauté', value: 'beaute', icon: '💄' },
  { label: 'Enfants', value: 'enfants', icon: '🧸' },
];

const SORTS = [
  { label: 'Recommandés', value: '' },
  { label: 'Prix ↑', value: 'price_asc' },
  { label: 'Prix ↓', value: 'price_desc' },
  { label: 'Nouveautés', value: 'newest' },
];

interface PageProps {
  searchParams: Promise<{ q?: string; cat?: string; sort?: string }>;
}

interface MifaProduct {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  category?: string;
  images?: string[];
  stock?: number;
  featured?: boolean;
  shipping_days?: number;
}

interface SimpleProduct {
  id: number;
  name: string;
  price_cfa: number;
  original_price_cfa?: number;
  stock?: number;
  category?: string;
  image_url?: string;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q ?? '';
  const cat = params.cat ?? '';
  const sort = params.sort ?? '';

  let products: Product[] = [];

  try {
    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from('mifa_products')
      .select('id,name,price,original_price,category,images,stock,featured,shipping_days')
      .eq('active', true);

    if (q) query = query.ilike('name', `%${q}%`);
    if (cat) query = query.ilike('category', `%${cat}%`);
    if (sort === 'price_asc') query = query.order('price', { ascending: true });
    else if (sort === 'price_desc') query = query.order('price', { ascending: false });
    else query = query.order('featured', { ascending: false });

    const { data: mifaData } = await query;

    if (mifaData && mifaData.length > 0) {
      products = (mifaData as MifaProduct[]).map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        original_price: p.original_price,
        category: p.category,
        images: p.images,
        featured: p.featured,
        shipping_days: p.shipping_days,
        stock: p.stock,
      }));
    } else {
      let q2 = supabase
        .from('products')
        .select('id,name,price_cfa,original_price_cfa,stock,category,image_url')
        .eq('active', true);
      if (q) q2 = q2.ilike('name', `%${q}%`);
      if (cat) q2 = q2.ilike('category', `%${cat}%`);
      if (sort === 'price_asc') q2 = q2.order('price_cfa', { ascending: true });
      else if (sort === 'price_desc') q2 = q2.order('price_cfa', { ascending: false });

      const { data: simpleData } = await q2;
      if (simpleData) {
        products = (simpleData as SimpleProduct[]).map((p) => ({
          id: p.id,
          name: p.name,
          price_cfa: p.price_cfa,
          original_price_cfa: p.original_price_cfa,
          category: p.category,
          image_url: p.image_url,
          stock: p.stock,
        }));
      }
    }
  } catch {
    // Supabase unavailable — render empty product grid
  }

  const activeFilters = [q && `"${q}"`, cat && `Catégorie: ${cat}`, sort && `Tri: ${sort}`].filter(Boolean);
  const hasResults = products.length > 0;
  const activeCatLabel = CATS.find((c) => c.value === cat)?.label ?? 'Tous';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{
        background: 'var(--sl3)',
        padding: 'clamp(24px,4vw,48px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circle */}
        <div style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 240,
          height: 240,
          borderRadius: '50%',
          background: 'rgba(0,137,123,0.06)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -40,
          left: -40,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'rgba(0,137,123,0.04)',
          pointerEvents: 'none',
        }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>
              Accueil
            </Link>
            <span style={{ opacity: 0.5 }}>›</span>
            <span style={{ color: 'rgba(255,255,255,0.65)' }}>Boutique</span>
            {cat && (
              <>
                <span style={{ opacity: 0.5 }}>›</span>
                <span style={{ color: 'var(--em)', fontWeight: 600 }}>{activeCatLabel}</span>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 'clamp(22px,4vw,34px)',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                marginBottom: 8,
              }}>
                {q ? `Résultats pour « ${q} »` : cat ? `${activeCatLabel}` : 'Boutique'}
              </h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.42)', lineHeight: 1.55 }}>
                {hasResults
                  ? `${products.length} produit${products.length !== 1 ? 's' : ''} disponible${products.length !== 1 ? 's' : ''}`
                  : 'Aucun résultat pour cette recherche'}
              </p>
            </div>

            {/* Result count badge */}
            {hasResults && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: 'rgba(0,137,123,0.18)',
                border: '1px solid rgba(0,137,123,0.3)',
                borderRadius: 22,
                fontSize: 12,
                fontWeight: 700,
                color: '#6ee7b7',
                flexShrink: 0,
              }}>
                <span style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#6ee7b7',
                  display: 'inline-block',
                  animation: 'pulse 2s ease-in-out infinite',
                }} />
                {products.length} produit{products.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 40 }}>
        {/* Filters row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          {/* Category chips */}
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', flex: 1 }}>
            {CATS.map((c) => {
              const isActive = cat === c.value;
              return (
                <Link
                  key={c.value}
                  href={`/shop?${new URLSearchParams({ ...(q && { q }), ...(c.value && { cat: c.value }), ...(sort && { sort }) }).toString()}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '7px 15px',
                    borderRadius: 22,
                    fontSize: 12,
                    fontWeight: 700,
                    border: '1.5px solid',
                    borderColor: isActive ? 'var(--em)' : 'var(--bg3)',
                    background: isActive ? 'var(--em)' : 'var(--white)',
                    color: isActive ? '#fff' : 'var(--t2)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 4px 14px rgba(0,137,123,0.25)' : '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  <span style={{ fontSize: 13 }}>{c.icon}</span>
                  {c.label}
                </Link>
              );
            })}
          </div>

          {/* Sort pills */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', flexShrink: 0 }}>
            {SORTS.map((s) => {
              const isActive = sort === s.value;
              return (
                <Link
                  key={s.value}
                  href={`/shop?${new URLSearchParams({ ...(q && { q }), ...(cat && { cat }), ...(s.value && { sort: s.value }) }).toString()}`}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 700,
                    border: '1.5px solid',
                    borderColor: isActive ? 'var(--em)' : 'var(--bg3)',
                    background: isActive ? 'var(--em-l)' : 'var(--bg)',
                    color: isActive ? 'var(--em)' : 'var(--t3)',
                    textDecoration: 'none',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {s.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--t4)', fontWeight: 600 }}>Filtres actifs :</span>
            {activeFilters.map((f) => (
              <span key={f} style={{
                padding: '3px 10px',
                borderRadius: 20,
                background: 'var(--em-l)',
                color: 'var(--em)',
                fontSize: 11,
                fontWeight: 700,
                border: '1px solid var(--em-g)',
              }}>
                {f}
              </span>
            ))}
            <Link href="/shop" style={{
              padding: '3px 10px',
              fontSize: 11,
              color: 'var(--t3)',
              fontWeight: 700,
              textDecoration: 'none',
              borderRadius: 20,
              border: '1px solid var(--bg3)',
              background: 'var(--white)',
              transition: 'all 0.2s',
            }}>
              ✕ Réinitialiser
            </Link>
          </div>
        )}

        {/* Product grid — empty state handled inside FeaturedProducts */}
        {!hasResults && (q || cat) ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: 'clamp(40px, 8vw, 80px) 20px',
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--bg2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              fontSize: 32,
            }}>
              🔍
            </div>
            <h2 style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(18px, 3vw, 24px)',
              fontWeight: 700,
              color: 'var(--t1)',
              marginBottom: 10,
            }}>
              Aucun résultat trouvé
            </h2>
            <p style={{ fontSize: 14, color: 'var(--t3)', lineHeight: 1.7, maxWidth: 420, marginBottom: 24 }}>
              {q
                ? `Aucun produit ne correspond à « ${q} »${cat ? ` dans la catégorie ${activeCatLabel}` : ''}. Essayez un autre terme ou explorez nos catégories.`
                : `Aucun produit disponible dans la catégorie ${activeCatLabel} pour le moment.`}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/shop" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '11px 22px',
                background: 'var(--em)',
                color: '#fff',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}>
                🛍️ Voir tous les produits
              </Link>
              <Link href="/" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '11px 22px',
                background: 'var(--white)',
                color: 'var(--t2)',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
                border: '1.5px solid var(--bg3)',
                transition: 'all 0.2s',
              }}>
                ← Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        ) : (
          <FeaturedProducts products={products} />
        )}
      </div>
    </div>
  );
}
