import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { BotanicalBackdrop } from "@/components/ui/BotanicalBackdrop";
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
      <div className="container relative grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-8 lg:py-24">
        {/* Copy */}
        <div className="max-w-xl animate-fade-up">
          <p className="eyebrow">Homemade · Plant-based · Hyderabad</p>
          <h1 className="mt-4 text-hero font-semibold text-forest">
            Everyday care,<br />
            thoughtfully formulated.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-forest/70 sm:text-lg">
            Surakshitam Naturals brings you homemade, plant-based skin and home care from Hyderabad.
            Our eco-friendly range of herbal soaps and natural cleaners is made with natural
            essential oils — for sustainable, everyday living.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <LinkButton href="/shop" size="lg">
              Shop Products <ArrowRight width={18} />
            </LinkButton>
            <LinkButton href="/our-story" variant="outline" size="lg">
              Our Story
            </LinkButton>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {trust.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-forest/70">
                <Icon width={18} className="text-moss" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual */}
        <div className="relative">
          <div className="relative mx-auto grid max-w-md grid-cols-2 gap-4 lg:max-w-none">
            <div className="space-y-4 pt-8">
              <HeroImage src="/products/triple-butter-soap.webp" alt="Triple Butter Soap" priority />
              <HeroImage src="/products/herbal-shampoo.webp" alt="Herbal Shampoo" />
            </div>
            <div className="space-y-4">
              <HeroImage src="/products/lavender-body-wash.webp" alt="Lavender Body Wash" />
              <HeroImage src="/products/dishwash-liquid.webp" alt="Natural Dishwash Liquid" />
            </div>
          </div>
          {/* Floating formulation note */}
          <div className="absolute -bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-forest/10 bg-white/90 px-5 py-3 shadow-card backdrop-blur sm:flex">
            <BeakerIcon width={18} className="text-moss" />
            <span className="text-sm font-medium text-forest">Formulated &amp; refined by Supriya</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroImage({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg border border-forest/8 bg-white shadow-soft">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 45vw, 280px"
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
