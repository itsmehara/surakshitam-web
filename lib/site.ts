import type { CategorySlug } from "./types";

/**
 * Central brand + site configuration.
 * Edit here to update navigation, contact details, and metadata site-wide.
 */

export const site = {
  name: "Surakshitam Naturals",
  shortName: "Surakshitam",
  tagline: "Homemade, plant-based care",
  description:
    "Homemade, plant-based home care, skin care and hair care from Hyderabad — herbal soaps, natural cleaners and hair care made with natural essential oils for everyday, sustainable living.",
  url: "https://surakshitamnaturals.example", // DEMO — replace with production domain
  locale: "en_IN",
  currency: "INR",
  email: "surakshitamnatural@gmail.com",
  phone: "+91 74163 94594",
  whatsapp: "+91 74163 94594",
  address: {
    line1: "Plot No. 40, Road No. 13, Hanuman Nagar",
    line2: "Jaipuri Colony, Nagole",
    city: "Hyderabad",
    postalCode: "500068",
    region: "Telangana",
    country: "IN",
  },
  instagramHandle: "surakshitam_naturals",
  social: {
    instagram: "https://www.instagram.com/surakshitam_naturals/",
    facebook: "https://www.facebook.com/profile.php?id=61580808786017",
    youtube: "https://www.youtube.com/@SurakshitamNaturals",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
};

/** Primary navigation kept deliberately simple (per IA spec). */
export const primaryNav: NavItem[] = [
  { label: "Shop", href: "/shop" },
  { label: "Offers", href: "/offers" },
  { label: "Home Care", href: "/shop?category=home-care" },
  { label: "Skin Care", href: "/shop?category=skin-care" },
  { label: "Hair Care", href: "/shop?category=hair-care" },
  { label: "Pantry", href: "/shop?category=pantry" },
  { label: "Our Story", href: "/our-story" },
  { label: "Ingredients", href: "/ingredients" },
  { label: "Learn", href: "/learn" },
];

export type Concern = {
  slug: string;
  name: string;
  /**
   * Which category shelves this tag belongs on. The shop page only offers a
   * concern when the shelf being browsed actually uses it — so Home Care never
   * shows "Dry Skin" or "Dandruff" filters.
   */
  categories: CategorySlug[];
};

/** Curated "shop by concern" tags — kept short and customer-language, not ingredient-language. */
export const concerns: Concern[] = [
  // Skin
  { slug: "dry-skin", name: "Dry Skin", categories: ["skin-care"] },
  { slug: "sensitive-skin", name: "Sensitive Skin", categories: ["skin-care"] },
  // Hair
  { slug: "dandruff", name: "Dandruff", categories: ["hair-care"] },
  { slug: "hair-fall", name: "Hair Fall", categories: ["hair-care"] },
  { slug: "frizz-control", name: "Frizz & Shine", categories: ["hair-care"] },
  // Home
  { slug: "kitchen-grease", name: "Kitchen Grease", categories: ["home-care"] },
  { slug: "floors-surfaces", name: "Floors & Surfaces", categories: ["home-care"] },
  { slug: "laundry", name: "Laundry Care", categories: ["home-care"] },
  { slug: "deep-clean", name: "Deep Clean", categories: ["home-care"] },
  // Shared
  { slug: "daily-freshness", name: "Daily Freshness", categories: ["home-care", "skin-care"] },
];

/** The concerns worth offering for a shelf — all of them when nothing is filtered. */
export function concernsForCategory(category?: string): Concern[] {
  if (!category) return concerns;
  return concerns.filter((c) => c.categories.includes(category as CategorySlug));
}

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Shop",
    items: [
      { label: "All Products", href: "/shop" },
      { label: "Offers & Combos", href: "/offers" },
      { label: "Home Care", href: "/shop?category=home-care" },
      { label: "Skin Care", href: "/shop?category=skin-care" },
      { label: "Hair Care", href: "/shop?category=hair-care" },
      { label: "Pantry & Foods", href: "/shop?category=pantry" },
      { label: "Best Sellers", href: "/shop?sort=best-selling" },
    ],
  },
  {
    title: "About",
    items: [
      { label: "Our Story", href: "/our-story" },
      { label: "Our Philosophy", href: "/our-story#philosophy" },
      { label: "Ingredients", href: "/ingredients" },
      { label: "Learn", href: "/learn" },
    ],
  },
  {
    title: "Help",
    items: [
      { label: "FAQs", href: "/faqs" },
      { label: "Contact", href: "/contact" },
      { label: "Track Order", href: "/track-order" },
      { label: "Shipping Policy", href: "/policies/shipping" },
      { label: "Returns", href: "/policies/returns" },
    ],
  },
];
