import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { format } from "date-fns";
import { 
  PlusCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  PauseCircle,
  Calendar,
  BarChart,
  MessageSquare,
  Package,
  FileCheck,
  BookOpen,
  Users,
  CreditCard,
  Settings,
  LineChart,
  FileText,
  Plus,
  ChevronRight
} from "lucide-react";

// Import enhanced dashboard components
import SmartNotifications from "@/components/dashboard/SmartNotifications";
import AchievementBadges from "@/components/dashboard/AchievementBadges";
import CustomizableWidgets from "@/components/dashboard/CustomizableWidgets";
import ProjectRecommendations from "@/components/dashboard/ProjectRecommendations";
import VisualProgressTracking from "@/components/dashboard/VisualProgressTracking";
import EnhancedLiveChat from "@/components/dashboard/EnhancedLiveChat";

// Helper component for project status badges
function StatusBadge({ status }: { status: string }) {
  let color = "";
  let Icon = Clock;
  let label = "Unknown";

  switch (status) {
    case "in_progress":
      color = "bg-blue-100 text-blue-800";
      Icon = Clock;
      label = "In Progress";
      break;
    case "completed":
      color = "bg-green-100 text-green-800";
      Icon = CheckCircle;
      label = "Completed";
      break;
    case "on_hold":
      color = "bg-yellow-100 text-yellow-800";
      Icon = PauseCircle;
      label = "On Hold";
      break;
    case "cancelled":
      color = "bg-red-100 text-red-800";
      Icon = AlertCircle;
      label = "Cancelled";
      break;
    case "requested":
      color = "bg-purple-100 text-purple-800";
      Icon = PlusCircle;
      label = "Requested";
      break;
    default:
      color = "bg-gray-100 text-gray-800";
      Icon = Clock;
      label = status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </span>
  );
}

