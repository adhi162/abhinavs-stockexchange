import { Check } from "lucide-react";
import heroBackground from "@/assets/image.png";

export const Hero = () => {
  const features = [
    "Fast, legal, and without bank blocking",
    "Pay for real estate in Thailand with rubles",
    "FET for Freehold without risks, with guarantee",
    "No hidden fees or commissions",
    "We accept MIR and Union Pay cards from all RF banks",
    "Any amount to exchange"
  ];

  return (
    <section 
      className="relative min-h-[600px] flex items-center py-20"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
            Currency Exchange in Thailand with Best Rate Guarantee
          </h1>
          
          <ul className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <span className="text-foreground text-lg">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 inline-block">
            <p className="text-foreground text-lg">
              Seen a lower rate? We'll make it even better for you!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
