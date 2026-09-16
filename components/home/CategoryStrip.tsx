import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/catalog";
import { categoryBlurbs } from "@/lib/site";
import { ArrowRight } from "@/components/icons";

/**
 * v2: the four shelves as one row directly under the slideshow hero. In v1
 * they sat beside the headline (`CategoryCards`); the full-bleed hero has no
 * side column, so they get their own strip — the first thing that "peeks"
 * under the hero and the target of its Explore hint.
 *
 * Deliberately *not* another row of product-style cards (the Founder's
 * Favourites grid right below is exactly that). These are compact horizontal
 * tiles — a small square thumbnail on the left, name + blurb on the right —
 * so they read as navigation, not merchandise. The group photos are square
 * with products filling the frame, so the thumbnail shows the whole image
 * rather than cropping it.
 */
export function CategoryStrip() {
  return (
    <section id="shop-by-category" className="scroll-mt-28 bg-parchment pb-6 pt-2">
      <div className="container">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-forest/8 bg-white p-2 pr-3 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-forest/15 hover:shadow-card sm:pr-3.5"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream sm:h-16 sm:w-16">
                <Image
                  src={cat.groupImage ?? cat.image}
                  alt={`${cat.name} range`}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.06]"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-[0.95rem] font-semibold leading-snug text-forest sm:text-base">
                  {cat.name}
                </h3>
                {/* phones: the tile is ~160px wide, so the blurb would just be an ellipsis — name + photo is enough */}
                <p className="mt-0.5 hidden line-clamp-2 text-xs leading-snug text-forest/60 sm:block">
                  {categoryBlurbs[cat.slug] ?? cat.description}
                </p>
              </div>
              <ArrowRight
                width={15}
                className="hidden shrink-0 text-moss transition-transform group-hover:translate-x-1 sm:block lg:hidden xl:block"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