export default function HybridDashboard() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeView, setActiveView] = useState<string>("main"); // main, badges, widgets, recommendations, tracking

  // Fetch projects data
  const { data: projects, isLoading: isProjectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
  });

  // Create a mock user if not authenticated
  const mockUser = {
    firstName: "Demo User",
    email: "demo@example.com"
  };

  // Calculate analytics data
  const analyticsData = [
    {
      name: "Total Projects",
      value: projects ? projects.length : 0,
      change: "+2",
      trend: "up",
      icon: <Package className="w-5 h-5 text-primary" />
    },
    {
      name: "In Progress",
      value: projects ? projects.filter(p => p.status === "in_progress").length : 0,
      change: "+1",
      trend: "up",
      icon: <Clock className="w-5 h-5 text-blue-500" />
    },
    {
      name: "Completed",
      value: projects ? projects.filter(p => p.status === "completed").length : 0,
      change: "0",
      trend: "flat",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    {
      name: "Response Time",
      value: "4h",
      change: "-20%",
      trend: "down",
      icon: <MessageSquare className="w-5 h-5 text-purple-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
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
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Smart Notifications Component */}
              <SmartNotifications />
              
              {/* Profile Dropdown */}
              <div className="relative ml-3">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {(user?.firstName || mockUser.firstName)?.charAt(0) || (user?.email || mockUser.email)?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {user?.firstName || mockUser.firstName || user?.email || mockUser.email || "User"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Layout with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
          <nav className="flex flex-col h-full py-4">
            <div className="px-4 pb-4 border-b border-gray-200">
              <h2 className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Main</h2>
              <div className="mt-2 space-y-1">
                <div 
                  onClick={() => setActiveView("main")}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                    activeView === "main" ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <BarChart className="w-4 h-4 mr-3" />
                  Dashboard
                </div>
                <div 
                  onClick={() => setActiveView("tracking")}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                    activeView === "tracking" ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <LineChart className="w-4 h-4 mr-3" />
                  Project Tracking
                </div>
                <div 
                  onClick={() => setActiveView("badges")}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                    activeView === "badges" ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FileCheck className="w-4 h-4 mr-3" />
                  Achievements
                </div>
                <div 
                  onClick={() => setActiveView("widgets")}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                    activeView === "widgets" ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Package className="w-4 h-4 mr-3" />
                  Customize Widgets
                </div>
                <div 
                  onClick={() => setActiveView("recommendations")}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                    activeView === "recommendations" ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <BookOpen className="w-4 h-4 mr-3" />
                  AI Recommendations
                </div>
              </div>
            </div>

            <div className="px-4 pt-4 pb-4 border-b border-gray-200">
              <h2 className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Resources</h2>
              <div className="mt-2 space-y-1">
                <div 
                  onClick={() => setLocation("/dashboard/documents")}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Documents
                </div>
                <div 
                  onClick={() => setLocation("/dashboard/chat")}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 mr-3" />
                  Support Chat
                </div>
              </div>
            </div>

            <div className="px-4 pt-4 pb-4 border-b border-gray-200">
              <h2 className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Account</h2>
              <div className="mt-2 space-y-1">
                <div 
                  onClick={() => setLocation("/dashboard/team")}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <Users className="w-4 h-4 mr-3" />
                  Team
                </div>
                <div 
                  onClick={() => setLocation("/dashboard/billing")}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 mr-3" />
                  Billing
                </div>
                <div 
                  onClick={() => setLocation("/dashboard/settings")}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-10">
          {activeView === "main" && (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Dashboard welcome section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Welcome back, {user?.firstName || mockUser.firstName || "Client"}!
                    </h2>
                    <p className="mt-1 text-gray-600">
                      Here's what's happening with your projects.
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Link href="/new">
                      <a className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors">
                        <Plus className="w-4 h-4 mr-1.5" />
                        Request New Project
                      </a>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Analytics Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Project Analytics</h2>
                  <Link href="/dashboard/analytics">
                    <a className="text-sm font-medium text-primary hover:underline">
                      View Detailed Analytics
                    </a>
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {analyticsData.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-gray-50">{item.icon}</div>
                        <span className={`inline-flex items-center text-xs font-medium ${
                          item.trend === 'up' ? 'text-green-600' : 
                          item.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {item.change}
                        </span>
                      </div>
                      <p className="mt-2 text-2xl font-bold text-gray-900">{item.value}</p>
                      <p className="mt-1 text-sm text-gray-500">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Your Projects</h2>
                  <Link href="/dashboard/projects">
                    <a className="text-sm font-medium text-primary hover:underline">
                      View All Projects
                    </a>
                  </Link>
                </div>

                {isProjectsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="flex justify-between mt-6">
                          <div className="h-8 bg-gray-200 rounded w-1/6"></div>
                          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : projects && projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.map(project => (
                      <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                            <p className="mt-1 text-gray-600">{project.description}</p>
                            <div className="mt-2 flex items-center">
                              <StatusBadge status={project.status} />
                              <span className="ml-4 text-sm text-gray-500 flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {format(new Date(project.startDate), 'MMM d, yyyy')}
                              </span>
                            </div>
                            {/* Progress bar for project completion */}
                            <div className="mt-3">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium text-gray-500">Progress</span>
                                <span className="text-xs font-medium text-gray-700">65%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 flex space-x-3">
                            <button 
                              onClick={() => setLocation(`/dashboard/projects/${project.id}`)}
                              className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md bg-white hover:bg-primary/5 transition-colors"
                            >
                              <BarChart className="w-4 h-4 mr-1" />
                              View Details
                            </button>
                            {project.replitUrl && (
                              <a 
                                href={project.replitUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors"
                              >
                                View App
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
                    <p className="mt-1 text-gray-500">
                      Your projects will appear here once they're created by our team.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setLocation("/dashboard/chat")}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact Support
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Quick access buttons to other views */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileCheck className="w-6 h-6 text-primary" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Achievement Badges</h3>
                  <p className="mt-2 text-sm text-gray-500">Track your progress and unlock rewards as you complete projects</p>
                  <button 
                    onClick={() => setActiveView("badges")}
                    className="mt-4 text-sm font-medium text-primary hover:underline"
                  >
                    View Achievements
                  </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-amber-600" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">AI Recommendations</h3>
                  <p className="mt-2 text-sm text-gray-500">Get personalized project ideas based on your business needs</p>
                  <button 
                    onClick={() => setActiveView("recommendations")}
                    className="mt-4 text-sm font-medium text-primary hover:underline"
                  >
                    View Recommendations
                  </button>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <LineChart className="w-6 h-6 text-blue-600" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Visual Project Tracking</h3>
                  <p className="mt-2 text-sm text-gray-500">See detailed timelines and progress for all your projects</p>
                  <button 
                    onClick={() => setActiveView("tracking")}
                    className="mt-4 text-sm font-medium text-primary hover:underline"
                  >
                    View Project Timeline
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeView === "badges" && (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Achievement Badges</h2>
                  <p className="mt-1 text-gray-600">Track your progress and unlock rewards as you complete projects</p>
                </div>
                <button
                  onClick={() => setActiveView("main")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Back to Dashboard
                </button>
              </div>
              
              <AchievementBadges />
            </div>
          )}
          
          {activeView === "widgets" && (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Customize Dashboard</h2>
                  <p className="mt-1 text-gray-600">Arrange and customize your dashboard widgets</p>
                </div>
                <button
                  onClick={() => setActiveView("main")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Back to Dashboard
                </button>
              </div>
              
              <CustomizableWidgets />
            </div>
          )}
          
          {activeView === "recommendations" && (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">AI Project Recommendations</h2>
                  <p className="mt-1 text-gray-600">Personalized project ideas based on your business needs</p>
                </div>
                <button
                  onClick={() => setActiveView("main")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Back to Dashboard
                </button>
              </div>
              
              <ProjectRecommendations />
            </div>
          )}
          
          {activeView === "tracking" && (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Project Timeline</h2>
                  <p className="mt-1 text-gray-600">Track your project progress with interactive timeline</p>
                </div>
                <button
                  onClick={() => setActiveView("main")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Back to Dashboard
                </button>
              </div>
              
              <VisualProgressTracking />
            </div>
          )}
        </main>
      </div>
      
      {/* Enhanced Live Chat Component */}
      <EnhancedLiveChat />
    </div>
  );
}