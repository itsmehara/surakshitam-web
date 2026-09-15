import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { CategoryStrip } from "@/components/home/CategoryStrip";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { IngredientBenefits } from "@/components/home/IngredientBenefits";
import { BestSellers } from "@/components/home/BestSellers";
import { Sustainability } from "@/components/home/Sustainability";
import { InstagramFeedSection } from "@/components/home/InstagramFeedSection";
import { WhatsAppCta } from "@/components/home/WhatsAppCta";

export default function HomePage() {
  return (
    <>
      {/* v2: full-bleed banner slideshow, then the four shelves peeking in under it */}
      <HeroSlideshow />
      <CategoryStrip />
      <FeaturedProducts />
      <WhyChooseUs />
      <IngredientBenefits />
      <BestSellers />
      <Sustainability />
      <InstagramFeedSection />
      {/* v3: closing WhatsApp call-to-action (no reviews / newsletter in the static site) */}
      <WhatsAppCta />
    </>
  );
}
