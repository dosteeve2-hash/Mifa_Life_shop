import type { ShopProduct } from "@/lib/types/store";

const PRODUCT_COLUMNS = "id,name,price_cfa,image_url,description,active";

function getSupabaseRestConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return {
    restUrl: `${url}/rest/v1/products`,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      Accept: "application/json",
    },
  };
}

export async function fetchActiveProducts() {
  const { restUrl, headers } = getSupabaseRestConfig();
  const response = await fetch(
    `${restUrl}?select=${PRODUCT_COLUMNS}&active=eq.true&order=id.desc`,
    {
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase fetch failed with status ${response.status}.`);
  }

  const data = (await response.json()) as ShopProduct[];
  return data ?? [];
}

export async function fetchProductById(id: string) {
  const { restUrl, headers } = getSupabaseRestConfig();
  const response = await fetch(
    `${restUrl}?select=${PRODUCT_COLUMNS}&id=eq.${encodeURIComponent(
      id,
    )}&active=eq.true&limit=1`,
    {
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase fetch failed with status ${response.status}.`);
  }

  const data = (await response.json()) as ShopProduct[];
  return data[0] ?? null;
}
