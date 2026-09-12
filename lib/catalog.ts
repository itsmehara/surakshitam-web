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
      "Everyday household cleaning — dishwash, floor and laundry care. Two shelves: bio-enzyme formulations that break down safely, and our general range.",
    image: "/surakshitam-product-images/natural-dishwash-liquid/natural-dishwash-liquid-01-listing-front-clean.webp",
    groupImage: "/category-groups/home-care-5-product-card-group.webp",
  },
  {
    id: "cat-skin",
    slug: "skin-care",
    name: "Skin Care",
    description:
      "Soaps, cleansers, creams and everyday skin care, made in small, considered batches.",
    image: "/surakshitam-product-images/shea-butter-soap/shea-butter-soap-01-listing-front-clean.webp",
    groupImage: "/category-groups/skin-care-5-product-card-group.webp",
  },
  {
    id: "cat-hair",
    slug: "hair-care",
    name: "Hair Care",
    description:
      "Shampoo, oils, packs and serums — herbal hair care for everyday routines.",
    image: "/surakshitam-product-images/herbal-shampoo/herbal-shampoo-01-listing-front-clean.webp",
    groupImage: "/category-groups/hair-care-5-product-card-group.webp",
  },
  {
    id: "cat-partner-brands",
    slug: "partner-brands",
    name: "Partner Brands",
    description:
      "Foods, pantry staples and everyday essentials from small brands we know and trust. Stocked and delivered by us, made by them — every pack carries its own brand.",
    image: "/products/partners/wheat-noodles.webp",
    groupImage: "/category-groups/partner-brands-4-product-card-group.webp",
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
    image: "/surakshitam-product-images/natural-dishwash-liquid/natural-dishwash-liquid-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/natural-dishwash-liquid/natural-dishwash-liquid-01-listing-front-clean.webp",
      "/surakshitam-product-images/natural-dishwash-liquid/natural-dishwash-liquid-02-lemon-ingredient-lifestyle.webp",
      "/surakshitam-product-images/natural-dishwash-liquid/natural-dishwash-liquid-03-sponge-usage-detail.webp",
    ],
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
    image: "/surakshitam-product-images/natural-dishwash-bar/natural-dishwash-bar-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/natural-dishwash-bar/natural-dishwash-bar-01-listing-front-clean.webp",
      "/surakshitam-product-images/natural-dishwash-bar/natural-dishwash-bar-02-lemon-reetha-lifestyle.webp",
      "/surakshitam-product-images/natural-dishwash-bar/natural-dishwash-bar-03-open-texture-detail.webp",
    ],
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
    image: "/surakshitam-product-images/natural-floor-cleaner/natural-floor-cleaner-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/natural-floor-cleaner/natural-floor-cleaner-01-listing-front-clean.webp",
      "/surakshitam-product-images/natural-floor-cleaner/natural-floor-cleaner-02-lemongrass-lifestyle.webp",
      "/surakshitam-product-images/natural-floor-cleaner/natural-floor-cleaner-03-measuring-cap-usage.webp",
    ],
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
    image: "/surakshitam-product-images/washing-machine-liquid/washing-machine-liquid-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/washing-machine-liquid/washing-machine-liquid-01-listing-front-clean.webp",
      "/surakshitam-product-images/washing-machine-liquid/washing-machine-liquid-02-fresh-laundry-lifestyle.webp",
    ],
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
    image: "/surakshitam-product-images/natural-utensil-shine/natural-utensil-shine-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/natural-utensil-shine/natural-utensil-shine-01-listing-front-clean.webp",
      "/surakshitam-product-images/natural-utensil-shine/natural-utensil-shine-02-lemon-powder-usage.webp",
    ],
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
    image: "/surakshitam-product-images/shea-butter-soap/shea-butter-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/shea-butter-soap/shea-butter-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/shea-butter-soap/shea-butter-soap-02-shea-coconut-lifestyle.webp",
      "/surakshitam-product-images/shea-butter-soap/shea-butter-soap-03-unwrapped-texture-detail.webp",
    ],
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
    image: "/surakshitam-product-images/neem-tulsi-soap/neem-tulsi-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/neem-tulsi-soap/neem-tulsi-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/neem-tulsi-soap/neem-tulsi-soap-02-neem-tulsi-lifestyle.webp",
      "/surakshitam-product-images/neem-tulsi-soap/neem-tulsi-soap-03-unwrapped-texture-detail.webp",
    ],
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
    image: "/surakshitam-product-images/papaya-soap/papaya-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/papaya-soap/papaya-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/papaya-soap/papaya-soap-02-papaya-ingredient-lifestyle.webp",
      "/surakshitam-product-images/papaya-soap/papaya-soap-03-unwrapped-texture-detail.webp",
    ],
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
    image: "/surakshitam-product-images/beetroot-soap/beetroot-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/beetroot-soap/beetroot-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/beetroot-soap/beetroot-soap-02-beetroot-ingredient-lifestyle.webp",
    ],
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
    image: "/surakshitam-product-images/glycerine-soap/glycerine-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/glycerine-soap/glycerine-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/glycerine-soap/glycerine-soap-02-transparent-texture-lifestyle.webp",
    ],
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
    image: "/surakshitam-product-images/triple-butter-soap/triple-butter-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/triple-butter-soap/triple-butter-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/triple-butter-soap/triple-butter-soap-02-butter-ingredient-lifestyle.webp",
      "/surakshitam-product-images/triple-butter-soap/triple-butter-soap-03-floral-texture-detail.webp",
    ],
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
    image: "/surakshitam-product-images/rose-face-wash/rose-face-wash-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/rose-face-wash/rose-face-wash-01-listing-front-clean.webp",
      "/surakshitam-product-images/rose-face-wash/rose-face-wash-02-rose-aloe-lifestyle.webp",
      "/surakshitam-product-images/rose-face-wash/rose-face-wash-03-pink-gel-texture-detail.webp",
    ],
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
    image: "/surakshitam-product-images/lavender-body-wash/lavender-body-wash-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/lavender-body-wash/lavender-body-wash-01-listing-front-clean.webp",
      "/surakshitam-product-images/lavender-body-wash/lavender-body-wash-02-lavender-aloe-lifestyle.webp",
      "/surakshitam-product-images/lavender-body-wash/lavender-body-wash-03-purple-gel-texture-detail.webp",
    ],
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
    image: "/surakshitam-product-images/body-lotion/body-lotion-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/body-lotion/body-lotion-01-listing-front-clean.webp",
      "/surakshitam-product-images/body-lotion/body-lotion-02-shea-coconut-lifestyle.webp",
    ],
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
    image: "/surakshitam-product-images/face-cream/face-cream-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/face-cream/face-cream-01-listing-front-clean.webp",
      "/surakshitam-product-images/face-cream/face-cream-02-aloe-daily-care-lifestyle.webp",
    ],
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
    image: "/surakshitam-product-images/herbal-bath-powder/herbal-bath-powder-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/herbal-bath-powder/herbal-bath-powder-01-listing-front-clean.webp",
      "/surakshitam-product-images/herbal-bath-powder/herbal-bath-powder-02-herbal-powder-usage.webp",
    ],
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
    image: "/surakshitam-product-images/foot-cream/foot-cream-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/foot-cream/foot-cream-01-listing-front-clean.webp",
      "/surakshitam-product-images/foot-cream/foot-cream-02-peppermint-care-lifestyle.webp",
    ],
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
    image: "/surakshitam-product-images/face-pack/face-pack-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/face-pack/face-pack-01-listing-front-clean.webp",
      "/surakshitam-product-images/face-pack/face-pack-02-clay-herbal-usage.webp",
    ],
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
    image: "/surakshitam-product-images/aloe-vera-gel/aloe-vera-gel-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/aloe-vera-gel/aloe-vera-gel-01-listing-front-clean.webp",
      "/surakshitam-product-images/aloe-vera-gel/aloe-vera-gel-02-aloe-soothing-lifestyle.webp",
    ],
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
    image: "/surakshitam-product-images/strawberry-lip-balm/strawberry-lip-balm-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/strawberry-lip-balm/strawberry-lip-balm-01-listing-front-clean.webp",
      "/surakshitam-product-images/strawberry-lip-balm/strawberry-lip-balm-02-strawberry-care-lifestyle.webp",
    ],
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
    image: "/surakshitam-product-images/herbal-shampoo/herbal-shampoo-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/herbal-shampoo/herbal-shampoo-01-listing-front-clean.webp",
      "/surakshitam-product-images/herbal-shampoo/herbal-shampoo-02-amla-reetha-lifestyle.webp",
      "/surakshitam-product-images/herbal-shampoo/herbal-shampoo-03-herbal-texture-detail.webp",
    ],
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
    image: "/surakshitam-product-images/herbal-hair-pack/herbal-hair-pack-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/herbal-hair-pack/herbal-hair-pack-01-listing-front-clean.webp",
      "/surakshitam-product-images/herbal-hair-pack/herbal-hair-pack-02-amla-hibiscus-usage.webp",
    ],
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
    image: "/surakshitam-product-images/hair-oil/hair-oil-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/hair-oil/hair-oil-01-listing-front-clean.webp",
      "/surakshitam-product-images/hair-oil/hair-oil-02-amla-curry-leaf-lifestyle.webp",
    ],
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
    image: "/surakshitam-product-images/rosemary-hair-spray/rosemary-hair-spray-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/rosemary-hair-spray/rosemary-hair-spray-01-listing-front-clean.webp",
      "/surakshitam-product-images/rosemary-hair-spray/rosemary-hair-spray-02-rosemary-scalp-mist-lifestyle.webp",
    ],
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
    image: "/surakshitam-product-images/hair-serum/hair-serum-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/hair-serum/hair-serum-01-listing-front-clean.webp",
      "/surakshitam-product-images/hair-serum/hair-serum-02-argan-smoothing-lifestyle.webp",
    ],
    stock: 16,
    isNew: true,
  },

  /* ------------------- ADDED FROM THE REEL-REFERENCE SET -------------------
   * Real products that were photographed but had never been listed. Copy here
   * is deliberately sensory and non-medical, matching the rest of the catalog.
   * DEMO PRICE + DEMO SIZE — the founders must confirm price, pack size and
   * every ingredient list before these go live.
   * ---------------------------------------------------------------------- */
  {
    id: "p-aloe-vera-soap",
    slug: "aloe-vera-soap",
    name: "Aloe Vera Soap",
    category: "skin-care",
    shortDescription: "Soothing everyday cleansing bar",
    description:
      "A mild aloe soap for a calm, everyday wash — made in small batches with a soft, clean finish.",
    benefits: ["Gentle daily cleanse", "Soft, clean finish", "Small-batch made"],
    keyIngredients: ["Aloe vera", "Coconut oil", "Glycerin"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 13900,
    sku: "SN-SC-ALS-100",
    image: "/surakshitam-product-images/aloe-vera-soap/aloe-vera-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/aloe-vera-soap/aloe-vera-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/aloe-vera-soap/aloe-vera-soap-02-aloe-ingredient-lifestyle.webp",
    ],
    stock: 24,
    isNew: true,
  },
  {
    id: "p-charcoal-soap",
    slug: "charcoal-soap",
    name: "Charcoal Soap",
    category: "skin-care",
    shortDescription: "Deep-cleansing charcoal bar",
    description:
      "Activated charcoal gives this bar its deep grey marbling and a thorough, fresh-feeling everyday cleanse.",
    benefits: ["Thorough daily cleanse", "Fresh finish", "Small-batch made"],
    keyIngredients: ["Activated charcoal", "Coconut oil", "Glycerin"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 14900,
    sku: "SN-SC-CHS-100",
    image: "/surakshitam-product-images/charcoal-soap/charcoal-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/charcoal-soap/charcoal-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/charcoal-soap/charcoal-soap-02-charcoal-detox-lifestyle.webp",
    ],
    stock: 24,
    isNew: true,
  },
  {
    id: "p-coffee-soap",
    slug: "coffee-soap",
    name: "Coffee Soap",
    category: "skin-care",
    shortDescription: "Gently exfoliating coffee bar",
    description:
      "Ground coffee gives this bar a light scrub and a warm, roasted aroma — a wake-up bar for the morning wash.",
    benefits: ["Light natural scrub", "Warm coffee aroma", "Small-batch made"],
    keyIngredients: ["Coffee grounds", "Coconut oil", "Glycerin"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 14900,
    sku: "SN-SC-COS-100",
    image: "/surakshitam-product-images/coffee-soap/coffee-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/coffee-soap/coffee-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/coffee-soap/coffee-soap-02-coffee-exfoliating-lifestyle.webp",
    ],
    stock: 24,
    isNew: true,
  },
  {
    id: "p-goat-milk-soap",
    slug: "goat-milk-soap",
    name: "Goat Milk Soap",
    category: "skin-care",
    shortDescription: "Creamy, mild everyday bar",
    description:
      "Goat milk gives this bar a soft, creamy lather — a mild choice for an everyday wash.",
    benefits: ["Creamy lather", "Mild for daily use", "Small-batch made"],
    keyIngredients: ["Goat milk", "Shea butter", "Coconut oil"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 16900,
    sku: "SN-SC-GMS-100",
    image: "/surakshitam-product-images/goat-milk-soap/goat-milk-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/goat-milk-soap/goat-milk-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/goat-milk-soap/goat-milk-soap-02-milk-creamy-lifestyle.webp",
    ],
    stock: 24,
    isNew: true,
  },
  {
    id: "p-honey-soap",
    slug: "honey-soap",
    name: "Honey Soap",
    category: "skin-care",
    shortDescription: "Warm honey and oat bar",
    description:
      "Honey and oats give this bar a soft golden colour, a gentle texture and a warm, comforting scent.",
    benefits: ["Gentle texture", "Warm natural scent", "Small-batch made"],
    keyIngredients: ["Honey", "Oats", "Coconut oil"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 15900,
    sku: "SN-SC-HNS-100",
    image: "/surakshitam-product-images/honey-soap/honey-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/honey-soap/honey-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/honey-soap/honey-soap-02-honey-oat-lifestyle.webp",
    ],
    stock: 24,
    isNew: true,
  },
  {
    id: "p-manjista-soap",
    slug: "manjista-soap",
    name: "Manjista Soap",
    category: "skin-care",
    shortDescription: "Traditional manjistha botanical bar",
    description:
      "Manjistha root, long used in Indian traditions, gives this bar its warm earthy tone and everyday botanical character.",
    benefits: ["Traditional botanical", "Earthy natural tone", "Small-batch made"],
    keyIngredients: ["Manjistha root", "Coconut oil", "Glycerin"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 15900,
    sku: "SN-SC-MJS-100",
    image: "/surakshitam-product-images/manjista-soap/manjista-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/manjista-soap/manjista-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/manjista-soap/manjista-soap-02-manjista-root-lifestyle.webp",
    ],
    stock: 24,
    isNew: true,
  },
  {
    id: "p-red-wine-soap",
    slug: "red-wine-soap",
    name: "Red Wine Soap",
    category: "skin-care",
    shortDescription: "Grape-led everyday bar",
    description:
      "A grape-led bar with a deep berry tone and a soft, everyday lather.",
    benefits: ["Soft daily lather", "Deep natural colour", "Small-batch made"],
    keyIngredients: ["Red wine extract", "Grape seed oil", "Coconut oil"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 16900,
    sku: "SN-SC-RWS-100",
    image: "/surakshitam-product-images/red-wine-soap/red-wine-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/red-wine-soap/red-wine-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/red-wine-soap/red-wine-soap-02-grape-botanical-lifestyle.webp",
    ],
    stock: 24,
    isNew: true,
  },
  {
    id: "p-sandal-soap",
    slug: "sandal-soap",
    name: "Sandal Soap",
    category: "skin-care",
    shortDescription: "Classic sandalwood bar",
    description:
      "A classic sandalwood bar — warm, woody and familiar, for an everyday wash.",
    benefits: ["Warm sandalwood scent", "Everyday bar", "Small-batch made"],
    keyIngredients: ["Sandalwood", "Coconut oil", "Glycerin"],
    usage: "Work into a lather with water, cleanse, and rinse.",
    size: "100 g",
    price: 16900,
    sku: "SN-SC-SDS-100",
    image: "/surakshitam-product-images/sandal-soap/sandal-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/sandal-soap/sandal-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/sandal-soap/sandal-soap-02-sandalwood-lifestyle.webp",
    ],
    stock: 24,
    isNew: true,
  },
  {
    id: "p-henna-powder",
    slug: "henna-powder",
    name: "Henna Powder",
    category: "hair-care",
    shortDescription: "Natural henna for hair",
    description:
      "Finely sifted henna powder for a traditional hair treatment, mixed fresh at home.",
    benefits: ["Finely sifted", "Traditional hair care", "No added colourants"],
    keyIngredients: ["Henna (Lawsonia inermis)"],
    usage: "Mix with warm water into a paste, apply to hair, leave as preferred, then rinse thoroughly.",
    size: "100 g",
    price: 17900,
    sku: "SN-HR-HNP-100",
    image: "/surakshitam-product-images/henna-powder/henna-powder-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/henna-powder/henna-powder-01-listing-front-clean.webp",
      "/surakshitam-product-images/henna-powder/henna-powder-02-henna-herbal-usage.webp",
    ],
    stock: 24,
    isNew: true,
  },

  /* --------------------------- PARTNER BRANDS ---------------------------
   * Third-party stock: made by other small brands, sold by us. Food and pantry
   * goods today; the shelf is defined by who made it, not what it is, so any
   * other resold product belongs here too. Every one
   * of these carries `thirdParty: true` and its own `brand`, which is what the
   * storefront shows — no Surakshitam branding, wording or artwork is applied
   * to them anywhere. DEMO BRANDS + DEMO PRICES — replace with the real
   * suppliers' names, packs and MRPs before launch.
   * -------------------------------------------------------------------- */
  {
    id: "p-wheat-noodles",
    slug: "homemade-wheat-noodles",
    name: "Homemade Wheat Noodles",
    category: "partner-brands",
    brand: "Amma's Kitchen",
    thirdParty: true,
    shortDescription: "Hand-cut wheat noodles, no maida",
    description:
      "Wheat noodles made in small home batches by Amma's Kitchen — hand-cut, sun-dried and packed without maida or added colour. Cooks in about five minutes.",
    benefits: ["Whole-wheat base", "No added colour", "Cooks in ~5 minutes"],
    keyIngredients: ["Whole wheat flour", "Edible salt"],
    usage: "Boil in salted water for 4–5 minutes, drain, then toss with your seasoning.",
    size: "250 g",
    weightGrams: 260,
    price: 9900,
    mrp: 11900,
    sku: "AK-PN-WNL-250",
    image: "/products/partners/wheat-noodles.webp",
    stock: 24,
    isNew: true,
  },
  {
    id: "p-millet-noodles",
    slug: "millet-hakka-noodles",
    name: "Millet Hakka Noodles",
    category: "partner-brands",
    brand: "Millet Mitra",
    thirdParty: true,
    shortDescription: "Millet-based noodles for everyday meals",
    description:
      "Hakka-style noodles from Millet Mitra, made on a millet base instead of refined flour. A quick weeknight base for stir-fries and lunchboxes.",
    benefits: ["Millet-based", "No refined flour", "Quick to cook"],
    keyIngredients: ["Little millet flour", "Wheat flour", "Edible salt"],
    usage: "Boil for 5–6 minutes, rinse in cold water, then stir-fry with vegetables.",
    size: "200 g",
    weightGrams: 210,
    price: 12900,
    sku: "MM-PN-MNL-200",
    image: "/products/partners/millet-noodles.webp",
    stock: 18,
    isNew: true,
  },
  {
    id: "p-ragi-murukku",
    slug: "roasted-ragi-murukku",
    name: "Roasted Ragi Murukku",
    category: "partner-brands",
    brand: "Amma's Kitchen",
    thirdParty: true,
    shortDescription: "Crunchy ragi tea-time snack",
    description:
      "A crisp, lightly spiced ragi murukku from Amma's Kitchen — made in small batches for tea time and lunchboxes.",
    benefits: ["Ragi (finger millet) base", "Small-batch made", "Everyday tea-time snack"],
    keyIngredients: ["Ragi flour", "Rice flour", "Cumin", "Edible salt"],
    usage: "Ready to eat. Reseal the pack and finish within a week of opening.",
    size: "200 g",
    weightGrams: 215,
    price: 8900,
    sku: "AK-PN-RMK-200",
    image: "/products/partners/ragi-murukku.webp",
    stock: 30,
  },
  {
    id: "p-groundnut-oil",
    slug: "wood-pressed-groundnut-oil",
    name: "Wood-Pressed Groundnut Oil",
    category: "partner-brands",
    brand: "Ghani Fresh",
    thirdParty: true,
    shortDescription: "Cold, wood-pressed cooking oil",
    description:
      "Groundnut oil pressed in a wooden ghani by Ghani Fresh, filtered and bottled without refining — for everyday Indian cooking.",
    benefits: ["Wood-pressed", "Unrefined", "Everyday cooking oil"],
    keyIngredients: ["Groundnut"],
    usage: "Use as your regular cooking oil. Store away from direct sunlight.",
    size: "1 L",
    weightGrams: 1020,
    price: 39900,
    mrp: 44900,
    sku: "GF-PN-GNO-1L",
    image: "/products/partners/groundnut-oil.webp",
    stock: 12,
  },
];

