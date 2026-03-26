"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "../../lib/supabase";

type Product = {
  id: string;
  name: string;
  price_cfa: number | null;
  image_url: string | null;
  description: string | null;
};

type State = {
  error: string | null;
  loading: boolean;
  products: Product[];
};

function formatPriceCfa(value: number | null) {
  if (value === null) {
    return "Prix indisponible";
  }

  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

function Banner() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--bg2)] shadow-[var(--bg3)]">
      <div className="grid h-2 grid-cols-3">
        <div className="bg-[var(--mg)]" />
        <div className="bg-[var(--my)]" />
        <div className="bg-[var(--mr)]" />
      </div>
      <div className="px-5 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--mg)]">
          Mali Design System
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Produits officiels en direct depuis Supabase, avec une presentation
          sobre, chaleureuse et moderne.
        </p>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [state, setState] = useState<State>({
    error: null,
    loading: true,
    products: [],
  });

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price_cfa, image_url, description")
        .eq("active", true)
        .order("id", { ascending: false });

      if (error) {
        setState({
          error: error.message,
          loading: false,
          products: [],
        });
        return;
      }

      setState({
        error: null,
        loading: false,
        products: (data ?? []) as Product[],
      });
    }

    void loadProducts();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <Banner />

      <section className="mt-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--mg)]">
            Boutique
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Produits disponibles
          </h1>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            Catalogue dynamique Mifa Life avec visuels issus de votre bucket
            Supabase et tarification en FCFA.
          </p>
        </div>

        <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-[var(--bg2)] px-5 py-4 shadow-[var(--bg3)]">
          <p className="text-sm text-[var(--muted)]">
            {state.loading ? "Chargement des produits..." : `${state.products.length} produit(s) actif(s)`}
          </p>
        </div>

        {state.error ? (
          <div className="mt-6 rounded-[24px] border border-[var(--mr)]/30 bg-[#fff2f0] px-5 py-4 text-sm text-[var(--mr)] shadow-[var(--bg3)]">
            Impossible de charger les produits : {state.error}
          </div>
        ) : null}

        {!state.error && state.loading ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[28px] border border-[var(--border)] bg-[var(--bg2)] p-5 shadow-[var(--bg3)]"
              >
                <div className="aspect-[4/3] animate-pulse rounded-[22px] bg-[#ebe2d0]" />
                <div className="mt-5 h-4 w-24 animate-pulse rounded-full bg-[#ebe2d0]" />
                <div className="mt-4 h-6 w-3/4 animate-pulse rounded-full bg-[#ebe2d0]" />
                <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-[#ebe2d0]" />
                <div className="mt-2 h-4 w-2/3 animate-pulse rounded-full bg-[#ebe2d0]" />
                <div className="mt-6 h-12 animate-pulse rounded-full bg-[#dfeadf]" />
              </div>
            ))}
          </div>
        ) : null}

        {!state.loading && !state.error && state.products.length === 0 ? (
          <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-[var(--bg2)] px-5 py-6 text-[var(--muted)] shadow-[var(--bg3)]">
            Aucun produit actif trouve dans la table `products`.
          </div>
        ) : null}

        {!state.loading && !state.error && state.products.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {state.products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-[30px] border border-[var(--border)] bg-[var(--bg2)] p-5 shadow-[var(--bg3)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[#efe6d7]">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
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

                <div className="mt-5">
                  <p className="text-sm font-medium text-[var(--mg)]">
                    {formatPriceCfa(product.price_cfa)}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    {product.name}
                  </h2>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-[var(--muted)]">
                    {product.description || "Description non disponible."}
                  </p>
                </div>

                <button
                  type="button"
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--mg)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Ajouter
                </button>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
