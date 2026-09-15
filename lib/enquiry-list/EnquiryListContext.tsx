"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { getProductById } from "@/lib/catalog";
import type { Product } from "@/lib/types";

/**
 * Enquiry list ("enquiry cart") — v3's stand-in for a shopping cart.
 *
 * Customers collect products across the site, adjust quantities, then send
 * ONE WhatsApp message (or one form enquiry) listing everything, instead of a
 * separate WhatsApp thread per product. No prices, no payment: it is a
 * shopping-list, not a checkout.
 *
 * Persisted in localStorage (`sn-enquiry-list-v1`) so the list survives a
 * reload or a detour to WhatsApp and back. Same reducer + hydrate-on-mount
 * shape as the v2 cart so the backend version can swap storage without
 * touching the UI.
 */

const STORAGE_KEY = "sn-enquiry-list-v1";
const NOTE_KEY = "sn-enquiry-note-v1";
const MAX_QTY = 99;
export const MAX_NOTE = 300;

export type EnquiryItem = { id: string; qty: number };
export type EnquiryLine = { product: Product; qty: number };

type Action =
  | { type: "hydrate"; items: EnquiryItem[] }
  | { type: "add"; id: string; qty: number }
  | { type: "setQty"; id: string; qty: number }
  | { type: "remove"; id: string }
  | { type: "clear" };

function reducer(items: EnquiryItem[], action: Action): EnquiryItem[] {
  switch (action.type) {
    case "hydrate":
      return action.items;
    case "add": {
      const existing = items.find((i) => i.id === action.id);
      if (existing) {
        return items.map((i) =>
          i.id === action.id ? { ...i, qty: Math.min(MAX_QTY, i.qty + action.qty) } : i,
        );
      }
      return [...items, { id: action.id, qty: Math.min(MAX_QTY, Math.max(1, action.qty)) }];
    }
    case "setQty":
      if (action.qty <= 0) return items.filter((i) => i.id !== action.id);
      return items.map((i) => (i.id === action.id ? { ...i, qty: Math.min(MAX_QTY, action.qty) } : i));
    case "remove":
      return items.filter((i) => i.id !== action.id);
    case "clear":
      return [];
  }
}

function load(): EnquiryItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((i): i is EnquiryItem => !!i && typeof i.id === "string" && typeof i.qty === "number")
      // Drop anything that no longer exists in the catalogue.
      .filter((i) => getProductById(i.id))
      .map((i) => ({ id: i.id, qty: Math.min(MAX_QTY, Math.max(1, Math.round(i.qty))) }));
  } catch {
    return [];
  }
}

interface EnquiryListValue {
  /** Resolved lines, catalogue order preserved as added. */
  lines: EnquiryLine[];
  /** Number of distinct products — what the badge shows. */
  count: number;
  /** True once localStorage has been read (avoids a badge flash of 0 → n). */
  ready: boolean;
  has: (id: string) => boolean;
  qtyOf: (id: string) => number;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  /** Free-text note appended to the WhatsApp message / form. */
  note: string;
  setNote: (note: string) => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const Ctx = createContext<EnquiryListValue | null>(null);

export function EnquiryListProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [note, setNoteState] = useState("");

  useEffect(() => {
    dispatch({ type: "hydrate", items: load() });
    try {
      setNoteState((window.localStorage.getItem(NOTE_KEY) ?? "").slice(0, MAX_NOTE));
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
      /* private mode / quota — the list still works for this page view */
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

  const lines = useMemo<EnquiryLine[]>(
    () =>
      items.flatMap((i) => {
        const product = getProductById(i.id);
        return product ? [{ product, qty: i.qty }] : [];
      }),
    [items],
  );

  const value = useMemo<EnquiryListValue>(
    () => ({
      lines,
      count: lines.length,
      ready,
      has: (id) => items.some((i) => i.id === id),
      qtyOf: (id) => items.find((i) => i.id === id)?.qty ?? 0,
      add: (id, qty = 1) => dispatch({ type: "add", id, qty }),
      setQty: (id, qty) => dispatch({ type: "setQty", id, qty }),
      remove: (id) => dispatch({ type: "remove", id }),
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

export function useEnquiryList(): EnquiryListValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEnquiryList must be used inside <EnquiryListProvider>");
  return ctx;
}

/** Stable hook for components that only need to know whether a product is listed. */
export function useEnquiryItem(id: string) {
  const { has, qtyOf, add, setQty, remove, openDrawer } = useEnquiryList();
  return {
    inList: has(id),
    qty: qtyOf(id),
    add: useCallback((qty = 1) => add(id, qty), [add, id]),
    setQty: useCallback((qty: number) => setQty(id, qty), [setQty, id]),
    remove: useCallback(() => remove(id), [remove, id]),
    openDrawer,
  };
}
