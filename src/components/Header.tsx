import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";
import { AdminDialog } from "@/components/AdminDialog";

const navLinks = [
  { label: "Exchange", href: "#exchange" },
  { label: "How it works", href: "#process" },
  { label: "Rates", href: "#rates" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contacts" }
];

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <a href="#hero" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-200 to-green-500 text-xl font-bold text-white shadow-lg shadow-green-500/30">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">Senate</span>
            <span className="text-xl font-semibold text-slate-900">Global Exchange</span>
          </div>
        </a>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-500 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <AdminDialog />
          <Button
            asChild
            variant="ghost"
            className="hidden text-sm text-slate-600 hover:text-slate-900 md:inline-flex"
          >
            <a href="tel:+66635503442" aria-label="Call us">
              <Phone className="h-4 w-4" />
              +66 63 550 3442
            </a>
          </Button>
          <Button asChild size="lg" className="hidden rounded-full px-6 md:inline-flex">
            <a
              href="https://wa.me/66635503442"
              target="_blank"
              rel="noreferrer"
              aria-label="Start exchange on WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
              Start exchange
            </a>
          </Button>
          <Button
            asChild
            size="icon"
            className="rounded-full md:hidden"
            aria-label="Call us"
          >
            <a href="tel:+66635503442">
              <Phone className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};
