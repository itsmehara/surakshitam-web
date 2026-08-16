"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getAdminProduct,
  saveProduct,
  blankProduct,
  withSlug,
  isCustomProduct,
  getStockHistory,
  type StockAuditEvent,
} from "@/lib/catalog-store";
import type { Product, CategorySlug } from "@/lib/types";

const CATEGORIES: { slug: CategorySlug; label: string }[] = [
  { slug: "home-care", label: "Home Care" },
  { slug: "skin-care", label: "Skin Care" },
  { slug: "hair-care", label: "Hair Care" },
];

const linesToArray = (s: string) =>
  s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

export function AdminProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const [p, setP] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  // Text-area mirrors for list fields + rupee mirrors for prices.
  const [benefits, setBenefits] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [stockHistory, setStockHistory] = useState<StockAuditEvent[]>([]);

  useEffect(() => {
    if (productId) {
      const found = getAdminProduct(productId);
      if (!found) {
        setNotFound(true);
        return;
      }
      setP(found);
      setBenefits(found.benefits.join("\n"));
      setIngredients(found.keyIngredients.join("\n"));
      setStockHistory(getStockHistory(productId));
    } else {
      setP(blankProduct());
    }
  }, [productId]);

  if (notFound) {
    return (
      <div className="container py-16 text-center text-forest/60">
        Product not found.{" "}
        <Link href="/studio/products" className="text-moss underline">
          Back to products
        </Link>
      </div>
    );
  }
  if (!p) return <div className="container py-16 text-center text-forest/50">Loading…</div>;

  const editingCustom = productId ? isCustomProduct(productId) : true;
  const set = (patch: Partial<Product>) => setP((prev) => (prev ? { ...prev, ...patch } : prev));
  const rupees = (paise: number) => (paise ? String(paise / 100) : "");
  const toPaise = (v: string) => Math.max(0, Math.round(Number(v || 0) * 100));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!p) return;
    const finalProduct = withSlug({
      ...p,
      benefits: linesToArray(benefits),
      keyIngredients: linesToArray(ingredients),
    });
    saveProduct(finalProduct);
    router.push("/studio/products");
  }

  const field = "w-full rounded-lg border border-forest/15 bg-white px-4 py-2.5 text-sm focus:border-moss focus:outline-none";
  const labelCls = "block text-xs font-medium text-forest/60";

  return (
    <div className="container max-w-3xl py-10">
      <Link href="/studio/products" className="text-sm font-medium text-moss hover:text-forest">
        ← Products
      </Link>
      <h1 className="mt-2 font-serif text-2xl font-semibold text-forest sm:text-3xl">
        {productId ? "Edit product" : "Add product"}
      </h1>
      {productId && !editingCustom && (
        <p className="mt-1 text-sm text-forest/55">
          Editing a seed product — use “Reset” on the products page to revert to the original.
        </p>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        {/* Basics */}
        <section className="rounded-lg border border-forest/8 bg-white/60 p-5">
          <h2 className="font-serif text-lg font-semibold text-forest">Basics</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Product name *</label>
              <input required value={p.name} onChange={(e) => set({ name: e.target.value })} className={`mt-1 ${field}`} />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select
                value={p.category}
                onChange={(e) => set({ category: e.target.value as CategorySlug })}
                className={`mt-1 ${field}`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>SKU</label>
              <input value={p.sku} onChange={(e) => set({ sku: e.target.value })} className={`mt-1 ${field}`} />
            </div>
            <div>
              <label className={labelCls}>Size (e.g. 100 ml)</label>
              <input value={p.size} onChange={(e) => set({ size: e.target.value })} className={`mt-1 ${field}`} />
            </div>
            <div>
              <label className={labelCls}>URL slug (auto if blank)</label>
              <input value={p.slug} onChange={(e) => set({ slug: e.target.value })} className={`mt-1 ${field}`} />
            </div>
          </div>
        </section>

        {/* Pricing & inventory */}
        <section className="rounded-lg border border-forest/8 bg-white/60 p-5">
          <h2 className="font-serif text-lg font-semibold text-forest">Pricing &amp; inventory</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls}>Price (₹) *</label>
              <input
                required
                type="number"
                min={0}
                step="0.01"
                value={rupees(p.price)}
                onChange={(e) => set({ price: toPaise(e.target.value) })}
                className={`mt-1 ${field}`}
              />
            </div>
            <div>
              <label className={labelCls}>MRP (₹, optional)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={p.mrp ? rupees(p.mrp) : ""}
                onChange={(e) => set({ mrp: e.target.value ? toPaise(e.target.value) : undefined })}
                className={`mt-1 ${field}`}
              />
            </div>
            <div>
              <label className={labelCls}>Stock (units)</label>
              <input
                type="number"
                min={0}
                value={String(p.stock)}
                onChange={(e) => set({ stock: Math.max(0, Math.round(Number(e.target.value || 0))) })}
                className={`mt-1 ${field}`}
              />
            </div>
          </div>
        </section>

        {/* Stock history */}
        {productId && (
          <section className="rounded-lg border border-forest/8 bg-white/60 p-5">
            <h2 className="font-serif text-lg font-semibold text-forest">Inventory audit history</h2>
            {stockHistory.length === 0 ? (
              <p className="mt-3 text-sm text-forest/55">No stock changes recorded yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-forest/8 text-sm">
                {stockHistory.map((e) => (
                  <li key={e.id} className="flex items-center justify-between py-2">
                    <span className="text-forest/70">
                      {new Date(e.ts).toLocaleString("en-IN")} · {e.actor}
                    </span>
                    <span className="font-medium text-forest">
                      {e.from} → {e.to}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Media */}
        <section className="rounded-lg border border-forest/8 bg-white/60 p-5">
          <h2 className="font-serif text-lg font-semibold text-forest">Image</h2>
          <div className="mt-4 flex items-start gap-4">
            <div className="flex-1">
              <label className={labelCls}>Image path or URL</label>
              <input value={p.image} onChange={(e) => set({ image: e.target.value })} className={`mt-1 ${field}`} />
              <p className="mt-1 text-xs text-forest/45">
                Use an existing path like <code>/products/hair-oil.webp</code> or a full image URL. In
                production, admins upload images (stored in Supabase Storage).
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.image || "/products/placeholder.webp"}
              alt="Preview"
              className="h-24 w-24 shrink-0 rounded-lg border border-forest/10 bg-parchment object-cover"
            />
          </div>
        </section>

        {/* Descriptions */}
        <section className="rounded-lg border border-forest/8 bg-white/60 p-5">
          <h2 className="font-serif text-lg font-semibold text-forest">Description</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className={labelCls}>Short description (shown on cards)</label>
              <input
                value={p.shortDescription}
                onChange={(e) => set({ shortDescription: e.target.value })}
                className={`mt-1 ${field}`}
              />
            </div>
            <div>
              <label className={labelCls}>Full description</label>
              <textarea
                rows={4}
                value={p.description}
                onChange={(e) => set({ description: e.target.value })}
                className={`mt-1 ${field}`}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Benefits (one per line)</label>
                <textarea rows={4} value={benefits} onChange={(e) => setBenefits(e.target.value)} className={`mt-1 ${field}`} />
              </div>
              <div>
                <label className={labelCls}>Key ingredients (one per line)</label>
                <textarea rows={4} value={ingredients} onChange={(e) => setIngredients(e.target.value)} className={`mt-1 ${field}`} />
              </div>
            </div>
            <div>
              <label className={labelCls}>How to use</label>
              <textarea rows={2} value={p.usage} onChange={(e) => set({ usage: e.target.value })} className={`mt-1 ${field}`} />
            </div>
          </div>
        </section>

        {/* Flags */}
        <section className="rounded-lg border border-forest/8 bg-white/60 p-5">
          <h2 className="font-serif text-lg font-semibold text-forest">Merchandising</h2>
          <div className="mt-4 flex flex-wrap gap-5 text-sm text-forest/75">
            {([
              ["featured", "Featured"],
              ["bestSeller", "Best seller"],
              ["isNew", "New"],
            ] as const).map(([key, lbl]) => (
              <label key={key} className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(p[key])}
                  onChange={(e) => set({ [key]: e.target.checked } as Partial<Product>)}
                  className="h-4 w-4 rounded border-forest/30 text-forest focus:ring-moss"
                />
                {lbl}
              </label>
            ))}
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button type="submit" className="rounded-full bg-forest px-6 py-3 text-sm font-medium text-cream hover:bg-ink">
            {productId ? "Save changes" : "Create product"}
          </button>
          <Link href="/studio/products" className="text-sm font-medium text-forest/60 hover:text-forest">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
