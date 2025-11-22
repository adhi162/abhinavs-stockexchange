import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { authenticator } from "otplib";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

// MFA Secret - must be base32 encoded (uppercase, no spaces)
const DEFAULT_MFA_SECRET = "JBSWY3DPEHPK3PXP";
const MFA_SECRET = (import.meta.env.VITE_ADMIN_MFA_SECRET ?? DEFAULT_MFA_SECRET).toUpperCase().replace(/\s/g, "");

authenticator.options = {
  window: 2,
  step: 30
};

export default function AdminMfa() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  // Get email from state passed via navigate
  const email = location.state?.email || "admin@senate.exchange";
  const [mfaCode, setMfaCode] = useState("");

  const provisioningUri = useMemo(() => {
    try {
      return authenticator.keyuri(email, "Senate Exchange", MFA_SECRET);
    } catch (e) {
      return "";
    }
  }, [email]);

  const qrUrl = useMemo(() => {
    if (!provisioningUri) return "";
    return `https://chart.googleapis.com/chart?cht=qr&chs=220x220&chl=${provisioningUri}`;
  }, [provisioningUri]);

  const handleMfaSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedCode = mfaCode.trim();
    if (!/^[0-9]{6}$/.test(trimmedCode)) {
      toast({ title: "Invalid code", description: "Enter the 6-digit code from Google Authenticator.", variant: "destructive" });
      return;
    }
    try {
      const isValid = authenticator.check(trimmedCode, MFA_SECRET);
      if (!isValid) {
        toast({ title: "Incorrect token", description: "The Google Authenticator code is not valid.", variant: "destructive" });
        return;
      }
      toast({ title: "MFA successful", description: "Welcome back. Admin panel unlocked." });
      navigate("/admin");
    } catch (error) {
      toast({ title: "Verification error", description: "An error occurred during verification.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      <Card className="max-w-md w-full p-8 rounded-3xl border border-white/70 bg-white/85 shadow-xl shadow-slate-200/60 backdrop-blur">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">Google Authenticator</h2>
        <ol className="mb-6 list-decimal list-inside text-sm text-slate-700 space-y-1">
          <li>Open the Google Authenticator app (or any compatible authenticator app) on your phone.</li>
          <li>Tap <b>+</b> and choose <b>Scan a QR code</b> or <b>Enter a setup key</b>.</li>
          <li>
            {qrUrl ? (
              <>
                Scan the QR code below:<br />
                <img src={qrUrl} alt="Google Authenticator QR" className="h-44 w-44 my-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm mx-auto" />
              </>
            ) : (
              <>If you can't scan the QR, enter the following details manually:</>
            )}
          </li>
          <li>
            <span className="font-semibold">Account name:</span> <span className="font-mono">{email}</span><br />
            <span className="font-semibold">Key:</span> <span className="font-mono">{MFA_SECRET}</span><br />
            <span className="font-semibold">Type:</span> Time-based (TOTP)
          </li>
        </ol>
        <div className="mb-4 text-xs text-rose-600 break-all">
          <div><b>QR URL:</b> {qrUrl || "(empty)"}</div>
          <div><b>Provisioning URI:</b> {provisioningUri || "(empty)"}</div>
        </div>
        <form className="space-y-6" onSubmit={handleMfaSubmit}>
          <div>
            <Label htmlFor="mfa-code" className="text-slate-700">6-digit code</Label>
            <Input
              id="mfa-code"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={mfaCode}
              onChange={e => setMfaCode(e.target.value.replace(/[^0-9]/g, ""))}
              className="mt-2 text-center text-2xl tracking-[0.5em] bg-white border-slate-200 text-slate-900"
              placeholder="••••••"
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full rounded-full text-base">Verify & unlock</Button>
        </form>
      </Card>
    </div>
  );
}
