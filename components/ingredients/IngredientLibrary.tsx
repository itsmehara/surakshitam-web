"use client";

import Image from "next/image";
import Link from "next/link";
import { products, productImage } from "@/lib/catalog";
import type { IngredientGroup } from "@/lib/types";
import { LeafIcon, HeartIcon, BeakerIcon, SproutIcon } from "@/components/icons";
import { useIngredientLibrary, type IngredientLibraryData } from "./useIngredientLibrary";

const productByName = new Map(products.map((p) => [p.name, p]));

/** Icons for the families we ship with. */
const KNOWN_GROUP_ICONS: Record<string, typeof LeafIcon> = {
  "Botanicals & herbs": LeafIcon,
  "Plant butters & oils": HeartIcon,
  "Natural cleansers": BeakerIcon,
  "Essential oils & extracts": SproutIcon,
};
const FALLBACK_ICONS = [LeafIcon, HeartIcon, BeakerIcon, SproutIcon];

/**
 * Families the admin adds have no icon of their own, so pick one from the set
 * by name — stable for a given family rather than random per render.
 */
function iconFor(group: IngredientGroup): typeof LeafIcon {
  const known = KNOWN_GROUP_ICONS[group];
  if (known) return known;
  const hash = [...group].reduce((n, c) => n + c.charCodeAt(0), 0);
  return FALLBACK_ICONS[hash % FALLBACK_ICONS.length];
}

/** The "N ingredients · N families" line under the page title. */
export function IngredientCounts({ seed }: { seed: IngredientLibraryData }) {
  const { ingredients, groups } = useIngredientLibrary(seed);
  const usedGroups = groups.filter((g) => ingredients.some((i) => i.group === g));
  return (
    <div className="mt-6 flex flex-wrap gap-4 text-sm text-forest/70">
      <span className="inline-flex items-center gap-2">
        <LeafIcon width={16} className="text-moss" /> {ingredients.length} ingredients
      </span>
      <span className="inline-flex items-center gap-2">
        <BeakerIcon width={16} className="text-moss" /> {usedGroups.length} families
      </span>
    </div>
  );
}

/** The grouped ingredient cards — the part Studio can edit. */
export function IngredientLibrary({ seed }: { seed: IngredientLibraryData }) {
  const { ingredients, groups } = useIngredientLibrary(seed);
  const populated = groups
    .map((group) => ({ group, items: ingredients.filter((i) => i.group === group) }))
    .filter((g) => g.items.length > 0);

  if (populated.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-forest/55">
        The ingredient library is empty right now — check back shortly.
      </p>
    );
  }

  return (
    <div className="space-y-16">
      {populated.map(({ group, items }) => {
        const Icon = iconFor(group);
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

                  {ing.properties.length > 0 && (
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
                  )}

                  {ing.usedIn.length > 0 && (
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
                                  src={productImage(product)}
                                  alt={product.name}
                                  fill
                                  sizes="24px"
                                  className={
                                    product.thirdParty
                                      ? "object-contain p-0.5"
                                      : "object-cover"
                                  }
                                />
                              </span>
                              {name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
