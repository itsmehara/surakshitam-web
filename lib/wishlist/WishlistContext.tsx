"use client";

/**
 * Wishlist ("save for later") — same shape as cart/CartContext.tsx: a localStorage-backed
 * React context with a reducer, hydrated once on mount. Simpler than cart since there's no
 * quantity, just a set of product ids.
 */
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { getProductById } from "@/lib/catalog";
import type { Product } from "@/lib/types";

type Action = { type: "toggle"; id: string } | { type: "hydrate"; ids: string[] };

function reducer(state: string[], action: Action): string[] {
  switch (action.type) {
    case "hydrate":
      return action.ids;
    case "toggle":
      return state.includes(action.id) ? state.filter((id) => id !== action.id) : [...state, action.id];
    default:
      return state;
  }
}

interface WishlistContextValue {
  ids: string[];
  items: Product[];
  count: number;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "sn-wishlist-v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, dispatch] = useReducer(reducer, []);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", ids: JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids, loaded]);

  const items = useMemo(
    () => ids.map((id) => getProductById(id)).filter((p): p is Product => !!p),
    [ids],
  );

  const value: WishlistContextValue = useMemo(
    () => ({
      ids,
      items,
      count: items.length,
      has: (id) => ids.includes(id),
      toggle: (id) => dispatch({ type: "toggle", id }),
    }),
    [ids, items],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
