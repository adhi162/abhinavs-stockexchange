import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="text-foreground font-bold text-2xl tracking-tight">
              <span className="inline-flex items-center gap-2">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded font-mono text-xl">
                  SENATE
                </div>
                <span className="text-xl">EXCHANGE</span>
              </span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#exchange" className="text-foreground/80 hover:text-foreground transition-colors">
              Currency Exchange
            </a>
            <a href="#cities" className="text-foreground/80 hover:text-foreground transition-colors">
              Cities
            </a>
            <a href="#rates" className="text-foreground/80 hover:text-foreground transition-colors">
              Exchange Rates
            </a>
            <a href="#about" className="text-foreground/80 hover:text-foreground transition-colors">
              About Us
            </a>
            <a href="#blog" className="text-foreground/80 hover:text-foreground transition-colors">
              Blog
            </a>
            <a href="#faq" className="text-foreground/80 hover:text-foreground transition-colors">
              FAQ
            </a>
            <a href="#contacts" className="text-foreground/80 hover:text-foreground transition-colors">
              Contacts
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-foreground">
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground">
              <MessageCircle className="h-5 w-5" />
            </Button>
            <a href="tel:+66635503442" className="text-foreground text-sm font-medium hidden lg:block">
              +66 63 550 3442
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
