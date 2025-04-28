import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CardShowcase } from "@/components/home/CardShowcase";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FaqSection } from "@/components/home/FaqSection";
import { CallToAction } from "@/components/home/CallToAction";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CardShowcase />
      <TestimonialsSection />
      <FaqSection />
      <CallToAction />
    </>
  );
}
