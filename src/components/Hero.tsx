import { useState, useMemo, useEffect } from "react";
import { Check } from "lucide-react";
import heroBackground from "@/assets/hero-background-1.jpg";
import { Button } from "@/components/ui/button";
import { dataService } from "@/lib/dataService";

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
  const [enabledCurrencies, setEnabledCurrencies] = useState<Array<{ code: string; name: string; exchangeRate: string }>>([]);

  useEffect(() => {
    const enabled = dataService.getEnabledCurrencies();
    setEnabledCurrencies(enabled.map(c => ({ code: c.code, name: c.name, exchangeRate: c.exchangeRate })));
    if (enabled.length > 0) {
      const usdt = enabled.find(c => c.code === "USDT");
      setFromCurrency(usdt ? "USDT" : enabled[0].code);
    }
  }, []);

  const calculatedAmount = useMemo(() => {
    const numAmount = parseFloat(amount.replace(/\s/g, "")) || 0;
    const currency = enabledCurrencies.find(c => c.code === fromCurrency);
    if (!currency) {
      // Fallback to hardcoded rates if currency not in enabled list
      const rate = exchangeRates[fromCurrency] || 0;
      const result = numAmount * rate;
      return Math.round(result).toLocaleString("en-US");
    }
    
    const rate = parseFloat(currency.exchangeRate) || 0;
    const result = numAmount * rate;
    return Math.round(result).toLocaleString("en-US");
  }, [amount, fromCurrency, enabledCurrencies]);

  const formatAmount = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmount(e.target.value);
    setAmount(formatted);
  };

  // Use enabled currencies or fallback to hardcoded list
  const displayCurrencies = enabledCurrencies.length > 0 
    ? enabledCurrencies.map(c => c.code)
    : currencies;

  return (
    <section
      id="hero"
      data-animate="fade-in"
      data-animate-section="hero"
      className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 py-32 sm:py-40"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-emerald-50/80" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600">Senate Exchange</p>
          <h1 className="mt-6 text-5xl font-semibold text-slate-900 sm:text-6xl">
            Exchange to Nepalese Rupee
          </h1>
          <p className="mt-6 text-xl text-slate-600">
            Fast, secure currency exchange with competitive rates. Licensed and trusted in Nepal.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {heroHighlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm text-slate-700 shadow-sm">
                <Check className="h-4 w-4 text-emerald-600" />
                {highlight}
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-white/70 bg-white/85 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur">
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
                  {displayCurrencies.map((currency) => (
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

          <div className="mt-12 grid grid-cols-3 gap-6">
            {heroStats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-semibold text-emerald-600">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
