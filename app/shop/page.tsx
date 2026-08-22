import type { Metadata } from "next";
import Link from "next/link";
import { products, categories } from "@/lib/catalog";
import { concernsForCategory } from "@/lib/site";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/ui/ProductCard";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse Surakshitam Naturals home care, skin care and hair care — natural, small-batch essentials for everyday homes.",
};

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low–High" },
  { value: "price-desc", label: "Price: High–Low" },
  { value: "best-selling", label: "Best Selling" },
];

function sortProducts(list: Product[], sort?: string): Product[] {
  const copy = [...list];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "newest":
      return copy.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    case "best-selling":
      return copy.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
    default:
      return copy.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }
}

type SearchParams = { category?: string; sort?: string; concern?: string; shelf?: string };

/** Home Care's two shelves — see lib/catalog.ts for how products are classified. */
const homeCareShelves = [
  { slug: "bio-enzyme", name: "Bio-Enzyme" },
  { slug: "general", name: "General Home Care" },
] as const;

export default function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const activeCategory = searchParams.category;
  const activeSort = searchParams.sort ?? "featured";
  const activeShelf = activeCategory === "home-care" ? searchParams.shelf : undefined;

  // Only offer concerns that belong to the shelf being browsed — Home Care must
  // never show skin/hair filters like "Dry Skin" or "Dandruff".
  const availableConcerns = concernsForCategory(activeCategory);
  const activeConcern = availableConcerns.some((c) => c.slug === searchParams.concern)
    ? searchParams.concern
    : undefined;

  let filtered = activeCategory ? products.filter((p) => p.category === activeCategory) : products;
  if (activeShelf) {
    filtered = filtered.filter((p) => (p.homeCareType ?? "general") === activeShelf);
  }
  if (activeConcern) filtered = filtered.filter((p) => p.concerns?.includes(activeConcern));
  const list = sortProducts(filtered, activeSort);

  const chips = [{ slug: undefined, name: "All Products" }, ...categories];

  function href(next: Partial<SearchParams>) {
    const params = new URLSearchParams();
    const category = "category" in next ? next.category : activeCategory;
    const sort = next.sort ?? activeSort;
    // Switching category drops filters that don't exist on the new shelf.
    const categoryChanged = "category" in next && next.category !== activeCategory;
    const concern = categoryChanged ? undefined : "concern" in next ? next.concern : activeConcern;
    const shelf = categoryChanged ? undefined : "shelf" in next ? next.shelf : activeShelf;
    if (category) params.set("category", category);
    if (sort && sort !== "featured") params.set("sort", sort);
    if (concern) params.set("concern", concern);
    if (shelf) params.set("shelf", shelf);
    const qs = params.toString();
    return qs ? `/shop?${qs}` : "/shop";
  }

  const concernName = activeConcern
    ? availableConcerns.find((c) => c.slug === activeConcern)?.name
    : undefined;
  const heading = concernName
    ? `${concernName} essentials`
    : activeCategory
      ? categories.find((c) => c.slug === activeCategory)?.name ?? "Shop"
      : "All Products";

  return (
    <>
      {/* Compact header — keeps products near the top of the viewport */}
      <div className="border-b border-forest/8 bg-parchment/70">
        <div className="container flex flex-wrap items-baseline justify-between gap-x-4 py-2.5">
          <h1 className="font-serif text-lg font-semibold text-forest">{heading}</h1>
          <p className="text-xs text-forest/55">{list.length} products · demo pricing</p>
        </div>
        {activeCategory === "pantry" && (
          <div className="container pb-2.5">
            <p className="text-xs leading-relaxed text-forest/60">
              Pantry &amp; Foods are made by other small brands — we stock and deliver them, we don&apos;t
              make them. Each pack is listed under its own brand name.
            </p>
          </div>
        )}
      </div>

      {/* Sticky filter + sort bar */}
      <div className="sticky top-[6.25rem] z-30 border-b border-forest/8 bg-cream/95 backdrop-blur-md lg:top-[6.75rem]">
        <div className="container flex items-center gap-3 overflow-x-auto py-2.5">
          <div className="flex shrink-0 gap-2" role="group" aria-label="Filter by category">
            {chips.map((c) => {
              const active = activeCategory === c.slug || (!activeCategory && !c.slug);
              return (
                <Link
                  key={c.name}
                  href={href({ category: c.slug ?? "" })}
                  className={cn(
                    "whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "border-forest bg-forest text-cream"
                      : "border-forest/15 text-forest hover:border-forest/40",
                  )}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1.5" aria-label="Sort products">
            <span className="hidden text-xs text-forest/50 sm:inline">Sort</span>
            {sortOptions.map((o) => (
              <Link
                key={o.value}
                href={href({ sort: o.value })}
                className={cn(
                  "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  activeSort === o.value
                    ? "bg-moss/15 text-moss"
                    : "text-forest/55 hover:bg-forest/5",
                )}
              >
                {o.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Home Care shelves — bio-enzyme vs the general range */}
      {activeCategory === "home-care" && (
        <div className="border-b border-forest/8 bg-cream">
          <div className="container flex flex-wrap items-center gap-2 py-2.5" role="group" aria-label="Home care type">
            <span className="hidden shrink-0 text-xs text-forest/50 sm:inline">Type</span>
            <Link
              href={href({ shelf: "" })}
              className={cn(
                "whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                !activeShelf
                  ? "border-forest bg-forest text-cream"
                  : "border-forest/12 text-forest/60 hover:border-forest/30",
              )}
            >
              All home care
            </Link>
            {homeCareShelves.map((shelf) => {
              const active = activeShelf === shelf.slug;
              return (
                <Link
                  key={shelf.slug}
                  href={href({ shelf: active ? "" : shelf.slug })}
                  className={cn(
                    "whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    active
                      ? "border-moss bg-moss/15 text-moss"
                      : "border-forest/12 text-forest/60 hover:border-forest/30",
                  )}
                >
                  {shelf.name}
                </Link>
              );
            })}
            <p className="basis-full text-xs leading-relaxed text-forest/55 sm:basis-auto sm:border-l sm:border-forest/10 sm:pl-3">
              Bio-enzyme cleaners are built on fermented plant peels — they break down after use, so
              what goes down the drain feeds the soil instead of harming it.
            </p>
          </div>
        </div>
      )}

      {/* Shop by concern — only the tags that apply to this shelf */}
      {availableConcerns.length > 0 && (
      <div className="border-b border-forest/8 bg-cream">
        <div className="container flex items-center gap-2 overflow-x-auto py-2.5" role="group" aria-label="Shop by concern">
          <span className="hidden shrink-0 text-xs text-forest/50 sm:inline">Shop by concern</span>
          {availableConcerns.map((c) => {
            const active = activeConcern === c.slug;
            return (
              <Link
                key={c.slug}
                href={href({ concern: active ? "" : c.slug })}
                className={cn(
                  "whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  active
                    ? "border-moss bg-moss/15 text-moss"
                    : "border-forest/12 text-forest/60 hover:border-forest/30",
                )}
              >
                {c.name}
              </Link>
            );
          })}
        </div>
      </div>
      )}

      <div className="container py-4">
        {list.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-xl text-forest">No products match these filters</p>
            <Link href="/shop" className="mt-3 inline-block text-sm font-medium text-moss">
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {list.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
