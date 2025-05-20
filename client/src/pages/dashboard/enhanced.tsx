import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { 
  BarChart, 
  Users, 
  FileText, 
  Settings, 
  MessageSquare,
  CreditCard,
  Layers,
  CheckSquare
} from "lucide-react";
import SmartNotifications from "@/components/dashboard/SmartNotifications";
import AchievementBadges from "@/components/dashboard/AchievementBadges";
import CustomizableWidgets from "@/components/dashboard/CustomizableWidgets";
import ProjectRecommendations from "@/components/dashboard/ProjectRecommendations";
import VisualProgressTracking from "@/components/dashboard/VisualProgressTracking";
import EnhancedLiveChat from "@/components/dashboard/EnhancedLiveChat";

export default function EnhancedDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState("dashboard");

  // For demo purposes, we're allowing access without authentication
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Create a mock user if not authenticated
  const mockUser = {
    firstName: "Demo User",
    email: "demo@example.com"
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side Menu */}
      <aside className="w-64 bg-white shadow-md z-10 border-r border-gray-200 fixed h-full hidden md:block">
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="bg-primary w-8 h-8 rounded-md flex items-center justify-center text-white font-bold shadow-sm">
                AF
              </div>
              <span className="ml-2 text-lg font-bold text-gray-900">AppForge</span>
            </div>
            <div className="mt-1 text-xs text-gray-500">Enhanced Dashboard</div>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6 px-4">
            <div className="mb-6">
              <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Dashboard</div>
              <nav className="space-y-1">
                <button
                  onClick={() => {setLocation("/dashboard")}}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <BarChart className="mr-3 h-5 w-5 text-gray-500" />
                  Overview
                </button>
                <button
                  onClick={() => setSelectedTab("dashboard")}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    selectedTab === "dashboard" ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Layers className="mr-3 h-5 w-5 text-gray-500" />
                  Widgets
                </button>
                <button
                  onClick={() => setSelectedTab("projects")}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    selectedTab === "projects" ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <BarChart className="mr-3 h-5 w-5 text-gray-500" />
                  Project Tracking
                </button>
                <button
                  onClick={() => setSelectedTab("achievements")}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    selectedTab === "achievements" ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <CheckSquare className="mr-3 h-5 w-5 text-gray-500" />
                  Achievements
                </button>
                <button
                  onClick={() => setSelectedTab("recommendations")}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                    selectedTab === "recommendations" ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <BarChart className="mr-3 h-5 w-5 text-gray-500" />
                  AI Recommendations
                </button>
              </nav>
            </div>
            
            <div className="mb-6">
              <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Resources</div>
              <nav className="space-y-1">
                <button
                  onClick={() => setLocation("/dashboard/documents")}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <FileText className="mr-3 h-5 w-5 text-gray-500" />
                  Documents
                </button>
                <button
                  onClick={() => setLocation("/dashboard/chat")}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <MessageSquare className="mr-3 h-5 w-5 text-gray-500" />
                  Support Chat
                </button>
              </nav>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Account</div>
              <nav className="space-y-1">
                <button
                  onClick={() => setLocation("/dashboard/team")}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Users className="mr-3 h-5 w-5 text-gray-500" />
                  Team
                </button>
                <button
                  onClick={() => setLocation("/dashboard/billing")}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <CreditCard className="mr-3 h-5 w-5 text-gray-500" />
                  Billing
                </button>
                <button
                  onClick={() => setLocation("/dashboard/settings")}
                  className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Settings className="mr-3 h-5 w-5 text-gray-500" />
                  Settings
                </button>
              </nav>
            </div>
          </div>
          
          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {(user?.firstName || mockUser.firstName)?.charAt(0) || (user?.email || mockUser.email)?.charAt(0) || "U"}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {user?.firstName || mockUser.firstName || user?.email || mockUser.email || "User"}
                </p>
                <a 
                  href="/api/logout" 
                  className="text-xs font-medium text-primary hover:text-primary/80"
                >
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center md:hidden">
                <div className="flex-shrink-0">
                  <div className="flex items-center">
                    <div className="bg-primary w-8 h-8 rounded-md flex items-center justify-center text-white font-bold shadow-sm">
                      AF
                    </div>
                    <span className="ml-2 text-xl font-bold text-gray-900">AppForge</span>
                  </div>
                </div>
              </div>
              
              <div className="flex md:flex-1 md:justify-end items-center space-x-4">
                <button
                  onClick={() => setLocation("/dashboard")}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center p-2 bg-gray-50 hover:bg-gray-100 rounded-md"
                >
                  <BarChart className="w-4 h-4 mr-2" />
                  <span>Dashboard Overview</span>
                </button>
              
                {/* Smart Notifications Component */}
                <SmartNotifications />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Content based on selected tab */}
          {selectedTab === "dashboard" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard Widgets</h1>
                  <p className="text-gray-600">Customize your dashboard with the information that matters most to you</p>
                </div>
              </div>
              <CustomizableWidgets />
            </div>
          )}
          
          {selectedTab === "projects" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Project Timeline</h1>
                  <p className="text-gray-600">Track your projects with interactive timelines and progress indicators</p>
                </div>
              </div>
              <VisualProgressTracking />
            </div>
          )}
          
          {selectedTab === "achievements" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Achievement Badges</h1>
                  <p className="text-gray-600">Track your progress and unlock badges as you complete projects</p>
                </div>
              </div>
              <AchievementBadges />
            </div>
          )}
          
          {selectedTab === "recommendations" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">AI Project Recommendations</h1>
                  <p className="text-gray-600">Get personalized project suggestions based on your business needs</p>
                </div>
              </div>
              <ProjectRecommendations />
            </div>
          )}
        </main>
      </div>
      
      {/* Enhanced Live Chat */}
      <EnhancedLiveChat />
    </div>
  );
}