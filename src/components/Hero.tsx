import { useState, useMemo } from "react";
import { Check } from "lucide-react";
import heroBackground from "@/assets/hero-background-1.jpg";
import { Button } from "@/components/ui/button";

const heroHighlights = [
  "Real-time desk rates • No hidden fees",
  "Licensed in Nepal • NRB Licensed",
  "Cash, bank, card & crypto settlements"
];

const heroStats = [
  { label: "Avg. savings", value: "0.2%" },
  { label: "Processed", value: "$12B+" },
  { label: "Cities served", value: "18" }
];

// Exchange rates (matching RatesSection)
const exchangeRates: Record<string, number> = {
  RUB: 1.48,
  USD: 133.25,
  EUR: 145.50,
  KZT: 0.28,
  USDT: 133.20,
  BTC: 12500000
};

const currencies = ["RUB", "USD", "EUR", "KZT", "USDT", "BTC"];

export const Hero = () => {
  const [amount, setAmount] = useState("1000000");
  const [fromCurrency, setFromCurrency] = useState("RUB");

  const calculatedAmount = useMemo(() => {
    const numAmount = parseFloat(amount.replace(/\s/g, "")) || 0;
    const rate = exchangeRates[fromCurrency] || 0;
    const result = numAmount * rate;
    return Math.round(result).toLocaleString("en-US");
  }, [amount, fromCurrency]);

  const formatAmount = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmount(e.target.value);
    setAmount(formatted);
  };
  return (
    <section
      id="hero"
      data-animate="fade-in"
      data-animate-section="hero"
      className="relative isolate overflow-hidden bg-slate-950 text-white"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(3, 7, 18, 0.35), rgba(15, 118, 110, 0.45)), url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      <div className="absolute inset-0 -z-10 bg-slate-950/70" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-950/60 via-slate-950/40 to-black/70" />

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-28 lg:flex-row lg:items-center">
        <div className="space-y-8 lg:w-1/2">
          <div
            data-animate="fade-up"
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200 shadow-sm shadow-emerald-900/40"
          >
            Trusted exchange desk since 2012
          </div>
          <div data-animate="fade-up" data-animate-delay="80">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/70">
              Senate Exchange
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl lg:text-6xl">
              Premium currency exchange for people who hate friction
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/80">
              Swap RUB, USD, EUR, KZT, USDT, BTC into Nepali Rupee (and back) through a private desk that
              moves with you. Same-day settlements, concierge delivery, and regulatory compliance support in one place.
            </p>
          </div>

          <div className="space-y-3" data-animate="fade-up" data-animate-delay="120">
            {heroHighlights.map((highlight) => (
              <div key={highlight} className="flex items-center gap-3 text-sm text-white/80">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
                  <Check className="h-4 w-4" />
                </span>
                {highlight}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row" data-animate="fade-up" data-animate-delay="160">
            <Button asChild size="lg" className="rounded-full px-8 text-base shadow-lg shadow-emerald-900/30">
              <a href="#exchange">Get a live quote</a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="rounded-full border border-white/40 bg-white/10 text-base text-white hover:border-white/60 hover:bg-white/20"
            >
              <a href="#contacts">Talk to a dealer</a>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-3" data-animate="fade-up" data-animate-delay="200">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center shadow-lg shadow-black/30 backdrop-blur"
              >
                <div className="text-2xl font-semibold text-white">{stat.value}</div>
                <p className="text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2" data-animate="zoom" data-animate-delay="240">
          <div className="rounded-[32px] border border-white/20 bg-white/90 p-8 text-slate-900 shadow-[0_25px_80px_rgba(2,6,23,0.35)] backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Live desk</p>
                <h2 className="text-2xl font-semibold text-slate-900">Instant quote preview</h2>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                24/7
              </div>
            </div>
            <div className="space-y-5">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="flex items-center justify-between text-xs uppercase text-slate-400 mb-3">
                  <span>Send currency</span>
                  <span>Receive currency</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 shadow-inner">
                    <p className="text-xs text-slate-400 mb-2">You send</p>
                    <input
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      className="w-full text-2xl font-semibold text-slate-900 bg-transparent border-none outline-none focus:ring-0 p-0"
                      placeholder="0"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {currencies.map((currency) => (
                        <button
                          key={currency}
                          onClick={() => setFromCurrency(currency)}
                          className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors ${
                            fromCurrency === currency
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {currency}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-inner">
                    <p className="text-xs text-slate-400 mb-2">You receive</p>
                    <p className="text-2xl font-semibold text-slate-900">{calculatedAmount}</p>
                    <p className="text-sm text-slate-500 mt-2">NPR</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {["Cash delivery", "Bank transfer", "Compliance ready", "MIR & UnionPay"].map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600"
                  >
                    {pill}
                  </span>
                ))}
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-500">
                Live desk spread refreshed at{" "}
                <span className="font-semibold text-slate-800">
                  {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </span>{" "}
                • NRB Licensed
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
