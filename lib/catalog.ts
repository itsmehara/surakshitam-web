import type { Category, Product } from "./types";

/**
 * DEMO CATALOG — pricing, ratings and stock are placeholder data.
 * Structure mirrors Supriya's product card: three sections —
 * Home Care, Skin Care, Hair Care. Products without real photos yet use a
 * clearly-marked "photo coming soon" placeholder cover.
 * Replace prices ("DEMO PRICE") and verify all copy with the founders.
 */

export const categories: Category[] = [
  {
    id: "cat-home",
    slug: "home-care",
    name: "Home Care",
    description:
      "Everyday household cleaning — dishwash, floor and laundry care, thoughtfully formulated for daily use.",
    image: "/products/dishwash-liquid.webp",
  },
  {
    id: "cat-skin",
    slug: "skin-care",
    name: "Skin Care",
    description:
      "Soaps, cleansers, creams and everyday skin care, made in small, considered batches.",
    image: "/products/shea-butter-soap.webp",
  },
  {
    id: "cat-hair",
    slug: "hair-care",
    name: "Hair Care",
    description:
      "Shampoo, oils, packs and serums — herbal hair care for everyday routines.",
    image: "/products/herbal-shampoo.webp",
  },
];

// Prices in paise (₹1 = 100 paise). All values are DEMO PRICE — REPLACE.
export const products: Product[] = [
  /* ------------------------------ HOME CARE ------------------------------ */
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
    id: "p-washing-machine-liquid",
    slug: "washing-machine-liquid",
    name: "Washing Machine Liquid",
    category: "home-care",
    shortDescription: "Gentle liquid detergent for laundry",
    description:
      "A liquid laundry detergent for everyday washing — dissolves easily and rinses clean, leaving a light, fresh finish.",
    benefits: ["Everyday laundry", "Gentle on fabrics", "Fresh finish"],
    keyIngredients: ["Plant-derived surfactants", "Essential oils"],
    usage: "Add one cap per load; use less for lightly soiled laundry.",
    size: "500 ml",
    price: 24900,
    mrp: 29900,
    sku: "SN-HC-WML-500",
    image: "/products/washing-machine-liquid.webp",
    stock: 20,
    isNew: true,
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

  /* ------------------------------ SKIN CARE ------------------------------ */
  {
    id: "p-shea-butter-soap",
    slug: "shea-butter-soap",
    name: "Shea Butter Soap",
    category: "skin-care",
    shortDescription: "Rich, moisturising daily bar",
    description:
      "A creamy shea butter soap made in small batches for a rich lather that helps skin feel soft and cared for.",
    benefits: ["Rich, creamy lather", "Helps skin feel soft", "Everyday use"],
    keyIngredients: ["Shea butter", "Coconut oil", "Glycerin"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 14900,
    mrp: 17900,
    sku: "SN-SC-SHS-100",
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
    category: "skin-care",
    shortDescription: "Refreshing daily cleansing bar",
    description:
      "A refreshing bar with neem and tulsi for a clean, everyday feel. Crafted in small, considered batches.",
    benefits: ["Refreshing clean feel", "Everyday cleansing", "Small-batch made"],
    keyIngredients: ["Neem", "Tulsi (holy basil)", "Coconut oil"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 12900,
    sku: "SN-SC-NTS-100",
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
    category: "skin-care",
    shortDescription: "Brightening everyday bar",
    description:
      "A gentle papaya soap for a fresh, everyday cleanse, made in small batches with a soft fragrance.",
    benefits: ["Gentle daily cleanse", "Soft natural fragrance", "Small-batch made"],
    keyIngredients: ["Papaya extract", "Glycerin", "Coconut oil"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 13900,
    sku: "SN-SC-PYS-100",
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
    category: "skin-care",
    shortDescription: "Naturally coloured gentle bar",
    description:
      "A naturally tinted beetroot soap with a gentle lather for everyday cleansing.",
    benefits: ["Gentle everyday lather", "Naturally coloured", "Small-batch made"],
    keyIngredients: ["Beetroot extract", "Glycerin", "Coconut oil"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 13900,
    sku: "SN-SC-BTS-100",
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
    category: "skin-care",
    shortDescription: "Transparent, mild cleansing bar",
    description:
      "A mild, transparent glycerine soap that keeps everyday cleansing simple and gentle.",
    benefits: ["Mild and gentle", "Transparent bar", "Everyday use"],
    keyIngredients: ["Vegetable glycerin", "Coconut oil"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 14900,
    sku: "SN-SC-GLS-100",
    image: "/products/glycerine-soap.webp",
    rating: 4.6,
    reviewCount: 98,
    stock: 40,
  },
  {
    id: "p-triple-butter-soap",
    slug: "triple-butter-soap",
    name: "Triple Butter Soap",
    category: "skin-care",
    shortDescription: "Nourishing shea, cocoa & mango",
    description:
      "A nourishing bar blending three plant butters for a rich, creamy lather and a cared-for feel.",
    benefits: ["Three plant butters", "Rich, creamy lather", "Nourishing feel"],
    keyIngredients: ["Shea butter", "Cocoa butter", "Mango butter"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 16900,
    mrp: 19900,
    sku: "SN-SC-TBS-100",
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
    category: "skin-care",
    shortDescription: "Gentle daily facial cleanser",
    description:
      "A gentle rose facial cleanser for a fresh, everyday clean without stripping the skin.",
    benefits: ["Gentle daily cleanse", "Soft rose scent", "Non-stripping"],
    keyIngredients: ["Rose extract", "Aloe vera", "Glycerin"],
    usage: "Massage a small amount onto damp skin, then rinse with water.",
    size: "100 ml",
    price: 24900,
    mrp: 29900,
    sku: "SN-SC-RFW-100",
    image: "/products/rose-face-wash.webp",
    rating: 4.7,
    reviewCount: 143,
    stock: 33,
    isNew: true,
  },
  {
    id: "p-lavender-body-wash",
    slug: "lavender-body-wash",
    name: "Lavender Body Wash",
    category: "skin-care",
    shortDescription: "Calming everyday body cleanser",
    description:
      "A calming lavender body wash for a gentle, everyday cleanse with a soft, soothing scent.",
    benefits: ["Gentle daily cleanse", "Calming lavender scent", "Everyday use"],
    keyIngredients: ["Lavender oil", "Aloe vera", "Glycerin"],
    usage: "Apply to a wet sponge or hand, lather over the body, then rinse.",
    size: "250 ml",
    price: 32900,
    sku: "SN-SC-LBW-250",
    image: "/products/lavender-body-wash.webp",
    rating: 4.8,
    reviewCount: 96,
    stock: 18,
    isNew: true,
  },
  {
    id: "p-body-lotion",
    slug: "body-lotion",
    name: "Body Lotion",
    category: "skin-care",
    shortDescription: "Everyday moisture for soft skin",
    description:
      "A light, everyday body lotion that absorbs quickly and leaves skin feeling soft, not greasy.",
    benefits: ["Light, non-greasy", "Everyday moisture", "Soft finish"],
    keyIngredients: ["Shea butter", "Aloe vera", "Glycerin"],
    usage: "Massage onto clean skin as often as needed.",
    size: "200 ml",
    price: 29900,
    sku: "SN-SC-LOT-200",
    image: "/products/body-lotion.webp",
    stock: 24,
    isNew: true,
  },
  {
    id: "p-face-cream",
    slug: "face-cream",
    name: "Face Cream",
    category: "skin-care",
    shortDescription: "Daily nourishing face cream",
    description:
      "A light daily face cream for everyday nourishment, made with plant-forward ingredients.",
    benefits: ["Daily nourishment", "Light texture", "Everyday use"],
    keyIngredients: ["Aloe vera", "Plant oils", "Glycerin"],
    usage: "Apply a small amount to a clean face, morning and night.",
    size: "50 g",
    price: 34900,
    sku: "SN-SC-FCR-050",
    image: "/products/face-cream.webp",
    stock: 18,
    isNew: true,
  },
  {
    id: "p-herbal-bath-powder",
    slug: "herbal-bath-powder",
    name: "Herbal Bath Powder",
    category: "skin-care",
    shortDescription: "Traditional herbal cleansing powder",
    description:
      "A traditional bath powder blend for a gentle, natural cleanse — a time-honoured alternative to soap.",
    benefits: ["Traditional cleanse", "Gentle on skin", "Herbal blend"],
    keyIngredients: ["Herbal blend", "Gram flour"],
    usage: "Mix with a little water into a paste and use as a cleanser, then rinse.",
    size: "100 g",
    price: 17900,
    sku: "SN-SC-BTP-100",
    image: "/products/herbal-bath-powder.webp",
    stock: 30,
  },
  {
    id: "p-foot-cream",
    slug: "foot-cream",
    name: "Foot Cream",
    category: "skin-care",
    shortDescription: "Softening care for tired feet",
    description:
      "A softening foot cream that helps care for dry heels and tired feet with a light, refreshing feel.",
    benefits: ["Softens dry heels", "Refreshing feel", "Everyday care"],
    keyIngredients: ["Shea butter", "Peppermint oil"],
    usage: "Massage into clean, dry feet, ideally before bed.",
    size: "50 g",
    price: 24900,
    sku: "SN-SC-FTC-050",
    image: "/products/foot-cream.webp",
    stock: 22,
  },
  {
    id: "p-face-pack",
    slug: "face-pack",
    name: "Face Pack",
    category: "skin-care",
    shortDescription: "Refreshing weekly face pack",
    description:
      "A weekly face pack of natural clays and herbs for a fresh, clean feel.",
    benefits: ["Weekly refresh", "Natural clays & herbs", "Fresh feel"],
    keyIngredients: ["Multani mitti", "Herbal extracts"],
    usage: "Apply an even layer, leave for 10–15 minutes, then rinse off.",
    size: "100 g",
    price: 27900,
    sku: "SN-SC-FPK-100",
    image: "/products/face-pack.webp",
    stock: 20,
    isNew: true,
  },
  {
    id: "p-aloe-vera-gel",
    slug: "aloe-vera-gel",
    name: "Aloe Vera Gel",
    category: "skin-care",
    shortDescription: "Soothing multi-use aloe gel",
    description:
      "A light, soothing aloe vera gel for skin and hair — a gentle multi-use everyday essential.",
    benefits: ["Soothing", "Multi-use", "Light gel"],
    keyIngredients: ["Aloe vera"],
    usage: "Apply to skin or hair as needed.",
    size: "100 ml",
    price: 19900,
    sku: "SN-SC-ALG-100",
    image: "/products/aloe-vera-gel.webp",
    stock: 35,
    bestSeller: true,
  },
  {
    id: "p-strawberry-lip-balm",
    slug: "strawberry-lip-balm",
    name: "Strawberry Lip Balm",
    category: "skin-care",
    shortDescription: "Softening balm for dry lips",
    description:
      "A softening lip balm with a light strawberry note to help everyday dry lips feel comfortable.",
    benefits: ["Softens dry lips", "Light strawberry note", "Pocket-sized"],
    keyIngredients: ["Shea butter", "Beeswax", "Strawberry extract"],
    usage: "Apply a thin layer to the lips as often as needed.",
    size: "10 g",
    price: 14900,
    sku: "SN-SC-SLB-010",
    image: "/products/strawberry-lip-balm.webp",
    rating: 4.7,
    reviewCount: 88,
    stock: 54,
  },

  /* ------------------------------ HAIR CARE ------------------------------ */
  {
    id: "p-herbal-shampoo",
    slug: "herbal-shampoo",
    name: "Herbal Shampoo",
    category: "hair-care",
    shortDescription: "Everyday cleansing for hair",
    description:
      "A herbal shampoo for everyday hair cleansing, formulated to be gentle for regular use.",
    benefits: ["Gentle daily cleanse", "Herbal blend", "For regular use"],
    keyIngredients: ["Reetha (soapnut)", "Shikakai", "Amla"],
    usage: "Apply to wet hair, massage into the scalp, then rinse thoroughly.",
    size: "200 ml",
    price: 29900,
    mrp: 34900,
    sku: "SN-HR-SHP-200",
    image: "/products/herbal-shampoo.webp",
    rating: 4.6,
    reviewCount: 121,
    stock: 27,
    featured: true,
  },
  {
    id: "p-herbal-hair-pack",
    slug: "herbal-hair-pack",
    name: "Herbal Hair Pack",
    category: "hair-care",
    shortDescription: "Nourishing weekly hair mask",
    description:
      "A weekly herbal hair pack to nourish and care for hair, made with a traditional herbal blend.",
    benefits: ["Weekly nourishment", "Herbal blend", "For all hair types"],
    keyIngredients: ["Amla", "Shikakai", "Hibiscus"],
    usage: "Apply to damp hair, leave for 20–30 minutes, then rinse.",
    size: "100 g",
    price: 29900,
    sku: "SN-HR-HPK-100",
    image: "/products/herbal-hair-pack.webp",
    stock: 18,
    isNew: true,
  },
  {
    id: "p-hair-oil",
    slug: "hair-oil",
    name: "Hair Oil",
    category: "hair-care",
    shortDescription: "Everyday nourishing hair oil",
    description:
      "A light, everyday hair oil to nourish the scalp and lengths without feeling heavy or sticky.",
    benefits: ["Daily nourishment", "Light, non-sticky", "Herbal infusion"],
    keyIngredients: ["Coconut oil", "Amla", "Curry leaf"],
    usage: "Massage into the scalp and lengths; leave for a while before washing.",
    size: "100 ml",
    price: 24900,
    sku: "SN-HR-OIL-100",
    image: "/products/hair-oil.webp",
    stock: 26,
    bestSeller: true,
  },
  {
    id: "p-rosemary-hair-spray",
    slug: "rosemary-hair-spray",
    name: "Rosemary Hair Spray",
    category: "hair-care",
    shortDescription: "Refreshing rosemary mist",
    description:
      "A refreshing rosemary mist for the scalp and hair, for a light pick-me-up during the day.",
    benefits: ["Refreshing mist", "Everyday use", "Light finish"],
    keyIngredients: ["Rosemary water", "Essential oils"],
    usage: "Spray onto the scalp and hair; no need to rinse.",
    size: "100 ml",
    price: 27900,
    sku: "SN-HR-RMS-100",
    image: "/products/rosemary-hair-spray.webp",
    stock: 20,
    isNew: true,
  },
  {
    id: "p-hair-serum",
    slug: "hair-serum",
    name: "Hair Serum",
    category: "hair-care",
    shortDescription: "Smoothing finish for frizz",
    description:
      "A lightweight hair serum for a smooth, finished look that helps tame everyday frizz.",
    benefits: ["Smoothing finish", "Tames frizz", "Lightweight"],
    keyIngredients: ["Argan oil", "Plant extracts"],
    usage: "Apply a few drops to damp or dry hair, focusing on the ends.",
    size: "50 ml",
    price: 32900,
    mrp: 37900,
    sku: "SN-HR-SER-050",
    image: "/products/hair-serum.webp",
    stock: 16,
    isNew: true,
  },
];

/**
 * "Shop by concern" tags, applied here rather than inline on every product object above
 * to keep the catalog literal easy to scan. See lib/site.ts `concerns` for the tag list.
 */
const CONCERN_TAGS: Record<string, string[]> = {
  "p-dishwash-liquid": ["deep-clean", "daily-freshness"],
  "p-dishwash-bar": ["deep-clean"],
  "p-floor-cleaner": ["deep-clean", "daily-freshness"],
  "p-washing-machine-liquid": ["deep-clean", "daily-freshness"],
  "p-natural-pitambari": ["deep-clean"],
  "p-shea-butter-soap": ["dry-skin"],
  "p-neem-tulsi-soap": ["sensitive-skin", "deep-clean"],
  "p-papaya-soap": ["daily-freshness"],
  "p-beetroot-soap": ["dry-skin"],
  "p-glycerine-soap": ["sensitive-skin"],
  "p-triple-butter-soap": ["dry-skin"],
  "p-rose-face-wash": ["sensitive-skin"],
  "p-lavender-body-wash": ["dry-skin", "daily-freshness"],
  "p-body-lotion": ["dry-skin"],
  "p-face-cream": ["dry-skin"],
  "p-herbal-bath-powder": ["sensitive-skin"],
  "p-foot-cream": ["dry-skin"],
  "p-face-pack": ["dry-skin"],
  "p-aloe-vera-gel": ["sensitive-skin", "dry-skin"],
  "p-strawberry-lip-balm": ["dry-skin"],
  "p-herbal-shampoo": ["dandruff", "hair-fall"],
  "p-herbal-hair-pack": ["hair-fall"],
  "p-hair-oil": ["hair-fall", "dandruff"],
  "p-rosemary-hair-spray": ["hair-fall", "frizz-control"],
  "p-hair-serum": ["frizz-control"],
};
for (const p of products) {
  if (CONCERN_TAGS[p.id]) p.concerns = CONCERN_TAGS[p.id];
}

/* ------------------------------- helpers ------------------------------- */

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** Simple search across name, category, short description and key ingredients. */
export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return products.filter((p) => {
    const haystack = [
      p.name,
      p.category.replace("-", " "),
      p.shortDescription,
      p.description,
      ...p.keyIngredients,
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
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
