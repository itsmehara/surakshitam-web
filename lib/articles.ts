/**
 * DEMO editorial content for the Learn section. Notes are practical and
 * non-medical. Review with the founders before publishing.
 */

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface Article {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  intro: string;
  sections: ArticleSection[];
}

export const articles: Article[] = [
  {
    slug: "why-plant-forward-ingredients",
    tag: "Ingredient story",
    title: "Why we choose plant-forward ingredients",
    excerpt:
      "How we decide what goes into an everyday product — and, just as importantly, what we leave out.",
    readTime: "4 min read",
    intro:
      "When you use a product every single day, the little details add up. That is why we start every formulation with a simple question: what does this really need, and nothing more?",
    sections: [
      {
        heading: "We begin with the routine, not the trend",
        paragraphs: [
          "A dish soap has a job to do at the kitchen sink. A bar of soap is part of a morning that repeats a thousand times a year. Before we think about ingredients, we think about the moment the product is used — how often, by whom, and what would genuinely make it better.",
          "Starting there keeps us honest. It stops us adding things for the label and helps us focus on what actually improves the experience.",
        ],
      },
      {
        heading: "Plant-forward, and kept simple",
        paragraphs: [
          "We lean on botanicals, plant butters and natural cleansers — ingredients with a long history of everyday use. Shea and cocoa butter for a creamy, cared-for feel; reetha and shikakai for gentle cleansing; citrus and lavender for a fresh, familiar scent.",
          "Simplicity is a feature, not a shortcut. The shorter and clearer an ingredient list, the easier it is for us to explain every choice — and for you to trust it.",
        ],
      },
      {
        heading: "What we choose to leave out",
        paragraphs: [
          "We keep our formulations free from added parabens, sulphates and SLS/SLES, and we colour our soaps with plant-derived ingredients rather than synthetic dyes.",
          "We say this plainly and without overclaiming. Natural does not automatically mean better, and no product is right for everyone — so we would always rather describe what is inside than make sweeping promises.",
        ],
      },
    ],
  },
  {
    slug: "getting-the-most-from-a-natural-dishwash",
    tag: "Care guide",
    title: "Getting the most from a natural dishwash",
    excerpt: "Simple habits that help a small amount of product go a long way at the sink.",
    readTime: "3 min read",
    intro:
      "Plant-based dish products can clean beautifully — with a slightly different rhythm to what you may be used to. A few small habits make all the difference.",
    sections: [
      {
        heading: "A little goes a long way",
        paragraphs: [
          "Concentrated, plant-based formulas don't need a big pour. Start with a few drops on a damp sponge and build up only if you need to. You'll often find one squeeze handles a whole sink.",
          "Warm water helps the product lift grease more easily, so let the tap run warm before you begin.",
        ],
      },
      {
        heading: "Work in the right order",
        paragraphs: [
          "Rinse off heavy food scraps first, then wash the least greasy items before the greasiest. This keeps your sponge working longer and uses less product overall.",
          "For baked-on residue, a short soak in warm, soapy water does the hard work for you — no scrubbing arm required.",
        ],
      },
      {
        heading: "Look after the bar and bottle",
        paragraphs: [
          "If you use a dishwash bar, let it dry between uses on a well-drained dish so it lasts longer. Keep liquids closed and out of direct sunlight.",
          "Stored well, our home-care products keep their scent and performance right to the last drop.",
        ],
      },
    ],
  },
  {
    slug: "storing-soaps-and-cleansers-well",
    tag: "Care guide",
    title: "Storing soaps and cleansers well",
    excerpt: "How to keep small-batch soaps and cleansers lasting longer with a few easy habits.",
    readTime: "3 min read",
    intro:
      "Handmade, small-batch soaps reward a little care. Store them kindly and they'll stay firm, fragrant and long-lasting.",
    sections: [
      {
        heading: "Let bars breathe and drain",
        paragraphs: [
          "The single biggest thing you can do for a natural soap is to keep it dry between uses. A draining soap dish that lets air circulate underneath will dramatically extend its life.",
          "Avoid leaving bars sitting in a pool of water on a flat surface — that is what turns a good bar soft and short-lived.",
        ],
      },
      {
        heading: "Cool, dry and out of the sun",
        paragraphs: [
          "Store spare bars and bottles somewhere cool and dry, away from direct sunlight and heat. Natural scents are delicate; strong light and warmth fade them faster.",
          "Keeping stock in a cupboard rather than on a sunny windowsill keeps everything fresher for longer.",
        ],
      },
      {
        heading: "Rotate and keep sealed",
        paragraphs: [
          "Because we make in small batches, our products are best enjoyed within a sensible time. Use older stock first, and keep liquid products closed when not in use.",
          "A quick wipe of the bottle neck now and then keeps caps clean and easy to open.",
        ],
      },
    ],
  },
  {
    slug: "from-idea-to-a-finished-bar-of-soap",
    tag: "Behind a formulation",
    title: "From idea to a finished bar of soap",
    excerpt: "The steps a formulation goes through before it becomes a product you can buy.",
    readTime: "5 min read",
    intro:
      "Every product in our range started as a question at home. Here is the path a formulation typically travels — from a rough idea to something we're happy to put our name on.",
    sections: [
      {
        heading: "1. Research and ingredient selection",
        paragraphs: [
          "We read, we compare notes, and we look at both traditional knowledge and contemporary understanding of an ingredient. Only then do we choose a shortlist that suits the everyday need we're designing for.",
        ],
      },
      {
        heading: "2. Small-batch preparation",
        paragraphs: [
          "Early versions are made in small batches by hand. Making small lets us change one thing at a time and actually notice the difference it makes to lather, feel and scent.",
        ],
      },
      {
        heading: "3. Living with it",
        paragraphs: [
          "A formulation isn't judged on paper — it's judged in a real bathroom or kitchen, used the way you'd actually use it, over days and weeks. If something feels off, we go back and adjust.",
        ],
      },
      {
        heading: "4. Refine, then refine again",
        paragraphs: [
          "Most recipes go through several rounds before they feel right. This patience is the part that doesn't show on the label, but it's the part we care about most.",
        ],
      },
      {
        heading: "5. Packaging and sharing",
        paragraphs: [
          "Once a formulation earns its place, we prepare it thoughtfully and bring it to more homes. Even then, we keep listening — a product can always be made a little better.",
        ],
      },
    ],
  },
  {
    slug: "reading-an-ingredient-list",
    tag: "Ingredient story",
    title: "A simple guide to reading an ingredient list",
    excerpt: "A friendly primer on making sense of what's printed on the back of the pack.",
    readTime: "4 min read",
    intro:
      "Ingredient lists can feel like a foreign language. A few simple ideas make them far less intimidating — and help you shop with confidence.",
    sections: [
      {
        heading: "Order tells a story",
        paragraphs: [
          "Ingredients are generally listed from most to least, by quantity. The first few items make up the bulk of a product, so they're a good clue to what it really is.",
          "If water and a gentle cleanser lead the list, that tells you more than a long tail of names further down.",
        ],
      },
      {
        heading: "Long names aren't automatically bad",
        paragraphs: [
          "Scientific (INCI) names can look alarming even when they describe something simple and plant-derived. 'Sodium chloride' is table salt; 'Cocos nucifera oil' is coconut oil.",
          "The goal isn't to fear complexity — it's to be able to find out what something is and why it's there.",
        ],
      },
      {
        heading: "Ask what each thing is doing",
        paragraphs: [
          "A helpful habit is to ask, for each ingredient, 'what job does this do?' Cleanser, moisturiser, scent, preservative, colour. If a brand can answer that for everything on the list, that's a good sign.",
          "That is exactly the test we hold ourselves to — every ingredient we use should have a reason we can explain in plain words.",
        ],
      },
    ],
  },
  {
    slug: "everyday-natural-care-routine",
    tag: "Care guide",
    title: "Building an everyday natural-care routine",
    excerpt: "You don't need a shelf full of products — just a few good ones, used well.",
    readTime: "3 min read",
    intro:
      "Switching to natural care doesn't have to mean an overhaul. The easiest way to start is small, with the products you already reach for daily.",
    sections: [
      {
        heading: "Start with one swap",
        paragraphs: [
          "Pick the product you use most — often a bar of soap or a body wash — and switch just that. Living with one change makes it easy to notice how a plant-based option feels for you.",
          "Once it feels natural, add the next swap. There's no prize for changing everything at once.",
        ],
      },
      {
        heading: "Match the product to the moment",
        paragraphs: [
          "A gentle facial cleanser for mornings, a nourishing bar for the shower, a calming body wash to wind down — the right product at the right moment makes a routine feel effortless.",
          "For the home, the same idea applies: a fresh, grease-cutting dishwash for the sink, a light floor cleaner for everyday mopping.",
        ],
      },
      {
        heading: "Keep it realistic",
        paragraphs: [
          "The best routine is the one you'll actually keep. A few well-chosen products, stored well and used with a little care, will serve you far better than a crowded shelf.",
        ],
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
