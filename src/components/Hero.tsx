import { Check } from "lucide-react";
import heroBackground from "@/assets/hero-background-1.jpg";
import { Button } from "@/components/ui/button";

const heroHighlights = [
  "Real-time desk rates • No hidden fees",
  "Licensed in Thailand • MC125660019",
  "Cash, bank, card & crypto settlements"
];

const heroStats = [
  { label: "Avg. savings", value: "0.2%" },
  { label: "Processed", value: "$12B+" },
  { label: "Cities served", value: "18" }
];

export const Hero = () => {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden"
    >
      <div
        className="absolute inset-0 -z-10 opacity-80"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(6, 95, 70, 0.25), rgba(16, 185, 129, 0.1)), url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      <div className="absolute inset-0 -z-10 bg-white/75 backdrop-blur-2xl" />

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-24 lg:flex-row lg:items-center">
        <div className="space-y-8 lg:w-1/2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 shadow-sm shadow-emerald-100">
            Trusted exchange desk since 2012
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
              Senate Exchange
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl lg:text-6xl">
              Premium currency exchange for people who hate friction
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Swap RUB, USD, EUR, KZT, USDT, BTC into Thai Baht (and back) through a private desk that
              moves with you. Same-day settlements, concierge delivery, and FET support in one place.
            </p>
          </div>

          <div className="space-y-3">
            {heroHighlights.map((highlight) => (
              <div key={highlight} className="flex items-center gap-3 text-sm text-slate-600">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check className="h-4 w-4" />
                </span>
                {highlight}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-8 text-base">
              <a href="#exchange">Get a live quote</a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="rounded-full border border-slate-200 bg-white/70 text-base text-slate-700 hover:border-slate-300 hover:bg-white"
            >
              <a href="#contacts">Talk to a dealer</a>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/60 bg-white/80 p-4 text-center shadow-lg shadow-slate-100 backdrop-blur"
              >
                <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="rounded-[32px] border border-white/60 bg-white/90 p-8 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Live desk</p>
                <h2 className="text-2xl font-semibold text-slate-900">Instant quote preview</h2>
              </div>
              <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                24/7
              </div>
            </div>
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center justify-between text-xs uppercase text-slate-400">
                  <span>Send currency</span>
                  <span>Receive currency</span>
                </div>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 shadow-inner">
                    <p className="text-xs text-slate-400">You send</p>
                    <p className="text-2xl font-semibold text-slate-900">1 000 000</p>
                    <p className="text-sm text-slate-500">RUB</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-inner">
                    <p className="text-xs text-slate-400">You receive</p>
                    <p className="text-2xl font-semibold text-slate-900">391 000</p>
                    <p className="text-sm text-slate-500">THB</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {["Cash delivery", "Bank transfer", "FET ready", "MIR & UnionPay"].map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
                  >
                    {pill}
                  </span>
                ))}
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-500">
                Live desk spread refreshed at <span className="font-semibold text-slate-800">05:23 PM</span> •
                License MC125660019
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
