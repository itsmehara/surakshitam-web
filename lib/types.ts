/**
 * Domain types for the storefront.
 * Designed to map cleanly onto a future database / CMS schema
 * (see docs/DATA_MODEL.md). Prices are stored in paise (integer,
 * smallest currency unit) to avoid floating-point errors.
 */

export type CategorySlug = "home-care" | "skin-care" | "hair-care";

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
