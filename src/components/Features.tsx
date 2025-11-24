import { Shield, Wallet, Globe, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const featureList = [
  {
    title: "Institutional spreads",
    description: "Direct access to interbank liquidity pools with transparent desk fees.",
    icon: Wallet
  },
  {
    title: "Regulated in Nepal",
    description: "Fully licensed exchange with compliance support for real-estate and business transactions.",
    icon: Shield
  },
  {
    title: "Any settlement route",
    description: "Cash delivery, ATM pickup, bank-to-bank, or stablecoin off-ramps.",
    icon: Globe
  },
  {
    title: "Concierge logistics",
    description: "White-glove couriers, private offices, and bilingual support every step.",
    icon: Building2
  }
];

export const Features = () => {
  return (
    <section
      id="features"
      data-animate="fade-up"
      data-animate-section="features"
      className="py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Why Senate</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
            Modern FX, minus the bank drama
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            We combine regulated infrastructure with concierge service so you can move money across borders without stress.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {featureList.map((feature, index) => (
            <Card
              key={feature.title}
              data-animate="fade-up"
              data-animate-delay={String(120 * index)}
              className="group relative overflow-hidden border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-200/60 backdrop-blur"
            >
              <div className="absolute inset-x-8 top-8 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent blur-3xl transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-center gap-4">
                <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-600">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
              </div>
              <p className="relative mt-4 text-base text-slate-600">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
