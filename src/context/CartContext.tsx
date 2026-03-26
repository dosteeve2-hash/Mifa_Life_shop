"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "mifa-life-cart";
const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

function persistCart(items: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

export function CartContextProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCart());
  }, []);

  const setAndPersist = useCallback((next: CartItem[]) => {
    setItems(next);
    persistCart(next);
  }, []);

  const addToCart = useCallback(
    (productId: string, quantity = 1) => {
      const current = readCart();
      const index = current.findIndex((item) => item.productId === productId);
      const next =
        index === -1
          ? [...current, { productId, quantity }]
          : current.map((item, itemIndex) =>
              itemIndex === index
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            );
      setAndPersist(next);
    },
    [setAndPersist],
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setAndPersist(readCart().filter((item) => item.productId !== productId));
    },
    [setAndPersist],
  );

  const clearCart = useCallback(() => {
    setAndPersist([]);
  }, [setAndPersist]);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      addToCart,
      removeFromCart,
      clearCart,
    }),
    [items, addToCart, removeFromCart, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartContextProvider");
  }
  return context;
}
