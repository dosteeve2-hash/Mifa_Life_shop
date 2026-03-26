"use client";

import type { ReactNode } from "react";
import { CartContextProvider } from "@/context/CartContext";

export function CartProvider({ children }: { children: ReactNode }) {
  return <CartContextProvider>{children}</CartContextProvider>;
}
