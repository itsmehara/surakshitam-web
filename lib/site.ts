/**
 * Central brand + site configuration.
 * Edit here to update navigation, contact details, and metadata site-wide.
 */

export const site = {
  name: "Surakshitam Naturals",
  shortName: "Surakshitam",
  tagline: "Homemade, plant-based care",
  description:
    "Homemade, plant-based home-care and personal-care from Hyderabad — herbal soaps and natural cleaners made with natural essential oils for everyday, sustainable living.",
  url: "https://surakshitamnaturals.example", // DEMO — replace with production domain
  locale: "en_IN",
  currency: "INR",
  email: "", // No public email supplied yet — WhatsApp/phone are the contact channels
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
  social: {
    instagram: "https://instagram.com/", // TODO — add real handle
    facebook: "https://facebook.com/", // TODO — add real handle
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
};

/** Primary navigation kept deliberately simple (per IA spec). */
export const primaryNav: NavItem[] = [
  { label: "Shop", href: "/shop" },
  { label: "Home Care", href: "/shop?category=home-care" },
  { label: "Personal Care", href: "/shop?category=personal-care" },
  { label: "Our Story", href: "/our-story" },
  { label: "Ingredients", href: "/ingredients" },
  { label: "Learn", href: "/learn" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Shop",
    items: [
      { label: "All Products", href: "/shop" },
      { label: "Home Care", href: "/shop?category=home-care" },
      { label: "Personal Care", href: "/shop?category=personal-care" },
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
      { label: "Contact", href: "/contact" },
      { label: "Track Order", href: "/track-order" },
      { label: "Shipping Policy", href: "/policies/shipping" },
      { label: "Returns", href: "/policies/returns" },
    ],
  },
];
