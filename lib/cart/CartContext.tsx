"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { getProductById } from "@/lib/catalog";
import { parcelWeightGrams } from "@/lib/weight";
import { getSession } from "@/lib/auth";
import { logEvent } from "@/lib/audit";
import type { Product } from "@/lib/types";

export interface CartLine {
  id: string; // product id
  qty: number;
}

interface CartState {
  lines: CartLine[];
}

type Action =
  | { type: "add"; id: string; qty?: number }
  | { type: "set"; id: string; qty: number }
  | { type: "remove"; id: string }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines };
    case "add": {
      const qty = action.qty ?? 1;
      const existing = state.lines.find((l) => l.id === action.id);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.id === action.id ? { ...l, qty: l.qty + qty } : l,
          ),
        };
      }
      return { lines: [...state.lines, { id: action.id, qty }] };
    }
    case "set":
      if (action.qty <= 0) return { lines: state.lines.filter((l) => l.id !== action.id) };
      return {
        lines: state.lines.map((l) => (l.id === action.id ? { ...l, qty: action.qty } : l)),
      };
    case "remove":
      return { lines: state.lines.filter((l) => l.id !== action.id) };
    case "clear":
      return { lines: [] };
    default:
      return state;
  }
}

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number; // paise
  /**
   * Approximate parcel weight in grams — recalculated on every add/remove so
   * the courier/bike booking always has a figure to work with. Includes one
   * packaging allowance; see lib/weight.ts.
   */
  weightGrams: number;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  qtyOf: (id: string) => number;
  // drawer
  drawerOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  // quick view
  quickViewId: string | null;
  openQuickView: (id: string) => void;
  closeQuickView: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "sn-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", lines: JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  // persist
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      /* ignore */
    }
  }, [state.lines, loaded]);

  const items: CartItem[] = useMemo(
    () =>
      state.lines
        .map((l) => {
          const product = getProductById(l.id);
          return product ? { product, qty: l.qty } : null;
        })
        .filter((x): x is CartItem => x !== null),
    [state.lines],
  );

  const value: CartContextValue = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.product.price * i.qty, 0);
    const weightGrams = parcelWeightGrams(items);
    return {
      items,
      count,
      subtotal,
      weightGrams,
      add: (id, qty) => {
        dispatch({ type: "add", id, qty });
        setDrawerOpen(true);
        const product = getProductById(id);
        const s = getSession();
        logEvent({
          type: "cart_add",
          actor: s ? { kind: "customer", id: s.id, name: s.name } : { kind: "guest" },
          productId: id,
          productName: product?.name,
          qty: qty ?? 1,
        });
      },
      setQty: (id, qty) => {
        if (qty <= 0) {
          const product = getProductById(id);
          const s = getSession();
          logEvent({
            type: "cart_remove",
            actor: s ? { kind: "customer", id: s.id, name: s.name } : { kind: "guest" },
            productId: id,
            productName: product?.name,
          });
        }
        dispatch({ type: "set", id, qty });
      },
      remove: (id) => {
        const product = getProductById(id);
        const s = getSession();
        logEvent({
          type: "cart_remove",
          actor: s ? { kind: "customer", id: s.id, name: s.name } : { kind: "guest" },
          productId: id,
          productName: product?.name,
        });
        dispatch({ type: "remove", id });
      },
      clear: () => dispatch({ type: "clear" }),
      qtyOf: (id) => items.find((i) => i.product.id === id)?.qty ?? 0,
      drawerOpen,
      openCart: () => setDrawerOpen(true),
      closeCart: () => setDrawerOpen(false),
      quickViewId,
      openQuickView: (id) => setQuickViewId(id),
      closeQuickView: () => setQuickViewId(null),
    };
  }, [items, drawerOpen, quickViewId]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
