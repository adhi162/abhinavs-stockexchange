import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Send } from "lucide-react";
import { dataService } from "@/lib/dataService";

const deliveryMethods = [
  { id: "atm", label: "ATM pickup" },
  { id: "cash", label: "Cash delivery" },
  { id: "office", label: "Private office" },
  { id: "bank", label: "Bank transfer" }
];

export const ExchangeCalculator = () => {
  const [amount, setAmount] = useState("1000");
  const [deliveryMethod, setDeliveryMethod] = useState("atm");
  const [currencies, setCurrencies] = useState<Array<{ code: string; name: string; exchangeRate: string }>>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USDT");

  // Load enabled currencies from dataService
  useEffect(() => {
    const enabled = dataService.getEnabledCurrencies();
    setCurrencies(enabled.map(c => ({ code: c.code, name: c.name, exchangeRate: c.exchangeRate })));
    if (enabled.length > 0) {
      const usdt = enabled.find(c => c.code === "USDT");
      setSelectedCurrency(usdt ? "USDT" : enabled[0].code);
    }
  }, []);

  // Calculate NPR amount
  const calculatedAmount = useMemo(() => {
    const numAmount = parseFloat(amount.replace(/\s/g, "")) || 0;
    const currency = currencies.find(c => c.code === selectedCurrency);
    if (!currency) return "0";
    
    const rate = parseFloat(currency.exchangeRate) || 0;
    const result = numAmount * rate;
    return Math.round(result).toLocaleString("en-US");
  }, [amount, selectedCurrency, currencies]);

  const formatAmount = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmount(e.target.value);
    setAmount(formatted);
  };

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);

  return (
    <section
      id="exchange"
      data-animate="fade-up"
      data-animate-section="exchange"
      className="py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Instant quote</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
            Choose how you'd like to exchange
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Tap a route, enter the amount, and we'll confirm the final rate via WhatsApp or Telegram within minutes.
          </p>
        </div>

        <Card className="mt-12 border border-white/70 bg-white/85 p-10 shadow-2xl shadow-slate-200/70 backdrop-blur">
          {currencies.length === 0 ? (
            <div className="text-center py-12 text-slate-600">
              <p>No currencies available. Please contact administrator.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <Label className="mb-3 block text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Delivery method
                </Label>
                <Tabs value={deliveryMethod} onValueChange={setDeliveryMethod}>
                  <TabsList className="grid w-full grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3 sm:grid-cols-4">
                    {deliveryMethods.map((method) => (
                      <TabsTrigger
                        key={method.id}
                        value={method.id}
                        className="rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-slate-500 data-[state=active]:border-emerald-200 data-[state=active]:bg-white data-[state=active]:text-emerald-600"
                      >
                        {method.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="amount" className="mb-3 block text-sm font-medium text-slate-600">
                    Amount to exchange
                  </Label>
                  <Input
                    id="amount"
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    className="h-14 rounded-2xl border-slate-200 bg-white text-lg text-slate-900"
                    placeholder="1000"
                  />
                  <div className="mt-3">
                    <Label className="mb-2 block text-xs text-slate-500">Choose currency</Label>
                    <div className="flex flex-wrap gap-2">
                      {currencies.map((currency) => (
                        <button
                          key={currency.code}
                          onClick={() => setSelectedCurrency(currency.code)}
                          className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                            selectedCurrency === currency.code
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          {currency.code}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="mb-3 block text-sm font-medium text-slate-600">
                    You will receive
                  </Label>
                  <div className="h-14 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-emerald-600">{calculatedAmount}</p>
                      <p className="text-sm text-slate-500">NPR</p>
                    </div>
                  </div>
                  {selectedCurrencyData && (
                    <p className="mt-2 text-xs text-slate-500 text-center">
                      Rate: 1 {selectedCurrency} = {selectedCurrencyData.exchangeRate} NPR
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  asChild
                  className="h-14 rounded-2xl text-base font-semibold"
                >
                  <a
                    href={`https://wa.me/9779841234567?text=Hi%20Senate%2C%20I%20want%20to%20exchange%20${amount.replace(/\s/g, "")}%20${selectedCurrency}%20via%20${deliveryMethod}.`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Lock rate in WhatsApp
                  </a>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="h-14 rounded-2xl text-base font-semibold"
                >
                  <a href="https://t.me/senateexchange" target="_blank" rel="noreferrer">
                    <Send className="h-5 w-5" />
                    Continue in Telegram
                  </a>
                </Button>
              </div>

              <div className="grid gap-6 rounded-3xl border border-slate-100 bg-slate-50/70 p-6 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">⭐</div>
                  <div className="text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">Google rating</p>
                    <p className="text-emerald-600">5.0 / 5 • 210 reviews</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">⭐</div>
                  <div className="text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">Yandex rating</p>
                    <p className="text-emerald-600">5.0 / 5 • 150 reviews</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};
