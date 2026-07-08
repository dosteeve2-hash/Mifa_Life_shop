"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { ShopProduct } from "@/lib/types/store";

/**
 * ProductCard — carte produit compacte avec badge optionnel.
 *
 * Usage :
 *   <ProductCard product={p} badge="nouveau" />
 *   <ProductCard product={p} badge="populaire" />
 *   <ProductCard product={p} />            // sans badge
 */

type BadgeType = "nouveau" | "populaire" | null;

type ProductCardProps = {
  product: ShopProduct;
  /** Affiche un badge coloré sur la vignette produit */
  badge?: BadgeType;
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

function Badge({ type }: { type: BadgeType }) {
  if (!type) return null;

  if (type === "nouveau") {
    return <span className="pc-badge pc-badge-new">Nouveau</span>;
  }

  return <span className="pc-badge pc-badge-pop">Populaire ★</span>;
}

export function ProductCard({ product, badge = null }: ProductCardProps) {
  const { addToCart } = useCart();
  const canRenderImage = isSupabaseStorageUrl(product.image_url);

  return (
    <article className="pc">
      {/* Image + badge */}
      <Link href={`/shop/${product.id}`} className="pc-img block">
        <div className="relative h-full w-full overflow-hidden bg-[var(--bg2)]">
          {canRenderImage && product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name ?? "Produit Mifa Life"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
            />
          ) : (
            <div className="pc-img-ph h-full">Sans image</div>
          )}

          <Badge type={badge} />
        </div>
      </Link>

      {/* Corps de la carte */}
      <div className="pc-bd">
        <p className="pc-vnd">
          <span className="pc-vck">●</span>
          Mifa Life
        </p>
        <h2 className="pc-nm">{product.name ?? "Produit sans nom"}</h2>
        <div className="pc-prices">
          <span className="pc-p">{formatPriceCfa(product.price_cfa)}</span>
        </div>
        <p className="text-sm leading-6 text-[var(--t3)]">
          {product.description || "Description non disponible."}
        </p>
      </div>

      {/* Overlay hover — desktop */}
      <div className="pc-hov">
        <Link href={`/shop/${product.id}`} className="pc-ha">
          Voir
        </Link>
        <button
          type="button"
          className="pc-ha add"
          onClick={() => addToCart(product.id, 1)}
        >
          Acheter
        </button>
      </div>

      {/* CTA — mobile (toujours visible) */}
      <button
        type="button"
        className="pc-atc-m"
        onClick={() => addToCart(product.id, 1)}
      >
        + Ajouter au panier
      </button>
    </article>
  );
}
