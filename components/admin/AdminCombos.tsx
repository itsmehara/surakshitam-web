"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getBundles,
  saveBundle,
  deleteBundle,
  blankBundle,
  bundleRegularTotal,
  bundleSavings,
  type Bundle,
} from "@/lib/bundles";
import { getAdminProducts } from "@/lib/catalog-store";
import { formatPrice } from "@/lib/format";

export function AdminCombos() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Bundle>(blankBundle());
  const [error, setError] = useState("");

  const products = useMemo(() => getAdminProducts(), []);

  const refresh = () => setBundles(getBundles());
  useEffect(refresh, []);

  function startAdd() {
    setDraft(blankBundle());
    setError("");
    setEditingId("new");
  }

  function startEdit(b: Bundle) {
    setDraft(b);
    setError("");
    setEditingId(b.id);
  }

  function cancel() {
    setEditingId(null);
    setError("");
  }

  function toggleProduct(id: string) {
    setDraft((d) =>
      d.productIds.includes(id)
        ? { ...d, productIds: d.productIds.filter((p) => p !== id) }
        : { ...d, productIds: [...d.productIds, id] },
    );
  }

  function save() {
    if (!draft.name.trim()) {
      setError("Enter a combo name.");
      return;
    }
    if (draft.productIds.length < 2) {
      setError("Pick at least 2 products for the combo.");
      return;
    }
    if (draft.price <= 0) {
      setError("Set a combo price.");
      return;
    }
    const slug = (draft.slug.trim() || draft.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const clash = bundles.some((b) => b.id !== draft.id && b.slug === slug);
    if (clash) {
      setError("Another combo already uses this name/slug.");
      return;
    }
    saveBundle({ ...draft, slug });
    cancel();
    refresh();
  }

  function remove(b: Bundle) {
    if (!confirm(`Delete the "${b.name}" combo? This can't be undone.`)) return;
    deleteBundle(b.id);
    refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-forest/60">
          Bundle 2 or more products at a special price. Adding a combo to cart adds its
          components — the discount applies automatically at checkout when all of them are
          present.
        </p>
        {editingId === null && (
          <button
            type="button"
            onClick={startAdd}
            className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream hover:bg-ink"
          >
            + Add combo
          </button>
        )}
      </div>

      {editingId !== null && (
        <div className="mt-5 rounded-lg border border-forest/8 bg-white/60 p-5">
          <h2 className="font-serif text-lg font-semibold text-forest">
            {editingId === "new" ? "Add combo" : `Edit ${draft.name || "combo"}`}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-forest">Name</span>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Daily Essentials Kit"
                className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 focus:border-moss focus:outline-none"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-forest">Combo price (₹)</span>
              <input
                type="number"
                min={0}
                value={draft.price ? draft.price / 100 : ""}
                onChange={(e) =>
                  setDraft({ ...draft, price: Math.round(Number(e.target.value || 0) * 100) })
                }
                className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 focus:border-moss focus:outline-none"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block font-medium text-forest">Description</span>
              <input
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                placeholder="Everything you need to get started, at a special price."
                className="w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 focus:border-moss focus:outline-none"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-forest/75">
              <input
                type="checkbox"
                checked={draft.enabled}
                onChange={(e) => setDraft({ ...draft, enabled: e.target.checked })}
              />
              Enabled
            </label>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-forest">
              Products in this combo ({draft.productIds.length} selected)
            </p>
            <div className="max-h-64 overflow-y-auto rounded-lg border border-forest/10">
              {products.map((p) => (
                <label
                  key={p.id}
                  className="flex items-center gap-3 border-b border-forest/8 px-3 py-2 text-sm last:border-b-0 hover:bg-parchment/50"
                >
                  <input
                    type="checkbox"
                    checked={draft.productIds.includes(p.id)}
                    onChange={() => toggleProduct(p.id)}
                  />
                  <span className="flex-1 text-forest/85">{p.name}</span>
                  <span className="text-forest/50">{formatPrice(p.price)}</span>
                </label>
              ))}
            </div>
            {draft.productIds.length >= 2 && (
              <p className="mt-2 text-xs text-forest/55">
                Regular total: {formatPrice(bundleRegularTotal(draft))}
                {draft.price > 0 && bundleSavings(draft) > 0 && (
                  <> · Customer saves {formatPrice(bundleSavings(draft))}</>
                )}
              </p>
            )}
          </div>

          {error && <p className="mt-3 text-sm text-clay">{error}</p>}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={save}
              className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-cream hover:bg-ink"
            >
              Save
            </button>
            <button
              type="button"
              onClick={cancel}
              className="rounded-full border border-forest/20 px-5 py-2.5 text-sm font-medium text-forest hover:bg-forest/5"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-lg border border-forest/8 bg-white/60">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-forest/8 text-left text-xs uppercase tracking-wide text-forest/50">
                <th className="px-4 py-3 font-medium">Combo</th>
                <th className="px-4 py-3 font-medium">Products</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/8">
              {bundles.map((b) => (
                <tr key={b.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-forest">{b.name}</p>
                    {b.description && <p className="text-xs text-forest/50">{b.description}</p>}
                  </td>
                  <td className="px-4 py-3 text-forest/70">{b.productIds.length} products</td>
                  <td className="px-4 py-3 text-forest/80">
                    {formatPrice(b.price)}
                    {bundleSavings(b) > 0 && (
                      <span className="block text-xs text-moss">
                        Save {formatPrice(bundleSavings(b))}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        b.enabled ? "bg-moss/10 text-moss" : "bg-forest/8 text-forest/50"
                      }`}
                    >
                      {b.enabled ? "Live" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(b)}
                        className="text-sm font-medium text-moss hover:text-forest"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(b)}
                        className="text-sm font-medium text-clay/80 hover:text-clay"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bundles.length === 0 && (
            <p className="px-4 py-10 text-center text-sm text-forest/55">
              No combos yet — bundle a few products together at a special price.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
