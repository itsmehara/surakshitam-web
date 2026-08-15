import Link from "next/link";
import { getFeaturedProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ui/ProductCard";
import { ArrowRight } from "@/components/icons";

export function FeaturedProducts() {
  const products = getFeaturedProducts(8);

  return (
    <section className="bg-parchment py-16 sm:py-20 lg:py-24">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="eyebrow">Featured</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Everyday essentials to start with
            </h2>
          </div>
          <Link href="/shop" className="link-underline text-sm">
            Shop all <ArrowRight width={16} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}
