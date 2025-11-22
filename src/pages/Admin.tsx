import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticator } from "otplib";
import { ShieldCheck, KeyRound, Lock, Fingerprint, ArrowRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

// MFA Secret - must be base32 encoded (uppercase, no spaces)
// This secret is used for Google Authenticator TOTP generation
// Example base32: JBSWY3DPEHPK3PXP (do not use this in production)
const DEFAULT_MFA_SECRET = "JBSWY3DPEHPK3PXP";
const MFA_SECRET = (import.meta.env.VITE_ADMIN_MFA_SECRET ?? DEFAULT_MFA_SECRET).toUpperCase().replace(/\s/g, "");

// Predefined allowed emails with their passwords - only these can access admin panel
// In production, this should be stored securely on the server with hashed passwords
const AUTHORIZED_USERS: Record<string, string> = {
  "adhiadarsh91@gmail.com": "admin123",
  "admin@senate.exchange": "senate2024",
  "operator@senate.exchange": "operator123"
};

// Configure authenticator with a wider time window for better compatibility
authenticator.options = {
  window: 2, // Accept codes from 2 steps before and 2 steps after current time (total 5 steps = 2.5 minutes)
  step: 30 // 30 second time steps
};

type Step = "credentials" | "mfa" | "authorized";

const Admin = () => {
  const [step, setStep] = useState<Step>("credentials");
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [mfaCode, setMfaCode] = useState("");
  const { toast } = useToast();

  const displayEmail = credentials.email || "admin@senate.exchange";

  // Generate provisioning URI for TOTP (Google Authenticator)
  const provisioningUri = useMemo(() => {
    try {
      return authenticator.keyuri(displayEmail, "Senate Exchange", MFA_SECRET);
    } catch (e) {
      console.error("Failed to generate provisioning URI", e);
      return "";
    }
  }, [displayEmail]);

  // Do NOT encodeURIComponent the provisioningUri, Google expects the raw otpauth URI
  const qrUrl = useMemo(() => {
    if (!provisioningUri) return "";
    return `https://chart.googleapis.com/chart?cht=qr&chs=220x220&chl=${provisioningUri}`;
  }, [provisioningUri]);

  const handleCredentialsSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast({
        title: "Missing details",
        description: "Enter both email and password to continue.",
        variant: "destructive"
      });
      return;
    }

    // Check if email is in allowed list
    const normalizedEmail = credentials.email.toLowerCase().trim();
    if (!AUTHORIZED_USERS[normalizedEmail]) {
      toast({
        title: "Access denied",
        description: "This email is not authorized to access the admin panel.",
        variant: "destructive"
      });
      return;
    }

    // Verify password matches the authorized user's password
    const correctPassword = AUTHORIZED_USERS[normalizedEmail];
    if (credentials.password !== correctPassword) {
      toast({
        title: "Invalid credentials",
        description: "The email or password is incorrect.",
        variant: "destructive"
      });
      return;
    }

    navigate("/admin/mfa", { state: { email: credentials.email } });
    toast({
      title: "Credentials accepted",
      description: "Confirm the login by entering your Google Authenticator code."
    });
  };


  const handleLogout = () => {
    setStep("credentials");
    setCredentials({ email: "", password: "" });
    setMfaCode("");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">Restricted Access</p>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900 sm:text-5xl">Admin Control Panel</h1>
          <p className="mt-4 mx-auto max-w-2xl text-base text-slate-600">
            Access to internal spreads, settlements, and compliance tooling requires authorized email and
            Google Authenticator verification.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Card className="space-y-5 rounded-3xl border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-50 p-3">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Zero trust</p>
                  <p className="text-lg font-semibold text-slate-900">Dual-step verification</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                Only predefined authorized emails can access this panel. Every session requires Google Authenticator
                TOTP verification for enhanced security.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Lock, title: "Device binding", text: "Codes rotate every 30 seconds." },
                  { icon: Fingerprint, title: "Email whitelist", text: "Only authorized emails allowed." }
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                    <Icon className="mb-3 h-5 w-5 text-emerald-600" />
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="text-sm text-slate-600">{text}</p>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          <div>
            <Card className="rounded-3xl border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-200/60 backdrop-blur lg:sticky lg:top-28">
              {step === "credentials" && (
                <form className="space-y-6" onSubmit={handleCredentialsSubmit}>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">Step 1</p>
                    <h2 className="text-2xl font-semibold text-slate-900">Sign in with credentials</h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Use your authorized email and password to continue.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="admin-email" className="text-slate-700">Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        autoComplete="username"
                        required
                        value={credentials.email}
                        onChange={(event) => setCredentials((prev) => ({ ...prev, email: event.target.value }))}
                        className="mt-2 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="admin-password" className="text-slate-700">Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={credentials.password}
                        onChange={(event) =>
                          setCredentials((prev) => ({ ...prev, password: event.target.value }))
                        }
                        className="mt-2 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full gap-2 rounded-full text-base">
                    Continue to MFA
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <p className="text-center text-xs text-slate-400">
                    Only predefined emails are authorized to access this panel.
                  </p>
                </form>
              )}



              {step === "authorized" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-emerald-600">Session live</p>
                      <p className="text-lg font-semibold text-slate-900">You are now authenticated</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    Welcome to the admin control panel. You can now access internal tools, manage rates,
                    and handle compliance operations.
                  </p>
                  <div className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm text-slate-600">
                    <div className="flex items-center justify-between min-w-0">
                      <span className="text-slate-500">Operator</span>
                      <span className="font-semibold text-slate-900 max-w-[180px] truncate text-ellipsis overflow-hidden block text-right" title={displayEmail}>{displayEmail}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">MFA secret</span>
                      <span className="font-mono text-emerald-600">{MFA_SECRET.slice(0, 6)}•••</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Issued</span>
                      <span className="text-slate-900">{new Date().toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button asChild variant="secondary" className="flex-1 rounded-full">
                      <a href="/">Back to main site</a>
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="flex-1 rounded-full border-slate-200"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
