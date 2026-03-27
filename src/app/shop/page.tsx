import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import type { ShopProduct } from "@/lib/types/store";

export const dynamic = "force-dynamic";

async function fetchActiveProductsNoStore() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("URL Supabase manquante dans Vercel");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/products?select=id,name,price_cfa,image_url,description,active&active=eq.true&order=id.desc`,
    {
      cache: "no-store",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    let errorDetails = "";

    try {
      errorDetails = await response.text();
    } catch {
      errorDetails = "";
    }

    throw new Error(
      `fetch failed (${response.status})${errorDetails ? ` - ${errorDetails}` : ""}`,
    );
  }

  return ((await response.json()) as ShopProduct[]) ?? [];
}

export default async function ShopPage() {
  try {
    const products = await fetchActiveProductsNoStore();

    return (
      <main>
        <section id="cat-hero">
          <div className="ch-in">
            <div className="ch-row">
              <div>
                <h1 className="ch-title">Catalogue Mifa Life</h1>
                <p className="ch-sub">
                  Wax, bijoux bogolan, beaute naturelle et essentiels lifestyle.
                  Une boutique synchronisee sur Supabase avec un fetch temps reel
                  force sans cache Vercel.
                </p>
              </div>
              <div className="ch-stats">
                <div className="chs">
                  <div className="chs-n">{products.length}</div>
                  <div className="chs-l">Produits</div>
                </div>
                <div className="chs">
                  <div className="chs-n">2h</div>
                  <div className="chs-l">Bamako</div>
                </div>
                <div className="chs">
                  <div className="chs-n">Wave</div>
                  <div className="chs-l">Paiement</div>
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
                <button type="button" className="filt-reset">
                  Reinitialiser
                </button>
              </div>

              <div className="filt-block">
                <div className="filt-label">Categories</div>
                <div className="fcat">
                  <div className="fcat-item on">
                    <span>Tous les produits</span>
                    <span className="cnt">{products.length}</span>
                  </div>
                  <div className="fcat-item">
                    <span>Mode</span>
                    <span className="cnt">Live</span>
                  </div>
                  <div className="fcat-item">
                    <span>Accessoires</span>
                    <span className="cnt">Live</span>
                  </div>
                  <div className="fcat-item">
                    <span>Beaute</span>
                    <span className="cnt">Live</span>
                  </div>
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
                  <b>{products.length}</b> produits disponibles
                </p>
                <div className="active-filters">
                  <span className="af-tag">Catalogue Mali</span>
                  <span className="af-tag">Supabase live</span>
                </div>
              </div>
              <div className="sort-right">
                <select className="sort-sel" defaultValue="recent">
                  <option value="recent">Plus recent</option>
                  <option value="price">Prix</option>
                </select>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-ico">?</div>
                <div className="empty-ti">Aucun produit actif pour le moment</div>
                <div className="empty-sub">
                  Revenez dans quelques instants ou contactez l'equipe Mifa Life.
                </div>
              </div>
            ) : (
              <div id="grid">
                {products.map((product) => (
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
