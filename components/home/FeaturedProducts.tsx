import Link from "next/link";
import { getFeaturedProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ui/ProductCard";
import { ArrowRight } from "@/components/icons";

export function FeaturedProducts() {
  const products = getFeaturedProducts(8);

  // Sits right under the compact category tiles (same parchment), so the top
  // padding is kept short — a full section gap here just reads as empty space.
  return (
    <section className="bg-parchment pb-16 pt-8 sm:pb-20 sm:pt-10 lg:pb-24">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Everyday essentials to start with
            </h2>
            <p className="mt-2 text-sm text-forest/60">
              Hand-picked by us — the products we reach for most, and the ones we&rsquo;d recommend first.
            </p>
          </div>
          <Link href="/shop" className="link-underline text-sm">
            Shop all <ArrowRight width={16} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} priority={i < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}
