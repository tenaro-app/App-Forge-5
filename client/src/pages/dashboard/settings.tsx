import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { 
  ArrowLeft, 
  User,
  Lock,
  Bell,
  Shield,
  Globe,
  Save
} from "lucide-react";

export default function Settings() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  
  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
    }
  }, [user]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [isAuthLoading, isAuthenticated]);
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement the actual save functionality
    alert("Profile updated");
  };
  
  if (isAuthLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <button 
                onClick={() => setLocation("/dashboard")}
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Settings sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Settings</h3>
              </div>
              <div className="p-0">
                <nav className="flex flex-col">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex items-center px-6 py-3 text-sm font-medium ${
                      activeTab === "profile"
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <User className="w-5 h-5 mr-3" />
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`flex items-center px-6 py-3 text-sm font-medium ${
                      activeTab === "security"
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Lock className="w-5 h-5 mr-3" />
                    Security
                  </button>
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className={`flex items-center px-6 py-3 text-sm font-medium ${
                      activeTab === "notifications"
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Bell className="w-5 h-5 mr-3" />
                    Notifications
                  </button>
                  <button
                    onClick={() => setActiveTab("privacy")}
                    className={`flex items-center px-6 py-3 text-sm font-medium ${
                      activeTab === "privacy"
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Shield className="w-5 h-5 mr-3" />
                    Privacy
                  </button>
                  <button
                    onClick={() => setActiveTab("preferences")}
                    className={`flex items-center px-6 py-3 text-sm font-medium ${
                      activeTab === "preferences"
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Globe className="w-5 h-5 mr-3" />
                    Preferences
                  </button>
                </nav>
              </div>
            </div>
          </div>
          
          {/* Settings content */}
          <div className="md:w-3/4">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                </div>
                <div className="p-6">
                  <form onSubmit={handleSaveProfile}>
                    <div className="space-y-6">
                      {/* Avatar section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Profile Picture
                        </label>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary text-2xl font-semibold">
                              {firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
                            </span>
                          </div>
                          <div className="ml-5 space-y-2">
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                              Change
                            </button>
                            <p className="text-xs text-gray-500">
                              JPG, GIF or PNG. 1MB max.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Personal information */}
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="first-name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="last-name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            id="company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone-number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                            Timezone
                          </label>
                          <select
                            id="timezone"
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/Denver">Mountain Time (MT)</option>
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="Europe/London">London</option>
                            <option value="Europe/Paris">Paris</option>
                            <option value="Asia/Tokyo">Tokyo</option>
                            <option value="Australia/Sydney">Sydney</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Save button */}
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Change password */}
                    <div>
                      <h4 className="text-base font-medium text-gray-900 mb-4">Change Password</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="current-password"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="new-password"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirm-password"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                          />
                        </div>
                        <div>
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                          >
                            Update Password
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Two-factor authentication */}
                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="text-base font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">
                            Add an extra layer of security to your account by requiring both your password and an
                            authentication code from your mobile device.
                          </p>
                        </div>
                        <div>
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            Enable
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Login sessions */}
                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="text-base font-medium text-gray-900 mb-4">Login Sessions</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Current Session</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Started: Today, 2:45 PM • IP: 192.168.1.1 • Browser: Chrome on Windows
                            </p>
                          </div>
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <button
                          type="button"
                          className="text-sm font-medium text-primary hover:text-primary/80"
                        >
                          Log out of all sessions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notifications Settings */}
            {activeTab === "notifications" && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 mb-4">Email Notifications</h4>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="project-updates"
                              type="checkbox"
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="project-updates" className="font-medium text-gray-700">
                              Project Updates
                            </label>
                            <p className="text-gray-500">Receive emails when there are updates to your projects</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="milestone-completion"
                              type="checkbox"
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="milestone-completion" className="font-medium text-gray-700">
                              Milestone Completion
                            </label>
                            <p className="text-gray-500">Receive notifications when project milestones are completed</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="chat-messages"
                              type="checkbox"
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="chat-messages" className="font-medium text-gray-700">
                              Chat Messages
                            </label>
                            <p className="text-gray-500">Receive notifications for new chat messages</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="billing-updates"
                              type="checkbox"
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="billing-updates" className="font-medium text-gray-700">
                              Billing Updates
                            </label>
                            <p className="text-gray-500">Receive notifications about billing and invoices</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="text-base font-medium text-gray-900 mb-4">Notification Frequency</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            How often would you like to receive emails?
                          </label>
                          <fieldset className="mt-2">
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <input
                                  id="frequency-realtime"
                                  name="notification-frequency"
                                  type="radio"
                                  defaultChecked
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <label htmlFor="frequency-realtime" className="ml-3 text-sm text-gray-700">
                                  Immediately
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="frequency-daily"
                                  name="notification-frequency"
                                  type="radio"
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <label htmlFor="frequency-daily" className="ml-3 text-sm text-gray-700">
                                  Daily digest
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="frequency-weekly"
                                  name="notification-frequency"
                                  type="radio"
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <label htmlFor="frequency-weekly" className="ml-3 text-sm text-gray-700">
                                  Weekly digest
                                </label>
                              </div>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                    </div>
                    
                    {/* Save button */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Privacy Settings */}
            {activeTab === "privacy" && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 mb-4">Data Sharing</h4>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="analytics-consent"
                              type="checkbox"
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="analytics-consent" className="font-medium text-gray-700">
                              Analytics & Performance Data
                            </label>
                            <p className="text-gray-500">
                              Allow us to collect anonymous usage data to improve our services
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="text-base font-medium text-gray-900 mb-4">Account Data</h4>
                      <p className="text-sm text-gray-500 mb-4">
                        You can request a copy of your data or delete your account and all associated data.
                      </p>
                      <div className="space-x-4">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                          Request Data Export
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                    
                    {/* Save button */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Preferences Settings */}
            {activeTab === "preferences" && (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Display Preferences</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 mb-4">Dashboard View</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Default dashboard view
                          </label>
                          <fieldset className="mt-2">
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <input
                                  id="view-projects"
                                  name="default-view"
                                  type="radio"
                                  defaultChecked
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <label htmlFor="view-projects" className="ml-3 text-sm text-gray-700">
                                  Projects Overview
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="view-analytics"
                                  name="default-view"
                                  type="radio"
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <label htmlFor="view-analytics" className="ml-3 text-sm text-gray-700">
                                  Analytics Dashboard
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="view-activity"
                                  name="default-view"
                                  type="radio"
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <label htmlFor="view-activity" className="ml-3 text-sm text-gray-700">
                                  Activity Feed
                                </label>
                              </div>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="text-base font-medium text-gray-900 mb-4">Language & Locale</h4>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                            Language
                          </label>
                          <select
                            id="language"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            defaultValue="en"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="ja">Japanese</option>
                            <option value="zh">Chinese</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="date-format" className="block text-sm font-medium text-gray-700 mb-1">
                            Date Format
                          </label>
                          <select
                            id="date-format"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            defaultValue="mm/dd/yyyy"
                          >
                            <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                            <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                            <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Save button */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}