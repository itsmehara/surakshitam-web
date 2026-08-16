import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { IngredientBenefits } from "@/components/home/IngredientBenefits";
import { BestSellers } from "@/components/home/BestSellers";
import { Sustainability } from "@/components/home/Sustainability";
import { Reviews } from "@/components/home/Reviews";
import { InstagramFeedSection } from "@/components/home/InstagramFeedSection";
import { Newsletter } from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <WhyChooseUs />
      <IngredientBenefits />
      <BestSellers />
      <Sustainability />
      <Reviews />
      <InstagramFeedSection />
      <Newsletter />
    </>
  );
}
