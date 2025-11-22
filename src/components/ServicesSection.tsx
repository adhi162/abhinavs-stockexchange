import { Card } from "@/components/ui/card";
import { Building2, Wallet, Shield, CreditCard, Banknote, Globe } from "lucide-react";

const services = [
  {
    icon: Wallet,
    title: "High-limit FX",
    description: "Large ticket RUB, USD, EUR, KZT conversions into NPR with institutional spreads."
  },
  {
    icon: Building2,
    title: "Real estate payments",
    description: "Complete compliance packages for property purchases with developer liaison."
  },
  {
    icon: Shield,
    title: "Compliant custody",
    description: "Fully documented flows with AML screening and bank-friendly paperwork."
  },
  {
    icon: CreditCard,
    title: "Card processing",
    description: "Accept MIR, UnionPay, and Visa cards with direct settlement into Nepali Rupee."
  },
  {
    icon: Banknote,
    title: "Cash & courier",
    description: "Private couriers and office pickups with biometric verification."
  },
  {
    icon: Globe,
    title: "Crypto ramps",
    description: "On/off ramp USDT or BTC into NPR with instant confirmations."
  }
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">What we do</p>
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Built for people moving money into Nepal
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            From a quick vacation swap to multi-million property deals, our desk adapts to the way you like to settle.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.title}
              className="group relative overflow-hidden border border-white/70 bg-white/85 p-6 shadow-lg shadow-slate-200/60 backdrop-blur"
            >
              <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute inset-5 rounded-3xl bg-gradient-to-br from-emerald-100 via-white to-white" />
              </div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="relative mt-6 text-xl font-semibold text-slate-900">{service.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-slate-600">{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
