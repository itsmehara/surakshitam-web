import { LinkButton } from "@/components/ui/Button";
import { BotanicalBackdrop } from "@/components/ui/BotanicalBackdrop";
import { CategoryCards } from "@/components/home/CategoryCards";
import { ArrowRight, LeafIcon, BeakerIcon, RecycleIcon } from "@/components/icons";

const trust = [
  { icon: LeafIcon, label: "Plant-forward ingredients" },
  { icon: BeakerIcon, label: "Research-led formulations" },
  { icon: RecycleIcon, label: "Made in small batches" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F1F3E6] to-cream">
      {/* business-card botanical wash */}
      <BotanicalBackdrop />
      <div className="container relative grid items-center gap-10 py-9 sm:py-11 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:py-12">
        {/* Copy */}
        <div className="max-w-xl animate-fade-up">
          <p className="eyebrow">Homemade · Plant-based · Hyderabad</p>
          <h1 className="mt-4 text-hero font-semibold text-forest">
            Everyday care,<br />
            thoughtfully formulated.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-forest/70">
            Surakshitam Naturals brings you homemade, plant-based skin and home care from Hyderabad.
            Our eco-friendly range of herbal soaps and natural cleaners is made with natural
            essential oils — for sustainable, everyday living.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <LinkButton href="/shop" size="lg">
              Shop Products <ArrowRight width={18} />
            </LinkButton>
            <LinkButton href="/our-story" variant="outline" size="lg">
              Our Story
            </LinkButton>
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {trust.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-forest/70">
                <Icon width={18} className="text-moss" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* The four shelves, beside the headline — visible without scrolling */}
        <div className="lg:pl-2">
          <CategoryCards />
        </div>
      </div>
    </section>
  );
}
