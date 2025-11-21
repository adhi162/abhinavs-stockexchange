import { Card } from "@/components/ui/card";
import { Building2, Wallet, Shield, CreditCard, Banknote, Globe } from "lucide-react";

export const ServicesSection = () => {
  const services = [
    {
      icon: Wallet,
      title: "Currency Exchange",
      description: "Exchange RUB, USD, EUR, KZT, USDT, BTC at the best rates in Thailand"
    },
    {
      icon: Building2,
      title: "Real Estate Payments",
      description: "Pay for Thai real estate in rubles without currency restrictions"
    },
    {
      icon: Shield,
      title: "FET for Freehold",
      description: "Foreign Exchange Transaction certificate without risks, with full guarantee"
    },
    {
      icon: CreditCard,
      title: "MIR & Union Pay",
      description: "We accept cards from all RF banks including MIR and Union Pay"
    },
    {
      icon: Banknote,
      title: "Cash Delivery",
      description: "Fast and secure cash delivery to any convenient location"
    },
    {
      icon: Globe,
      title: "No Hidden Fees",
      description: "Transparent pricing with no hidden commissions or fees"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Professional currency exchange and financial services in Thailand
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="p-6 bg-card border-border hover:border-primary transition-all duration-300 group">
              <div className="mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
