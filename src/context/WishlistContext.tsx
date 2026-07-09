'use client';

/**
 * MIFA LIFE — LISTE DE SOUHAITS
 * src/context/WishlistContext.tsx
 *
 * Stratégie :
 * 1. Stockage immédiat en localStorage (hors-ligne, instantané)
 * 2. Si utilisateur connecté → sync automatique avec Supabase wishlist
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { createBrowserClient } from '@supabase/ssr';

// ─── Types ────────────────────────────────────────────────────
export type WishlistItem = {
  id: string;
  produit_id: string;
  nom: string;
  prix: number;
  image_url?: string | null;
};

type WishlistContextType = {
  items: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'id'>) => void;
  removeFromWishlist: (produit_id: string) => void;
  isInWishlist: (produit_id: string) => boolean;
  clearWishlist: () => void;
  totalItems: number;
};

// ─── Constantes ────────────────────────────────────────────────
const STORAGE_KEY = 'mifa_wishlist';

let _supabase: ReturnType<typeof createBrowserClient> | null = null;
function getSupabase() {
  if (typeof window === 'undefined') return null;
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    _supabase = createBrowserClient(url, key);
  }
  return _supabase;
}

// ─── Helpers localStorage ──────────────────────────────────────
function loadFromStorage(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: WishlistItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota dépassé — ignorer
  }
}

// ─── Context ──────────────────────────────────────────────────
const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Chargement initial depuis localStorage (côté client uniquement)
  useEffect(() => {
    setItems(loadFromStorage());
    setMounted(true);
  }, []);

  // Persist localStorage à chaque changement
  useEffect(() => {
    if (!mounted) return;
    saveToStorage(items);
  }, [items, mounted]);

  // Sync Supabase quand utilisateur connecté
  useEffect(() => {
    if (!mounted) return;
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            const { data } = await supabase
              .from('wishlist')
              .select('*')
              .eq('user_id', session.user.id);

            if (data && data.length > 0) {
              const remoteItems: WishlistItem[] = data.map((row) => ({
                id: row.id as string,
                produit_id: row.produit_id as string,
                nom: row.nom as string,
                prix: row.prix as number,
                image_url: row.image_url as string | null,
              }));
              setItems((prev) => {
                const merged = new Map<string, WishlistItem>();
                remoteItems.forEach((i) => merged.set(i.produit_id, i));
                prev.forEach((i) => merged.set(i.produit_id, i));
                return Array.from(merged.values());
              });
            }
          } catch {
            // Sync silencieuse — ne pas bloquer l'UX
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [mounted]);

  // Sync vers Supabase après chaque modification si connecté
  useEffect(() => {
    if (!mounted) return;
    const supabase = getSupabase();
    if (!supabase) return;
    let cancelled = false;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || cancelled) return;
      try {
        if (items.length === 0) {
          supabase.from('wishlist').delete().eq('user_id', user.id);
        } else {
          supabase.from('wishlist').upsert(
            items.map((item) => ({
              user_id: user.id,
              produit_id: item.produit_id,
              nom: item.nom,
              prix: item.prix,
              image_url: item.image_url ?? null,
            })),
            { onConflict: 'user_id,produit_id' }
          );
        }
      } catch {
        // Sync silencieuse
      }
    });

    return () => { cancelled = true; };
  }, [items, mounted]);

  // Actions
  const addToWishlist = useCallback((item: Omit<WishlistItem, 'id'>) => {
    setItems((prev) => {
      if (prev.some((i) => i.produit_id === item.produit_id)) return prev;
      const newItem: WishlistItem = {
        ...item,
        id: `${item.produit_id}-${Date.now()}`,
      };
      return [...prev, newItem];
    });
  }, []);

  const removeFromWishlist = useCallback((produit_id: string) => {
    setItems((prev) => prev.filter((i) => i.produit_id !== produit_id));
  }, []);

  const isInWishlist = useCallback(
    (produit_id: string) => items.some((i) => i.produit_id === produit_id),
    [items]
  );

  const clearWishlist = useCallback(() => setItems([]), []);

  const totalItems = useMemo(() => items.length, [items]);

  if (!mounted) {
    return (
      <WishlistContext.Provider value={{
        items: [],
        addToWishlist: () => {},
        removeFromWishlist: () => {},
        isInWishlist: () => false,
        clearWishlist: () => {},
        totalItems: 0,
      }}>
        {children}
      </WishlistContext.Provider>
    );
  }

  return (
    <WishlistContext.Provider value={{
      items,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      totalItems,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist doit être utilisé dans <WishlistProvider>');
  return ctx;
}
