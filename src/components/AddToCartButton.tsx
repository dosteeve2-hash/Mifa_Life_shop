'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

type Product = {
  id:        number;
  name:      string;
  price_cfa: number;
  image_url: string | null;
};

export default function AddToCartButton({ product, item }: { product?: Product; item?: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const p = product ?? item;

  function handle() {
    if (!p) return;
    addItem({
      id:        p.id,
      name:      p.name,
      price_cfa: p.price_cfa,
      image_url: p.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handle}
      className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-bold text-white transition-all duration-200 ${
        added
          ? 'bg-emerald-600 scale-95'
          : 'bg-[#009739] hover:bg-[#007a2e] active:scale-95'
      }`}
    >
      {added ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Ajouté !
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Ajouter
        </>
      )}
    </button>
  );
}
