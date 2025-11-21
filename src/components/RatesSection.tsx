import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import heroBackground from "@/assets/hero-background-1.jpg";

const rates = [
  { from: "RUB", to: "THB", rate: "0.368", change: "+0.5%", trend: "up" },
  { from: "USD", to: "THB", rate: "35.42", change: "-0.2%", trend: "down" },
  { from: "EUR", to: "THB", rate: "37.89", change: "+0.3%", trend: "up" },
  { from: "KZT", to: "THB", rate: "0.071", change: "+0.1%", trend: "up" },
  { from: "USDT", to: "THB", rate: "35.38", change: "0.0%", trend: "neutral" },
  { from: "BTC", to: "THB", rate: "3,254,000", change: "+2.1%", trend: "up" }
];

export const RatesSection = () => {
  return (
    <section id="rates" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
              Live desk view
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Desk rates updated hourly
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              These are indicative desk rates. Your final quote can be locked in WhatsApp and typically improves for larger tickets.
            </p>

            <Card className="mt-8 overflow-hidden border border-white/70 bg-white/85 shadow-2xl shadow-slate-200/60 backdrop-blur">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      <th className="px-6 py-4">Pair</th>
                      <th className="px-6 py-4 text-right">Rate</th>
                      <th className="px-6 py-4 text-right">24h</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rates.map((rate) => (
                      <tr key={`${rate.from}-${rate.to}`} className="border-b border-slate-100/70 text-sm text-slate-600 last:border-b-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-lg font-semibold text-slate-900">{rate.from}</span>
                            <span className="text-slate-400">→</span>
                            <span className="font-mono text-lg font-semibold text-slate-900">{rate.to}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-lg font-semibold text-emerald-600">
                          {rate.rate}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {rate.trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                            {rate.trend === "down" && <TrendingDown className="h-4 w-4 text-rose-500" />}
                            <span
                              className={
                                rate.trend === "up"
                                  ? "font-semibold text-emerald-600"
                                  : rate.trend === "down"
                                  ? "font-semibold text-rose-500"
                                  : "font-semibold text-slate-400"
                              }
                            >
                              {rate.change}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 text-center text-sm text-slate-500">
                💡 Rates update on the hour. Large tickets (&gt; 2M THB) qualify for custom spreads.
              </div>
            </Card>
          </div>

          <div className="relative">
            <div className="sticky top-32 space-y-6 rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur">
              <img
                src={heroBackground}
                alt="Currency desk"
                className="h-64 w-full rounded-[24px] object-cover"
              />
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Last refresh</span>
                  <span className="font-semibold text-slate-900">05:23 PM</span>
                </div>
                <div className="grid gap-3 rounded-2xl bg-slate-50/70 p-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Desk fee</span>
                    <span className="font-semibold text-slate-900">0.20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Settlement time</span>
                    <span className="font-semibold text-slate-900">30-90 mins</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Coverage</span>
                    <span className="font-semibold text-slate-900">TH nationwide</span>
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
