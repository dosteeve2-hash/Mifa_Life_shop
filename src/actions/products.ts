"use server";

import { fetchActiveProducts, fetchProductById } from "@/lib/data/products";

export async function getActiveProductsAction() {
  return fetchActiveProducts();
}

export async function getProductByIdAction(id: string) {
  return fetchProductById(id);
}
