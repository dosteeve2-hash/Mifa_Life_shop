import { createClient } from "@supabase/supabase-js";
import type { ShopProduct } from "@/lib/types/store";

const PRODUCT_COLUMNS = "id, name, price_cfa, image_url, description, active";

function createProductsClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
        }),
    },
    db: {
      schema: "public",
    },
  });
}

function mapProduct(product: Partial<ShopProduct>): ShopProduct {
  return {
    id: String(product.id ?? ""),
    name: product.name ?? null,
    price_cfa: product.price_cfa ?? null,
    image_url: product.image_url ?? null,
    description: product.description ?? null,
    active: product.active ?? null,
  };
}

export async function fetchActiveProducts() {
  const supabase = createProductsClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("active", true)
    .order("id", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapProduct);
}

export async function fetchProductById(id: string) {
  const supabase = createProductsClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("id", id)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapProduct(data) : null;
}
