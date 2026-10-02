/**
 * Domain types for the storefront.
 * Designed to map cleanly onto a future database / CMS schema
 * (see docs/DATA_MODEL.md).
 *
 * v4-whatsapp-orders: every product carries its pack sizes with an MRP each
 * (PRODUCT-CATALOG-NOTES-2026-09-19 §7.1). Still no stock or ratings — the
 * order itself goes through WhatsApp; a real backend is v5.
 */

export type CategorySlug = "home-care" | "skin-care" | "hair-care" | "partner-brands";

/**
 * One pack size of a product. Price lives here, never on the product, so a
 * card always shows the price of a specific pack. Exactly one size per product
 * is `default` — the bigger pack, per Supriya (19 Sep) — and a product with a
 * single size is still an array of one. `mrp` missing = "price on request".
 */
export interface ProductSize {
  /** Stable key used in cart lines and URLs — "500ml", "1l", "100g", "box". */
  id: string;
  /** What the customer sees — "500 ml", "1 L", "100 g". */
  label: string;
  /** Maximum retail price in whole rupees, inclusive of taxes. */
  mrp?: number;
  default?: boolean;
  /**
   * This pack is temporarily unavailable: it still shows on the card and the
   * product page (so people know the size exists) but cannot be added to the
   * cart. Set per size — a product is never sold out as a whole.
   */
  soldOut?: boolean;
}

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
  /**
   * Wide "everything on this shelf" photo used by the homepage category cards —
   * the whole range in one shot, rather than a single product standing in for it.
   */
  groupImage?: string;
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
  /**
   * Ingredient list as printed on the pack. Home Care and the hair oil are
   * Supriya's lists (19 Sep 2026); the rest still await hers.
   */
  keyIngredients: string[];
  /** How to use — demo content, founder verification recommended. */
  usage: string;
  /** Pack sizes with MRP; see ProductSize. */
  sizes: ProductSize[];
  sku: string;
  image: string;
  /** Optional gallery of additional images (Amazon-style). Falls back to [image]. */
  images?: string[];
  /** Optional alternate image shown on hover. */
  imageAlt?: string;
  featured?: boolean;
  bestSeller?: boolean;
  isNew?: boolean;
  /** Customer-concern tags (see lib/site.ts `concerns`) for "shop by concern" browsing. */
  concerns?: string[];
  /**
   * Set for stock we resell rather than make — other companies' foods, pantry
   * staples and everyday goods. The brand is shown instead of our own so nothing
   * implies these were made by Surakshitam, and they fall back to a neutral,
   * unbranded placeholder image (see lib/catalog.ts `productImage`).
   */
  brand?: string;
  /** True for third-party/resold stock. Drives the "Brand partner" labelling. */
  thirdParty?: boolean;
}

/**
 * Ingredient family ("Botanicals & herbs", "Plant butters & oils", …).
 *
 * Deliberately a free string rather than a fixed union: the admin can add and
 * rename families from Studio without a code change. The four we ship with are
 * `DEFAULT_INGREDIENT_GROUPS` in lib/ingredients.ts, and the live list is
 * managed by lib/ingredient-store.ts.
 */
export type IngredientGroup = string;

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
