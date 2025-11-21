import { Button } from "@/components/ui/button";
import { MessageCircle, Send, Phone } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Exchange Currency?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Get the best rates in Thailand with guaranteed security and fast delivery
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8">
              <MessageCircle className="w-5 h-5" />
              Contact via WhatsApp
            </Button>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8">
              <Send className="w-5 h-5" />
              Contact via Telegram
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Phone className="w-5 h-5 text-primary" />
            <span>Or call us:</span>
            <a href="tel:+66635503442" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              +66 63 550 3442
            </a>
          </div>

          <div className="mt-12 pt-12 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">Licensed</div>
                <div className="text-muted-foreground">MC125660019</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">5★ Rating</div>
                <div className="text-muted-foreground">Google & Yandex</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
