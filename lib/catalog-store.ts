/**
 * Admin catalog store (prototype).
 *
 * The storefront reads the static seed catalog in `catalog.ts` (server-rendered
 * for SEO). This store lets the admin manage products/inventory on top of that
 * seed, persisted in localStorage so the demo is self-contained:
 *
 *   - edit an existing product (price, stock, description, image, …)
 *   - add a brand-new product
 *   - update / restock inventory
 *   - hide a product
 *
 * PRODUCTION: this maps to a Supabase `products` + `inventory` table with an
 * admin-only API. See docs/ADMIN_WORKFLOWS.md. Image uploads map to Supabase
 * Storage; in the prototype an image path/URL is entered directly.
 */

import { products as seedProducts } from "./catalog";
import type { Product, CategorySlug } from "./types";
import { getAdminSession } from "./admin";

const KEY = "sn-catalog-v1";
const STOCK_AUDIT_KEY = "sn-stock-audit-v1";

export interface StockAuditEvent {
  id: string;
  ts: string;
  productId: string;
  productName: string;
  from: number;
  to: number;
  actor: string;
}

function readStockAudit(): StockAuditEvent[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STOCK_AUDIT_KEY) || "[]") as StockAuditEvent[];
  } catch {
    return [];
  }
}

function writeStockAudit(list: StockAuditEvent[]) {
  try {
    localStorage.setItem(STOCK_AUDIT_KEY, JSON.stringify(list.slice(0, 500)));
  } catch {
    /* ignore */
  }
}

function logStockChange(productId: string, productName: string, from: number, to: number, actorOverride?: string) {
  if (from === to) return;
  const actor = actorOverride ?? (getAdminSession()?.name ?? "Admin");
  const evt: StockAuditEvent = {
    id: `sa_${Math.random().toString(36).slice(2, 10)}`,
    ts: new Date().toISOString(),
    productId,
    productName,
    from,
    to,
    actor,
  };
  const all = readStockAudit();
  all.unshift(evt);
  writeStockAudit(all);
}

/** Stock-change history for a product, most recent first. */
export function getStockHistory(productId: string): StockAuditEvent[] {
  return readStockAudit().filter((e) => e.productId === productId);
}

interface CatalogState {
  /** Full Product objects keyed by id — covers edited seed products AND new ones. */
  overrides: Record<string, Product>;
  /** Ids of seed products the admin has hidden. */
  hidden: string[];
}

function read(): CatalogState {
  if (typeof window === "undefined") return { overrides: {}, hidden: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { overrides: {}, hidden: [] };
    const parsed = JSON.parse(raw) as Partial<CatalogState>;
    return { overrides: parsed.overrides ?? {}, hidden: parsed.hidden ?? [] };
  } catch {
    return { overrides: {}, hidden: [] };
  }
}

function write(state: CatalogState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

/**
 * Category slugs that have been renamed. Products saved by an admin before the
 * rename keep their old slug in localStorage, so normalise on read rather than
 * leaving them stranded in a category that no longer exists.
 */
const CATEGORY_MIGRATIONS: Record<string, CategorySlug> = { pantry: "partner-brands" };

function migrateProduct(product: Product): Product {
  const renamed = CATEGORY_MIGRATIONS[product.category as string];
  return renamed ? { ...product, category: renamed } : product;
}

/** True if the id is a brand-new admin product (not part of the seed catalog). */
export function isCustomProduct(id: string): boolean {
  return !seedProducts.some((p) => p.id === id);
}

/**
 * Merged catalog: seed overlaid with admin edits + additions.
 * By default hidden products are excluded (storefront / dashboard view). Pass
 * `{ includeHidden: true }` for the admin management table.
 */
export function getAdminProducts(opts?: { includeHidden?: boolean }): Product[] {
  const { overrides, hidden } = read();
  const map = new Map<string, Product>();
  for (const p of seedProducts) map.set(p.id, p);
  for (const [id, p] of Object.entries(overrides)) map.set(id, migrateProduct(p));
  if (!opts?.includeHidden) for (const id of hidden) map.delete(id);
  return [...map.values()];
}

export function getAdminProduct(id: string): Product | undefined {
  return getAdminProducts({ includeHidden: true }).find((p) => p.id === id);
}

export function getHiddenIds(): string[] {
  return read().hidden;
}

export function isHidden(id: string): boolean {
  return read().hidden.includes(id);
}

/** Toggle a product's hidden state (works for seed and custom products). */
export function setProductHidden(id: string, hidden: boolean): void {
  const state = read();
  const has = state.hidden.includes(id);
  if (hidden && !has) state.hidden.push(id);
  if (!hidden && has) state.hidden = state.hidden.filter((h) => h !== id);
  write(state);
}

/** Create or update a product. */
export function saveProduct(product: Product, actorOverride?: string): void {
  const previous = getAdminProduct(product.id);
  const state = read();
  state.overrides[product.id] = product;
  state.hidden = state.hidden.filter((h) => h !== product.id);
  write(state);
  if (previous) logStockChange(product.id, product.name, previous.stock, product.stock, actorOverride);
}

/** Fast inventory update. */
export function updateStock(id: string, stock: number): void {
  const current = getAdminProduct(id);
  if (!current) return;
  saveProduct({ ...current, stock: Math.max(0, Math.round(stock)) });
}

/**
 * Reduces stock for each line item in a placed order (stock never goes below 0).
 * Called once from `createOrder()` so every order — checkout or otherwise — keeps
 * inventory accurate without admins having to manually adjust it after each sale.
 * Logged to the same stock-audit history as manual admin edits, attributed to
 * "Order placed" rather than an admin name (the customer isn't an admin session).
 */
export function decrementStockForOrder(items: { productId: string; qty: number }[]): void {
  for (const item of items) {
    const current = getAdminProduct(item.productId);
    if (!current) continue; // custom/removed product — nothing to decrement
    const next = Math.max(0, current.stock - item.qty);
    saveProduct({ ...current, stock: next }, "Order placed");
  }
}

/** Permanently remove a custom product. (Seed products can only be hidden.) */
export function deleteProduct(id: string): void {
  if (!isCustomProduct(id)) return;
  const state = read();
  delete state.overrides[id];
  state.hidden = state.hidden.filter((h) => h !== id);
  write(state);
}

/** Revert a seed product to its original values / un-hide it. */
export function resetProduct(id: string): void {
  const state = read();
  delete state.overrides[id];
  state.hidden = state.hidden.filter((h) => h !== id);
  write(state);
}

/** Reset the whole admin catalog back to the seed. */
export function resetCatalog(): void {
  write({ overrides: {}, hidden: [] });
}

/* ------------------------------ helpers ------------------------------ */

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** A blank product scaffold for the "add product" form. */
export function blankProduct(): Product {
  const id = `p-custom-${Date.now()}`;
  return {
    id,
    slug: "",
    name: "",
    category: "home-care" as CategorySlug,
    shortDescription: "",
    description: "",
    benefits: [],
    keyIngredients: [],
    usage: "",
    size: "",
    price: 0,
    sku: "",
    image: "/products/placeholder.webp",
    stock: 0,
  };
}

/** Ensure a product has a slug (derived from name if empty). */
export function withSlug(product: Product): Product {
  return { ...product, slug: product.slug?.trim() || slugify(product.name) };
}
