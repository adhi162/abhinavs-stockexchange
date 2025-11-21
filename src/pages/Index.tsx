import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ExchangeCalculator } from "@/components/ExchangeCalculator";
import { Features } from "@/components/Features";
import { ProcessSection } from "@/components/ProcessSection";
import { CitiesSection } from "@/components/CitiesSection";
import { RatesSection } from "@/components/RatesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { useScrollAnimations } from "@/hooks/use-scroll-animations";

const Index = () => {
  useScrollAnimations();

  return (
    <div className="min-h-screen bg-transparent">
      <Header />
      <main>
        <Hero />
        <ExchangeCalculator />
        <Features />
        <ProcessSection />
        <CitiesSection />
        <RatesSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
