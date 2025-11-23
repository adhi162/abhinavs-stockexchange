import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { authenticator } from "otplib";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { saveSession, getSession, isAuthorizedUser } from "@/lib/session";

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

    // Verify email is in authorized users list
    const normalizedEmail = email.toLowerCase().trim();
    if (!isAuthorizedUser(normalizedEmail)) {
      toast({
        title: "Access denied",
        description: "This email is not authorized to access the admin panel.",
        variant: "destructive"
      });
      navigate("/admin", { replace: true });
      return;
    }
  }, [email, navigate, toast]);

  const provisioningUri = useMemo(() => {
    if (!email) return "";
    try {
      // MFA_SECRET is already processed at module level, use it directly
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
    // URL encode the provisioning URI for Google Charts API
    // Using a more reliable QR code service as primary, with Google Charts as fallback
    const encodedUri = encodeURIComponent(provisioningUri);
    // Using api.qrserver.com as it's more reliable than Google Charts
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodedUri}`;
  }, [provisioningUri]);

  const handleMfaSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedCode = mfaCode.trim();
    if (!/^[0-9]{6}$/.test(trimmedCode)) {
      toast({ title: "Invalid code", description: "Enter the 6-digit code from Google Authenticator.", variant: "destructive" });
      return;
    }

    // MFA_SECRET is already processed at module level (uppercase, no spaces)
    // Use it directly to ensure consistency with QR code generation
    if (!MFA_SECRET) {
      toast({
        title: "Configuration error",
        description: "MFA secret is not configured. Please contact administrator.",
        variant: "destructive"
      });
      console.error("MFA_SECRET is empty");
      return;
    }

    // Ensure authenticator options are set
    authenticator.options = {
      window: 2,
      step: 30
    };

    // Log for debugging
    console.log("Verifying MFA code:", {
      code: trimmedCode,
      secretLength: MFA_SECRET.length,
      secretPreview: MFA_SECRET.substring(0, 8) + "...",
      fullSecret: MFA_SECRET, // Log full secret for debugging (remove in production)
      options: authenticator.options,
      currentTime: new Date().toISOString()
    });

    // Generate current token for comparison (for debugging)
    try {
      const currentToken = authenticator.generate(MFA_SECRET);
      console.log("Current generated token:", currentToken);
      console.log("User entered code:", trimmedCode);
      console.log("Tokens match:", currentToken === trimmedCode);
    } catch (genError) {
      console.error("Failed to generate token for comparison:", genError);
    }

    // Try to verify the code
    let isValid: boolean = false;
    try {
      // Use check() which returns boolean
      isValid = authenticator.check(trimmedCode, MFA_SECRET);
      console.log("MFA check() result:", isValid, "for code:", trimmedCode);

      // If check() returns false, try verifyDelta for more info
      if (!isValid) {
        try {
          // verifyDelta returns the time step difference if valid, null if invalid
          const delta = authenticator.verifyDelta(trimmedCode, MFA_SECRET);
          console.log("verifyDelta result:", delta);
          if (delta !== null && typeof delta === 'number') {
            // Delta is a number, meaning code is valid but from a different time step
            isValid = true;
            console.log("Code valid with delta:", delta, "time steps");
          } else {
            console.log("verifyDelta returned null - code is invalid");
          }
        } catch (deltaError) {
          console.log("verifyDelta error:", deltaError);
        }
      }
    } catch (checkError) {
      // If check() throws, log it and treat as invalid
      console.error("authenticator.check() threw an error:", checkError);
      console.error("Check error details:", {
        message: checkError instanceof Error ? checkError.message : String(checkError),
        stack: checkError instanceof Error ? checkError.stack : undefined,
        code: trimmedCode,
        secretLength: MFA_SECRET.length
      });
      isValid = false;
    }

    if (!isValid) {
      toast({
        title: "Incorrect token",
        description: "The Google Authenticator code is not valid. Make sure your device time is synchronized and try again.",
        variant: "destructive"
      });
      return;
    }

    // Success! Code is valid
    try {
      console.log("MFA verification successful");
      // Save session to localStorage
      saveSession(email);
      toast({ title: "MFA successful", description: "Welcome back. Admin panel unlocked." });
      // Navigate to admin panel
      navigate("/admin", { replace: true });
    } catch (navError) {
      console.error("Navigation error after successful MFA:", navError);
      toast({
        title: "MFA successful",
        description: "Verification successful, but navigation failed. Please refresh the page.",
      });
    }
  };

  // Don't render if email is not valid (will redirect)
  if (!email) {
    return null;
  }

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
