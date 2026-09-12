import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/catalog";
import { categoryBlurbs } from "@/lib/site";
import { ArrowRight } from "@/components/icons";

/**
 * The four shelf cards, sitting beside the headline in the hero as a staggered
 * 2×2.
 *
 * The name and blurb sit *on* the photo rather than under it. Stacked-text
 * cards work in a wide row, but beside a column of copy they get tall and the
 * pair of columns stops balancing — an overlay keeps each card to just its
 * image, so the grid stays compact and the photography does the work.
 *
 * The left column is nudged down (`pt-8`) so the four don't line up in a rigid
 * block. Each card is a single link to its shelf.
 *
 * Image is `aspect-[4/5]`: the source photos are square, so this trims a little
 * from the left and right edges, where the group shots have the most room.
 */
export function CategoryCards() {
  const columns = [categories.slice(0, 2), categories.slice(2, 4)];

  return (
    <div className="mx-auto grid max-w-md grid-cols-2 gap-3 sm:gap-4 lg:max-w-none">
      {columns.map((column, c) => (
        <div key={c} className={c === 0 ? "space-y-3 pt-6 sm:space-y-4 sm:pt-8" : "space-y-3 sm:space-y-4"}>
          {column.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative block overflow-hidden rounded-lg border border-forest/8 shadow-soft transition-shadow duration-300 hover:shadow-card"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-cream">
                <Image
                  src={cat.groupImage ?? cat.image}
                  alt={`${cat.name} range`}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 40vw, 260px"
                  priority={c === 0 && i === 0}
                  className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.05]"
                />
                {/* scrim only where the type sits, so the photo stays bright */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-forest/85 via-forest/45 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                <h3 className="font-serif text-base font-semibold leading-snug text-cream sm:text-lg">
                  {cat.name}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-[0.7rem] leading-relaxed text-cream/75 sm:text-xs">
                  {categoryBlurbs[cat.slug] ?? cat.description}
                </p>
                <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-cream">
                  Explore
                  <ArrowRight width={13} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
