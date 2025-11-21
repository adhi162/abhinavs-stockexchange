import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-foreground font-bold text-xl mb-4">SENATE EXCHANGE</h3>
            <p className="text-muted-foreground">
              Professional currency exchange services in Thailand with the best rates guaranteed.
            </p>
          </div>
          
          <div>
            <h4 className="text-foreground font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Currency Exchange</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Property Payments</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">FET Services</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-foreground font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contacts</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-foreground font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Send className="w-4 h-4" />
                Telegram
              </Button>
              <a href="tel:+66635503442" className="block text-primary hover:text-primary/80 font-medium text-center">
                +66 63 550 3442
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Senate Exchange. All rights reserved. License MC125660019
          </p>
        </div>
      </div>
    </footer>
  );
};
