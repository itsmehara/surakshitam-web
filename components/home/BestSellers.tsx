import Link from "next/link";
import { getBestSellers } from "@/lib/catalog";
import { ProductCard } from "@/components/ui/ProductCard";
import { ArrowRight } from "@/components/icons";

export function BestSellers() {
  const products = getBestSellers(4);

  return (
    <section className="bg-cream py-16 sm:py-20 lg:py-24">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="eyebrow">Loved by our customers</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Best sellers this season
            </h2>
          </div>
          <Link href="/shop?sort=best-selling" className="link-underline text-sm">
            View best sellers <ArrowRight width={16} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
