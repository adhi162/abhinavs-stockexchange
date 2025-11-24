import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Send } from "lucide-react";

const deliveryMethods = [
  { id: "atm", label: "ATM pickup" },
  { id: "cash", label: "Cash delivery" },
  { id: "office", label: "Private office" },
  { id: "bank", label: "Bank transfer" }
];

const currencies = ["RUB", "USD", "EUR", "KZT", "USDT", "BTC"];

export const ExchangeCalculator = () => {
  const [amount, setAmount] = useState("100000");
  const [fromCurrency, setFromCurrency] = useState("RUB");
  const [deliveryMethod, setDeliveryMethod] = useState("atm");

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
            Choose how you’d like to exchange
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Tap a route, enter the amount, and we’ll confirm the final rate via WhatsApp or Telegram within minutes.
          </p>
        </div>

        <Card className="mt-12 border border-white/70 bg-white/85 p-10 shadow-2xl shadow-slate-200/70 backdrop-blur">
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
                  type="number"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="h-14 rounded-2xl border-slate-200 bg-white text-lg text-slate-900"
                />
              </div>
              <div>
                <Label className="mb-3 block text-sm font-medium text-slate-600">
                  Choose currency
                </Label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {currencies.map((currency) => (
                    <button
                      key={currency}
                      onClick={() => setFromCurrency(currency)}
                      className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                        fromCurrency === currency
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {currency}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Button
                asChild
                className="h-14 rounded-2xl text-base font-semibold"
              >
                <a
                  href={`https://wa.me/9779841234567?text=Hi%20Senate%2C%20I%20want%20to%20exchange%20${amount}%20${fromCurrency}%20via%20${deliveryMethod}.`}
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
        </Card>
      </div>
    </section>
  );
};
