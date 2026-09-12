import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/catalog";
import { categoryBlurbs } from "@/lib/site";
import { ArrowRight } from "@/components/icons";

/**
 * v2: the four shelves as one row directly under the slideshow hero. In v1
 * they sat beside the headline (`CategoryCards`); the full-bleed hero has no
 * side column, so they get their own compact strip — the first thing that
 * "peeks" under the hero and the target of its Explore hint.
 */
export function CategoryStrip() {
  return (
    <section id="shop-by-category" className="scroll-mt-28 bg-parchment pb-4 pt-2 sm:pb-6">
      <div className="container">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative block overflow-hidden rounded-lg border border-forest/8 shadow-soft transition-shadow duration-300 hover:shadow-card"
            >
              <div className="relative aspect-[5/3] overflow-hidden bg-cream sm:aspect-[16/9]">
                <Image
                  src={cat.groupImage ?? cat.image}
                  alt={`${cat.name} range`}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 45vw, 300px"
                  className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.05]"
                />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-forest/85 via-forest/40 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                <h3 className="font-serif text-base font-semibold leading-snug text-cream sm:text-lg">{cat.name}</h3>
                <p className="mt-0.5 line-clamp-1 text-[0.7rem] leading-relaxed text-cream/75 sm:text-xs">
                  {categoryBlurbs[cat.slug] ?? cat.description}
                </p>
                <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-cream">
                  Explore <ArrowRight width={13} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
