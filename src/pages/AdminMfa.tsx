import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { authenticator } from "otplib";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { saveSession, getSession } from "@/lib/session";
import { authService } from "@/lib/authService";

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
  const [mfaCode, setMfaCode] = useState("");

  // Get email from state passed via navigate
  const locationState = location.state as { email?: string } | null;
  const email = locationState?.email || "";

  // Check for existing session - if authenticated, redirect to admin panel
  useEffect(() => {
    const session = getSession();
    if (session) {
      navigate("/admin", { replace: true });
      return;
    }
  }, [navigate]);

  // Protect route: redirect to /admin if accessed without proper authentication
  useEffect(() => {
    if (!email) {
      toast({
        title: "Authentication required",
        description: "Please authenticate with email and password first.",
        variant: "destructive"
      });
      navigate("/admin", { replace: true });
      return;
    }
  }, [email, navigate, toast]);

  const provisioningUri = useMemo(() => {
    if (!email) return "";
    try {
      if (!MFA_SECRET) {
        console.error("MFA_SECRET is empty or invalid");
        return "";
      }
      const uri = authenticator.keyuri(email, "Senate Exchange", MFA_SECRET);
      console.log("Generated provisioning URI for:", email);
      return uri;
    } catch (e) {
      console.error("Failed to generate provisioning URI:", e);
      return "";
    }
  }, [email]);

  const qrUrl = useMemo(() => {
    if (!provisioningUri) return "";
    const encodedUri = encodeURIComponent(provisioningUri);
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodedUri}`;
  }, [provisioningUri]);

  const handleMfaSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedCode = mfaCode.trim();
    if (!/^[0-9]{6}$/.test(trimmedCode)) {
      toast({ title: "Invalid code", description: "Enter the 6-digit code from Google Authenticator.", variant: "destructive" });
      return;
    }

    if (!email) {
      toast({
        title: "Email required",
        description: "Please go back and enter your email first.",
        variant: "destructive"
      });
      navigate("/admin", { replace: true });
      return;
    }

    try {
      // Verify MFA code using client-side authService
      const isValid = authService.verifyMfa(trimmedCode);
      if (!isValid) {
        toast({
          title: "MFA verification failed",
          description: "Invalid MFA code. Please try again.",
          variant: "destructive"
        });
        setMfaCode("");
        return;
      }

      // Generate token and save session
      const token = authService.generateToken(email);
      saveSession(email, token);
      toast({
        title: "Authentication successful",
        description: "You have been logged in successfully."
      });
      navigate("/admin", { state: { mfaSuccess: true, email } });
    } catch (error) {
      toast({
        title: "MFA verification failed",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
      setMfaCode("");
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
