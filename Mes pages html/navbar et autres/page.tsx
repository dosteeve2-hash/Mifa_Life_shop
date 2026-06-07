import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import AddToCartButton from '@/components/AddToCartButton';

export const dynamic = 'force-dynamic';

type Product = {
  id:                number;
  name:              string;
  price_cfa:         number;
  original_price_cfa: number | null;
  stock:             number;
  category:          string | null;
  image_url:         string | null;
  shipping_days:     string;
};

interface Props {
  searchParams: Promise<{ q?: string; cat?: string }>;
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  let products: Product[] = [];
  let categories: string[] = [];

  try {
    const supabase = await createServerSupabaseClient();

    // Produits
    let query = supabase
      .from('products')
      .select('id,name,price_cfa,original_price_cfa,stock,category,image_url,shipping_days')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (params.q)   query = query.ilike('name', `%${params.q}%`);
    if (params.cat) query = query.eq('category', params.cat);

    const { data } = await query;
    products = (data ?? []) as Product[];

    // Catégories distinctes
    const { data: catData } = await supabase
      .from('products')
      .select('category')
      .eq('active', true)
      .not('category', 'is', null);

    categories = [...new Set((catData ?? []).map((r) => r.category).filter(Boolean))] as string[];
  } catch (err) {
    console.error('[ShopPage]', err);
  }

  const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

      {/* ── EN-TÊTE ── */}
      <div className="mb-8">
        <div className="mb-3 h-[3px] w-12 overflow-hidden rounded-full flex">
          <span className="flex-1 bg-[#009739]" />
          <span className="flex-1 bg-[#FCD116]" />
          <span className="flex-1 bg-[#CE1126]" />
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-900">
          {params.cat
            ? params.cat.charAt(0).toUpperCase() + params.cat.slice(1)
            : 'Catalogue'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {products.length} produit{products.length > 1 ? 's' : ''}
          {params.q && <> pour &ldquo;<strong>{params.q}</strong>&rdquo;</>}
        </p>
      </div>

      {/* ── BARRE DE RECHERCHE ── */}
      <form method="GET" action="/shop" className="mb-6 flex gap-2">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="Rechercher un produit…"
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-[#009739] focus:outline-none focus:ring-2 focus:ring-[#009739]/20"
        />
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-[#009739] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#007a2e]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Chercher
        </button>
      </form>

      {/* ── FILTRES CATÉGORIES ── */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <a
            href="/shop"
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
              !params.cat
                ? 'bg-[#009739] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#009739] hover:text-[#009739]'
            }`}
          >
            Tout
          </a>
          {categories.map((cat) => (
            <a
              key={cat}
              href={`/shop?cat=${cat}`}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                params.cat === cat
                  ? 'bg-[#009739] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#009739] hover:text-[#009739]'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </a>
          ))}
        </div>
      )}

      {/* ── GRILLE ── */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="#9ca3af" strokeWidth="1.2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <p className="text-base font-semibold text-gray-600">Aucun produit trouvé</p>
          {(params.q || params.cat) && (
            <a href="/shop" className="mt-4 rounded-xl bg-[#009739] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#007a2e]">
              Voir tout le catalogue
            </a>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {products.map((product) => {
            const discount = product.original_price_cfa && product.original_price_cfa > product.price_cfa
              ? Math.round((1 - product.price_cfa / product.original_price_cfa) * 100)
              : null;

            return (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Image */}
                <a href={`/shop/${product.id}`} className="relative block aspect-square overflow-hidden bg-gray-100">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                        stroke="#d1d5db" strokeWidth="1.2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  )}

                  {/* Badge réduction */}
                  {discount && (
                    <span className="absolute left-2 top-2 rounded-md bg-[#CE1126] px-1.5 py-0.5 text-[10px] font-bold text-white">
                      -{discount}%
                    </span>
                  )}

                  {/* Badge rupture */}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                        Rupture de stock
                      </span>
                    </div>
                  )}

                  {/* Badge stock faible */}
                  {product.stock > 0 && product.stock <= 5 && (
                    <span className="absolute right-2 top-2 rounded-md bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      Plus que {product.stock}
                    </span>
                  )}
                </a>

                {/* Corps */}
                <div className="flex flex-1 flex-col p-3">
                  <a href={`/shop/${product.id}`} className="flex-1">
                    {product.category && (
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {product.category}
                      </p>
                    )}
                    <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
                      {product.name}
                    </h2>
                  </a>

                  {/* Prix */}
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-base font-extrabold text-gray-900">
                      {fmt(product.price_cfa)}
                      <span className="ml-0.5 text-[11px] font-semibold text-gray-400"> FCFA</span>
                    </span>
                    {product.original_price_cfa && product.original_price_cfa > product.price_cfa && (
                      <span className="text-xs text-gray-400 line-through">
                        {fmt(product.original_price_cfa)}
                      </span>
                    )}
                  </div>

                  <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13"/>
                      <path d="M16 8h4l3 5v4h-7V8z"/>
                      <circle cx="5.5" cy="18.5" r="2.5"/>
                      <circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                    Livraison {product.shipping_days ?? '7-14 jours'}
                  </p>

                  {/* Bouton Ajouter */}
                  <div className="mt-3">
                    {product.stock > 0 ? (
                      <AddToCartButton product={product} />
                    ) : (
                      <button
                        disabled
                        className="w-full cursor-not-allowed rounded-xl bg-gray-100 py-2 text-sm font-bold text-gray-400"
                      >
                        Indisponible
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
