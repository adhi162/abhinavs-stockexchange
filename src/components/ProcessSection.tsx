import { MessageCircle, Calculator, Truck, CheckCircle } from "lucide-react";

export const ProcessSection = () => {
  const steps = [
    {
      icon: MessageCircle,
      title: "Contact Us",
      description: "Send us a message via WhatsApp or Telegram with the amount you want to exchange"
    },
    {
      icon: Calculator,
      title: "Get Quote",
      description: "Receive the best rate instantly. We guarantee the most competitive rates in Thailand"
    },
    {
      icon: Truck,
      title: "Choose Delivery",
      description: "Select ATM withdrawal, cash delivery, office pickup, or bank transfer"
    },
    {
      icon: CheckCircle,
      title: "Complete Exchange",
      description: "Fast and secure transaction completed. Get your money within 1-3 hours"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">
            Simple 4-step process to exchange your currency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 relative group hover:bg-primary/20 transition-colors">
                  <step.icon className="w-10 h-10 text-primary" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
