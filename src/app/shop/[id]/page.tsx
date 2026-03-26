import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchProductById } from "@/lib/data/products";
import { ProductPurchaseControls } from "@/components/ProductPurchaseControls";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

function formatPriceCfa(value: number | null) {
  if (value === null) {
    return "Prix indisponible";
  }

  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

function isSupabaseStorageUrl(url: string | null) {
  if (!url) {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.hostname.endsWith(".supabase.co") &&
      parsedUrl.pathname.includes("/storage/v1/object/public/")
    );
  } catch {
    return false;
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  let product = null;

  try {
    product = await fetchProductById(id);
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="mifa-card p-0">
          <div className="relative aspect-square overflow-hidden rounded-[30px] bg-[var(--surface-muted)]">
            {isSupabaseStorageUrl(product.image_url) && product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name ?? "Produit Mifa Life"}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                Image indisponible
              </div>
            )}
          </div>
        </div>

        <div className="mifa-panel p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--mg)]">
            Produit
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            {product.name ?? "Produit"}
          </h1>
          <p className="mt-4 text-2xl font-semibold text-[var(--mg)]">
            {formatPriceCfa(product.price_cfa)}
          </p>
          <p className="mt-6 text-base leading-7 text-[var(--muted)]">
            {product.description ?? "Description non disponible."}
          </p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--muted)]">
            Disponible maintenant sur la boutique Mifa Life.
          </div>

          <ProductPurchaseControls productId={product.id} />
        </div>
      </section>
    </main>
  );
}
