import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";
import type { ShopProduct } from "@/lib/types/store";

export const dynamic = "force-dynamic";

type Product = {
  id: number;
  name: string;
  description?: string | null;
  price_cfa: number;
  original_price_cfa?: number | null;
  stock?: number;
  category?: string | null;
  image_url?: string | null;
  featured?: boolean;
  shipping_days?: string | null;
};

type ShopFilters = {
  q?: string;
  cat?: string;
  min?: number;
  max?: number;
  page?: number;
};

const PAGE_SIZE = 20;

async function fetchProducts(filters: ShopFilters = {}): Promise<{
  products: Product[];
  total: number;
  hasMore: boolean;
}> {
  const supabase = await createServerSupabaseClient();
  const page = filters.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("products")
    .select(
      "id,name,description,price_cfa,original_price_cfa,stock,category,image_url,featured,shipping_days",
      { count: "exact" },
    )
    .eq("active", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.q) {
    query = query.ilike("name", `%${filters.q}%`);
  }

  if (filters.cat) {
    query = query.eq("category", filters.cat);
  }

  if (filters.min) query = query.gte("price_cfa", filters.min);
  if (filters.max) query = query.lte("price_cfa", filters.max);

  const { data, error, count } = await query;

  if (error) {
    console.error("[fetchProducts]", error.message);
    return { products: [], total: 0, hasMore: false };
  }

  const total = count ?? 0;
  const hasMore = from + PAGE_SIZE < total;

  return {
    products: (data ?? []) as Product[],
    total,
    hasMore,
  };
}

async function fetchCategories(): Promise<string[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select("category")
    .eq("active", true)
    .not("category", "is", null);

  if (error || !data) return [];

  const unique = [
    ...new Set(
      data
        .map((row) => row.category)
        .filter((value): value is string => typeof value === "string" && value.length > 0),
    ),
  ];

  return unique.sort((a, b) => a.localeCompare(b));
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const params = await searchParams;

  try {
    const [{ products, total }, categories] = await Promise.all([
      fetchProducts({ q: params.q, cat: params.cat }),
      fetchCategories(),
    ]);

    const shopProducts: ShopProduct[] = products.map((product) => ({
      id: String(product.id),
      name: product.name ?? null,
      price_cfa: product.price_cfa ?? null,
      image_url: product.image_url ?? null,
      description: product.description ?? null,
      active: true,
    }));

    return (
      <main>
        <section id="cat-hero">
          <div className="ch-in">
            <div className="ch-row">
              <div>
                <h1 className="ch-title">
                  {params.cat
                    ? params.cat.charAt(0).toUpperCase() + params.cat.slice(1)
                    : "Catalogue Mifa Life"}
                </h1>
                <p className="ch-sub">
                  {total} produit{total > 1 ? "s" : ""} disponible{total > 1 ? "s" : ""}
                  {params.q ? <> pour &ldquo;{params.q}&rdquo;</> : null}
                </p>
              </div>
              <div className="ch-stats">
                <div className="chs">
                  <div className="chs-n">{total}</div>
                  <div className="chs-l">Produits</div>
                </div>
                <div className="chs">
                  <div className="chs-n">{categories.length || 1}</div>
                  <div className="chs-l">Categories</div>
                </div>
                <div className="chs">
                  <div className="chs-n">Live</div>
                  <div className="chs-l">Supabase</div>
                </div>
              </div>
            </div>
            <div className="ch-stripe">
              <span className="bg-[var(--mg)]" />
              <span className="bg-[var(--my)]" />
              <span className="bg-[var(--mr)]" />
            </div>
          </div>
        </section>

        <section id="breadcrumb">
          <div className="bc-in">
            <Link href="/">Accueil</Link>
            <span className="bc-sep">/</span>
            <span className="bc-cur">Catalogue</span>
          </div>
        </section>

        <section id="main">
          <aside id="sidebar">
            <div id="sidebar-inner">
              <div className="filt-hd">
                <h2 className="filt-ti">Filtres</h2>
                <Link href="/shop" className="filt-reset">
                  Reinitialiser
                </Link>
              </div>

              <div className="filt-block">
                <div className="filt-label">Categories</div>
                <div className="fcat">
                  <Link
                    href="/shop"
                    className={`fcat-item ${!params.cat ? "on" : ""}`}
                  >
                    <span>Tous les produits</span>
                    <span className="cnt">{total}</span>
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/shop?cat=${encodeURIComponent(category)}`}
                      className={`fcat-item ${params.cat === category ? "on" : ""}`}
                    >
                      <span>{category}</span>
                      <span className="cnt">Live</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="filt-block">
                <div className="filt-label">Services</div>
                <div className="filt-checks">
                  <label className="fcheck">
                    <span className="fcheck-box" />
                    <span className="fcheck-lbl">Livraison Bamako</span>
                  </label>
                  <label className="fcheck">
                    <span className="fcheck-box" />
                    <span className="fcheck-lbl">Paiement mobile</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          <div id="prod-zone">
            <div className="sort-bar">
              <div className="sort-left">
                <p className="result-count">
                  <b>{total}</b> produits disponibles
                </p>
                <div className="active-filters">
                  {params.cat ? <span className="af-tag">{params.cat}</span> : null}
                  {params.q ? <span className="af-tag">{params.q}</span> : null}
                  {!params.cat && !params.q ? (
                    <>
                      <span className="af-tag">Catalogue Mali</span>
                      <span className="af-tag">Supabase live</span>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="sort-right">
                <select className="sort-sel" defaultValue="recent">
                  <option value="recent">Plus recent</option>
                  <option value="price">Prix</option>
                </select>
              </div>
            </div>

            {shopProducts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-ico">?</div>
                <div className="empty-ti">Aucun produit trouve</div>
                <div className="empty-sub">
                  {params.q || params.cat
                    ? "Essayez un autre filtre ou revenez au catalogue complet."
                    : "Revenez dans quelques instants ou contactez l'equipe Mifa Life."}
                </div>
                {params.q || params.cat ? (
                  <Link href="/shop" className="empty-cta">
                    Voir tout le catalogue
                  </Link>
                ) : null}
              </div>
            ) : (
              <div id="grid">
                {shopProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error("DEBUG SHOP FETCH ERROR:", error);

    const message =
      error instanceof Error ? error.message : "Erreur de synchronisation inconnue.";

    return (
      <main>
        <section id="cat-hero">
          <div className="ch-in">
            <h1 className="ch-title">Catalogue Mifa Life</h1>
            <p className="ch-sub">Le chargement du catalogue a rencontre une erreur.</p>
            <div className="ch-stripe">
              <span className="bg-[var(--mg)]" />
              <span className="bg-[var(--my)]" />
              <span className="bg-[var(--mr)]" />
            </div>
          </div>
        </section>

        <section id="main">
          <div className="empty-state">
            <div className="empty-ti">Boutique temporairement indisponible</div>
            <div className="empty-sub">Erreur detaillee: {message}</div>
          </div>
        </section>
      </main>
    );
  }
}
