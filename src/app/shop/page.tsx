import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import FeaturedProducts, { type Product } from '@/components/FeaturedProducts';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Boutique' };

const CATS = [
  { label: 'Tous', value: '' },
  { label: 'Électronique', value: 'electronique' },
  { label: 'Mode', value: 'mode' },
  { label: 'Maison', value: 'maison' },
  { label: 'Sport', value: 'sport' },
  { label: 'Beauté', value: 'beaute' },
  { label: 'Enfants', value: 'enfants' },
];

const SORTS = [
  { label: 'Recommandés', value: '' },
  { label: 'Prix croissant', value: 'price_asc' },
  { label: 'Prix décroissant', value: 'price_desc' },
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

  // Try mifa_products first
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

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{ background: 'var(--sl3)', padding: 'clamp(24px,4vw,40px) 0' }}>
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Boutique</span>
          </div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
            {q ? `Résultats pour "${q}"` : 'Boutique'}
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>
            {products.length} produit{products.length !== 1 ? 's' : ''} trouvé{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 40 }}>
        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24, alignItems: 'center' }}>
          {/* Category chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CATS.map((c) => (
              <Link
                key={c.value}
                href={`/shop?${new URLSearchParams({ ...(q && { q }), ...(c.value && { cat: c.value }), ...(sort && { sort }) }).toString()}`}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  border: '1.5px solid',
                  borderColor: cat === c.value ? 'var(--em)' : 'var(--bg3)',
                  background: cat === c.value ? 'var(--em)' : 'var(--white)',
                  color: cat === c.value ? '#fff' : 'var(--t2)',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                {c.label}
              </Link>
            ))}
          </div>

          {/* Sort */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            {SORTS.map((s) => (
              <Link
                key={s.value}
                href={`/shop?${new URLSearchParams({ ...(q && { q }), ...(cat && { cat }), ...(s.value && { sort: s.value }) }).toString()}`}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: sort === s.value ? 'var(--em)' : 'var(--bg3)',
                  background: sort === s.value ? 'var(--em-l)' : 'var(--white)',
                  color: sort === s.value ? 'var(--em)' : 'var(--t3)',
                  textDecoration: 'none',
                  flexShrink: 0,
                }}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {activeFilters.map((f) => (
              <span key={f} style={{ padding: '3px 10px', borderRadius: 20, background: 'var(--em-l)', color: 'var(--em)', fontSize: 11, fontWeight: 700, border: '1px solid var(--em-g)' }}>
                {f}
              </span>
            ))}
            <Link href="/shop" style={{ padding: '3px 10px', fontSize: 11, color: 'var(--t3)', fontWeight: 600, textDecoration: 'none' }}>
              Réinitialiser ×
            </Link>
          </div>
        )}

        {/* Product grid */}
        <FeaturedProducts products={products} />
      </div>
    </div>
  );
}

