import type { Metadata } from "next";
import Link from "next/link";
import { searchProducts, categories } from "@/lib/catalog";
import { ProductCard } from "@/components/ui/ProductCard";
import { SearchBox } from "@/components/search/SearchBox";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Surakshitam Naturals products by name, category or ingredient.",
};

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q ?? "").trim();
  const results = q ? searchProducts(q) : [];

  return (
    <>
      <section className="border-b border-forest/8 bg-gradient-to-b from-[#F1F3E6] to-cream">
        <div className="container max-w-2xl py-12 sm:py-16">
          <h1 className="font-serif text-3xl font-semibold text-forest sm:text-4xl">Search</h1>
          <p className="mt-2 text-sm text-forest/60">
            Find products by name, category or ingredient.
          </p>
          <div className="mt-6">
            <SearchBox initial={q} />
          </div>
        </div>
      </section>

      <div className="container py-10">
        {!q ? (
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-medium text-forest/70">Browse a category</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/shop?category=${c.slug}`}
                  className="rounded-full border border-forest/15 px-4 py-2 text-sm font-medium text-forest hover:border-forest/40"
                >
                  {c.name}
                </Link>
              ))}
              <Link
                href="/ingredients"
                className="rounded-full border border-forest/15 px-4 py-2 text-sm font-medium text-forest hover:border-forest/40"
              >
                Ingredients
              </Link>
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif text-xl text-forest">No results for &ldquo;{q}&rdquo;</p>
            <p className="mt-2 text-sm text-forest/60">
              Try a different word — a product, category or ingredient.
            </p>
            <Link href="/shop" className="mt-4 inline-block text-sm font-medium text-moss">
              Browse all products
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-forest/55">
              {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
