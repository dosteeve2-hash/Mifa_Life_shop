"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { ShopProduct } from "@/lib/types/store";

type ProductCardProps = {
  product: ShopProduct;
};

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

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const canRenderImage = isSupabaseStorageUrl(product.image_url);

  return (
    <article className="mifa-card">
      <Link href={`/shop/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[var(--surface-muted)]">
          {canRenderImage && product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name ?? "Produit Mifa Life"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
              Sans image
            </div>
          )}
        </div>
      </Link>

      <div className="mt-5">
        <p className="text-sm font-medium text-[var(--mg)]">
          {formatPriceCfa(product.price_cfa)}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          {product.name ?? "Produit sans nom"}
        </h2>
        <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--muted)]">
          {product.description || "Description non disponible."}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/shop/${product.id}`}
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
        >
          Voir le produit
        </Link>
        <button
          type="button"
          className="mifa-button-primary flex-1"
          onClick={() => addToCart(product.id, 1)}
        >
          Acheter
        </button>
      </div>
    </article>
  );
}
