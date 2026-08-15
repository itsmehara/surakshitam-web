import type { Category, Product } from "./types";

/**
 * DEMO CATALOG — all pricing, ratings and stock are placeholder data.
 * Product names are read from the actual packaging supplied in /Products.
 * Replace prices marked "DEMO PRICE" and verify all copy with the founders
 * before publishing. This module is the single source of truth for the
 * prototype and can be swapped for a CMS / database query later.
 */

export const categories: Category[] = [
  {
    id: "cat-home",
    slug: "home-care",
    name: "Home Care",
    description:
      "Everyday cleaning essentials for kitchens, floors and utensils — thoughtfully formulated for daily use.",
    image: "/products/dishwash-liquid.webp",
  },
  {
    id: "cat-personal",
    slug: "personal-care",
    name: "Personal Care",
    description:
      "Gentle soaps, cleansers and care for skin and hair, made in small, considered batches.",
    image: "/products/shea-butter-soap.webp",
  },
];

// Prices in paise (₹1 = 100 paise). All values below are DEMO PRICE — REPLACE.
export const products: Product[] = [
  {
    id: "p-dishwash-liquid",
    slug: "natural-dishwash-liquid",
    name: "Natural Dishwash Liquid",
    category: "home-care",
    shortDescription: "Cuts grease on everyday utensils",
    description:
      "An everyday dishwashing liquid formulated to lift grease from utensils while remaining gentle on hands. Made in small batches with a light, clean scent.",
    benefits: ["Cuts everyday grease", "Gentle on hands", "Light natural scent"],
    keyIngredients: ["Plant-derived cleansers", "Lemon extract", "Glycerin"],
    usage: "Add a few drops to a wet sponge, work into a lather, then rinse thoroughly.",
    size: "500 ml",
    price: 19900,
    mrp: 24900,
    sku: "SN-HC-DWL-500",
    image: "/products/dishwash-liquid.webp",
    rating: 4.7,
    reviewCount: 128,
    stock: 42,
    featured: true,
    bestSeller: true,
  },
  {
    id: "p-dishwash-bar",
    slug: "dishwash-bar",
    name: "Natural Dishwash Bar",
    category: "home-care",
    shortDescription: "Long-lasting utensil cleaning bar",
    description:
      "A firm, long-lasting dishwashing bar for scrubbing utensils clean. A practical, low-waste alternative for the kitchen sink.",
    benefits: ["Long-lasting bar", "Low-waste format", "Tackles tough residue"],
    keyIngredients: ["Plant-derived cleansers", "Reetha (soapnut)"],
    usage: "Rub a damp sponge on the bar to build lather, clean, then rinse.",
    size: "200 g",
    price: 8900,
    sku: "SN-HC-DWB-200",
    image: "/products/dishwash-bar.webp",
    rating: 4.5,
    reviewCount: 64,
    stock: 30,
    bestSeller: true,
  },
  {
    id: "p-floor-cleaner",
    slug: "natural-floor-cleaner",
    name: "Natural Floor Cleaner",
    category: "home-care",
    shortDescription: "Fresh, streak-free floors",
    description:
      "A concentrated floor cleaner that leaves a fresh finish across everyday floor types. A little goes a long way when diluted.",
    benefits: ["Concentrated formula", "Fresh finish", "Everyday floor types"],
    keyIngredients: ["Plant-derived surfactants", "Citrus oils"],
    usage: "Dilute one capful in a bucket of water and mop as usual.",
    size: "500 ml",
    price: 21900,
    mrp: 26900,
    sku: "SN-HC-FLC-500",
    image: "/products/floor-cleaner.webp",
    rating: 4.6,
    reviewCount: 89,
    stock: 8,
    featured: true,
    bestSeller: true,
  },
  {
    id: "p-natural-pitambari",
    slug: "natural-utensil-shine",
    name: "Natural Utensil Shine",
    category: "home-care",
    shortDescription: "Restores shine to metal utensils",
    description:
      "A gentle scouring powder that helps restore shine to metal utensils and cookware without harsh fumes.",
    benefits: ["Restores metal shine", "Everyday cookware", "Little residue"],
    keyIngredients: ["Mineral cleansers", "Natural acids"],
    usage: "Sprinkle onto a damp cloth, rub the utensil, then rinse clean.",
    size: "200 g",
    price: 12900,
    sku: "SN-HC-UTS-200",
    image: "/products/natural-pitambari.webp",
    rating: 4.4,
    reviewCount: 51,
    stock: 25,
  },
  {
    id: "p-shea-butter-soap",
    slug: "shea-butter-soap",
    name: "Shea Butter Soap",
    category: "personal-care",
    shortDescription: "Rich, moisturising daily bar",
    description:
      "A creamy shea butter soap made in small batches for a rich lather that helps skin feel soft and cared for.",
    benefits: ["Rich, creamy lather", "Helps skin feel soft", "Everyday use"],
    keyIngredients: ["Shea butter", "Coconut oil", "Glycerin"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 14900,
    mrp: 17900,
    sku: "SN-PC-SHS-100",
    image: "/products/shea-butter-soap.webp",
    rating: 4.8,
    reviewCount: 203,
    stock: 60,
    featured: true,
    bestSeller: true,
  },
  {
    id: "p-neem-tulsi-soap",
    slug: "neem-tulsi-soap",
    name: "Neem & Tulsi Soap",
    category: "personal-care",
    shortDescription: "Refreshing daily cleansing bar",
    description:
      "A refreshing bar with neem and tulsi for a clean, everyday feel. Crafted in small, considered batches.",
    benefits: ["Refreshing clean feel", "Everyday cleansing", "Small-batch made"],
    keyIngredients: ["Neem", "Tulsi (holy basil)", "Coconut oil"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 12900,
    sku: "SN-PC-NTS-100",
    image: "/products/neem-tulsi-soap.webp",
    rating: 4.7,
    reviewCount: 156,
    stock: 48,
    featured: true,
    bestSeller: true,
  },
  {
    id: "p-papaya-soap",
    slug: "papaya-soap",
    name: "Papaya Soap",
    category: "personal-care",
    shortDescription: "Brightening everyday bar",
    description:
      "A gentle papaya soap for a fresh, everyday cleanse, made in small batches with a soft fragrance.",
    benefits: ["Gentle daily cleanse", "Soft natural fragrance", "Small-batch made"],
    keyIngredients: ["Papaya extract", "Glycerin", "Coconut oil"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 13900,
    sku: "SN-PC-PYS-100",
    image: "/products/papaya-soap.webp",
    rating: 4.6,
    reviewCount: 112,
    stock: 35,
    featured: true,
  },
  {
    id: "p-beetroot-soap",
    slug: "beetroot-soap",
    name: "Beetroot Soap",
    category: "personal-care",
    shortDescription: "Naturally coloured gentle bar",
    description:
      "A naturally tinted beetroot soap with a gentle lather for everyday cleansing.",
    benefits: ["Gentle everyday lather", "Naturally coloured", "Small-batch made"],
    keyIngredients: ["Beetroot extract", "Glycerin", "Coconut oil"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 13900,
    sku: "SN-PC-BTS-100",
    image: "/products/beetroot-soap.webp",
    rating: 4.5,
    reviewCount: 74,
    stock: 22,
    isNew: true,
  },
  {
    id: "p-glycerine-soap",
    slug: "glycerine-soap",
    name: "Glycerine Soap",
    category: "personal-care",
    shortDescription: "Transparent, mild cleansing bar",
    description:
      "A mild, transparent glycerine soap that keeps everyday cleansing simple and gentle.",
    benefits: ["Mild and gentle", "Transparent bar", "Everyday use"],
    keyIngredients: ["Vegetable glycerin", "Coconut oil"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 14900,
    sku: "SN-PC-GLS-100",
    image: "/products/glycerine-soap.webp",
    rating: 4.6,
    reviewCount: 98,
    stock: 40,
  },
  {
    id: "p-triple-butter-soap",
    slug: "triple-butter-soap",
    name: "Triple Butter Soap",
    category: "personal-care",
    shortDescription: "Nourishing shea, cocoa & mango",
    description:
      "A nourishing bar blending three plant butters for a rich, creamy lather and a cared-for feel.",
    benefits: ["Three plant butters", "Rich, creamy lather", "Nourishing feel"],
    keyIngredients: ["Shea butter", "Cocoa butter", "Mango butter"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 16900,
    mrp: 19900,
    sku: "SN-PC-TBS-100",
    image: "/products/triple-butter-soap.webp",
    rating: 4.9,
    reviewCount: 187,
    stock: 5,
    featured: true,
    bestSeller: true,
  },
  {
    id: "p-rose-face-wash",
    slug: "rose-face-wash",
    name: "Rose Face Wash",
    category: "personal-care",
    shortDescription: "Gentle daily facial cleanser",
    description:
      "A gentle rose facial cleanser for a fresh, everyday clean without stripping the skin.",
    benefits: ["Gentle daily cleanse", "Soft rose scent", "Non-stripping"],
    keyIngredients: ["Rose extract", "Aloe vera", "Glycerin"],
    usage: "Massage a small amount onto damp skin, then rinse with water.",
    size: "100 ml",
    price: 24900,
    mrp: 29900,
    sku: "SN-PC-RFW-100",
    image: "/products/rose-face-wash.webp",
    rating: 4.7,
    reviewCount: 143,
    stock: 33,
    isNew: true,
  },
  {
    id: "p-herbal-shampoo",
    slug: "herbal-shampoo",
    name: "Herbal Shampoo",
    category: "personal-care",
    shortDescription: "Everyday cleansing for hair",
    description:
      "A herbal shampoo for everyday hair cleansing, formulated to be gentle for regular use.",
    benefits: ["Gentle daily cleanse", "Herbal blend", "For regular use"],
    keyIngredients: ["Reetha (soapnut)", "Shikakai", "Amla"],
    usage: "Apply to wet hair, massage into the scalp, then rinse thoroughly.",
    size: "200 ml",
    price: 29900,
    mrp: 34900,
    sku: "SN-PC-HSH-200",
    image: "/products/herbal-shampoo.webp",
    rating: 4.6,
    reviewCount: 121,
    stock: 27,
    featured: true,
  },
  {
    id: "p-lavender-body-wash",
    slug: "lavender-body-wash",
    name: "Lavender Body Wash",
    category: "personal-care",
    shortDescription: "Calming everyday body cleanser",
    description:
      "A calming lavender body wash for a gentle, everyday cleanse with a soft, soothing scent.",
    benefits: ["Gentle daily cleanse", "Calming lavender scent", "Everyday use"],
    keyIngredients: ["Lavender oil", "Aloe vera", "Glycerin"],
    usage: "Apply to a wet sponge or hand, lather over the body, then rinse.",
    size: "250 ml",
    price: 32900,
    sku: "SN-PC-LBW-250",
    image: "/products/lavender-body-wash.webp",
    rating: 4.8,
    reviewCount: 96,
    stock: 18,
    isNew: true,
  },
  {
    id: "p-strawberry-lip-balm",
    slug: "strawberry-lip-balm",
    name: "Strawberry Lip Balm",
    category: "personal-care",
    shortDescription: "Softening balm for dry lips",
    description:
      "A softening lip balm with a light strawberry note to help everyday dry lips feel comfortable.",
    benefits: ["Softens dry lips", "Light strawberry note", "Pocket-sized"],
    keyIngredients: ["Shea butter", "Beeswax", "Strawberry extract"],
    usage: "Apply a thin layer to the lips as often as needed.",
    size: "10 g",
    price: 14900,
    sku: "SN-PC-SLB-010",
    image: "/products/strawberry-lip-balm.webp",
    rating: 4.7,
    reviewCount: 88,
    stock: 54,
  },
];

/* ------------------------------- helpers ------------------------------- */

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function getBestSellers(limit = 4): Product[] {
  return products.filter((p) => p.bestSeller).slice(0, limit);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
