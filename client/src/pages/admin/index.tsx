import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  Package, 
  Settings, 
  MessageSquare,
  FileText,
  Home,
  Plus,
  UserPlus,
  ClipboardList,
  BarChart,
  CheckCircle,
  Clock,
  ChevronDown,
  Search
} from "lucide-react";
import { format } from "date-fns";

// Admin Dashboard Component
export default function AdminDashboard() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  
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
  
  // Fetch all clients
  const { 
    data: clients, 
    isLoading: isClientsLoading 
  } = useQuery({
    queryKey: ["/api/admin/clients"],
    enabled: isAuthenticated && isAdmin,
  });
  
  // Fetch all projects
  const { 
    data: projects, 
    isLoading: isProjectsLoading 
  } = useQuery({
    queryKey: ["/api/admin/projects"],
    enabled: isAuthenticated && isAdmin,
  });
  
  // Fetch active support sessions
  const { 
    data: supportSessions, 
    isLoading: isSupportSessionsLoading 
  } = useQuery({
    queryKey: ["/api/admin/support/sessions"],
    enabled: isAuthenticated && isAdmin,
  });
  
  if (isAuthLoading) {
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
                    className="px-3 py-2 rounded-md text-sm font-medium bg-gray-800 text-white"
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
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Settings
                  </button>
                </div>
              </nav>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => setLocation("/dashboard")}
                className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
              >
                <Home className="w-4 h-4 mr-2" />
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
        {/* Admin Dashboard Overview */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Manage clients, projects, and system settings.
          </p>
        </div>
        
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Clients Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Clients</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {isClientsLoading ? "..." : clients?.length || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
              <div className="text-sm">
                <button 
                  onClick={() => setLocation("/admin/clients")}
                  className="font-medium text-primary hover:text-primary/80"
                >
                  View all clients
                </button>
              </div>
            </div>
          </div>
          
          {/* Projects Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Projects</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {isProjectsLoading ? "..." : projects?.length || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
              <div className="text-sm">
                <button 
                  onClick={() => setLocation("/admin/projects")}
                  className="font-medium text-primary hover:text-primary/80"
                >
                  View all projects
                </button>
              </div>
            </div>
          </div>
          
          {/* Support Sessions Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Support Sessions</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {isSupportSessionsLoading ? "..." : supportSessions?.length || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
              <div className="text-sm">
                <button 
                  onClick={() => setLocation("/admin/support")}
                  className="font-medium text-primary hover:text-primary/80"
                >
                  View all support sessions
                </button>
              </div>
            </div>
          </div>
          
          {/* Actions Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Quick Actions</dt>
                    <dd className="mt-2 space-y-2">
                      <button 
                        onClick={() => setLocation("/admin/clients/new")}
                        className="text-sm text-primary hover:text-primary/80 flex items-center"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Add New Client
                      </button>
                      <button 
                        onClick={() => setLocation("/admin/projects/new")}
                        className="text-sm text-primary hover:text-primary/80 flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Create New Project
                      </button>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity & Actions */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Client Activity */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Recent Client Activity</h3>
              <button 
                onClick={() => setLocation("/admin/activity")}
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                View All
              </button>
            </div>
            <div className="p-6">
              <ul className="divide-y divide-gray-200">
                {/* Activity Item 1 */}
                <li className="py-4">
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-semibold">JD</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Jane Doe submitted a new project request: "E-commerce Integration"
                      </p>
                      <p className="text-sm text-gray-500">
                        2 hours ago
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20">
                        Review
                      </button>
                    </div>
                  </div>
                </li>
                
                {/* Activity Item 2 */}
                <li className="py-4">
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">JS</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        John Smith opened a new support ticket: "API Integration Issue"
                      </p>
                      <p className="text-sm text-gray-500">
                        Yesterday at 4:30 PM
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20">
                        Respond
                      </button>
                    </div>
                  </div>
                </li>
                
                {/* Activity Item 3 */}
                <li className="py-4">
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 font-semibold">AB</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        Alice Brown uploaded a new document to "CRM Project"
                      </p>
                      <p className="text-sm text-gray-500">
                        2 days ago
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20">
                        View
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Project Status Overview */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Project Status Overview</h3>
              <button 
                onClick={() => setLocation("/admin/projects")}
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                View All
              </button>
            </div>
            <div className="p-6">
              <ul className="divide-y divide-gray-200">
                {/* Project Status Item 1 */}
                <li className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-indigo-600" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          E-commerce Dashboard
                        </p>
                        <p className="text-xs text-gray-500">
                          Client: Acme Corp
                        </p>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        On Track
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-gray-900 font-medium">68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-gray-500">
                    <span>Start: May 15, 2023</span>
                    <span>Due: Jul 20, 2023</span>
                  </div>
                </li>
                
                {/* Project Status Item 2 */}
                <li className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          CRM Integration
                        </p>
                        <p className="text-xs text-gray-500">
                          Client: Beta Industries
                        </p>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Needs Attention
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-gray-900 font-medium">32%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-gray-500">
                    <span>Start: Apr 10, 2023</span>
                    <span>Due: Jun 15, 2023</span>
                  </div>
                </li>
                
                {/* Project Status Item 3 */}
                <li className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Inventory System
                        </p>
                        <p className="text-xs text-gray-500">
                          Client: Gamma Solutions
                        </p>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Planning
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-gray-900 font-medium">10%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-gray-500">
                    <span>Start: May 20, 2023</span>
                    <span>Due: Aug 30, 2023</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}