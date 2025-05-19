import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Settings,
  Bell,
  Mail,
  Lock,
  User,
  Shield,
  Save,
  Loader2,
  Check,
  X,
  Globe,
  CreditCard,
  FileText,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Dummy settings data (will be replaced with API data in production)
const dummySettings = {
  general: {
    companyName: "AppForge Agency",
    supportEmail: "support@appforge.io",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY"
  },
  notifications: {
    emailNotifications: true,
    newClientAlert: true,
    supportTicketAlert: true,
    projectMilestoneAlert: true,
    dailyDigest: false,
    weeklyReport: true
  },
  security: {
    twoFactorAuth: false,
    passwordExpiry: 90, // days
    sessionTimeout: 60, // minutes
    ipRestriction: false,
    allowedIPs: ""
  },
  branding: {
    primaryColor: "#ff0033",
    accentColor: "#1a1a1a",
    logo: "appforge-logo.png",
    favicon: "appforge-favicon.ico"
  },
  billing: {
    defaultBillingType: "monthly",
    defaultCurrency: "USD",
    paymentGateway: "stripe",
    invoicePrefix: "INV-",
    invoiceTerms: "Payment due within 30 days."
  }
};

export default function AdminSettings() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [settingsForm, setSettingsForm] = useState(dummySettings);
  
  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        window.location.href = "/api/login";
      } else if (!isAdmin) {
        setLocation("/dashboard");
      }
    }
  }, [isAuthLoading, isAuthenticated, isAdmin, setLocation]);
  
  // Fetch settings
  const { 
    data: settings, 
    isLoading: isSettingsLoading 
  } = useQuery({
    queryKey: ["/api/admin/settings"],
    enabled: isAuthenticated && isAdmin,
    // For development we're using dummy data
    initialData: dummySettings
  });
  
  // Set settings form when data changes
  useEffect(() => {
    if (settings) {
      setSettingsForm(settings);
    }
  }, [settings]);
  
  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      setIsSaving(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would be a real API call
      const response = await apiRequest("PUT", "/api/admin/settings", newSettings);
      if (!response.ok) {
        throw new Error(`Failed to update settings: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
        action: (
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-5 w-5 text-green-600" />
          </div>
        ),
      });
      setIsSaving(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update settings",
        description: error.message,
        variant: "destructive",
        action: (
          <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
            <X className="h-5 w-5 text-red-600" />
          </div>
        ),
      });
      setIsSaving(false);
    },
  });
  
  const handleInputChange = (section: string, field: string, value: any) => {
    setSettingsForm({
      ...settingsForm,
      [section]: {
        ...settingsForm[section as keyof typeof settingsForm],
        [field]: value
      }
    });
  };
  
  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(settingsForm);
  };
  
  if (isAuthLoading || isSettingsLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-lg">AF</span>
                  </div>
                  <span className="ml-2 text-xl font-bold">AppForge Admin</span>
                </div>
              </div>
              <nav className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <button 
                    onClick={() => setLocation("/admin")}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => setLocation("/admin/clients")}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Clients
                  </button>
                  <button 
                    onClick={() => setLocation("/admin/projects")}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Projects
                  </button>
                  <button 
                    onClick={() => setLocation("/admin/team")}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Team
                  </button>
                  <button 
                    onClick={() => setLocation("/admin/support")}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Support
                  </button>
                  <button 
                    onClick={() => setLocation("/admin/settings")}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-gray-800 text-white"
                  >
                    Settings
                  </button>
                </div>
              </nav>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => setLocation("/dashboard")}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Client View
              </button>
              <div className="ml-4 relative flex-shrink-0">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-white">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "A"}
                  </div>
                  <span className="ml-2 text-sm font-medium text-white">
                    {user?.firstName || "Admin"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center">
          <Settings className="h-8 w-8 text-gray-500 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            <p className="mt-1 text-gray-600">
              Configure your application settings and preferences
            </p>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 py-5 border-b border-gray-200">
              <TabsList className="grid grid-cols-5 gap-4">
                <TabsTrigger value="general" className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="branding" className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Branding
                </TabsTrigger>
                <TabsTrigger value="billing" className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              {/* General Settings */}
              <TabsContent value="general" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={settingsForm.general.companyName}
                        onChange={(e) => handleInputChange('general', 'companyName', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="supportEmail">Support Email</Label>
                      <Input
                        id="supportEmail"
                        type="email"
                        value={settingsForm.general.supportEmail}
                        onChange={(e) => handleInputChange('general', 'supportEmail', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Time Zone</Label>
                      <select
                        id="timezone"
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        value={settingsForm.general.timezone}
                        onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                      >
                        <option value="America/New_York">Eastern Time (US & Canada)</option>
                        <option value="America/Chicago">Central Time (US & Canada)</option>
                        <option value="America/Denver">Mountain Time (US & Canada)</option>
                        <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                        <option value="Australia/Sydney">Sydney</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <select
                        id="dateFormat"
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        value={settingsForm.general.dateFormat}
                        onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)}
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Notification Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <Label htmlFor="emailNotifications" className="text-base">Email Notifications</Label>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={settingsForm.notifications.emailNotifications}
                        onCheckedChange={(checked) => handleInputChange('notifications', 'emailNotifications', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="pl-7 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="newClientAlert" className="flex-1">New client registration</Label>
                        <Switch
                          id="newClientAlert"
                          checked={settingsForm.notifications.newClientAlert}
                          onCheckedChange={(checked) => handleInputChange('notifications', 'newClientAlert', checked)}
                          disabled={!settingsForm.notifications.emailNotifications}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="supportTicketAlert" className="flex-1">New support ticket</Label>
                        <Switch
                          id="supportTicketAlert"
                          checked={settingsForm.notifications.supportTicketAlert}
                          onCheckedChange={(checked) => handleInputChange('notifications', 'supportTicketAlert', checked)}
                          disabled={!settingsForm.notifications.emailNotifications}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="projectMilestoneAlert" className="flex-1">Project milestone updates</Label>
                        <Switch
                          id="projectMilestoneAlert"
                          checked={settingsForm.notifications.projectMilestoneAlert}
                          onCheckedChange={(checked) => handleInputChange('notifications', 'projectMilestoneAlert', checked)}
                          disabled={!settingsForm.notifications.emailNotifications}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="dailyDigest" className="flex-1">Daily activity digest</Label>
                        <Switch
                          id="dailyDigest"
                          checked={settingsForm.notifications.dailyDigest}
                          onCheckedChange={(checked) => handleInputChange('notifications', 'dailyDigest', checked)}
                          disabled={!settingsForm.notifications.emailNotifications}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="weeklyReport" className="flex-1">Weekly summary report</Label>
                        <Switch
                          id="weeklyReport"
                          checked={settingsForm.notifications.weeklyReport}
                          onCheckedChange={(checked) => handleInputChange('notifications', 'weeklyReport', checked)}
                          disabled={!settingsForm.notifications.emailNotifications}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="twoFactorAuth" className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500 mt-1">
                          Require two-factor authentication for all admin users
                        </p>
                      </div>
                      <Switch
                        id="twoFactorAuth"
                        checked={settingsForm.security.twoFactorAuth}
                        onCheckedChange={(checked) => handleInputChange('security', 'twoFactorAuth', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                        <Input
                          id="passwordExpiry"
                          type="number"
                          min="0"
                          value={settingsForm.security.passwordExpiry}
                          onChange={(e) => handleInputChange('security', 'passwordExpiry', parseInt(e.target.value) || 0)}
                        />
                        <p className="text-xs text-gray-500">
                          Set to 0 for no expiration
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          min="5"
                          value={settingsForm.security.sessionTimeout}
                          onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value) || 60)}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="ipRestriction" className="text-base">IP Address Restriction</Label>
                          <p className="text-sm text-gray-500 mt-1">
                            Restrict admin access to specific IP addresses
                          </p>
                        </div>
                        <Switch
                          id="ipRestriction"
                          checked={settingsForm.security.ipRestriction}
                          onCheckedChange={(checked) => handleInputChange('security', 'ipRestriction', checked)}
                        />
                      </div>
                      
                      {settingsForm.security.ipRestriction && (
                        <div className="pl-7 space-y-2">
                          <Label htmlFor="allowedIPs">Allowed IP Addresses</Label>
                          <Input
                            id="allowedIPs"
                            placeholder="192.168.1.1, 10.0.0.1"
                            value={settingsForm.security.allowedIPs}
                            onChange={(e) => handleInputChange('security', 'allowedIPs', e.target.value)}
                          />
                          <p className="text-xs text-gray-500">
                            Enter comma-separated IP addresses
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Branding Settings */}
              <TabsContent value="branding" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Branding Settings</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-3">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="h-8 w-8 rounded-md border border-gray-300" 
                          style={{ backgroundColor: settingsForm.branding.primaryColor }}
                        />
                        <Input
                          id="primaryColor"
                          value={settingsForm.branding.primaryColor}
                          onChange={(e) => handleInputChange('branding', 'primaryColor', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="h-8 w-8 rounded-md border border-gray-300" 
                          style={{ backgroundColor: settingsForm.branding.accentColor }}
                        />
                        <Input
                          id="accentColor"
                          value={settingsForm.branding.accentColor}
                          onChange={(e) => handleInputChange('branding', 'accentColor', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="logo">Logo</Label>
                      <div className="flex items-center space-x-2">
                        <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center border border-gray-300">
                          <Globe className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <Input
                            id="logo"
                            type="file"
                            accept="image/*"
                            className="mb-2"
                          />
                          <p className="text-xs text-gray-500">
                            Current: {settingsForm.branding.logo}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label htmlFor="favicon">Favicon</Label>
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-gray-100 rounded-md flex items-center justify-center border border-gray-300">
                          <Globe className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <Input
                            id="favicon"
                            type="file"
                            accept="image/x-icon,image/png"
                            className="mb-2"
                          />
                          <p className="text-xs text-gray-500">
                            Current: {settingsForm.branding.favicon}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Billing Settings */}
              <TabsContent value="billing" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Settings</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="defaultBillingType">Default Billing Type</Label>
                      <select
                        id="defaultBillingType"
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        value={settingsForm.billing.defaultBillingType}
                        onChange={(e) => handleInputChange('billing', 'defaultBillingType', e.target.value)}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="annual">Annual</option>
                        <option value="project">Per Project</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="defaultCurrency">Default Currency</Label>
                      <select
                        id="defaultCurrency"
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        value={settingsForm.billing.defaultCurrency}
                        onChange={(e) => handleInputChange('billing', 'defaultCurrency', e.target.value)}
                      >
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="GBP">British Pound (GBP)</option>
                        <option value="CAD">Canadian Dollar (CAD)</option>
                        <option value="AUD">Australian Dollar (AUD)</option>
                        <option value="JPY">Japanese Yen (JPY)</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="paymentGateway">Payment Gateway</Label>
                      <select
                        id="paymentGateway"
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        value={settingsForm.billing.paymentGateway}
                        onChange={(e) => handleInputChange('billing', 'paymentGateway', e.target.value)}
                      >
                        <option value="stripe">Stripe</option>
                        <option value="paypal">PayPal</option>
                        <option value="manual">Manual Payment</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="invoicePrefix">Invoice Number Prefix</Label>
                      <Input
                        id="invoicePrefix"
                        value={settingsForm.billing.invoicePrefix}
                        onChange={(e) => handleInputChange('billing', 'invoicePrefix', e.target.value)}
                        placeholder="INV-"
                      />
                    </div>
                    
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="invoiceTerms">Invoice Terms</Label>
                      <textarea
                        id="invoiceTerms"
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        rows={3}
                        value={settingsForm.billing.invoiceTerms}
                        onChange={(e) => handleInputChange('billing', 'invoiceTerms', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              onClick={handleSaveSettings}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}