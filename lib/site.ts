import { categories } from "./catalog";
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
  url: "https://www.surakshitamnaturals.com",
  locale: "en_IN",
  currency: "INR",
  email: "surakshitamnatural@gmail.com",
  phone: "+91 74163 94594",
  whatsapp: "+91 74163 94594",
  hours: "10 am – 6 pm",
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
    facebook: "https://www.facebook.com/surakshitam.naturals",
    youtube: "https://www.youtube.com/@SurakshitamNaturals",
  },
} as const;

/**
 * Short menu blurbs, kept separate from the category descriptions in
 * `catalog.ts` — those are written for the homepage cards and are far too long
 * for a dropdown row.
 */
export const categoryBlurbs: Partial<Record<CategorySlug, string>> = {
  "home-care": "Bio-enzyme & everyday cleaning",
  "skin-care": "Soaps, cleansers & creams",
  "hair-care": "Shampoo, oils, packs & serums",
  "partner-brands": "Homemade foods from makers we know",
};

export type NavItem = {
  label: string;
  href: string;
  /** One line shown beside the label inside a dropdown. Ignored at top level. */
  description?: string;
  /** Nested items — renders as a dropdown on desktop, indented in the drawer. */
  children?: NavItem[];
};

/**
 * Primary navigation.
 *
 * The category shelves live *inside* Shop rather than beside it. Flat category
 * links read fine with three of them and broke the header at four ("Partner
 * Brands" pushed the row past the 1200px container at every screen width, so
 * labels wrapped mid-word). Nesting them fixes that permanently: the shelf list
 * is generated from `categories`, so adding a fifth or sixth costs the header
 * nothing at all.
 *
 * What stays at the top level is what isn't a shelf — the brand pages people
 * navigate to directly, and Contact (v3 is a listing site: every order starts
 * with a conversation, so the contact page is a primary destination).
 */
export const primaryNav: NavItem[] = [
  {
    label: "Shop",
    href: "/shop",
    children: [
      { label: "All Products", href: "/shop", description: "The full range" },
      // Built from the catalogue so a new shelf appears here on its own.
      ...categories.map((c) => ({
        label: c.name,
        href: `/shop?category=${c.slug}`,
        description: categoryBlurbs[c.slug] ?? "",
      })),
    ],
  },
  { label: "Our Story", href: "/our-story" },
  { label: "Ingredients", href: "/ingredients" },
  { label: "Learn", href: "/learn" },
  {
    label: "Contact",
    href: "/contact",
    // Each child opens the same enquiry form with the type pre-selected (?type=).
    children: [
      { label: "Product Enquiry", href: "/contact?type=product", description: "Price, availability & delivery" },
      { label: "Partner With Us", href: "/contact?type=partner", description: "Promote your homemade brand with us" },
      { label: "Book a Consultation", href: "/contact?type=consultation", description: "First 30 min free · Mon–Sat, 10 am – 5 pm" },
    ],
  },
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
      { label: "Home Care", href: "/shop?category=home-care" },
      { label: "Skin Care", href: "/shop?category=skin-care" },
      { label: "Hair Care", href: "/shop?category=hair-care" },
      { label: "Partner Brands", href: "/shop?category=partner-brands" },
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
    title: "Reach us",
    items: [
      { label: "Contact & enquiries", href: "/contact" },
      { label: "Order on WhatsApp", href: "/contact#whatsapp" },
      { label: "Instagram", href: "https://www.instagram.com/surakshitam_naturals/" },
      { label: "YouTube", href: "https://www.youtube.com/@SurakshitamNaturals" },
    ],
  },
];
