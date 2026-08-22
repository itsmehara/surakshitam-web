/**
 * Domain types for the storefront.
 * Designed to map cleanly onto a future database / CMS schema
 * (see docs/DATA_MODEL.md). Prices are stored in paise (integer,
 * smallest currency unit) to avoid floating-point errors.
 */

export type CategorySlug = "home-care" | "skin-care" | "hair-care" | "pantry";

/**
 * Home care splits into two shelves: bio-enzyme formulations (fermented plant
 * waste — biodegradable, safe for drains and soil) and the general range.
 */
export type HomeCareType = "bio-enzyme" | "general";

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  /** One-line purpose shown on cards. */
  shortDescription: string;
  /** Longer marketing description for the PDP. */
  description: string;
  /** Key benefits — supportable, non-medical claims only. */
  benefits: string[];
  /** Human-readable hero ingredients (demo content). */
  keyIngredients: string[];
  /** How to use — demo content, founder verification recommended. */
  usage: string;
  size: string;
  /**
   * Approximate shipped weight of one unit, in grams. Optional — when absent it
   * is derived from `size` (see lib/weight.ts). Always presented to customers
   * as approximate.
   */
  weightGrams?: number;
  /** Selling price in paise. DEMO PRICE — REPLACE. */
  price: number;
  /** MRP in paise, if discounted. DEMO PRICE — REPLACE. */
  mrp?: number;
  sku: string;
  image: string;
  /** Optional gallery of additional images (Amazon-style). Falls back to [image]. */
  images?: string[];
  /** Optional alternate image shown on hover. */
  imageAlt?: string;
  rating?: number;
  reviewCount?: number;
  stock: number;
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  /** Customer-concern tags (see lib/site.ts `concerns`) for "shop by concern" browsing. */
  concerns?: string[];
  /** Home-care only: which shelf this belongs to. Defaults to "general". */
  homeCareType?: HomeCareType;
  /**
   * Set for stock we resell rather than make — other companies' food and pantry
   * goods. The brand is shown instead of our own so nothing implies these were
   * made by Surakshitam, and they fall back to a neutral, unbranded placeholder
   * image (see lib/catalog.ts `productImage`).
   */
  brand?: string;
  /** True for third-party/resold stock. Drives the "Brand partner" labelling. */
  thirdParty?: boolean;
}

export type IngredientGroup =
  | "Botanicals & herbs"
  | "Plant butters & oils"
  | "Natural cleansers"
  | "Essential oils & extracts";

export interface Ingredient {
  slug: string;
  name: string;
  botanicalName?: string;
  group: IngredientGroup;
  /** One-line summary for cards. */
  summary: string;
  /** Why we reach for it — plain, non-medical language. */
  why: string;
  /** Short, supportable descriptors. */
  properties: string[];
  /** Product names that use it. */
  usedIn: string[];
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  product: string;
}
