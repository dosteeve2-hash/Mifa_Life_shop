"use client";

import { useCart } from "../context/CartContext";

type AddToCartButtonProps = {
  product: {
    id: number;
    name: string;
    price_cfa: number;
    image_url: string | null;
  };
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => {
        addItem(product);
        console.log("Produit ajouté :", product.name);
      }}
      className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
    >
      Ajouter au panier
    </button>
  );
}
