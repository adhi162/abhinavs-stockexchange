import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authenticator } from "otplib";
import { ShieldCheck, KeyRound, Lock, Fingerprint, ArrowRight, LogOut, Settings, DollarSign, Coins, Key, MapPin, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getSession, clearSession, saveSession } from "@/lib/session";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dataService } from "@/lib/dataService";
import { authService } from "@/lib/authService";

// MFA Secret - must be base32 encoded (uppercase, no spaces)
// This secret is used for Google Authenticator TOTP generation
// Example base32: JBSWY3DPEHPK3PXP (do not use this in production)
const DEFAULT_MFA_SECRET = "JBSWY3DPEHPK3PXP";
const MFA_SECRET = (import.meta.env.VITE_ADMIN_MFA_SECRET ?? DEFAULT_MFA_SECRET).toUpperCase().replace(/\s/g, "");

// Authorized users are now stored in localStorage via session.ts functions

// Configure authenticator with a wider time window for better compatibility
authenticator.options = {
  window: 2, // Accept codes from 2 steps before and 2 steps after current time (total 5 steps = 2.5 minutes)
  step: 30 // 30 second time steps
};

type Step = "credentials" | "mfa" | "authorized";

// Admin Panel Component
interface AdminPanelProps {
  email: string;
  onLogout: () => void;
  onBackToLogin?: () => void;
}

interface OfficeLocation {
  street: string;
  city: string;
  postalCode: string;
  mapUrl: string;
}

