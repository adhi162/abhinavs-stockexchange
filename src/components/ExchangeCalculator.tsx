import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Send } from "lucide-react";

export const ExchangeCalculator = () => {
  const [amount, setAmount] = useState("1000");
  const [fromCurrency, setFromCurrency] = useState("RUB");

  const currencies = ["RUB", "USD", "EUR", "KZT", "USDT", "BTC"];
  const deliveryMethods = [
    { id: "atm", label: "ATM" },
    { id: "cash", label: "Cash Delivery" },
    { id: "office", label: "Office Pickup" },
    { id: "bank", label: "Bank Account" }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto p-8 bg-card border-border">
          <div className="mb-6">
            <Label className="text-foreground mb-3 block text-lg font-semibold">
              Delivery Method
            </Label>
            <Tabs defaultValue="atm" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-muted">
                {deliveryMethods.map((method) => (
                  <TabsTrigger key={method.id} value={method.id} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    {method.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="text-foreground mb-3 block">Exchange From</Label>
              <div className="grid grid-cols-6 gap-2">
                {currencies.map((currency) => (
                  <Button
                    key={currency}
                    variant={fromCurrency === currency ? "default" : "outline"}
                    className={fromCurrency === currency ? "bg-primary text-primary-foreground" : ""}
                    onClick={() => setFromCurrency(currency)}
                  >
                    {currency}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="amount" className="text-foreground mb-2 block">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg bg-input border-border text-foreground"
              />
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <MessageCircle className="w-5 h-5" />
                Exchange via WhatsApp
              </Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Send className="w-5 h-5" />
                Exchange via Telegram
              </Button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">⭐</div>
              <div className="text-sm text-muted-foreground">
                <div className="font-semibold text-foreground">Google Rating</div>
                <div className="text-primary">★★★★★</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-2xl">⭐</div>
              <div className="text-sm text-muted-foreground">
                <div className="font-semibold text-foreground">Yandex Rating</div>
                <div className="text-primary">★★★★★</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
