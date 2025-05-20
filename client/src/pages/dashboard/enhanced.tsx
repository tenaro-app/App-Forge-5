import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { 
  BarChart, 
  Users, 
  FileText, 
  Settings, 
  MessageSquare, 
  Bell,
  Calendar,
  CreditCard,
  Layers,
  Plus
} from "lucide-react";
import SmartNotifications from "@/components/dashboard/SmartNotifications";
import AchievementBadges from "@/components/dashboard/AchievementBadges";
import CustomizableWidgets from "@/components/dashboard/CustomizableWidgets";
import ProjectRecommendations from "@/components/dashboard/ProjectRecommendations";
import VisualProgressTracking from "@/components/dashboard/VisualProgressTracking";
import EnhancedLiveChat from "@/components/dashboard/EnhancedLiveChat";

export default function EnhancedDashboard() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState("dashboard");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [isAuthLoading, isAuthenticated]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="bg-primary w-8 h-8 rounded-md flex items-center justify-center text-white font-bold shadow-sm">
                    AF
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900">AppForge</span>
                </div>
              </div>
              <nav className="hidden md:ml-8 md:flex space-x-4">
                <button
                  onClick={() => setSelectedTab("dashboard")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    selectedTab === "dashboard"
                      ? "bg-primary/10 text-primary"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setSelectedTab("projects")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    selectedTab === "projects"
                      ? "bg-primary/10 text-primary"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Projects
                </button>
                <button
                  onClick={() => setSelectedTab("documents")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    selectedTab === "documents"
                      ? "bg-primary/10 text-primary"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Documents
                </button>
                <button
                  onClick={() => setSelectedTab("billing")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    selectedTab === "billing"
                      ? "bg-primary/10 text-primary"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Billing
                </button>
                <button
                  onClick={() => setSelectedTab("team")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    selectedTab === "team"
                      ? "bg-primary/10 text-primary"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Team
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Smart Notifications Component */}
              <SmartNotifications />
              
              {/* Profile Dropdown */}
              <div className="relative ml-3">
                <div 
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => window.location.href = "/api/logout"}
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {user?.firstName || user?.email || "User"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName || "Client"}!
            </h1>
            <p className="mt-1 text-gray-600">
              Track your projects, achievements, and manage your account from one place.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setLocation("/new")}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Request New Project
            </button>
          </div>
        </div>

        {/* Content based on selected tab */}
        {selectedTab === "dashboard" && (
          <div className="space-y-8">
            {/* Customizable Widgets */}
            <CustomizableWidgets />
            
            {/* Achievement Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <AchievementBadges />
              </div>
              
              <div>
                {/* AI Recommendations */}
                <ProjectRecommendations />
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === "projects" && (
          <div className="space-y-8">
            {/* Visual Progress Tracking */}
            <VisualProgressTracking />
          </div>
        )}
        
        {selectedTab === "documents" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                Project Documents
              </h2>
              <button className="text-sm text-primary hover:text-primary-dark font-medium">
                Upload New Document
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-gray-500">3 days ago</span>
                  </div>
                  <h3 className="font-medium text-gray-900">Project Requirements</h3>
                  <p className="text-sm text-gray-500 mt-1">PDF Document • 2.3 MB</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {selectedTab === "billing" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-primary" />
                Billing & Invoices
              </h2>
              <button className="text-sm text-primary hover:text-primary-dark font-medium">
                Payment Methods
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          INV-{2023001 + i}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${(1500 + i * 500).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            i === 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {i === 0 ? "Current" : "Paid"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a href="#" className="text-primary hover:text-primary-dark">
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {selectedTab === "team" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                Your Project Team
              </h2>
              <button className="text-sm text-primary hover:text-primary-dark font-medium">
                Contact Team
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Sarah Johnson", role: "Project Manager", project: "E-commerce Platform" },
                { name: "Michael Chen", role: "Lead Developer", project: "E-commerce Platform" },
                { name: "Aisha Patel", role: "UI/UX Designer", project: "E-commerce Platform" },
                { name: "David Wilson", role: "Integration Specialist", project: "CRM Integration" },
                { name: "Emma Lewis", role: "Data Analyst", project: "CRM Integration" }
              ].map((member, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                        {member.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-gray-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {member.role}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {member.project}
                      </p>
                    </div>
                    <div>
                      <button className="text-primary hover:text-primary-dark p-1.5 rounded-full hover:bg-primary/10">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      {/* Enhanced Live Chat Component */}
      <EnhancedLiveChat />
    </div>
  );
}