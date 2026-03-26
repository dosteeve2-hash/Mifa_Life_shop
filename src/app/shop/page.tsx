import { fetchActiveProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

function MaliBanner() {
  return (
    <div className="mifa-banner">
      <div className="mifa-flag">
        <span className="bg-[var(--mg)]" />
        <span className="bg-[var(--my)]" />
        <span className="bg-[var(--mr)]" />
      </div>
      <div className="px-5 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[var(--mg)]">
          Mifa Life
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Boutique synchronisee en temps reel avec Supabase, optimisee pour mobile.
        </p>
      </div>
    </div>
  );
}

export default async function ShopPage() {
  try {
    const products = await fetchActiveProducts();

    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <MaliBanner />

        <section className="mt-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--mg)]">
              Boutique
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Produits disponibles
            </h1>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">
              Une selection Mifa Life responsive, claire et stable sur mobile comme
              sur desktop.
            </p>
          </div>

          <div className="mifa-panel mt-6">
            <p className="text-sm text-[var(--muted)]">
              {products.length} produit(s) actif(s)
            </p>
          </div>

          {products.length === 0 ? (
            <div className="mifa-panel mt-6 text-[var(--muted)]">
              Aucun produit actif trouve pour le moment.
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur de synchronisation.";

    return (
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <MaliBanner />
        <div className="mt-8 rounded-[28px] border border-[var(--mr)]/30 bg-[var(--surface)] px-6 py-8 shadow-[var(--bg3)]">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--mr)]">
            Erreur
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            La boutique est temporairement indisponible
          </h1>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            Impossible de charger les produits pour le moment : {message}
          </p>
        </div>
      </main>
    );
  }
}
