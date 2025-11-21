import { Bike, Shield } from "lucide-react";

export const Features = () => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-4 rounded-full">
              <Bike className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-foreground font-semibold text-lg">
                Delivery to your convenient location
              </h3>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-4 rounded-full">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-foreground font-semibold text-lg">
                License MC125660019 — 100% Security
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
