import type { Metadata } from "next";
import { ingredients, DEFAULT_INGREDIENT_GROUPS } from "@/lib/ingredients";
import { BannerIntro } from "@/components/ui/BannerIntro";
import { LinkButton } from "@/components/ui/Button";
import {
  IngredientLibrary,
  IngredientCounts,
} from "@/components/ingredients/IngredientLibrary";
import { ArrowRight, CheckIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Ingredients",
  description:
    "The plant-forward ingredients behind Surakshitam Naturals — botanicals, plant butters, natural cleansers and essential oils, and why we choose each one.",
};

/**
 * The shipped library, rendered on the server so the page has real content in
 * its HTML. `IngredientLibrary` swaps in whatever the admin has since saved in
 * Studio (see lib/ingredient-store.ts) once it mounts.
 */
const seed = { ingredients, groups: DEFAULT_INGREDIENT_GROUPS };

const selection = [
  {
    title: "Start with the everyday need",
    body: "We look at a real routine — washing up, mopping, a daily bath — and ask what would genuinely help.",
  },
  {
    title: "Choose plant-forward ingredients",
    body: "We reach for botanicals, plant butters and natural cleansers, and keep each recipe as simple as it can be.",
  },
  {
    title: "Make, test and refine",
    body: "Small batches are prepared and adjusted until the feel, lather and scent are right for daily use.",
  },
];

const avoidList = [
  "No added parabens",
  "No added sulphates",
  "No added SLS / SLES",
  "No synthetic dyes in our soaps",
];

export default function IngredientsPage() {
  return (
    <>
      <BannerIntro
        src="/banners/ingredients-botanicals-butters-natural-cleansers-responsive.webp"
        alt="Plant butters, herbs, essential oils and natural cleansers used across the range"
        eyebrow="Ingredients"
        title="What we use, and why"
        intro="Good products start with knowing what goes into them. Here is the library of plant-forward ingredients behind our range — grouped, with a plain-language note on why we choose each. Descriptions are general and non-medical, for the prototype."
      >
        <IngredientCounts seed={seed} />
      </BannerIntro>

      {/* How we choose */}
      <section className="border-b border-forest/8 bg-cream py-14 sm:py-16">
        <div className="container">
          <div className="max-w-2xl">
            <p className="eyebrow">How we choose</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Every ingredient earns its place
            </h2>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {selection.map((s, i) => (
              <div key={s.title} className="rounded-lg border border-forest/8 bg-white/60 p-6 shadow-soft">
                <span className="font-serif text-2xl font-semibold text-moss">0{i + 1}</span>
                <h3 className="mt-3 font-serif text-lg font-semibold text-forest">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-forest/70">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredient library, grouped — editable from Studio */}
      <section className="container py-14 sm:py-20">
        <IngredientLibrary seed={seed} />
      </section>

      {/* What we don't add */}
      <section className="bg-forest py-14 text-cream sm:py-20">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="max-w-md">
            <p className="eyebrow text-sage">Kept simple</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
              What we choose to leave out
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-cream/75">
              We keep our formulations plant-forward and our labels honest. Here is what we don&apos;t
              add — stated plainly, without overclaiming.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {avoidList.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border border-cream/12 bg-cream/5 px-4 py-3.5"
              >
                <CheckIcon width={18} className="shrink-0 text-sage" />
                <span className="text-sm text-cream/90">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-14 text-center sm:py-16">
        <h2 className="mx-auto max-w-xl font-serif text-2xl font-semibold text-forest sm:text-3xl">
          See these ingredients at work
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href="/shop" size="lg">
            Shop Products <ArrowRight width={18} />
          </LinkButton>
          <LinkButton href="/our-story" variant="outline" size="lg">
            Our Story
          </LinkButton>
        </div>
      </section>
    </>
  );
}
