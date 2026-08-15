import { reviews } from "@/lib/reviews";
import { StarRating } from "@/components/ui/StarRating";

export function Reviews() {
  return (
    <section className="bg-cream py-16 sm:py-20 lg:py-24">
      <div className="container">
        <div className="max-w-2xl">
          <p className="eyebrow">In their words</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Trusted in everyday homes
          </h2>
          <p className="mt-4 text-sm text-forest/55">
            Demo testimonials shown for the prototype — to be replaced with verified customer
            reviews.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review) => (
            <figure
              key={review.id}
              className="flex flex-col rounded-lg border border-forest/8 bg-white/60 p-6 shadow-soft"
            >
              <StarRating rating={review.rating} />
              <blockquote className="mt-4 flex-1">
                <p className="font-serif text-lg font-medium leading-snug text-forest">
                  &ldquo;{review.title}&rdquo;
                </p>
                <p className="mt-2 text-sm leading-relaxed text-forest/70">{review.body}</p>
              </blockquote>
              <figcaption className="mt-5 border-t border-forest/8 pt-4">
                <p className="text-sm font-semibold text-forest">{review.author}</p>
                <p className="text-xs text-forest/55">
                  {review.location} · {review.product}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
