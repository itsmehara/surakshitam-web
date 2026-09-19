import type { Category, Product, ProductSize } from "./types";

/**
 * Product catalogue. Structure mirrors Supriya's product card: three sections —
 * Home Care, Skin Care, Hair Care — plus one Partner Brands shelf.
 * v4: every product carries `sizes[]` with an MRP per pack (Supriya's notebook,
 * PRODUCT-CATALOG-NOTES-2026-09-19). Orders still go through WhatsApp. Home Care
 * and hair-oil ingredient lists are Supriya's; the rest await her lists.
 */

export const categories: Category[] = [
  {
    id: "cat-home",
    slug: "home-care",
    name: "Home Care",
    description:
      "Everyday household cleaning — dishwash, floor, toilet and laundry care, including bio-enzyme formulations that break down safely.",
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
      "Shampoo, oil, packs, natural dyes and single-herb powders — herbal hair care for everyday routines.",
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
    keyIngredients: ["Lemon extract", "Plant-based (coconut) surfactant", "Salt", "Lime essential oil"],
    usage: "Add a few drops to a wet sponge, work into a lather, then rinse thoroughly.",
    sizes: [
      { id: "500ml", label: "500 ml", mrp: 185, default: true },
    ],
    sku: "SN-HC-DWL-500",
    image: "/surakshitam-product-images/natural-dishwash-liquid/natural-dishwash-liquid-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/natural-dishwash-liquid/natural-dishwash-liquid-01-listing-front-clean.webp",
      "/surakshitam-product-images/natural-dishwash-liquid/natural-dishwash-liquid-02-lemon-ingredient-lifestyle.webp",
      "/surakshitam-product-images/natural-dishwash-liquid/natural-dishwash-liquid-03-sponge-usage-detail.webp",
    ],
    featured: true,
    bestSeller: true,
  },
  {
    id: "p-dishwash-bar",
    slug: "dishwash-bar",
    name: "Dish Wash Soap",
    category: "home-care",
    shortDescription: "Long-lasting utensil cleaning bar",
    description:
      "A firm, long-lasting dishwashing bar for scrubbing utensils clean. A practical, low-waste alternative for the kitchen sink.",
    benefits: ["Long-lasting bar", "Low-waste format", "Tackles tough residue"],
    keyIngredients: ["Cow-dung ash", "Tamarind seed powder", "Soapnut powder"],
    usage: "Rub a damp sponge on the bar to build lather, clean, then rinse.",
    sizes: [
      { id: "400g", label: "400 g", mrp: 114, default: true },
    ],
    sku: "SN-HC-DWS-400",
    image: "/surakshitam-product-images/natural-dishwash-bar/natural-dishwash-bar-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/natural-dishwash-bar/natural-dishwash-bar-01-listing-front-clean.webp",
      "/surakshitam-product-images/natural-dishwash-bar/natural-dishwash-bar-02-lemon-reetha-lifestyle.webp",
      "/surakshitam-product-images/natural-dishwash-bar/natural-dishwash-bar-03-open-texture-detail.webp",
    ],
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
    keyIngredients: ["Vinegar", "Lemongrass essential oil", "Citronella essential oil"],
    usage: "Dilute one capful in a bucket of water and mop as usual.",
    sizes: [
      { id: "500ml", label: "500 ml", mrp: 185, default: true },
    ],
    sku: "SN-HC-FLC-500",
    image: "/surakshitam-product-images/natural-floor-cleaner/natural-floor-cleaner-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/natural-floor-cleaner/natural-floor-cleaner-01-listing-front-clean.webp",
      "/surakshitam-product-images/natural-floor-cleaner/natural-floor-cleaner-02-lemongrass-lifestyle.webp",
      "/surakshitam-product-images/natural-floor-cleaner/natural-floor-cleaner-03-measuring-cap-usage.webp",
    ],
    featured: true,
    bestSeller: true,
  },
  {
    id: "p-washing-machine-liquid",
    slug: "washing-machine-liquid",
    name: "Laundry Detergent",
    category: "home-care",
    shortDescription: "Liquid detergent for everyday laundry",
    description:
      "A liquid laundry detergent for everyday washing — dissolves easily and rinses clean, leaving a light, fresh finish.",
    benefits: ["Everyday laundry", "Gentle on fabrics", "Fresh finish"],
    keyIngredients: ["Plant-based (coconut) surfactant", "Bio-enzymes", "IFRA-certified fragrance"],
    usage: "Add one cap per load; use less for lightly soiled laundry.",
    sizes: [
      { id: "1l", label: "1 L", mrp: 300, default: true },
    ],
    sku: "SN-HC-LDT-1000",
    image: "/surakshitam-product-images/washing-machine-liquid/washing-machine-liquid-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/washing-machine-liquid/washing-machine-liquid-01-listing-front-clean.webp",
      "/surakshitam-product-images/washing-machine-liquid/washing-machine-liquid-02-fresh-laundry-lifestyle.webp",
    ],
    isNew: true,
  },
  {
    id: "p-natural-pitambari",
    slug: "natural-utensil-shine",
    name: "Natural Pitambari (Utensil Shine)",
    category: "home-care",
    shortDescription: "Restores shine to metal utensils",
    description:
      "A gentle scouring powder that helps restore shine to metal utensils and cookware without harsh fumes.",
    benefits: ["Restores metal shine", "Everyday cookware", "Little residue"],
    keyIngredients: ["Rice husk ash", "Soapnut powder", "Whole lemon powder", "Neem powder"],
    usage: "Sprinkle onto a damp cloth, rub the utensil, then rinse clean.",
    sizes: [
      { id: "100g", label: "100 g", mrp: 104, default: true },
    ],
    sku: "SN-HC-PIT-100",
    image: "/surakshitam-product-images/natural-utensil-shine/natural-utensil-shine-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/natural-utensil-shine/natural-utensil-shine-01-listing-front-clean.webp",
      "/surakshitam-product-images/natural-utensil-shine/natural-utensil-shine-02-lemon-powder-usage.webp",
    ],
  },
  {
    id: "p-dishwash-powder",
    slug: "dishwash-powder",
    name: "Dish Wash Powder",
    category: "home-care",
    shortDescription: "Scouring powder for everyday utensils",
    description:
      "A dry dishwashing powder for scrubbing everyday utensils — ash, soapnut and lemon do the work, with no synthetic foam.",
    benefits: ["Scrubs without synthetic foam", "Low-waste dry format", "Everyday utensils"],
    keyIngredients: ["Rice husk ash", "Soapnut powder", "Neem", "Lemon powder", "Pulses powder"],
    usage: "Sprinkle a little onto a damp scrubber, clean the utensil, then rinse.",
    sizes: [
      { id: "200g", label: "200 g", mrp: 114, default: true },
    ],
    sku: "SN-HC-DWP-200",
    image: "/products/placeholder.webp",
    isNew: true,
  },
  {
    id: "p-toilet-cleaning-powder",
    slug: "toilet-bathroom-cleaning-powder",
    name: "Toilet & Bathroom Cleaning Powder",
    category: "home-care",
    shortDescription: "One pack makes a litre of cleaner",
    description:
      "A concentrated cleaning powder for toilets and bathrooms — mix one pack in water to make a litre of ready-to-use cleaner with a lavender note.",
    benefits: ["Makes 1 litre", "Lavender note", "Toilets, tiles and basins"],
    keyIngredients: ["Baking soda", "Citric acid", "Salt", "Plant-based (coconut) surfactant", "Lavender essential oil"],
    usage: "Mix the pack in 1 litre of water. Apply, leave for a few minutes, scrub and rinse.",
    sizes: [
      { id: "140g", label: "140 g", mrp: 140, default: true },
    ],
    sku: "SN-HC-TBP-140",
    image: "/products/placeholder.webp",
    isNew: true,
  },
  {
    id: "p-bio-enzyme-floor-cleaner",
    slug: "bio-enzyme-floor-cleaner",
    name: "Bio-enzyme Floor Cleaner",
    category: "home-care",
    shortDescription: "Fermented citrus enzyme for floors",
    description:
      "A floor cleaner built on fermented citrus-peel enzyme with lemongrass — what goes down the drain breaks down safely.",
    benefits: ["Citrus bio-enzyme", "Safe for drains", "Lemongrass freshness"],
    keyIngredients: ["Citrus bio-enzyme", "Lemongrass essential oil"],
    usage: "Dilute one capful in a bucket of water and mop as usual.",
    sizes: [
      { id: "500ml", label: "500 ml", mrp: 110 },
      { id: "1l", label: "1 L", mrp: 175, default: true },
    ],
    sku: "SN-HC-BFC-1000",
    image: "/products/placeholder.webp",
    isNew: true,
  },
  {
    id: "p-bio-enzyme-laundry-detergent",
    slug: "bio-enzyme-laundry-detergent",
    name: "Bio-enzyme Laundry Detergent",
    category: "home-care",
    shortDescription: "Soapnut and citrus enzyme for laundry",
    description:
      "A laundry detergent made from soapnut and fermented citrus enzyme — gentle on fabrics and on the water that leaves your home.",
    benefits: ["Soapnut & citrus enzyme", "Gentle on fabrics", "Safe for drains"],
    keyIngredients: ["Soapnut bio-enzyme", "Citrus bio-enzyme"],
    usage: "Add one cap per load; use less for lightly soiled laundry.",
    sizes: [
      { id: "1l", label: "1 L", mrp: 185, default: true },
    ],
    sku: "SN-HC-BLD-1000",
    image: "/products/placeholder.webp",
    isNew: true,
  },
  {
    id: "p-bio-enzyme-toilet-cleaner",
    slug: "bio-enzyme-toilet-cleaner",
    name: "Bio-enzyme Toilet Cleaner",
    category: "home-care",
    shortDescription: "Enzyme cleaner for the toilet bowl",
    description:
      "A toilet cleaner made from soapnut and fermented citrus enzyme — cleans the bowl without harsh acids or fumes.",
    benefits: ["Soapnut & citrus enzyme", "No harsh acids", "Safe for septic tanks"],
    keyIngredients: ["Soapnut bio-enzyme", "Citrus bio-enzyme"],
    usage: "Pour around the bowl, leave for a few minutes, brush and flush.",
    sizes: [
      { id: "1l", label: "1 L", mrp: 185, default: true },
    ],
    sku: "SN-HC-BTC-1000",
    image: "/products/placeholder.webp",
    isNew: true,
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
    sizes: [
      { id: "bar", label: "approx. 100 g", mrp: 95, default: true },
    ],
    sku: "SN-SC-SHS-100",
    image: "/surakshitam-product-images/shea-butter-soap/shea-butter-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/shea-butter-soap/shea-butter-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/shea-butter-soap/shea-butter-soap-02-shea-coconut-lifestyle.webp",
      "/surakshitam-product-images/shea-butter-soap/shea-butter-soap-03-unwrapped-texture-detail.webp",
    ],
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
    sizes: [
      { id: "bar", label: "approx. 100 g", mrp: 95, default: true },
    ],
    sku: "SN-SC-NTS-100",
    image: "/surakshitam-product-images/neem-tulsi-soap/neem-tulsi-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/neem-tulsi-soap/neem-tulsi-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/neem-tulsi-soap/neem-tulsi-soap-02-neem-tulsi-lifestyle.webp",
      "/surakshitam-product-images/neem-tulsi-soap/neem-tulsi-soap-03-unwrapped-texture-detail.webp",
    ],
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
    sizes: [
      { id: "bar", label: "approx. 100 g", mrp: 95, default: true },
    ],
    sku: "SN-SC-PYS-100",
    image: "/surakshitam-product-images/papaya-soap/papaya-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/papaya-soap/papaya-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/papaya-soap/papaya-soap-02-papaya-ingredient-lifestyle.webp",
      "/surakshitam-product-images/papaya-soap/papaya-soap-03-unwrapped-texture-detail.webp",
    ],
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
    sizes: [
      { id: "bar", label: "approx. 100 g", mrp: 95, default: true },
    ],
    sku: "SN-SC-BTS-100",
    image: "/surakshitam-product-images/beetroot-soap/beetroot-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/beetroot-soap/beetroot-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/beetroot-soap/beetroot-soap-02-beetroot-ingredient-lifestyle.webp",
    ],
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
    sizes: [
      { id: "bar", label: "approx. 100 g", mrp: 95, default: true },
    ],
    sku: "SN-SC-GLS-100",
    image: "/surakshitam-product-images/glycerine-soap/glycerine-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/glycerine-soap/glycerine-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/glycerine-soap/glycerine-soap-02-transparent-texture-lifestyle.webp",
    ],
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
    sizes: [
      { id: "bar", label: "approx. 100 g", mrp: 95, default: true },
    ],
    sku: "SN-SC-TBS-100",
    image: "/surakshitam-product-images/triple-butter-soap/triple-butter-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/triple-butter-soap/triple-butter-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/triple-butter-soap/triple-butter-soap-02-butter-ingredient-lifestyle.webp",
      "/surakshitam-product-images/triple-butter-soap/triple-butter-soap-03-floral-texture-detail.webp",
    ],
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
    sizes: [
      { id: "50ml", label: "50 ml", mrp: 125, default: true },
    ],
    sku: "SN-SC-RFW-050",
    image: "/surakshitam-product-images/rose-face-wash/rose-face-wash-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/rose-face-wash/rose-face-wash-01-listing-front-clean.webp",
      "/surakshitam-product-images/rose-face-wash/rose-face-wash-02-rose-aloe-lifestyle.webp",
      "/surakshitam-product-images/rose-face-wash/rose-face-wash-03-pink-gel-texture-detail.webp",
    ],
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
    sizes: [
      { id: "200ml", label: "200 ml", mrp: 299, default: true },
    ],
    sku: "SN-SC-LBW-250",
    image: "/surakshitam-product-images/lavender-body-wash/lavender-body-wash-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/lavender-body-wash/lavender-body-wash-01-listing-front-clean.webp",
      "/surakshitam-product-images/lavender-body-wash/lavender-body-wash-02-lavender-aloe-lifestyle.webp",
      "/surakshitam-product-images/lavender-body-wash/lavender-body-wash-03-purple-gel-texture-detail.webp",
    ],
    isNew: true,
  },
  {
    id: "p-body-lotion",
    slug: "body-lotion",
    name: "Rose Body Lotion",
    category: "skin-care",
    shortDescription: "Everyday moisture with a soft rose note",
    description:
      "A light, everyday body lotion with a soft rose note that absorbs quickly and leaves skin feeling soft, not greasy.",
    benefits: ["Light, non-greasy", "Everyday moisture", "Soft rose note"],
    keyIngredients: ["Shea butter", "Aloe vera", "Glycerin"],
    usage: "Massage onto clean skin as often as needed.",
    sizes: [
      { id: "100ml", label: "100 ml", mrp: 149 },
      { id: "200ml", label: "200 ml", mrp: 299, default: true },
    ],
    sku: "SN-SC-LOT-200",
    image: "/surakshitam-product-images/body-lotion/body-lotion-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/body-lotion/body-lotion-01-listing-front-clean.webp",
      "/surakshitam-product-images/body-lotion/body-lotion-02-shea-coconut-lifestyle.webp",
    ],
    isNew: true,
  },
  {
    id: "p-lavender-body-lotion",
    slug: "lavender-body-lotion",
    name: "Lavender Body Lotion",
    category: "skin-care",
    shortDescription: "Everyday moisture with a calming lavender note",
    description:
      "A light, everyday body lotion with a calming lavender note that absorbs quickly and leaves skin feeling soft, not greasy.",
    benefits: ["Light, non-greasy", "Everyday moisture", "Calming lavender note"],
    keyIngredients: ["Shea butter", "Aloe vera", "Glycerin", "Lavender oil"],
    usage: "Massage onto clean skin as often as needed.",
    sizes: [
      { id: "100ml", label: "100 ml", mrp: 149 },
      { id: "200ml", label: "200 ml", mrp: 299, default: true },
    ],
    sku: "SN-SC-LLT-200",
    image: "/surakshitam-product-images/body-lotion/body-lotion-01-listing-front-clean.webp",
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
    sizes: [
      { id: "200g", label: "200 g", mrp: 125, default: true },
    ],
    sku: "SN-SC-BTP-200",
    image: "/surakshitam-product-images/herbal-bath-powder/herbal-bath-powder-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/herbal-bath-powder/herbal-bath-powder-01-listing-front-clean.webp",
      "/surakshitam-product-images/herbal-bath-powder/herbal-bath-powder-02-herbal-powder-usage.webp",
    ],
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
    sizes: [
      { id: "20g", label: "20 g", mrp: 140, default: true },
    ],
    sku: "SN-SC-FTC-020",
    image: "/surakshitam-product-images/foot-cream/foot-cream-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/foot-cream/foot-cream-01-listing-front-clean.webp",
      "/surakshitam-product-images/foot-cream/foot-cream-02-peppermint-care-lifestyle.webp",
    ],
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
    sizes: [
      { id: "100g", label: "100 g", mrp: 125, default: true },
    ],
    sku: "SN-SC-ALG-100",
    image: "/surakshitam-product-images/aloe-vera-gel/aloe-vera-gel-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/aloe-vera-gel/aloe-vera-gel-01-listing-front-clean.webp",
      "/surakshitam-product-images/aloe-vera-gel/aloe-vera-gel-02-aloe-soothing-lifestyle.webp",
    ],
    bestSeller: true,
  },
  {
    id: "p-strawberry-lip-balm",
    slug: "strawberry-lip-balm",
    name: "Strawberry Lip Balm (Round Box)",
    category: "skin-care",
    shortDescription: "Softening balm for dry lips",
    description:
      "A softening lip balm with a light strawberry note to help everyday dry lips feel comfortable.",
    benefits: ["Softens dry lips", "Light strawberry note", "Pocket-sized"],
    keyIngredients: ["Shea butter", "Beeswax", "Strawberry extract"],
    usage: "Apply a thin layer to the lips as often as needed.",
    sizes: [
      { id: "box", label: "Round box", mrp: 125, default: true },
    ],
    sku: "SN-SC-SLB-BOX",
    image: "/surakshitam-product-images/strawberry-lip-balm/strawberry-lip-balm-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/strawberry-lip-balm/strawberry-lip-balm-01-listing-front-clean.webp",
      "/surakshitam-product-images/strawberry-lip-balm/strawberry-lip-balm-02-strawberry-care-lifestyle.webp",
    ],
  },
  {
    id: "p-strawberry-lip-balm-stick",
    slug: "strawberry-lip-balm-stick",
    name: "Strawberry Lip Balm Stick",
    category: "skin-care",
    shortDescription: "Chapstick with a light strawberry note",
    description:
      "The strawberry lip balm in a twist-up stick — the same softening balm, easier to carry and apply on the go.",
    benefits: ["Softens dry lips", "Light natural note", "Pocket-sized"],
    keyIngredients: ["Shea butter", "Beeswax", "Strawberry extract"],
    usage: "Apply a thin layer to the lips as often as needed.",
    sizes: [
      { id: "stick", label: "Stick", mrp: 100, default: true },
    ],
    sku: "SN-SC-SLB-STK",
    image: "/surakshitam-product-images/strawberry-lip-balm/strawberry-lip-balm-01-listing-front-clean.webp",
    isNew: true,
  },
  {
    id: "p-beetroot-lip-balm",
    slug: "beetroot-lip-balm",
    name: "Beetroot Lip Balm (Round Box)",
    category: "skin-care",
    shortDescription: "Softening balm with a natural beetroot tint",
    description:
      "A softening lip balm in a round box, tinted naturally with beetroot for a soft, everyday colour.",
    benefits: ["Softens dry lips", "Light natural note", "Pocket-sized"],
    keyIngredients: ["Shea butter", "Beeswax", "Beetroot extract"],
    usage: "Apply a thin layer to the lips as often as needed.",
    sizes: [
      { id: "box", label: "Round box", mrp: 125, default: true },
    ],
    sku: "SN-SC-BLB-BOX",
    image: "/products/placeholder.webp",
    isNew: true,
  },
  {
    id: "p-beetroot-lip-balm-stick",
    slug: "beetroot-lip-balm-stick",
    name: "Beetroot Lip Balm Stick",
    category: "skin-care",
    shortDescription: "Chapstick with a natural beetroot tint",
    description:
      "The beetroot lip balm in a twist-up stick — a soft natural tint, easy to carry and apply on the go.",
    benefits: ["Softens dry lips", "Light natural note", "Pocket-sized"],
    keyIngredients: ["Shea butter", "Beeswax", "Beetroot extract"],
    usage: "Apply a thin layer to the lips as often as needed.",
    sizes: [
      { id: "stick", label: "Stick", mrp: 100, default: true },
    ],
    sku: "SN-SC-BLB-STK",
    image: "/products/placeholder.webp",
    isNew: true,
  },
  {
    id: "p-vanilla-lip-balm",
    slug: "vanilla-lip-balm",
    name: "Vanilla Lip Balm (Round Box)",
    category: "skin-care",
    shortDescription: "Softening balm with a warm vanilla note",
    description:
      "A softening lip balm in a round box with a warm vanilla note for everyday dry lips.",
    benefits: ["Softens dry lips", "Light natural note", "Pocket-sized"],
    keyIngredients: ["Shea butter", "Beeswax", "Vanilla extract"],
    usage: "Apply a thin layer to the lips as often as needed.",
    sizes: [
      { id: "box", label: "Round box", mrp: 125, default: true },
    ],
    sku: "SN-SC-VLB-BOX",
    image: "/products/placeholder.webp",
    isNew: true,
  },
  {
    id: "p-vanilla-lip-balm-stick",
    slug: "vanilla-lip-balm-stick",
    name: "Vanilla Lip Balm Stick",
    category: "skin-care",
    shortDescription: "Chapstick with a warm vanilla note",
    description:
      "The vanilla lip balm in a twist-up stick — the same softening balm, easier to carry and apply on the go.",
    benefits: ["Softens dry lips", "Light natural note", "Pocket-sized"],
    keyIngredients: ["Shea butter", "Beeswax", "Vanilla extract"],
    usage: "Apply a thin layer to the lips as often as needed.",
    sizes: [
      { id: "stick", label: "Stick", mrp: 100, default: true },
    ],
    sku: "SN-SC-VLB-STK",
    image: "/products/placeholder.webp",
    isNew: true,
  },
  {
    id: "p-neem-gel",
    slug: "neem-gel",
    name: "Neem Gel",
    category: "skin-care",
    shortDescription: "Cooling neem gel for everyday skin",
    description:
      "A light, cooling neem gel for everyday skin care — absorbs quickly and leaves no residue.",
    benefits: ["Cooling feel", "Absorbs quickly", "Everyday use"],
    keyIngredients: ["Neem extract", "Aloe vera"],
    usage: "Apply a thin layer to clean skin as needed.",
    sizes: [
      { id: "50g", label: "50 g", mrp: 79, default: true },
    ],
    sku: "SN-SC-NMG-050",
    image: "/products/placeholder.webp",
    isNew: true,
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
    sizes: [
      { id: "225ml", label: "225 ml", mrp: 250 },
      { id: "500ml", label: "500 ml", mrp: 550, default: true },
    ],
    sku: "SN-HR-SHP-200",
    image: "/surakshitam-product-images/herbal-shampoo/herbal-shampoo-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/herbal-shampoo/herbal-shampoo-01-listing-front-clean.webp",
      "/surakshitam-product-images/herbal-shampoo/herbal-shampoo-02-amla-reetha-lifestyle.webp",
      "/surakshitam-product-images/herbal-shampoo/herbal-shampoo-03-herbal-texture-detail.webp",
    ],
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
    sizes: [
      { id: "50g", label: "50 g", mrp: 90 },
      { id: "100g", label: "100 g", mrp: 175, default: true },
    ],
    sku: "SN-HR-HPK-100",
    image: "/surakshitam-product-images/herbal-hair-pack/herbal-hair-pack-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/herbal-hair-pack/herbal-hair-pack-01-listing-front-clean.webp",
      "/surakshitam-product-images/herbal-hair-pack/herbal-hair-pack-02-amla-hibiscus-usage.webp",
    ],
    isNew: true,
  },
  {
    id: "p-hair-oil",
    slug: "hair-oil",
    name: "Herbal Hair Oil",
    category: "hair-care",
    shortDescription: "16 herbs infused in coconut and castor oil",
    description:
      "A traditional hair oil made by infusing sixteen herbs — bhringraj, brahmi, amla, hibiscus, curry leaf and more — in coconut and castor oil. For the scalp and lengths, without feeling heavy.",
    benefits: ["16-herb infusion", "Coconut & castor oil base", "Scalp and lengths"],
    keyIngredients: [
      "Bhringraj", "Brahmi", "Rose", "Avarampoo", "Henna", "Indigo", "Rosemary", "Amla",
      "Methi", "Vattiveru (vetiver)", "Neem", "Hibiscus flower", "Hibiscus leaf", "Curry leaf",
      "Maredu (bael)", "Kalonji", "Coconut oil", "Castor oil",
    ],
    usage: "Massage into the scalp and lengths; leave for a while before washing.",
    sizes: [
      { id: "100ml", label: "100 ml", mrp: 279 },
      { id: "200ml", label: "200 ml", mrp: 499, default: true },
    ],
    sku: "SN-HR-OIL-100",
    image: "/surakshitam-product-images/hair-oil/hair-oil-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/hair-oil/hair-oil-01-listing-front-clean.webp",
      "/surakshitam-product-images/hair-oil/hair-oil-02-amla-curry-leaf-lifestyle.webp",
    ],
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
    sizes: [
      { id: "100ml", label: "100 ml", mrp: 100, default: true },
    ],
    sku: "SN-HR-RMS-100",
    image: "/surakshitam-product-images/rosemary-hair-spray/rosemary-hair-spray-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/rosemary-hair-spray/rosemary-hair-spray-01-listing-front-clean.webp",
      "/surakshitam-product-images/rosemary-hair-spray/rosemary-hair-spray-02-rosemary-scalp-mist-lifestyle.webp",
    ],
    isNew: true,
  },

  /* ------------------- ADDED FROM THE REEL-REFERENCE SET -------------------
   * Real products that were photographed but had never been listed. Copy here
   * is deliberately sensory and non-medical, matching the rest of the catalog.
   * Ingredient lists still to be confirmed by the founders.
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
    sizes: [
      { id: "bar", label: "approx. 100 g", mrp: 95, default: true },
    ],
    sku: "SN-SC-ALS-100",
    image: "/surakshitam-product-images/aloe-vera-soap/aloe-vera-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/aloe-vera-soap/aloe-vera-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/aloe-vera-soap/aloe-vera-soap-02-aloe-ingredient-lifestyle.webp",
    ],
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
    sizes: [
      { id: "bar", label: "approx. 100 g", mrp: 95, default: true },
    ],
    sku: "SN-SC-CHS-100",
    image: "/surakshitam-product-images/charcoal-soap/charcoal-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/charcoal-soap/charcoal-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/charcoal-soap/charcoal-soap-02-charcoal-detox-lifestyle.webp",
    ],
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
    sizes: [
      { id: "bar", label: "approx. 100 g", mrp: 95, default: true },
    ],
    sku: "SN-SC-COS-100",
    image: "/surakshitam-product-images/coffee-soap/coffee-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/coffee-soap/coffee-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/coffee-soap/coffee-soap-02-coffee-exfoliating-lifestyle.webp",
    ],
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
    sizes: [
      { id: "bar", label: "approx. 100 g", mrp: 95, default: true },
    ],
    sku: "SN-SC-GMS-100",
    image: "/surakshitam-product-images/goat-milk-soap/goat-milk-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/goat-milk-soap/goat-milk-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/goat-milk-soap/goat-milk-soap-02-milk-creamy-lifestyle.webp",
    ],
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
    sizes: [
      { id: "bar", label: "approx. 100 g", mrp: 95, default: true },
    ],
    sku: "SN-SC-HNS-100",
    image: "/surakshitam-product-images/honey-soap/honey-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/honey-soap/honey-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/honey-soap/honey-soap-02-honey-oat-lifestyle.webp",
    ],
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
    sizes: [
      { id: "bar", label: "approx. 100 g", mrp: 95, default: true },
    ],
    sku: "SN-SC-MJS-100",
    image: "/surakshitam-product-images/manjista-soap/manjista-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/manjista-soap/manjista-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/manjista-soap/manjista-soap-02-manjista-root-lifestyle.webp",
    ],
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
    sizes: [
      { id: "bar", label: "approx. 100 g", mrp: 95, default: true },
    ],
    sku: "SN-SC-RWS-100",
    image: "/surakshitam-product-images/red-wine-soap/red-wine-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/red-wine-soap/red-wine-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/red-wine-soap/red-wine-soap-02-grape-botanical-lifestyle.webp",
    ],
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
    sizes: [
      { id: "bar", label: "approx. 100 g", mrp: 95, default: true },
    ],
    sku: "SN-SC-SDS-100",
    image: "/surakshitam-product-images/sandal-soap/sandal-soap-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/sandal-soap/sandal-soap-01-listing-front-clean.webp",
      "/surakshitam-product-images/sandal-soap/sandal-soap-02-sandalwood-lifestyle.webp",
    ],
    isNew: true,
  },
  {
    id: "p-henna-powder",
    slug: "henna-powder",
    name: "Natural Hair Dye — Henna",
    category: "hair-care",
    shortDescription: "Pure henna for natural hair colour",
    description:
      "Finely sifted henna powder for a traditional hair treatment, mixed fresh at home.",
    benefits: ["Finely sifted", "Traditional hair care", "No added colourants"],
    keyIngredients: ["Henna (Lawsonia inermis)"],
    usage: "Mix with warm water into a paste, apply to hair, leave as preferred, then rinse thoroughly.",
    sizes: [
      { id: "250g", label: "250 g", mrp: 175, default: true },
    ],
    sku: "SN-HR-HNP-250",
    image: "/surakshitam-product-images/henna-powder/henna-powder-01-listing-front-clean.webp",
    images: [
      "/surakshitam-product-images/henna-powder/henna-powder-01-listing-front-clean.webp",
      "/surakshitam-product-images/henna-powder/henna-powder-02-henna-herbal-usage.webp",
    ],
    isNew: true,
  },
  {
    id: "p-anti-dandruff-pack",
    slug: "anti-dandruff-pack",
    name: "Anti-Dandruff Pack",
    category: "hair-care",
    shortDescription: "Weekly herbal pack for a flaky scalp",
    description:
      "A weekly herbal pack for scalps that tend to flake — a traditional blend, mixed fresh at home.",
    benefits: ["Weekly scalp care", "Herbal blend", "Mix fresh at home"],
    keyIngredients: ["Herbal blend"],
    usage: "Mix with water into a paste, apply to the scalp, leave for 20–30 minutes, then rinse.",
    sizes: [
      { id: "50g", label: "50 g", mrp: 90 },
      { id: "100g", label: "100 g", mrp: 175, default: true },
    ],
    sku: "SN-HR-ADP-100",
    image: "/products/placeholder.webp",
    isNew: true,
  },
  {
    id: "p-indigo-powder",
    slug: "indigo-powder",
    name: "Natural Hair Dye — Indigo",
    category: "hair-care",
    shortDescription: "Pure indigo for deeper natural colour",
    description:
      "Finely sifted indigo leaf powder, used after henna for a deeper, natural colour — mixed fresh at home.",
    benefits: ["Finely sifted", "Use after henna", "No added colourants"],
    keyIngredients: ["Indigo (Indigofera tinctoria)"],
    usage: "Mix with warm water into a paste and apply over henna-treated hair; leave as preferred, then rinse thoroughly.",
    sizes: [
      { id: "200g", label: "200 g", mrp: 225, default: true },
    ],
    sku: "SN-HR-IND-200",
    image: "/products/placeholder.webp",
    isNew: true,
  },
  {
    id: "p-bhringraj-powder",
    slug: "bhringraj-powder",
    name: "Bhringraj Powder",
    category: "hair-care",
    shortDescription: "Traditional herb for hair care",
    description:
      "Finely sifted bhringraj leaf powder, a traditional hair-care herb for packs and oils.",
    benefits: ["Single-ingredient powder", "Finely sifted", "Mix fresh at home"],
    keyIngredients: ["Bhringraj (Eclipta alba)"],
    usage: "Mix with water, curd or your hair oil into a paste, apply to the scalp and hair, leave for 20–30 minutes, then rinse.",
    sizes: [
      { id: "100g", label: "100 g", default: true },
    ],
    sku: "SN-HR-BRJ-100",
    image: "/products/placeholder.webp",
    isNew: true,
  },
  {
    id: "p-soapnut-powder",
    slug: "soapnut-powder",
    name: "Soapnut Powder",
    category: "hair-care",
    shortDescription: "Natural cleansing powder for hair",
    description:
      "Finely sifted soapnut (reetha) powder — a traditional, gentle hair cleanser.",
    benefits: ["Single-ingredient powder", "Finely sifted", "Mix fresh at home"],
    keyIngredients: ["Soapnut (Sapindus)"],
    usage: "Mix with water, curd or your hair oil into a paste, apply to the scalp and hair, leave for 20–30 minutes, then rinse.",
    sizes: [
      { id: "250g", label: "250 g", mrp: 100, default: true },
    ],
    sku: "SN-HR-SNP-250",
    image: "/products/placeholder.webp",
    isNew: true,
  },
  {
    id: "p-shikakai-powder",
    slug: "shikakai-powder",
    name: "Shikakai Powder",
    category: "hair-care",
    shortDescription: "Traditional hair-washing powder",
    description:
      "Finely sifted shikakai pod powder for a traditional, gentle hair wash.",
    benefits: ["Single-ingredient powder", "Finely sifted", "Mix fresh at home"],
    keyIngredients: ["Shikakai (Acacia concinna)"],
    usage: "Mix with water, curd or your hair oil into a paste, apply to the scalp and hair, leave for 20–30 minutes, then rinse.",
    sizes: [
      { id: "250g", label: "250 g", mrp: 100, default: true },
    ],
    sku: "SN-HR-SKP-250",
    image: "/products/placeholder.webp",
    isNew: true,
  },
  {
    id: "p-amla-powder",
    slug: "amla-powder",
    name: "Amla Powder",
    category: "hair-care",
    shortDescription: "Amla for hair packs",
    description:
      "Finely sifted amla (Indian gooseberry) powder for hair packs and rinses.",
    benefits: ["Single-ingredient powder", "Finely sifted", "Mix fresh at home"],
    keyIngredients: ["Amla (Phyllanthus emblica)"],
    usage: "Mix with water, curd or your hair oil into a paste, apply to the scalp and hair, leave for 20–30 minutes, then rinse.",
    sizes: [
      { id: "100g", label: "100 g", mrp: 80, default: true },
    ],
    sku: "SN-HR-AML-100",
    image: "/products/placeholder.webp",
    isNew: true,
  },
  {
    id: "p-hibiscus-leaf-powder",
    slug: "hibiscus-leaf-powder",
    name: "Hibiscus Leaf Powder",
    category: "hair-care",
    shortDescription: "Hibiscus leaf for hair packs",
    description:
      "Finely sifted hibiscus leaf powder for conditioning hair packs.",
    benefits: ["Single-ingredient powder", "Finely sifted", "Mix fresh at home"],
    keyIngredients: ["Hibiscus leaf"],
    usage: "Mix with water, curd or your hair oil into a paste, apply to the scalp and hair, leave for 20–30 minutes, then rinse.",
    sizes: [
      { id: "100g", label: "100 g", mrp: 80, default: true },
    ],
    sku: "SN-HR-HLP-100",
    image: "/products/placeholder.webp",
    isNew: true,
  },
  {
    id: "p-hibiscus-flower-powder",
    slug: "hibiscus-flower-powder",
    name: "Hibiscus Flower Powder",
    category: "hair-care",
    shortDescription: "Hibiscus flower for hair packs",
    description:
      "Finely sifted hibiscus flower powder for conditioning hair packs.",
    benefits: ["Single-ingredient powder", "Finely sifted", "Mix fresh at home"],
    keyIngredients: ["Hibiscus flower"],
    usage: "Mix with water, curd or your hair oil into a paste, apply to the scalp and hair, leave for 20–30 minutes, then rinse.",
    sizes: [
      { id: "100g", label: "100 g", mrp: 110, default: true },
    ],
    sku: "SN-HR-HFP-100",
    image: "/products/placeholder.webp",
    isNew: true,
  },

  /* --------------------------- PARTNER BRANDS ---------------------------
   * Third-party stock: made by other small brands, sold by us. Food and pantry
   * goods today; the shelf is defined by who made it, not what it is, so any
   * other resold product belongs here too. Every one
   * of these carries `thirdParty: true` and its own `brand`, which is what the
   * storefront shows — no Surakshitam branding, wording or artwork is applied
   * to them anywhere. v3: only Homemade Swagruha Kitchen's wheat noodles are
   * listed (ANSWERS-2026-09-14 §C15).
   * -------------------------------------------------------------------- */
  {
    id: "p-wheat-noodles",
    slug: "homemade-wheat-noodles",
    name: "Homemade Wheat Noodles",
    category: "partner-brands",
    brand: "Homemade Swagruha Kitchen",
    thirdParty: true,
    shortDescription: "Hand-cut wheat noodles, no maida",
    description:
      "Wheat noodles made in small home batches by Homemade Swagruha Kitchen — hand-cut, sun-dried and packed without maida or added colour. Cooks in about five minutes.",
    benefits: ["Whole-wheat base", "No added colour", "Cooks in ~5 minutes"],
    keyIngredients: ["Whole wheat flour", "Edible salt"],
    usage: "Boil in salted water for 4–5 minutes, drain, then toss with your seasoning.",
    sizes: [
      { id: "250g", label: "250 g", default: true },
    ],
    sku: "AK-PN-WNL-250",
    image: "/products/partners/wheat-noodles.webp",
    isNew: true,
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
  "p-herbal-bath-powder": ["sensitive-skin"],
  "p-foot-cream": ["dry-skin"],
  "p-aloe-vera-gel": ["sensitive-skin", "dry-skin"],
  "p-strawberry-lip-balm": ["dry-skin"],
  "p-herbal-shampoo": ["dandruff", "hair-fall"],
  "p-herbal-hair-pack": ["hair-fall"],
  "p-hair-oil": ["hair-fall", "dandruff"],
  "p-rosemary-hair-spray": ["hair-fall", "frizz-control"],
  "p-aloe-vera-soap": ["sensitive-skin", "dry-skin"],
  "p-charcoal-soap": ["deep-clean", "daily-freshness"],
  "p-coffee-soap": ["deep-clean"],
  "p-goat-milk-soap": ["dry-skin", "sensitive-skin"],
  "p-honey-soap": ["dry-skin"],
  "p-manjista-soap": ["sensitive-skin"],
  "p-red-wine-soap": ["daily-freshness"],
  "p-sandal-soap": ["daily-freshness", "sensitive-skin"],
  "p-henna-powder": ["hair-fall"],
  "p-dishwash-powder": ["kitchen-grease", "deep-clean"],
  "p-toilet-cleaning-powder": ["floors-surfaces", "deep-clean"],
  "p-bio-enzyme-floor-cleaner": ["floors-surfaces", "daily-freshness"],
  "p-bio-enzyme-laundry-detergent": ["laundry", "daily-freshness"],
  "p-bio-enzyme-toilet-cleaner": ["floors-surfaces", "deep-clean"],
  "p-strawberry-lip-balm-stick": ["dry-skin"],
  "p-beetroot-lip-balm": ["dry-skin"],
  "p-beetroot-lip-balm-stick": ["dry-skin"],
  "p-vanilla-lip-balm": ["dry-skin"],
  "p-vanilla-lip-balm-stick": ["dry-skin"],
  "p-lavender-body-lotion": ["dry-skin"],
  "p-neem-gel": ["sensitive-skin"],
  "p-anti-dandruff-pack": ["dandruff"],
  "p-indigo-powder": ["hair-fall"],
  "p-soapnut-powder": ["dandruff"],
  "p-shikakai-powder": ["hair-fall"],
  "p-amla-powder": ["hair-fall"],
  "p-hibiscus-leaf-powder": ["frizz-control"],
  "p-hibiscus-flower-powder": ["frizz-control"],
};
for (const p of products) {
  if (CONCERN_TAGS[p.id]) p.concerns = CONCERN_TAGS[p.id];
}


/* ------------------------------- helpers ------------------------------- */

/** The pack pre-selected on a card — the one marked `default`, else the first. */
export function defaultSize(product: Pick<Product, "sizes">): ProductSize {
  return product.sizes.find((s) => s.default) ?? product.sizes[0];
}

export function getSize(product: Pick<Product, "sizes">, sizeId: string): ProductSize | undefined {
  return product.sizes.find((s) => s.id === sizeId);
}

/** "MRP ₹499", or "Price on request" when a pack has no MRP yet. */
export function formatMrp(size: Pick<ProductSize, "mrp">): string {
  return size.mrp == null ? "Price on request" : `MRP ₹${size.mrp.toLocaleString("en-IN")}`;
}

/** Distinct size labels across a set of products, in the order first seen — feeds the Shop size filter. */
export function sizeLabels(list: Product[]): string[] {
  const seen: string[] = [];
  for (const p of list) for (const sz of p.sizes) if (!seen.includes(sz.label)) seen.push(sz.label);
  return seen;
}

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
