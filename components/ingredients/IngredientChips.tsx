"use client";

import Link from "next/link";
import { DEFAULT_INGREDIENT_GROUPS } from "@/lib/ingredients";
import type { Ingredient } from "@/lib/types";
import { SproutIcon } from "@/components/icons";
import { useIngredientLibrary } from "./useIngredientLibrary";

/**
 * The ingredient chips on the homepage. Reads the same live library as the
 * Ingredients page, so anything the admin adds, renames or hides in Studio
 * shows up here too rather than drifting out of sync with it.
 */
export function IngredientChips({ seed, limit = 6 }: { seed: Ingredient[]; limit?: number }) {
  const { ingredients } = useIngredientLibrary({
    ingredients: seed,
    groups: DEFAULT_INGREDIENT_GROUPS,
  });
  const featured = ingredients.slice(0, limit);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {featured.map((ing) => (
        <Link
          key={ing.slug}
          href={`/ingredients#${ing.slug}`}
          className="group rounded-lg border border-cream/12 bg-cream/5 p-4 transition-colors hover:bg-cream/10"
        >
          <div className="relative mx-auto h-14 w-14 overflow-hidden rounded-full bg-cream/10">
            <div className="flex h-full w-full items-center justify-center text-sage">
              <SproutIcon width={24} />
            </div>
          </div>
          <p className="mt-3 text-center font-serif text-base font-semibold text-cream">
            {ing.name}
          </p>
          {ing.botanicalName && (
            <p className="mt-0.5 text-center text-[0.7rem] italic text-cream/50">
              {ing.botanicalName}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
}
