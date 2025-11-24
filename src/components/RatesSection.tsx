import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import heroBackground from "@/assets/hero-background-1.jpg";
import { dataService } from "@/lib/dataService";

// Default USDT rate if not found in dataService
const DEFAULT_USDT_RATE = 133.20;

export const RatesSection = () => {
  const [usdtRate, setUsdtRate] = useState<string>(String(DEFAULT_USDT_RATE));

  useEffect(() => {
    const enabled = dataService.getEnabledCurrencies();
    const usdt = enabled.find(c => c.code === "USDT");
    if (usdt) {
      setUsdtRate(usdt.exchangeRate);
    }
  }, []);

  return (
    <section
      id="rates"
      data-animate="fade-up"
      data-animate-section="rates"
      className="py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
              Live exchange rate
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
              USDT to Nepalese Rupee
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Current exchange rate for USDT to NPR. Your final quote can be locked in WhatsApp and typically improves for larger amounts.
            </p>

            <Card
              data-animate="fade-up"
              className="mt-8 overflow-hidden border border-white/70 bg-white/85 shadow-2xl shadow-slate-200/60 backdrop-blur"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      <th className="px-6 py-4">Pair</th>
                      <th className="px-6 py-4 text-right">Rate (NPR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100/70 text-sm text-slate-600 last:border-b-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-lg font-semibold text-slate-900">USDT</span>
                          <span className="text-slate-400">→</span>
                          <span className="font-mono text-lg font-semibold text-slate-900">NPR</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-lg font-semibold text-emerald-600">
                        {parseFloat(usdtRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 text-center text-sm text-slate-500">
                💡 Rate is updated by administrators. Large amounts may qualify for custom rates.
              </div>
            </Card>
          </div>

          <div className="relative">
            <div
              data-animate="fade-up"
              data-animate-delay="120"
              className="sticky top-32 space-y-6 rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur"
            >
              <img
                src={heroBackground}
                alt="Currency desk"
                className="h-64 w-full rounded-[24px] object-cover"
              />
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Last refresh</span>
                  <span className="font-semibold text-slate-900">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="grid gap-3 rounded-2xl bg-slate-50/70 p-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Settlement time</span>
                    <span className="font-semibold text-slate-900">30-90 mins</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Coverage</span>
                    <span className="font-semibold text-slate-900">Nepal nationwide</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