/**
 * "Shop by concern" tags, applied here rather than inline on every product object above
 * to keep the catalog literal easy to scan. See lib/site.ts `concerns` for the tag list.
 */
const CONCERN_TAGS: Record<string, string[]> = {
  "p-dishwash-liquid": ["kitchen-grease", "deep-clean", "daily-freshness"],
  "p-dishwash-bar": ["kitchen-grease", "deep-clean"],
  "p-floor-cleaner": ["floors-surfaces", "deep-clean", "daily-freshness"],
  "p-washing-machine-liquid": ["laundry", "deep-clean", "daily-freshness"],
  "p-natural-pitambari": ["kitchen-grease", "floors-surfaces", "deep-clean"],
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
  "p-aloe-vera-soap": ["sensitive-skin", "dry-skin"],
  "p-charcoal-soap": ["deep-clean", "daily-freshness"],
  "p-coffee-soap": ["deep-clean"],
  "p-goat-milk-soap": ["dry-skin", "sensitive-skin"],
  "p-honey-soap": ["dry-skin"],
  "p-manjista-soap": ["sensitive-skin"],
  "p-red-wine-soap": ["daily-freshness"],
  "p-sandal-soap": ["daily-freshness", "sensitive-skin"],
  "p-henna-powder": ["hair-fall"],
};
for (const p of products) {
  if (CONCERN_TAGS[p.id]) p.concerns = CONCERN_TAGS[p.id];
}

