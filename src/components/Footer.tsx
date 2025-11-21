import { useEffect, useState, type ReactNode } from "react";
import { MessageCircle, Send, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const footerLinks = [
  {
    title: "Navigate",
    links: [
      { label: "Exchange", href: "#exchange" },
      { label: "How it works", href: "#process" },
      { label: "Rates", href: "#rates" },
      { label: "FAQ", href: "#faq" }
    ]
  },
  {
    title: "Offices",
    links: [
      { label: "Phuket", href: "#cities" },
      { label: "Bangkok", href: "#cities" },
      { label: "Pattaya", href: "#cities" }
    ]
  }
];

type FooterGroupProps = {
  title: string;
  children: ReactNode;
};

const FooterGroup = ({ title, children }: FooterGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 768px)").matches) {
      setIsOpen(true);
    }
  }, []);

  return (
    <div className="rounded-2xl border border-white/60 bg-white/80 p-4 md:border-none md:bg-transparent md:p-0">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 md:cursor-default"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition md:hidden",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
      <div className={cn("mt-3 text-sm text-slate-500", isOpen ? "block" : "hidden md:block")}>
        {children}
      </div>
    </div>
  );
};

export const Footer = () => {
  return (
    <footer className="border-t border-white/60 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">
              Senate Exchange
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900">
              Currency desk for people who value time
            </h3>
            <p className="mt-4 text-sm text-slate-500">
              Licensed desk • MC125660019 • Operating across Thailand since 2012.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="sm" className="rounded-full px-4">
                <a href="https://wa.me/66635503442" target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="rounded-full border border-slate-200 bg-white px-4 text-slate-700"
              >
                <a href="https://t.me/senateexchange" target="_blank" rel="noreferrer">
                  <Send className="h-4 w-4" />
                  Telegram
                </a>
              </Button>
            </div>
          </div>

          {footerLinks.map((column) => (
            <FooterGroup key={column.title} title={column.title}>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="transition-colors hover:text-slate-900">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </FooterGroup>
          ))}

          <FooterGroup title="Contact">
            <div className="space-y-3 text-sm">
              <a href="tel:+66635503442" className="flex items-center gap-2 font-semibold text-slate-900">
                <Phone className="h-4 w-4 text-emerald-500" />
                +66 63 550 3442
              </a>
              <p className="text-slate-500">Daily • 9:00 – 20:00</p>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Mail</p>
                <a href="mailto:desk@senate.exchange" className="text-slate-600 hover:text-slate-900">
                  desk@senate.exchange
                </a>
              </div>
            </div>
          </FooterGroup>
        </div>

        <div className="mt-12 border-t border-white/60 pt-6 text-sm text-slate-400">
          © {new Date().getFullYear()} Senate Exchange. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
