import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/catalog";
import { ArrowRight } from "@/components/icons";

export function Categories() {
  return (
    <section className="bg-cream py-16 sm:py-20 lg:py-24">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="eyebrow">Shop by category</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Find what your home needs
            </h2>
          </div>
          <Link href="/shop" className="link-underline text-sm">
            View all products <ArrowRight width={16} />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-lg border border-forest/8 bg-parchment"
            >
              <div className="grid grid-cols-[1fr_auto] items-center gap-4 p-6 sm:p-8">
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-forest">{cat.name}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-forest/65">
                    {cat.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-moss transition-colors group-hover:text-forest">
                    Explore <ArrowRight width={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-white shadow-soft sm:h-36 sm:w-36">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="150px"
                    className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