/**
 * Home care sits on two shelves. Bio-enzyme products are built on fermented
 * fruit/vegetable-peel enzymes: they break down in water, so what goes down the
 * drain feeds soil and waterways instead of loading them with harsh chemistry.
 * Everything else is the general home-care range.
 *
 * DEMO CLASSIFICATION — the founders must confirm which SKUs are genuinely
 * bio-enzyme formulations before this is published; the badge is a claim.
 */
const BIO_ENZYME_PRODUCTS = new Set<string>([
  "p-dishwash-liquid",
  "p-floor-cleaner",
  "p-washing-machine-liquid",
]);
for (const p of products) {
  if (p.category === "home-care") {
    p.homeCareType = BIO_ENZYME_PRODUCTS.has(p.id) ? "bio-enzyme" : "general";
  }
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
      p.brand ?? "",
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

/** Our own "photo coming soon" cover — carries the house palette. */
export const HOUSE_PLACEHOLDER_IMAGE = "/products/placeholder.webp";
/** Neutral, unbranded cover used for other companies' stock. */
export const PARTNER_PLACEHOLDER_IMAGE = "/products/partners/placeholder.webp";

/**
 * The cover to render for a product. Third-party stock never falls back to the
 * house placeholder — a Surakshitam-styled card behind someone else's noodles
 * would read as our own product, so those get a plain, brandless cover instead.
 */
export function productImage(product: Pick<Product, "image" | "thirdParty">): string {
  const src = product.image?.trim();
  if (product.thirdParty) {
    if (!src || src === HOUSE_PLACEHOLDER_IMAGE) return PARTNER_PLACEHOLDER_IMAGE;
    return src;
  }
  return src || HOUSE_PLACEHOLDER_IMAGE;
}

/** Home-care products on one shelf — "bio-enzyme" or "general". */
export function getHomeCareByType(type: "bio-enzyme" | "general"): Product[] {
  return products.filter((p) => p.category === "home-care" && (p.homeCareType ?? "general") === type);
}
