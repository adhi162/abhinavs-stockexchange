import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ExchangeCalculator } from "@/components/ExchangeCalculator";
import { Features } from "@/components/Features";
import { ProcessSection } from "@/components/ProcessSection";
import { ServicesSection } from "@/components/ServicesSection";
import { CitiesSection } from "@/components/CitiesSection";
import { RatesSection } from "@/components/RatesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { BlogSection } from "@/components/BlogSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ExchangeCalculator />
      <Features />
      <ProcessSection />
      <ServicesSection />
      <CitiesSection />
      <RatesSection />
      <TestimonialsSection />
      <FAQSection />
      <BlogSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
