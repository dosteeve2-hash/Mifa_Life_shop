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

  const supabase = await createServerSupabaseClient();
  let products: Product[] = [];

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

  const activeFilters = [q && `"${q}"`, cat && `Catégorie: ${cat}`, sort && `Tri: ${sort}`].filter(Boolean);
  const hasResults = products.length > 0;
  const activeCatLabel = CATS.find((c) => c.value === cat)?.label ?? 'Tous';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)',
        padding: 'clamp(24px,4vw,48px) 0',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(240,168,50,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(45,212,255,0.03)', pointerEvents: 'none' }} />

        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>Accueil</Link>
            <span style={{ opacity: 0.5 }}>›</span>
            <span style={{ color: 'var(--t2)' }}>Boutique</span>
            {cat && (
              <>
                <span style={{ opacity: 0.5 }}>›</span>
                <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{activeCatLabel}</span>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(22px,4vw,34px)',
                fontWeight: 700,
                fontStyle: 'italic',
                color: 'var(--t1)',
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                marginBottom: 8,
              }}>
                {q ? `Résultats pour « ${q} »` : cat ? `${activeCatLabel}` : 'Notre Catalogue'}
              </h1>
              <p style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: 'var(--t3)' }}>
                {hasResults
                  ? `${products.length} produit${products.length !== 1 ? 's' : ''} disponible${products.length !== 1 ? 's' : ''}`
                  : 'Aucun résultat pour cette recherche'}
              </p>
            </div>

            {hasResults && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 14px',
                background: 'rgba(240,168,50,0.08)',
                border: '1px solid rgba(240,168,50,0.2)',
                borderRadius: 22,
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                color: 'var(--gold)',
                flexShrink: 0,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block' }} />
                {products.length} produit{products.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 40 }}>
        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20, alignItems: 'center' }}>
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
                    padding: '7px 14px',
                    borderRadius: 22,
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    border: '1.5px solid',
                    borderColor: isActive ? 'var(--gold)' : 'var(--border2)',
                    background: isActive ? 'var(--gold)' : 'var(--bg3)',
                    color: isActive ? 'var(--bg)' : 'var(--t2)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '.05em',
                  }}
                >
                  <span style={{ fontSize: 13 }}>{c.icon}</span>
                  {c.label}
                </Link>
              );
            })}
          </div>

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
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                    border: '1.5px solid',
                    borderColor: isActive ? 'var(--gold)' : 'var(--border2)',
                    background: isActive ? 'rgba(240,168,50,0.10)' : 'var(--bg3)',
                    color: isActive ? 'var(--gold)' : 'var(--t3)',
                    textDecoration: 'none',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    textTransform: 'uppercase' as const,
                    letterSpacing: '.05em',
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
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--t3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>Filtres :</span>
            {activeFilters.map((f) => (
              <span key={f} style={{
                padding: '3px 10px',
                borderRadius: 20,
                background: 'rgba(240,168,50,0.08)',
                color: 'var(--gold)',
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                border: '1px solid rgba(240,168,50,0.2)',
              }}>
                {f}
              </span>
            ))}
            <Link href="/shop" style={{
              padding: '3px 10px',
              fontSize: 11,
              color: 'var(--t3)',
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
              textDecoration: 'none',
              borderRadius: 20,
              border: '1px solid var(--border2)',
              background: 'var(--bg3)',
              transition: 'all 0.2s',
            }}>
              ✕ Reset
            </Link>
          </div>
        )}

        {/* Grid */}
        {!hasResults && (q || cat) ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'clamp(40px,8vw,80px) 20px' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, border: '1px solid var(--border2)', fontSize: 28 }}>
              🔍
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(18px,3vw,24px)', fontWeight: 700, fontStyle: 'italic', color: 'var(--t1)', marginBottom: 10 }}>
              Aucun résultat trouvé
            </h2>
            <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.7, maxWidth: 420, marginBottom: 24 }}>
              {q
                ? `Aucun produit ne correspond à « ${q} »${cat ? ` dans la catégorie ${activeCatLabel}` : ''}.`
                : `Aucun produit dans la catégorie ${activeCatLabel} pour le moment.`}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 22px', background: 'var(--gold)', color: 'var(--bg)', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', transition: 'background 0.2s' }}>
                Voir tous les produits
              </Link>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 22px', background: 'var(--bg3)', color: 'var(--t2)', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', border: '1.5px solid var(--border2)', transition: 'all 0.2s' }}>
                ← Accueil
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
