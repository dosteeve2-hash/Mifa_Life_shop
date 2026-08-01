'use client';

/**
 * MIFA LIFE — Contexte Panier Vendeurs
 * src/context/PanierContext.tsx
 *
 * Panier simple pour les articles ajoutés depuis les cards vendeurs.
 * Persistance localStorage. API 100% française.
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

// ─── Types ────────────────────────────────────────────────────
export type ArticlePanier = {
  id: string;
  nom: string;
  prix: number;       // en FCFA
  quantite: number;
  vendeur: string;
  image?: string;
};

type PanierContextType = {
  articles: ArticlePanier[];
  ajouterArticle: (article: Omit<ArticlePanier, 'quantite'>) => void;
  retirerArticle: (id: string) => void;
  modifierQuantite: (id: string, quantite: number) => void;
  viderPanier: () => void;
  total: number;
  nombreArticles: number;
};

// ─── Constantes ───────────────────────────────────────────────
const STORAGE_KEY = 'mifa_panier_vendeurs';

function chargerDepuisStorage(): ArticlePanier[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ArticlePanier[]) : [];
  } catch {
    return [];
  }
}

function sauvegarderDansStorage(articles: ArticlePanier[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch {
    // quota dépassé
  }
}

// ─── Contexte ─────────────────────────────────────────────────
const PanierContext = createContext<PanierContextType | null>(null);

export function PanierProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<ArticlePanier[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydratation localStorage (évite l'erreur SSR)
  useEffect(() => {
    setArticles(chargerDepuisStorage());
    setHydrated(true);
  }, []);

  // Persistance automatique
  useEffect(() => {
    if (hydrated) {
      sauvegarderDansStorage(articles);
    }
  }, [articles, hydrated]);

  // ─── Actions ─────────────────────────────────────────────────

  const ajouterArticle = useCallback(
    (article: Omit<ArticlePanier, 'quantite'>) => {
      setArticles((prev) => {
        const existant = prev.find((a) => a.id === article.id);
        if (existant) {
          return prev.map((a) =>
            a.id === article.id ? { ...a, quantite: a.quantite + 1 } : a
          );
        }
        return [...prev, { ...article, quantite: 1 }];
      });
    },
    []
  );

  const retirerArticle = useCallback((id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const modifierQuantite = useCallback((id: string, quantite: number) => {
    if (quantite <= 0) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } else {
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, quantite } : a))
      );
    }
  }, []);

  const viderPanier = useCallback(() => {
    setArticles([]);
  }, []);

  // ─── Dérivés ─────────────────────────────────────────────────

  const total = useMemo(
    () => articles.reduce((s, a) => s + a.prix * a.quantite, 0),
    [articles]
  );

  const nombreArticles = useMemo(
    () => articles.reduce((s, a) => s + a.quantite, 0),
    [articles]
  );

  return (
    <PanierContext.Provider
      value={{
        articles,
        ajouterArticle,
        retirerArticle,
        modifierQuantite,
        viderPanier,
        total,
        nombreArticles,
      }}
    >
      {children}
    </PanierContext.Provider>
  );
}

export function usePanier(): PanierContextType {
  const ctx = useContext(PanierContext);
  if (!ctx) {
    throw new Error('usePanier doit être utilisé dans <PanierProvider>');
  }
  return ctx;
}
