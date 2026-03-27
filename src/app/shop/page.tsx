import Image from "next/image";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AddToCartButton } from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

type Product = {
  id: number;
  name: string;
  price: number | null;
  image_url: string | null;
  active?: boolean | null;
};

async function fetchProducts() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("id,name,price:price_cfa,image_url,active")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[shop] fetch error", error.message);
    return [] as Product[];
  }

  return (data ?? []) as Product[];
}

function formatPrice(value: number | null) {
  return `${new Intl.NumberFormat("fr-FR").format(value ?? 0)} FCFA`;
}

export default async function ShopPage() {
  const products = await fetchProducts();

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Tous nos produits
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Découvrez notre sélection Mifa Life, pensée pour mobile et desktop.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500 shadow-sm">
          Aucun produit disponible pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-square bg-gray-100">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <Image
                    src="https://placehold.co/300x300"
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                )}
              </div>

              <div className="space-y-4 p-4">
                <div>
                  <h2 className="line-clamp-2 text-sm font-semibold text-gray-900 sm:text-base">
                    {product.name}
                  </h2>
                  <p className="mt-2 text-base font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price_cfa: product.price ?? 0,
                    image_url: product.image_url,
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
