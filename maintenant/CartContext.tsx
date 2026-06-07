'use client';

/**
 * MIFA LIFE — LOGIQUE PANIER
 * src/context/CartContext.tsx
 *
 * Stratégie :
 * 1. Stockage immédiat en localStorage (hors-ligne, instantané)
 * 2. Si utilisateur connecté → sync automatique avec Supabase cart_items
 * 3. Merge localStorage + DB à la connexion
 */

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { createBrowserClient } from '@supabase/ssr';

// ─── Types ────────────────────────────────────────────────────
export type CartItem = {
  id: number;          // product id
  name: string;
  price_cfa: number;
  image_url: string | null;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  syncing: boolean;
};

type CartAction =
  | { type: 'SET';      items: CartItem[] }
  | { type: 'ADD';      item: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE';   id: number }
  | { type: 'UPDATE';   id: number; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'SYNCING';  value: boolean };

type CartContextType = {
  items:       CartItem[];
  syncing:     boolean;
  addItem:     (item: Omit<CartItem, 'quantity'>) => void;
  removeItem:  (id: number) => void;
  updateQty:   (id: number, quantity: number) => void;
  clearCart:   () => void;
  totalItems:  number;
  totalPrice:  number;
};

// ─── Constantes ────────────────────────────────────────────────
const STORAGE_KEY = 'mifa_cart';
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Reducer ──────────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET':
      return { ...state, items: action.items };

    case 'ADD': {
      const exists = state.items.find((i) => i.id === action.item.id);
      const items = exists
        ? state.items.map((i) =>
            i.id === action.item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...state.items, { ...action.item, quantity: 1 }];
      return { ...state, items };
    }

    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };

    case 'UPDATE': {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      };
    }

    case 'CLEAR':
      return { ...state, items: [] };

    case 'SYNCING':
      return { ...state, syncing: action.value };

    default:
      return state;
  }
}

// ─── Helpers localStorage ──────────────────────────────────────
function loadFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota dépassé — ignorer
  }
}

// ─── Sync Supabase ─────────────────────────────────────────────
async function syncToSupabase(items: CartItem[], userId: string) {
  if (!items.length) {
    await supabase.from('cart_items').delete().eq('user_id', userId);
    return;
  }

  // Upsert chaque item (UNIQUE sur user_id + product_id)
  await supabase.from('cart_items').upsert(
    items.map((item) => ({
      user_id:    userId,
      product_id: item.id,
      quantity:   item.quantity,
    })),
    { onConflict: 'user_id,product_id' }
  );
}

async function loadFromSupabase(userId: string): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      quantity,
      products (
        id,
        name,
        price_cfa,
        image_url
      )
    `)
    .eq('user_id', userId);

  if (error || !data) return [];

  return data
    .filter((row) => row.products)
    .map((row) => {
      const p = row.products as unknown as {
        id: number;
        name: string;
        price_cfa: number;
        image_url: string | null;
      };
      return {
        id:        p.id,
        name:      p.name,
        price_cfa: p.price_cfa,
        image_url: p.image_url,
        quantity:  row.quantity,
      };
    });
}

// ─── Merge (localStorage + DB, localStorage prioritaire) ───────
function mergeItems(local: CartItem[], remote: CartItem[]): CartItem[] {
  const merged = new Map<number, CartItem>();
  // Remote en base
  remote.forEach((item) => merged.set(item.id, item));
  // Local écrase (plus récent)
  local.forEach((item) => {
    const existing = merged.get(item.id);
    merged.set(item.id, {
      ...item,
      quantity: existing
        ? Math.max(item.quantity, existing.quantity)
        : item.quantity,
    });
  });
  return Array.from(merged.values());
}

// ─── Context ──────────────────────────────────────────────────
const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items:   loadFromStorage(),
    syncing: false,
  });

  // Persist localStorage à chaque changement
  useEffect(() => {
    saveToStorage(state.items);
  }, [state.items]);

  // Sync Supabase quand utilisateur connecté
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          dispatch({ type: 'SYNCING', value: true });

          // Charger le panier DB et merger avec localStorage
          const remote = await loadFromSupabase(session.user.id);
          const local  = loadFromStorage();
          const merged = mergeItems(local, remote);

          dispatch({ type: 'SET', items: merged });
          saveToStorage(merged);
          await syncToSupabase(merged, session.user.id);

          dispatch({ type: 'SYNCING', value: false });
        }

        if (event === 'SIGNED_OUT') {
          // Garder le panier en local mais effacer la DB
          dispatch({ type: 'SYNCING', value: false });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sync DB après chaque modification si connecté
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && !cancelled) {
        syncToSupabase(state.items, user.id);
      }
    });
    return () => { cancelled = true; };
  }, [state.items]);

  // Actions mémoïsées
  const addItem    = useCallback((item: Omit<CartItem, 'quantity'>) =>
    dispatch({ type: 'ADD', item }), []);
  const removeItem = useCallback((id: number) =>
    dispatch({ type: 'REMOVE', id }), []);
  const updateQty  = useCallback((id: number, quantity: number) =>
    dispatch({ type: 'UPDATE', id, quantity }), []);
  const clearCart  = useCallback(() =>
    dispatch({ type: 'CLEAR' }), []);

  // Dérivés mémoïsés
  const totalItems = useMemo(
    () => state.items.reduce((s, i) => s + i.quantity, 0),
    [state.items]
  );
  const totalPrice = useMemo(
    () => state.items.reduce((s, i) => s + i.price_cfa * i.quantity, 0),
    [state.items]
  );

  return (
    <CartContext.Provider value={{
      items:      state.items,
      syncing:    state.syncing,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      totalItems,
      totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans <CartProvider>');
  return ctx;
}
