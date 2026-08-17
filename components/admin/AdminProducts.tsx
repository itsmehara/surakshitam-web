"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getAdminProducts,
  getHiddenIds,
  setProductHidden,
  updateStock,
  deleteProduct,
  resetProduct,
  isCustomProduct,
} from "@/lib/catalog-store";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { AdminOffers } from "./AdminOffers";
import { AdminCombos } from "./AdminCombos";

const LOW_STOCK = 10;
type Filter = "all" | "live" | "hidden";
type Tab = "catalog" | "offers" | "combos";

const TAB_LABEL: Record<Tab, string> = { catalog: "Catalog", offers: "Offers", combos: "Combos" };
const TAB_HEADING: Record<Tab, string> = {
  catalog: "Products & inventory",
  offers: "Offers",
  combos: "Combos",
};
const TAB_SUBTITLE: Record<Tab, string> = {
  catalog: "Add products, edit details & images, and keep stock up to date.",
  offers: "Discount codes customers can apply at checkout.",
  combos: "Bundle products together at a special price.",
};

export function AdminProducts() {
  const [tab, setTab] = useState<Tab>("catalog");
  const [items, setItems] = useState<Product[]>([]);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const refresh = () => {
    setItems(getAdminProducts({ includeHidden: true }));
    setHiddenIds(getHiddenIds());
  };
  useEffect(refresh, []);
  const hidden = (id: string) => hiddenIds.includes(id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((p) => {
      if (filter === "live" && hiddenIds.includes(p.id)) return false;
      if (filter === "hidden" && !hiddenIds.includes(p.id)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [items, hiddenIds, query, filter]);

  const live = items.filter((p) => !hiddenIds.includes(p.id));
  const totalUnits = live.reduce((n, p) => n + p.stock, 0);
  const low = live.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK).length;
  const out = live.filter((p) => p.stock === 0).length;

  const stats = [
    { label: "Live products", value: live.length },
    { label: "Inventory units", value: totalUnits },
    { label: "Low stock", value: low },
    { label: "Out of stock", value: out },
  ];

  function saveStock(id: string) {
    const v = drafts[id];
    if (v === undefined || v === "") return;
    updateStock(id, Number(v));
    setDrafts((d) => {
      const next = { ...d };
      delete next[id];
      return next;
    });
    refresh();
  }

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-forest sm:text-3xl">
            {TAB_HEADING[tab]}
          </h1>
          <p className="mt-1 text-sm text-forest/60">{TAB_SUBTITLE[tab]}</p>
        </div>
        {tab === "catalog" && (
          <Link
            href="/studio/products/new"
            className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream hover:bg-ink"
          >
            + Add product
          </Link>
        )}
      </div>

      <div className="mt-5 inline-flex rounded-full border border-forest/15 bg-white/60 p-1">
        {(["catalog", "offers", "combos"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              tab === t ? "bg-forest text-cream" : "text-forest/65 hover:text-forest"
            }`}
          >
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      {tab === "offers" ? (
        <div className="mt-6">
          <AdminOffers />
        </div>
      ) : tab === "combos" ? (
        <div className="mt-6">
          <AdminCombos />
        </div>
      ) : (
        <>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-forest/8 bg-white/60 p-4">
            <p className="text-xs text-forest/55">{s.label}</p>
            <p className="mt-1 font-serif text-2xl font-semibold text-forest">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, SKU or category…"
          className="w-full max-w-md rounded-full border border-forest/15 bg-white px-5 py-2.5 text-sm focus:border-moss focus:outline-none"
        />
        <div className="inline-flex rounded-full border border-forest/15 bg-white/60 p-1">
          {(["all", "live", "hidden"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition-colors ${
                filter === f ? "bg-forest text-cream" : "text-forest/65 hover:text-forest"
              }`}
            >
              {f}
              {f === "hidden" && hiddenIds.length > 0 ? ` (${hiddenIds.length})` : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-forest/8 bg-white/60">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-forest/8 text-left text-xs uppercase tracking-wide text-forest/50">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest/8">
            {filtered.map((p) => {
              const custom = isCustomProduct(p.id);
              const draft = drafts[p.id];
              const dirty = draft !== undefined && draft !== String(p.stock);
              return (
                <tr key={p.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-md bg-parchment object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-forest">
                          {p.name || <span className="text-forest/40">Untitled</span>}
                        </p>
                        <p className="truncate text-xs text-forest/50">
                          {p.sku} {custom && <span className="text-moss">· custom</span>}
                          {hidden(p.id) && (
                            <span className="ml-1 rounded-full bg-forest/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-forest/70">
                              Hidden
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-forest/70">{p.category.replace("-", " ")}</td>
                  <td className="px-4 py-3 text-forest/80">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        value={draft ?? String(p.stock)}
                        onChange={(e) => setDrafts((d) => ({ ...d, [p.id]: e.target.value }))}
                        className={`w-20 rounded-md border px-2 py-1 text-sm focus:outline-none ${
                          p.stock === 0
                            ? "border-clay/40 text-clay"
                            : p.stock <= LOW_STOCK
                              ? "border-clay/30"
                              : "border-forest/15"
                        }`}
                      />
                      {dirty && (
                        <button
                          type="button"
                          onClick={() => saveStock(p.id)}
                          className="rounded-full bg-moss px-3 py-1 text-xs font-medium text-cream hover:bg-forest"
                        >
                          Save
                        </button>
                      )}
                      {!dirty && p.stock === 0 && (
                        <span className="rounded-full bg-clay/10 px-2 py-0.5 text-xs font-medium text-clay">
                          Out
                        </span>
                      )}
                      {!dirty && p.stock > 0 && p.stock <= LOW_STOCK && (
                        <span className="rounded-full bg-clay/10 px-2 py-0.5 text-xs font-medium text-clay">
                          Low
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/studio/products/${p.id}`}
                        className="text-sm font-medium text-moss hover:text-forest"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setProductHidden(p.id, !hidden(p.id));
                          refresh();
                        }}
                        className="text-sm font-medium text-forest/60 hover:text-forest"
                      >
                        {hidden(p.id) ? "Unhide" : "Hide"}
                      </button>
                      {!custom && (
                        <button
                          type="button"
                          onClick={() => {
                            resetProduct(p.id);
                            refresh();
                          }}
                          className="text-sm font-medium text-forest/50 hover:text-forest"
                        >
                          Reset
                        </button>
                      )}
                      {custom && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete "${p.name}"? This permanently removes the custom product.`)) {
                              deleteProduct(p.id);
                              refresh();
                            }
                          }}
                          className="text-sm font-medium text-clay/80 hover:text-clay"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-forest/55">No products match “{query}”.</p>
        )}
        </div>
      </div>

      <p className="mt-4 text-xs text-forest/45">
        <b>Hidden</b> products stay in this list (see the Hidden filter) but are removed from the
        storefront &amp; search — use <b>Unhide</b> to bring one back. <b>Reset</b> reverts a seed
        product to its original values; <b>Delete</b> permanently removes a custom product. Demo
        edits are saved on this device; in production they map to the Supabase catalog &amp; inventory
        tables and reflect on the live storefront.
      </p>
        </>
      )}
    </div>
  );
}
