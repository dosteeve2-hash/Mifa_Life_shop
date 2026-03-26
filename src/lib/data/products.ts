import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ShopProduct } from "@/lib/types/store";

export async function fetchActiveProducts() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price_cfa, image_url, description, active")
    .eq("active", true)
    .order("id", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ShopProduct[];
}

export async function fetchProductById(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, price_cfa, image_url, description, active")
    .eq("id", id)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? null) as ShopProduct | null;
}
