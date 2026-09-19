"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentUser } from '@/lib/auth/session';

type OrderInput = {
  items: Array<{ id: number; name: string; price_cfa: number; quantity: number }>;
  total: number;
  paymentMethod: "orange" | "wave" | "cash";
  shipping: {
    firstName: string;
    lastName: string;
    phone: string;
    city: string;
    address: string;
    quarter: string;
  };
};

type PlaceOrderResult =
  | { ok: true; orderId: string; orderNumber: string }
  | { ok: false; error: string };

export async function placeOrderAction(input: OrderInput): Promise<PlaceOrderResult> {
  try {
    const supabase = await createServerSupabaseClient();

    // Récupérer l'utilisateur connecté (nullable)
  const user = await getCurrentUser();

    const deliveryAddress = JSON.stringify({
      firstName: input.shipping.firstName,
      lastName: input.shipping.lastName,
      phone: input.shipping.phone,
      city: input.shipping.city,
      address: input.shipping.address,
      quarter: input.shipping.quarter,
    });

    // Créer la commande
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        total_cfa: input.total,
        payment_type: input.paymentMethod,
        payment_status: "pending",
        status: "pending",
        delivery_address: deliveryAddress,
        notes: null,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("[checkout] order insert error:", orderError);
      return { ok: false, error: orderError?.message ?? "Erreur création commande" };
    }

    const orderId: string = order.id as string;

    // Insérer les order_items
    const orderItems = input.items.map((item) => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      price_cfa: item.price_cfa,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) {
      console.error("[checkout] order_items insert error:", itemsError);
      // On supprime la commande créée pour rester cohérent
      await supabase.from("orders").delete().eq("id", orderId);
      return { ok: false, error: itemsError.message };
    }

    const orderNumber = "ML" + orderId.slice(0, 6).toUpperCase();

    return { ok: true, orderId, orderNumber };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur inattendue";
    console.error("[checkout] unexpected error:", err);
    return { ok: false, error: message };
  }
}
