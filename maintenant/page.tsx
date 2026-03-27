/**
 * MIFA LIFE — LOGIQUE PAGE BOUTIQUE
 * src/app/shop/page.tsx
 *
 * CONSIGNE : Ce fichier remplace UNIQUEMENT la logique de fetch.
 * Le JSX existant (className, structure HTML) est CONSERVÉ.
 * Seuls les données dynamiques changent.
 *
 * Adaptation : remplacez les sections marquées [INSÉRER ICI]
 * dans votre page shop existante.
 */

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

// ─── Types alignés avec votre schema.sql ──────────────────────
export type Product = {
  id:           number;
  name:         string;
  price_cfa:    number;
  original_price_cfa: number | null;
  stock:        number;
  category:     string | null;
  image_url:    string | null;
  featured:     boolean;
  shipping_days: string;
};

export type ShopFilters = {
  q?:   string;   // recherche texte
  cat?: string;   // catégorie
  min?: number;   // prix min
  max?: number;   // prix max
  page?: number;  // pagination
};

const PAGE_SIZE = 20;

// ─── Fonction de fetch principale ────────────────────────────
export async function fetchProducts(filters: ShopFilters = {}): Promise<{
  products: Product[];
  total:    number;
  hasMore:  boolean;
}> {
  const supabase = await createServerSupabaseClient();
  const page = filters.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;
  const to   = from + PAGE_SIZE - 1;

  let query = supabase
    .from('products')
    .select('id,name,price_cfa,original_price_cfa,stock,category,image_url,featured,shipping_days', { count: 'exact' })
    .eq('active', true)
    .order('created_at', { ascending: false })
    .range(from, to);

  // Filtre texte
  if (filters.q) {
    query = query.ilike('name', `%${filters.q}%`);
  }

  // Filtre catégorie
  if (filters.cat) {
    query = query.eq('category', filters.cat);
  }

  // Filtre prix
  if (filters.min) query = query.gte('price_cfa', filters.min);
  if (filters.max) query = query.lte('price_cfa', filters.max);

  const { data, error, count } = await query;

  if (error) {
    console.error('[fetchProducts]', error.message);
    return { products: [], total: 0, hasMore: false };
  }

  const total   = count ?? 0;
  const hasMore = from + PAGE_SIZE < total;

  return {
    products: (data ?? []) as Product[],
    total,
    hasMore,
  };
}

// ─── Fetch produit unique (pour /shop/[id]) ───────────────────
export async function fetchProductById(id: string): Promise<Product | null> {
  const supabase = await createServerSupabaseClient();

  const numId = parseInt(id, 10);
  if (isNaN(numId)) return null;

  const { data, error } = await supabase
    .from('products')
    .select('id,name,price_cfa,original_price_cfa,stock,category,image_url,featured,shipping_days')
    .eq('id', numId)
    .eq('active', true)
    .single();

  if (error || !data) return null;
  return data as Product;
}

// ─── Fetch catégories disponibles ────────────────────────────
export async function fetchCategories(): Promise<string[]> {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('products')
    .select('category')
    .eq('active', true)
    .not('category', 'is', null);

  if (!data) return [];

  const unique = [...new Set(data.map((r) => r.category).filter(Boolean))] as string[];
  return unique.sort();
}

// ─── Fetch produits mis en avant (homepage) ───────────────────
export async function fetchFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('products')
    .select('id,name,price_cfa,original_price_cfa,stock,category,image_url,featured,shipping_days')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  return (data ?? []) as Product[];
}

// ─── Utilitaires formatage ────────────────────────────────────
export function formatPriceCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

export function getDiscountPercent(price: number, original: number | null): number | null {
  if (!original || original <= price) return null;
  return Math.round((1 - price / original) * 100);
}

// ─── Page shop complète (drop-in) ─────────────────────────────
// Copiez ce composant dans src/app/shop/page.tsx
// en conservant vos classNames existants

export const dynamic = 'force-dynamic';

interface ShopPageProps {
  searchParams: Promise<{ q?: string; cat?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const [{ products, total }, categories] = await Promise.all([
    fetchProducts({ q: params.q, cat: params.cat }),
    fetchCategories(),
  ]);

  return (
    // ⚠️  CONSERVEZ VOS CLASSNAMES EXISTANTS
    // Remplacez uniquement les données statiques par les variables ci-dessous

    <main className="shop-main">

      {/* EN-TÊTE — gardez votre structure, changez le texte */}
      <div className="shop-header">
        <h1 className="shop-title">
          {params.cat
            ? params.cat.charAt(0).toUpperCase() + params.cat.slice(1)
            : 'Catalogue'}
        </h1>
        <p className="shop-sub">
          {total} produit{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}
          {params.q && <> pour &ldquo;{params.q}&rdquo;</>}
        </p>
      </div>

      {/* FILTRES CATÉGORIES — boucle sur les vraies catégories */}
      {categories.length > 0 && (
        <div className="shop-filters">
          <a
            href="/shop"
            className={`filter-chip ${!params.cat ? 'filter-chip-active' : ''}`}
          >
            Tout
          </a>
          {categories.map((cat) => (
            <a
              key={cat}
              href={`/shop?cat=${cat}`}
              className={`filter-chip ${params.cat === cat ? 'filter-chip-active' : ''}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </a>
          ))}
        </div>
      )}

      {/* GRILLE PRODUITS — boucle sur les vraies données */}
      {products.length === 0 ? (
        <div className="shop-empty">
          <p>Aucun produit trouvé.</p>
          {params.q || params.cat ? (
            <a href="/shop" className="btn-buy" style={{ display: 'inline-block', marginTop: '1rem' }}>
              Voir tout le catalogue
            </a>
          ) : null}
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <a
              key={product.id}
              href={`/shop/${product.id}`}
              className="product-card"
            >
              {/* Image */}
              <div className="product-card-img">
                {product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image_url}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
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

                {/* Badge stock faible */}
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="product-badge" style={{ background: 'rgba(184,92,56,0.85)' }}>
                    Plus que {product.stock}
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="product-badge" style={{ background: 'rgba(0,0,0,0.7)' }}>
                    Rupture
                  </span>
                )}
              </div>

              {/* Corps */}
              <div className="product-card-body">
                <p className="product-card-name">{product.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p className="product-card-price">
                    {formatPriceCFA(product.price_cfa)}
                  </p>
                  {product.original_price_cfa && product.original_price_cfa > product.price_cfa && (
                    <span style={{ fontSize: '11px', color: '#9cb5a8', textDecoration: 'line-through' }}>
                      {formatPriceCFA(product.original_price_cfa)}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '11px', color: '#9cb5a8', marginTop: '4px' }}>
                  Livraison {product.shipping_days}
                </p>
              </div>

              {/* Footer */}
              <div className="product-card-footer">
                <span className="btn-buy">Voir le produit</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
