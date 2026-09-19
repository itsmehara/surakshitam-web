"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { getProductById, getSize } from "@/lib/catalog";
import type { Product, ProductSize } from "@/lib/types";

/**
 * Cart — v4 turns v3's "enquiry list" into an order basket.
 *
 * Customers collect products (with a pack size) across the site, adjust
 * quantities, then order everything in ONE WhatsApp message. Payment happens
 * on WhatsApp after the founders confirm (customer sends the payment
 * screenshot); nothing on the site takes money.
 *
 * A line is `productId + sizeId` — the same product in two sizes is two lines
 * (PRODUCT-CATALOG-NOTES-2026-09-19 §7.2). Persisted in localStorage
 * (`sn-cart-v2`); v3's `sn-enquiry-list-v1` entries had no size and are
 * dropped rather than guessed. Same reducer + hydrate-on-mount shape as before
 * so the backend version (v5) can swap storage without touching the UI.
 */

const STORAGE_KEY = "sn-cart-v2";
const NOTE_KEY = "sn-cart-note-v1";
const LEGACY_KEYS = ["sn-enquiry-list-v1", "sn-enquiry-note-v1"];
const MAX_QTY = 99;
export const MAX_NOTE = 300;

export type CartItem = { id: string; sizeId: string; qty: number };
export type CartLine = { product: Product; size: ProductSize; qty: number };

/** Stable key for a line — used for React keys and localStorage dedupe. */
export const lineKey = (id: string, sizeId: string) => `${id}:${sizeId}`;

type Action =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; id: string; sizeId: string; qty: number }
  | { type: "setQty"; id: string; sizeId: string; qty: number }
  | { type: "remove"; id: string; sizeId: string }
  | { type: "clear" };

const same = (i: CartItem, id: string, sizeId: string) => i.id === id && i.sizeId === sizeId;

function reducer(items: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case "hydrate":
      return action.items;
    case "add": {
      const existing = items.find((i) => same(i, action.id, action.sizeId));
      if (existing) {
        return items.map((i) =>
          same(i, action.id, action.sizeId) ? { ...i, qty: Math.min(MAX_QTY, i.qty + action.qty) } : i,
        );
      }
      return [...items, { id: action.id, sizeId: action.sizeId, qty: Math.min(MAX_QTY, Math.max(1, action.qty)) }];
    }
    case "setQty":
      if (action.qty <= 0) return items.filter((i) => !same(i, action.id, action.sizeId));
      return items.map((i) =>
        same(i, action.id, action.sizeId) ? { ...i, qty: Math.min(MAX_QTY, action.qty) } : i,
      );
    case "remove":
      return items.filter((i) => !same(i, action.id, action.sizeId));
    case "clear":
      return [];
  }
}

function load(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (i): i is CartItem =>
          !!i && typeof i.id === "string" && typeof i.sizeId === "string" && typeof i.qty === "number",
      )
      // Drop anything that no longer exists in the catalogue — product or pack.
      .filter((i) => {
        const p = getProductById(i.id);
        return p && getSize(p, i.sizeId);
      })
      .map((i) => ({ id: i.id, sizeId: i.sizeId, qty: Math.min(MAX_QTY, Math.max(1, Math.round(i.qty))) }));
  } catch {
    return [];
  }
}

interface CartValue {
  /** Resolved lines, in the order added. */
  lines: CartLine[];
  /** Number of lines — what the badge shows. */
  count: number;
  /** Sum of MRP × qty over lines that have an MRP, in rupees. */
  subtotal: number;
  /** True when at least one line is "price on request" (excluded from subtotal). */
  hasPriceOnRequest: boolean;
  /** True once localStorage has been read (avoids a badge flash of 0 → n). */
  ready: boolean;
  has: (id: string, sizeId: string) => boolean;
  qtyOf: (id: string, sizeId: string) => number;
  add: (id: string, sizeId: string, qty?: number) => void;
  setQty: (id: string, sizeId: string, qty: number) => void;
  remove: (id: string, sizeId: string) => void;
  clear: () => void;
  /** Free-text note appended to the WhatsApp order. */
  note: string;
  setNote: (note: string) => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const Ctx = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [note, setNoteState] = useState("");

  useEffect(() => {
    dispatch({ type: "hydrate", items: load() });
    try {
      setNoteState((window.localStorage.getItem(NOTE_KEY) ?? "").slice(0, MAX_NOTE));
      for (const k of LEGACY_KEYS) window.localStorage.removeItem(k);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.localStorage.setItem(NOTE_KEY, note);
    } catch {
      /* private mode / quota — the cart still works for this page view */
    }
  }, [items, note, ready]);

  // Keep several open tabs in step.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) dispatch({ type: "hydrate", items: load() });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const lines = useMemo<CartLine[]>(
    () =>
      items.flatMap((i) => {
        const product = getProductById(i.id);
        const size = product && getSize(product, i.sizeId);
        return product && size ? [{ product, size, qty: i.qty }] : [];
      }),
    [items],
  );

  const value = useMemo<CartValue>(
    () => ({
      lines,
      count: lines.length,
      subtotal: lines.reduce((sum, l) => sum + (l.size.mrp ?? 0) * l.qty, 0),
      hasPriceOnRequest: lines.some((l) => l.size.mrp == null),
      ready,
      has: (id, sizeId) => items.some((i) => same(i, id, sizeId)),
      qtyOf: (id, sizeId) => items.find((i) => same(i, id, sizeId))?.qty ?? 0,
      add: (id, sizeId, qty = 1) => dispatch({ type: "add", id, sizeId, qty }),
      setQty: (id, sizeId, qty) => dispatch({ type: "setQty", id, sizeId, qty }),
      remove: (id, sizeId) => dispatch({ type: "remove", id, sizeId }),
      clear: () => {
        dispatch({ type: "clear" });
        setNoteState("");
      },
      note,
      setNote: (n) => setNoteState(n.slice(0, MAX_NOTE)),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [items, lines, ready, drawerOpen, note],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

/** Stable hook for the one product + pack a button is about. */
export function useCartItem(id: string, sizeId: string) {
  const { has, qtyOf, add, setQty, remove, openDrawer } = useCart();
  return {
    inCart: has(id, sizeId),
    qty: qtyOf(id, sizeId),
    add: useCallback((qty = 1) => add(id, sizeId, qty), [add, id, sizeId]),
    setQty: useCallback((qty: number) => setQty(id, sizeId, qty), [setQty, id, sizeId]),
    remove: useCallback(() => remove(id, sizeId), [remove, id, sizeId]),
    openDrawer,
  };
}
