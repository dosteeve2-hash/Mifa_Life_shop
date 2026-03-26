"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

type ProductPurchaseControlsProps = {
  productId: string;
};

export function ProductPurchaseControls({
  productId,
}: ProductPurchaseControlsProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-4 text-lg"
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          aria-label="Diminuer la quantite"
        >
          -
        </button>
        <span className="min-w-12 text-center text-sm font-semibold">
          {quantity}
        </span>
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-4 text-lg"
          onClick={() => setQuantity((current) => current + 1)}
          aria-label="Augmenter la quantite"
        >
          +
        </button>
      </div>

      <button
        type="button"
        className="mifa-button-primary w-full sm:w-auto sm:min-w-52"
        onClick={() => addToCart(productId, quantity)}
      >
        Acheter
      </button>
    </div>
  );
}
