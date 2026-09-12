import Link from "next/link";
import { ingredients } from "@/lib/ingredients";
import { IngredientChips } from "@/components/ingredients/IngredientChips";
import { ArrowRight, SproutIcon } from "@/components/icons";

export function IngredientBenefits() {

  return (
    <section className="bg-forest py-16 text-cream sm:py-20 lg:py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* Copy */}
          <div className="max-w-lg">
            <p className="eyebrow text-sage">Ingredient story</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
              Ingredients we understand, chosen with purpose
            </h2>
            <p className="mt-4 text-base leading-relaxed text-cream/75">
              Good products start with knowing what goes into them. We choose plant-forward
              ingredients for a reason — and we&apos;re always happy to explain why.
            </p>

            <div className="mt-8 flex items-start gap-3 rounded-lg border border-cream/15 bg-cream/5 p-4">
              <SproutIcon width={20} className="mt-0.5 shrink-0 text-sage" />
              <p className="text-sm leading-relaxed text-cream/75">
                Our formulation approach:{" "}
                <span className="text-cream">
                  Research → Ingredient selection → Formulation → Small-batch preparation → Review → Packaging.
                </span>
              </p>
            </div>

            <Link
              href="/ingredients"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-medium text-forest transition-colors hover:bg-parchment"
            >
              Explore Ingredients <ArrowRight width={16} />
            </Link>
          </div>

          {/* Ingredient chips — follows the Studio-managed library */}
          <IngredientChips seed={ingredients} />
        </div>
      </div>
    </section>
  );
}