const AdminPanel = ({ email, onLogout, onBackToLogin }: AdminPanelProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currencies, setCurrencies] = useState<Array<{ id: string; code: string; name: string; exchangeRate: string; enabled: boolean }>>([]);
  const [newCurrency, setNewCurrency] = useState({ code: "", name: "", exchangeRate: "133.20" });
  const [officeLocation, setOfficeLocation] = useState<OfficeLocation>({ street: "", city: "", postalCode: "", mapUrl: "" });
  const [authorizedUsers, setAuthorizedUsers] = useState<Array<{ id: string; email: string; createdAt: string; lastLogin?: string }>>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    // Check if user has a valid session before loading data
    const session = getSession();
    if (session && session.token) {
      loadData();
    } else {
      setBackendError("Not authenticated. Please log in first.");
      setLoading(false);
    }
  }, []);

  const loadData = () => {
    setLoading(true);
    setBackendError(null);
    try {
      // Initialize data service if needed
      dataService.initialize();
      
      // Load all data from localStorage
      const currenciesData = dataService.getCurrencies();
      const usersData = dataService.getUsers();
      const officeData = dataService.getOfficeLocation();
      
      setCurrencies(currenciesData);
      setAuthorizedUsers(usersData);
      setOfficeLocation(officeData);
    } catch (error: any) {
      setBackendError(error.message || 'Failed to load data');
      toast({
        title: "Error loading data",
        description: error.message || 'An error occurred while loading admin data',
        variant: "destructive",
      });
      console.error("Failed to load admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive"
      });
      return;
    }
    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    try {
      // Verify current password
      const isValid = await authService.verifyPassword(email, currentPassword);
      if (!isValid) {
        toast({
          title: "Invalid password",
          description: "Current password is incorrect.",
          variant: "destructive"
        });
        return;
      }
      
      // Hash new password and update
      const passwordHash = await authService.hashPassword(newPassword);
      dataService.updateUserPassword(email, passwordHash);
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated."
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Failed to update password",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCurrencyRate = (id: string, code: string, exchangeRate: string) => {
    const rate = parseFloat(exchangeRate);
    if (isNaN(rate) || rate <= 0) {
      toast({
        title: "Invalid exchange rate",
        description: "Exchange rate must be a positive number.",
        variant: "destructive"
      });
      return;
    }
    try {
      dataService.updateCurrency(id, { exchangeRate });
      setCurrencies(currencies.map(c => c.id === id ? { ...c, exchangeRate } : c));
      toast({
        title: "Exchange rate updated",
        description: `${code} exchange rate updated to ${rate} NPR.`
      });
    } catch (error: any) {
      toast({
        title: "Failed to update exchange rate",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCurrency = (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete ${code}? This action cannot be undone.`)) {
      return;
    }
    try {
      dataService.deleteCurrency(id);
      loadData(); // Reload currencies
      toast({
        title: "Currency deleted",
        description: `${code} has been deleted.`
      });
    } catch (error: any) {
      toast({
        title: "Failed to delete currency",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  const handleAddCurrency = () => {
    if (!newCurrency.code || !newCurrency.name) {
      toast({
        title: "Missing information",
        description: "Please enter both currency code and name.",
        variant: "destructive"
      });
      return;
    }
    if (currencies.some(c => c.code === newCurrency.code.toUpperCase())) {
      toast({
        title: "Currency exists",
        description: "This currency is already in the list.",
        variant: "destructive"
      });
      return;
    }
    try {
      dataService.createCurrency(
        newCurrency.code.toUpperCase(),
        newCurrency.name,
        newCurrency.exchangeRate
      );
      loadData(); // Reload to get the new currency with ID
      setNewCurrency({ code: "", name: "", exchangeRate: "133.20" });
      toast({
        title: "Currency added",
        description: `${newCurrency.code.toUpperCase()} has been added to the list.`
      });
    } catch (error: any) {
      toast({
        title: "Failed to add currency",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  const handleToggleCurrency = (id: string, code: string) => {
    const currency = currencies.find(c => c.id === id);
    if (!currency) return;
    try {
      dataService.updateCurrency(id, { enabled: !currency.enabled });
      setCurrencies(currencies.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
      toast({
        title: "Currency updated",
        description: `${code} has been ${currency.enabled ? "disabled" : "enabled"}.`
      });
    } catch (error: any) {
      toast({
        title: "Failed to update currency",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  const handleUpdateOfficeLocation = () => {
    if (!officeLocation.street || !officeLocation.city) {
      toast({
        title: "Missing information",
        description: "Please enter street address and city.",
        variant: "destructive"
      });
      return;
    }
    try {
      dataService.updateOfficeLocation(officeLocation);
      toast({
        title: "Office location updated",
        description: "The main office location has been successfully updated."
      });
    } catch (error: any) {
      toast({
        title: "Failed to update office location",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  const handleAddAdminUser = async () => {
    if (!newAdminEmail || !newAdminPassword) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }
    if (newAdminPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    try {
      const passwordHash = await authService.hashPassword(newAdminPassword);
      dataService.createUser(newAdminEmail, passwordHash);
      loadData(); // Reload users
      setNewAdminEmail("");
      setNewAdminPassword("");
      toast({
        title: "Admin added",
        description: `${newAdminEmail.toLowerCase().trim()} has been added as an admin.`
      });
    } catch (error: any) {
      toast({
        title: "Failed to add admin",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  const handleRemoveAdminUser = (userEmail: string) => {
    if (userEmail.toLowerCase().trim() === email.toLowerCase().trim()) {
      toast({
        title: "Cannot remove yourself",
        description: "You cannot remove your own admin access. Ask another admin to do it.",
        variant: "destructive"
      });
      return;
    }
    try {
      dataService.deleteUser(userEmail);
      loadData(); // Reload users
      toast({
        title: "Admin removed",
        description: `${userEmail} has been removed from admin access.`
      });
    } catch (error: any) {
      toast({
        title: "Failed to remove admin",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
    }
  };

  if (backendError) {
    const isAuthError = backendError.includes('Authentication') || backendError.includes('Not authenticated');
    return (
      <div className="space-y-6">
        <div className={`p-6 border rounded-xl ${isAuthError ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
          <h3 className={`text-lg font-semibold mb-2 ${isAuthError ? 'text-yellow-900' : 'text-red-900'}`}>
            {isAuthError ? 'Authentication Required' : 'Backend Connection Failed'}
          </h3>
          <p className={`text-sm mb-4 ${isAuthError ? 'text-yellow-700' : 'text-red-700'}`}>
            {backendError}
          </p>
          {!isAuthError && (
            <Button onClick={loadData} className="rounded-full">
              Retry Connection
            </Button>
          )}
          {isAuthError && (
            <Button 
              onClick={() => {
                clearSession();
                if (onBackToLogin) {
                  onBackToLogin();
                } else {
                  window.location.reload();
                }
              }} 
              className="rounded-full"
            >
              Go to Login
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-emerald-600">Session live</p>
          <h2 className="text-2xl font-semibold text-slate-900">Admin Control Panel</h2>
          <p className="text-sm text-slate-500 mt-1">{email}</p>
        </div>
        <Button onClick={onLogout} variant="outline" className="rounded-full">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="currencies" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="currencies">
            <Coins className="h-4 w-4 mr-2" />
            Currencies & Rates
          </TabsTrigger>
          <TabsTrigger value="admins">
            <Users className="h-4 w-4 mr-2" />
            Users & Security
          </TabsTrigger>
          <TabsTrigger value="location">
            <MapPin className="h-4 w-4 mr-2" />
            Office
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admins" className="space-y-4 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">User Management</h3>

            {/* Change My Password Section */}
            <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Key className="h-4 w-4 text-emerald-600" />
                Change My Password
              </h4>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-2"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="rounded-full">
                  Update My Password
                </Button>
              </form>
            </div>

            {/* Manage Other Admins Section */}
            <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Add New Admin</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="new-admin-email">Email</Label>
                  <Input
                    id="new-admin-email"
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="mt-2"
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="new-admin-password">Password</Label>
                  <Input
                    id="new-admin-password"
                    type="password"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    className="mt-2"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <Button onClick={handleAddAdminUser} className="mt-4 rounded-full">
                Add Admin
              </Button>
            </div>

            <div className="space-y-3 mt-6">
              <h4 className="text-sm font-semibold text-slate-700">All Admin Users</h4>
              {loading ? (
                <p className="text-sm text-slate-500">Loading users...</p>
              ) : authorizedUsers.length === 0 ? (
                <p className="text-sm text-slate-500">No users found</p>
              ) : (
                authorizedUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-900">{user.email}</span>
                        {user.email.toLowerCase().trim() === email.toLowerCase().trim() && (
                          <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                            Current User
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Created: {new Date(user.createdAt).toLocaleDateString()}
                        {user.lastLogin && ` • Last login: ${new Date(user.lastLogin).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.email.toLowerCase().trim() !== email.toLowerCase().trim() && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveAdminUser(user.email)}
                          className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="currencies" className="space-y-4 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Manage Currencies & Exchange Rates</h3>

            <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Add New Currency</h4>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="new-currency-code">Currency Code</Label>
                  <Input
                    id="new-currency-code"
                    value={newCurrency.code}
                    onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value.toUpperCase() })}
                    className="mt-2"
                    placeholder="USDT"
                    maxLength={3}
                  />
                </div>
                <div>
                  <Label htmlFor="new-currency-name">Currency Name</Label>
                  <Input
                    id="new-currency-name"
                    value={newCurrency.name}
                    onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
                    className="mt-2"
                    placeholder="Tether"
                  />
                </div>
                <div>
                  <Label htmlFor="new-currency-rate">Exchange Rate (NPR)</Label>
                  <Input
                    id="new-currency-rate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newCurrency.exchangeRate}
                    onChange={(e) => setNewCurrency({ ...newCurrency, exchangeRate: e.target.value })}
                    className="mt-2"
                    placeholder="133.20"
                  />
                  <p className="text-xs text-slate-500 mt-1">1 {newCurrency.code || "XXX"} = X NPR</p>
                </div>
              </div>
              <Button onClick={handleAddCurrency} className="mt-4 rounded-full">
                Add Currency
              </Button>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-700">Existing Currencies</h4>
              {currencies.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No currencies added yet.</p>
              ) : (
                currencies.map((currency) => (
                  <div key={currency.id} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold text-slate-900">{currency.code}</span>
                        <span className="text-sm text-slate-600">{currency.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${currency.enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                          {currency.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={currency.exchangeRate}
                          onChange={(e) => handleUpdateCurrencyRate(currency.id, currency.code, e.target.value)}
                          className="w-32"
                        />
                        <span className="text-sm text-slate-500">NPR</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleCurrency(currency.id, currency.code)}
                        className="rounded-full"
                      >
                        {currency.enabled ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCurrency(currency.id, currency.code)}
                        className="rounded-full"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-4 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Main Office Location</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="office-street">Street Address</Label>
                <Input
                  id="office-street"
                  value={officeLocation.street}
                  onChange={(e) => setOfficeLocation({ ...officeLocation, street: e.target.value })}
                  className="mt-2"
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <Label htmlFor="office-city">City</Label>
                <Input
                  id="office-city"
                  value={officeLocation.city}
                  onChange={(e) => setOfficeLocation({ ...officeLocation, city: e.target.value })}
                  className="mt-2"
                  placeholder="Kathmandu, Nepal"
                />
              </div>
              <div>
                <Label htmlFor="office-postal">Postal Code</Label>
                <Input
                  id="office-postal"
                  value={officeLocation.postalCode}
                  onChange={(e) => setOfficeLocation({ ...officeLocation, postalCode: e.target.value })}
                  className="mt-2"
                  placeholder="44600"
                />
              </div>
              <div>
                <Label htmlFor="office-map">Google Maps Embed URL</Label>
                <Input
                  id="office-map"
                  value={officeLocation.mapUrl}
                  onChange={(e) => setOfficeLocation({ ...officeLocation, mapUrl: e.target.value })}
                  className="mt-2"
                  placeholder="https://www.google.com/maps?q=...&output=embed"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Get the embed URL from Google Maps: Share → Embed a map
                </p>
              </div>
              <Button onClick={handleUpdateOfficeLocation} className="w-full rounded-full">
                Update Office Location
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Admin = () => {
  const location = useLocation();
  const [step, setStep] = useState<Step>("credentials");
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [mfaCode, setMfaCode] = useState("");
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const session = getSession();
    if (session && session.email) {
      setCredentials({ email: session.email, password: "" });
      setStep("authorized");
    } else {
      // Check if MFA was successful (coming from AdminMfa page)
      const locationState = location.state as { mfaSuccess?: boolean; email?: string } | null;
      if (locationState?.mfaSuccess && locationState?.email) {
        setCredentials({ email: locationState.email, password: "" });
        setStep("authorized");
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state]);

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

  const handleCredentialsSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast({
        title: "Missing details",
        description: "Enter both email and password to continue.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Verify password using client-side authService
      const isValid = await authService.verifyPassword(credentials.email, credentials.password);
      if (!isValid) {
        toast({
          title: "Login failed",
          description: "Invalid email or password.",
          variant: "destructive"
        });
        return;
      }
      
      // Password is valid, proceed to MFA
      navigate("/admin/mfa", { state: { email: credentials.email } });
      toast({
        title: "Credentials accepted",
        description: "Confirm the login by entering your Google Authenticator code."
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    clearSession();
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

        {step === "authorized" ? (
          <Card className="rounded-3xl border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-200/60 backdrop-blur">
            <AdminPanel 
              email={displayEmail} 
              onLogout={handleLogout}
              onBackToLogin={() => {
                clearSession();
                setStep("credentials");
                setCredentials({ email: "", password: "" });
              }}
            />
          </Card>
        ) : (
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
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
