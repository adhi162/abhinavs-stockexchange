import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { AdminDialog } from "@/components/AdminDialog";

const navLinks = [
  { label: "Exchange", href: "#exchange" },
  { label: "How it works", href: "#process" },
  { label: "Rates", href: "#rates" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contacts" }
];

export const Header = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <a href="#hero" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-300 to-green-600 text-xl font-bold text-white shadow-lg shadow-green-500/30">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">Senate</span>
            <span className="text-2xl font-semibold text-slate-900">Global Exchange</span>
          </div>
        </a>

        <nav className="hidden items-center gap-6 text-base font-semibold text-slate-500 lg:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-slate-900">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <AdminDialog />
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-xl text-slate-700 lg:hidden"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMobileOpen && (
        <div className="lg:hidden">
          <div className="mx-auto mt-2 flex max-w-6xl flex-col gap-4 rounded-3xl border border-white/70 bg-white/90 px-6 py-4 shadow-lg">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-lg font-semibold text-slate-700"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <AdminDialog />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
