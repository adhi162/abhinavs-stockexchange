import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, LogOut, ShieldCheck } from "lucide-react";

const SETTINGS_KEY = "senate-admin-settings";
const TOKEN_KEY = "senate-admin-token";

const defaultCurrencies = ["RUB", "USD", "EUR", "KZT", "USDT", "BTC"];

type AdminSettings = {
  username: string;
  password: string;
  commission: string;
  perCurrency: Record<string, string>;
};

const defaultSettings: AdminSettings = {
  username: "admin",
  password: "admin",
  commission: "0.20",
  perCurrency: defaultCurrencies.reduce<Record<string, string>>((acc, currency) => {
    acc[currency] = "0.20";
    return acc;
  }, {})
};

const issueToken = (username: string) =>
  btoa(
    JSON.stringify({
      sub: username,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    }),
  );

const decodeToken = (token: string | null) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp * 1000 > Date.now()) {
      return payload;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const persistSettings = (settings: AdminSettings) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
};

const readSettings = (): AdminSettings => {
  if (typeof window === "undefined") return defaultSettings;
  const stored = window.localStorage.getItem(SETTINGS_KEY);
  if (!stored) return defaultSettings;
  try {
    const parsed = JSON.parse(stored) as Partial<AdminSettings>;
    return {
      ...defaultSettings,
      ...parsed,
      perCurrency: { ...defaultSettings.perCurrency, ...(parsed.perCurrency ?? {}) }
    };
  } catch (error) {
    return defaultSettings;
  }
};

export const AdminDialog = () => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [token, setToken] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [commission, setCommission] = useState(defaultSettings.commission);
  const [currencyRates, setCurrencyRates] = useState<Record<string, string>>(defaultSettings.perCurrency);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const loaded = readSettings();
    setSettings(loaded);
    setCommission(loaded.commission);
    setCurrencyRates(loaded.perCurrency);

    const storedToken = typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;
    if (decodeToken(storedToken)) {
      setToken(storedToken);
    } else if (storedToken && typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleLogin = () => {
    if (loginForm.username !== settings.username || loginForm.password !== settings.password) {
      showFeedback("error", "Invalid credentials.");
      return;
    }
    const nextToken = issueToken(loginForm.username);
    setToken(nextToken);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TOKEN_KEY, nextToken);
    }
    showFeedback("success", "Authenticated successfully.");
  };

  const handleLogout = () => {
    setToken(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  };

  const updatePassword = () => {
    if (!newPassword || newPassword.length < 4) {
      showFeedback("error", "Password must be at least 4 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showFeedback("error", "Passwords do not match.");
      return;
    }
    const updated = { ...settings, password: newPassword };
    setSettings(updated);
    persistSettings(updated);
    setNewPassword("");
    setConfirmPassword("");
    showFeedback("success", "Password updated.");
  };

  const updateCommission = () => {
    const numericValue = Number(commission);
    if (Number.isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
      showFeedback("error", "Commission must be between 0 and 100.");
      return;
    }
    const updated = { ...settings, commission: numericValue.toFixed(2) };
    setSettings(updated);
    persistSettings(updated);
    showFeedback("success", "Global commission updated.");
  };

  const updateCurrencyRates = () => {
    const sanitized: Record<string, string> = {};
    for (const currency of defaultCurrencies) {
      const value = Number(currencyRates[currency]);
      if (Number.isNaN(value) || value < 0 || value > 100) {
        showFeedback("error", `Rate for ${currency} must be between 0 and 100.`);
        return;
      }
      sanitized[currency] = value.toFixed(2);
    }
    const updated = { ...settings, perCurrency: sanitized };
    setSettings(updated);
    setCurrencyRates(sanitized);
    persistSettings(updated);
    showFeedback("success", "Per-currency rates saved.");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="rounded-full px-4 text-sm font-semibold text-slate-600 hover:text-slate-900">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-3xl border border-white/80 bg-white/95 p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-slate-900">Admin access</DialogTitle>
        </DialogHeader>

        {!token ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              <Lock className="h-4 w-4 text-emerald-500" />
              Sign in
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="admin-username">Username</Label>
                <Input
                  id="admin-username"
                  value={loginForm.username}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, username: event.target.value }))}
                  autoComplete="username"
                />
              </div>
              <div>
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                  autoComplete="current-password"
                />
              </div>
              <Button className="w-full rounded-full" onClick={handleLogin}>
                Authenticate
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Active session</p>
                  <p className="text-sm font-semibold text-slate-900">{settings.username}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="gap-2 rounded-full" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>

            <Tabs defaultValue="security" className="space-y-4">
              <TabsList className="grid grid-cols-3 rounded-2xl bg-slate-100 p-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="commission">Commission</TabsTrigger>
                <TabsTrigger value="currency">Per currency</TabsTrigger>
              </TabsList>

              <TabsContent value="security" className="space-y-4">
                <div>
                  <Label htmlFor="new-password">New password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="••••"
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="••••"
                  />
                </div>
                <Button className="w-full rounded-full" variant="secondary" onClick={updatePassword}>
                  Update password
                </Button>
              </TabsContent>

              <TabsContent value="commission" className="space-y-4">
                <Label htmlFor="commission-input">Global commission (%)</Label>
                <Input
                  id="commission-input"
                  type="number"
                  step="0.01"
                  value={commission}
                  onChange={(event) => setCommission(event.target.value)}
                />
                <Button className="w-full rounded-full" onClick={updateCommission}>
                  Save commission
                </Button>
              </TabsContent>

              <TabsContent value="currency" className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {defaultCurrencies.map((currency) => (
                    <div key={currency} className="rounded-2xl border border-slate-100 p-4">
                      <Label htmlFor={`rate-${currency}`} className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        {currency}
                      </Label>
                      <Input
                        id={`rate-${currency}`}
                        type="number"
                        step="0.01"
                        value={currencyRates[currency]}
                        onChange={(event) =>
                          setCurrencyRates((prev) => ({ ...prev, [currency]: event.target.value }))
                        }
                      />
                    </div>
                  ))}
                </div>
                <Button className="w-full rounded-full" onClick={updateCurrencyRates}>
                  Save per-currency rates
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {feedback && (
          <div
            className={`rounded-full px-4 py-3 text-center text-sm ${
              feedback.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            }`}
          >
            {feedback.message}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

