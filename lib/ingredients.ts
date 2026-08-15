import type { Ingredient, IngredientGroup } from "./types";

/**
 * DEMO ingredient library — descriptions are general, sensory and non-medical.
 * Traditional-use notes are cultural context, not health claims. Verify
 * botanical names and product associations with the founders before publishing.
 */
export const ingredients: Ingredient[] = [
  {
    slug: "neem",
    name: "Neem",
    botanicalName: "Azadirachta indica",
    group: "Botanicals & herbs",
    summary: "A time-honoured Indian botanical with a clean, green character.",
    why: "Long used across Indian households, neem lends our cleansing bars a fresh, purifying feel for everyday use.",
    properties: ["Traditionally valued", "Refreshing", "Green, herbaceous"],
    usedIn: ["Neem & Tulsi Soap"],
  },
  {
    slug: "tulsi",
    name: "Tulsi (Holy Basil)",
    botanicalName: "Ocimum tenuiflorum",
    group: "Botanicals & herbs",
    summary: "The familiar holy basil found in homes across India.",
    why: "Tulsi adds a bright, herbal note and a sense of everyday freshness to our formulations.",
    properties: ["Aromatic", "Familiar", "Uplifting scent"],
    usedIn: ["Neem & Tulsi Soap"],
  },
  {
    slug: "amla",
    name: "Amla (Indian Gooseberry)",
    botanicalName: "Phyllanthus emblica",
    group: "Botanicals & herbs",
    summary: "A classic hair-care botanical in Indian tradition.",
    why: "Amla is a staple of traditional hair care, chosen here to support a clean, cared-for feel.",
    properties: ["Traditional hair care", "Rich in character"],
    usedIn: ["Herbal Shampoo"],
  },
  {
    slug: "papaya",
    name: "Papaya",
    botanicalName: "Carica papaya",
    group: "Botanicals & herbs",
    summary: "A gentle fruit extract for a fresh daily cleanse.",
    why: "Papaya brings a soft, fruity character to a mild everyday cleansing bar.",
    properties: ["Gentle", "Fruity", "Everyday"],
    usedIn: ["Papaya Soap"],
  },
  {
    slug: "beetroot",
    name: "Beetroot",
    botanicalName: "Beta vulgaris",
    group: "Botanicals & herbs",
    summary: "A natural source of that warm, rosy tint.",
    why: "We use beetroot to colour a soap naturally, without synthetic dyes.",
    properties: ["Natural colour", "Plant-derived"],
    usedIn: ["Beetroot Soap"],
  },
  {
    slug: "shea-butter",
    name: "Shea Butter",
    botanicalName: "Vitellaria paradoxa",
    group: "Plant butters & oils",
    summary: "A rich, creamy butter that makes soap feel indulgent.",
    why: "Shea butter gives our bars a creamy lather and helps skin feel soft and comfortable after washing.",
    properties: ["Rich & creamy", "Softening", "Nourishing feel"],
    usedIn: ["Shea Butter Soap", "Triple Butter Soap", "Strawberry Lip Balm"],
  },
  {
    slug: "cocoa-butter",
    name: "Cocoa Butter",
    botanicalName: "Theobroma cacao",
    group: "Plant butters & oils",
    summary: "A velvety butter with a naturally comforting note.",
    why: "Cocoa butter adds richness and a smooth, cared-for finish to our triple-butter bar.",
    properties: ["Velvety", "Comforting", "Conditioning feel"],
    usedIn: ["Triple Butter Soap"],
  },
  {
    slug: "mango-butter",
    name: "Mango Butter",
    botanicalName: "Mangifera indica",
    group: "Plant butters & oils",
    summary: "A light plant butter with a soft, cushiony feel.",
    why: "Mango butter rounds out our butter blend with a lighter, silky character.",
    properties: ["Light", "Silky", "Softening feel"],
    usedIn: ["Triple Butter Soap"],
  },
  {
    slug: "coconut-oil",
    name: "Coconut Oil",
    botanicalName: "Cocos nucifera",
    group: "Plant butters & oils",
    summary: "The everyday oil behind a good, bubbly lather.",
    why: "Coconut oil helps our soaps build a satisfying lather while keeping the base plant-derived.",
    properties: ["Lathering", "Plant-derived", "Everyday"],
    usedIn: ["Shea Butter Soap", "Neem & Tulsi Soap", "Papaya Soap", "Glycerine Soap"],
  },
  {
    slug: "glycerin",
    name: "Vegetable Glycerin",
    botanicalName: "Plant-derived glycerol",
    group: "Plant butters & oils",
    summary: "A humectant that helps skin feel comfortable, not tight.",
    why: "Glycerin draws in a little moisture, so our cleansers feel mild rather than stripping.",
    properties: ["Humectant", "Mild", "Comforting"],
    usedIn: ["Glycerine Soap", "Rose Face Wash", "Lavender Body Wash"],
  },
  {
    slug: "reetha",
    name: "Reetha (Soapnut)",
    botanicalName: "Sapindus mukorossi",
    group: "Natural cleansers",
    summary: "A naturally foaming fruit used for centuries to clean.",
    why: "Reetha is a traditional, plant-based cleanser we lean on for gentle, everyday washing.",
    properties: ["Naturally foaming", "Traditional cleanser", "Gentle"],
    usedIn: ["Herbal Shampoo", "Natural Dishwash Bar"],
  },
  {
    slug: "shikakai",
    name: "Shikakai",
    botanicalName: "Senegalia rikii",
    group: "Natural cleansers",
    summary: "The classic 'fruit for hair' of Indian tradition.",
    why: "Shikakai is a much-loved traditional hair cleanser, chosen for a mild, everyday clean.",
    properties: ["Traditional hair wash", "Mild", "Time-honoured"],
    usedIn: ["Herbal Shampoo"],
  },
  {
    slug: "lemon",
    name: "Lemon & Citrus",
    botanicalName: "Citrus limon",
    group: "Essential oils & extracts",
    summary: "A bright, fresh note that says 'clean'.",
    why: "Citrus lends a crisp, uplifting scent to our home-care range and cuts through everyday grease.",
    properties: ["Fresh & zesty", "Grease-cutting", "Uplifting"],
    usedIn: ["Natural Dishwash Liquid", "Natural Floor Cleaner"],
  },
  {
    slug: "lavender",
    name: "Lavender",
    botanicalName: "Lavandula angustifolia",
    group: "Essential oils & extracts",
    summary: "A calming floral that turns a wash into a wind-down.",
    why: "Lavender gives our body wash a soft, soothing scent for a calmer everyday routine.",
    properties: ["Calming scent", "Floral", "Soothing"],
    usedIn: ["Lavender Body Wash"],
  },
  {
    slug: "rose",
    name: "Rose",
    botanicalName: "Rosa",
    group: "Essential oils & extracts",
    summary: "A gentle floral for a fresh, delicate finish.",
    why: "Rose brings a light, pleasant fragrance to our facial cleanser without overpowering.",
    properties: ["Delicate", "Fresh floral", "Gentle"],
    usedIn: ["Rose Face Wash"],
  },
  {
    slug: "aloe-vera",
    name: "Aloe Vera",
    botanicalName: "Aloe barbadensis",
    group: "Essential oils & extracts",
    summary: "A soothing plant gel that keeps things gentle.",
    why: "Aloe adds a soft, soothing quality to our facial and body cleansers.",
    properties: ["Soothing", "Gentle", "Plant gel"],
    usedIn: ["Rose Face Wash", "Lavender Body Wash"],
  },
];

export const ingredientGroups: IngredientGroup[] = [
  "Botanicals & herbs",
  "Plant butters & oils",
  "Natural cleansers",
  "Essential oils & extracts",
];

export function getIngredientBySlug(slug: string): Ingredient | undefined {
  return ingredients.find((i) => i.slug === slug);
}

export function getIngredientsByGroup(group: IngredientGroup): Ingredient[] {
  return ingredients.filter((i) => i.group === group);
}
