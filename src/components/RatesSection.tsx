import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export const RatesSection = () => {
  const rates = [
    { from: "RUB", to: "THB", rate: "0.368", change: "+0.5%", trend: "up" },
    { from: "USD", to: "THB", rate: "35.42", change: "-0.2%", trend: "down" },
    { from: "EUR", to: "THB", rate: "37.89", change: "+0.3%", trend: "up" },
    { from: "KZT", to: "THB", rate: "0.071", change: "+0.1%", trend: "up" },
    { from: "USDT", to: "THB", rate: "35.38", change: "0.0%", trend: "neutral" },
    { from: "BTC", to: "THB", rate: "3,254,000", change: "+2.1%", trend: "up" }
  ];

  return (
    <section id="rates" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Current Exchange Rates</h2>
          <p className="text-muted-foreground text-lg">
            Updated in real-time • Best rates guaranteed
          </p>
        </div>

        <Card className="max-w-4xl mx-auto bg-card border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-foreground font-semibold">Currency Pair</th>
                  <th className="text-right p-4 text-foreground font-semibold">Exchange Rate</th>
                  <th className="text-right p-4 text-foreground font-semibold">24h Change</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg font-semibold text-foreground">{rate.from}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-mono text-lg font-semibold text-foreground">{rate.to}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-xl font-bold text-primary">{rate.rate}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {rate.trend === "up" && <TrendingUp className="w-4 h-4 text-green-500" />}
                        {rate.trend === "down" && <TrendingDown className="w-4 h-4 text-red-500" />}
                        <span className={`font-semibold ${
                          rate.trend === "up" ? "text-green-500" : 
                          rate.trend === "down" ? "text-red-500" : 
                          "text-muted-foreground"
                        }`}>
                          {rate.change}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-primary/5 border-t border-border">
            <p className="text-center text-muted-foreground">
              💡 <strong className="text-foreground">Best Rate Guarantee:</strong> If you find a better rate elsewhere, we'll beat it!
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};
