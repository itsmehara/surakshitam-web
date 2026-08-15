import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ingredients, ingredientGroups, getIngredientsByGroup } from "@/lib/ingredients";
import type { IngredientGroup } from "@/lib/types";
import { products } from "@/lib/catalog";
import { PageIntro } from "@/components/ui/PageIntro";
import { LinkButton } from "@/components/ui/Button";
import {
  ArrowRight,
  LeafIcon,
  HeartIcon,
  BeakerIcon,
  SproutIcon,
  CheckIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Ingredients",
  description:
    "The plant-forward ingredients behind Surakshitam Naturals — botanicals, plant butters, natural cleansers and essential oils, and why we choose each one.",
};

const productByName = new Map(products.map((p) => [p.name, p]));

const groupIcon: Record<IngredientGroup, typeof LeafIcon> = {
  "Botanicals & herbs": LeafIcon,
  "Plant butters & oils": HeartIcon,
  "Natural cleansers": BeakerIcon,
  "Essential oils & extracts": SproutIcon,
};

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
      <PageIntro
        eyebrow="Ingredients"
        title="What we use, and why"
        intro="Good products start with knowing what goes into them. Here is the library of plant-forward ingredients behind our range — grouped, with a plain-language note on why we choose each. Descriptions are general and non-medical, for the prototype."
      >
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-forest/70">
          <span className="inline-flex items-center gap-2">
            <LeafIcon width={16} className="text-moss" /> {ingredients.length} ingredients
          </span>
          <span className="inline-flex items-center gap-2">
            <BeakerIcon width={16} className="text-moss" /> {ingredientGroups.length} families
          </span>
        </div>
      </PageIntro>

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

      {/* Ingredient library, grouped */}
      <section className="container py-14 sm:py-20">
        <div className="space-y-16">
          {ingredientGroups.map((group) => {
            const Icon = groupIcon[group];
            const items = getIngredientsByGroup(group);
            return (
              <div key={group}>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-moss/12 text-moss">
                    <Icon width={20} />
                  </span>
                  <h2 className="font-serif text-2xl font-semibold text-forest">{group}</h2>
                  <span className="text-sm text-forest/45">({items.length})</span>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((ing) => (
                    <article
                      key={ing.slug}
                      id={ing.slug}
                      className="flex scroll-mt-28 flex-col rounded-lg border border-forest/8 bg-white/60 p-6 shadow-soft"
                    >
                      <h3 className="font-serif text-xl font-semibold text-forest">{ing.name}</h3>
                      {ing.botanicalName && (
                        <p className="mt-0.5 text-sm italic text-forest/50">{ing.botanicalName}</p>
                      )}
                      <p className="mt-3 text-sm font-medium text-forest/80">{ing.summary}</p>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-forest/65">{ing.why}</p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {ing.properties.map((p) => (
                          <span
                            key={p}
                            className="rounded-full bg-parchment px-2.5 py-1 text-[0.7rem] font-medium text-forest/70"
                          >
                            {p}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 border-t border-forest/8 pt-4">
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-moss">
                          Found in
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {ing.usedIn.map((name) => {
                            const product = productByName.get(name);
                            if (!product) {
                              return (
                                <span key={name} className="text-xs text-forest/55">
                                  {name}
                                </span>
                              );
                            }
                            return (
                              <Link
                                key={name}
                                href={`/product/${product.slug}`}
                                className="group inline-flex items-center gap-2 rounded-full border border-forest/10 py-1 pl-1 pr-3 text-xs text-forest/75 transition-colors hover:border-forest/30 hover:text-forest"
                              >
                                <span className="relative h-6 w-6 overflow-hidden rounded-full bg-cream">
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    sizes="24px"
                                    className="scale-[1.15] object-cover object-[50%_60%]"
                                  />
                                </span>
                                {name}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
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
