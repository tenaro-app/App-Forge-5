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
  Layers
} from "lucide-react";

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
    default:
      color = "bg-gray-100 text-gray-800";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </span>
  );
}

// Loading state component
function DashboardLoading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="ml-3 h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/6"></div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="flex justify-between mt-6">
                  <div className="h-8 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [isAuthLoading, isAuthenticated]);

  // Fetch projects from API
  const { data: projects, isLoading: isProjectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
  });

  // Sample metrics data for the analytics dashboard
  const analyticsData = [
    { name: 'API Calls', value: '12,458', change: '+12.3%', trend: 'up' },
    { name: 'User Activity', value: '948', change: '+24.5%', trend: 'up' },
    { name: 'Database Size', value: '238 MB', change: '+5.2%', trend: 'up' },
    { name: 'Response Time', value: '45ms', change: '-8.4%', trend: 'down' },
  ];

  // Active documents data
  const recentDocuments = [
    { name: 'Project Requirements.pdf', updated: '2 days ago', size: '2.4 MB' },
    { name: 'API Documentation.md', updated: '5 days ago', size: '1.1 MB' },
    { name: 'User Guide.pdf', updated: '1 week ago', size: '4.2 MB' },
  ];

  if (isAuthLoading) {
    return <DashboardLoading />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex">
              <div onClick={() => setLocation("/")} className="flex items-center cursor-pointer">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-lg">AF</span>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">AppForge</span>
              </div>
              <h1 className="ml-8 text-2xl font-semibold text-gray-900 hidden sm:block">Client Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                  <MessageSquare className="w-6 h-6 text-gray-600" />
                  <span className="absolute top-0 right-0 block w-2 h-2 bg-primary rounded-full"></span>
                </button>
              </div>
              
              {/* User menu */}
              <div className="relative group">
                <button className="flex items-center space-x-2 group">
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt={user.firstName || "User"} 
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 group-hover:ring-2 group-hover:ring-primary/30 transition-all"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:ring-2 group-hover:ring-primary/30 transition-all">
                      <span className="text-primary font-medium text-sm">
                        {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                  <span className="ml-2 font-medium text-sm text-gray-700 hidden sm:block">
                    {user?.firstName || user?.email?.split('@')[0] || "User"}
                  </span>
                </button>
                
                {/* User dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
                  <div className="py-1">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                    <div className="border-t border-gray-200"></div>
                    <a href="/api/logout" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign out</a>
                  </div>
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
                  onClick={() => setLocation("/dashboard")}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary cursor-pointer"
                >
                  <BarChart className="w-4 h-4 mr-3" />
                  Dashboard
                </div>
                <div 
                  onClick={() => setLocation("/dashboard/enhanced")}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <Layers className="w-4 h-4 mr-3" />
                  Enhanced Dashboard
                </div>
                <div 
                  onClick={() => setLocation("/dashboard/projects")}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <Package className="w-4 h-4 mr-3" />
                  Projects
                </div>
                <div 
                  onClick={() => setLocation("/dashboard/analytics")}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <LineChart className="w-4 h-4 mr-3" />
                  Analytics
                </div>
                <div 
                  onClick={() => setLocation("/dashboard/documents")}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <FileText className="w-4 h-4 mr-3" />
                  Documents
                </div>
              </div>
            </div>
            
            <div className="px-4 py-4 border-b border-gray-200">
              <h2 className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Support</h2>
              <div className="mt-2 space-y-1">
                <div 
                  onClick={() => setLocation("/dashboard/chat")}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 mr-3" />
                  Live Chat
                </div>
                <div 
                  onClick={() => setLocation("/dashboard/tickets")}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 mr-3" />
                  Tickets
                </div>
                <div 
                  onClick={() => setLocation("/dashboard/knowledge")}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 mr-3" />
                  Knowledge Base
                </div>
              </div>
            </div>
            
            <div className="px-4 py-4 border-b border-gray-200">
              <h2 className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Account</h2>
              <div className="mt-2 space-y-1">
                <div 
                  onClick={() => setLocation("/dashboard/team")}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <Users className="w-4 h-4 mr-3" />
                  Team Members
                </div>
                <div 
                  onClick={() => setLocation("/dashboard/billing")}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 mr-3" />
                  Billing & Invoices
                </div>
                <div 
                  onClick={() => setLocation("/dashboard/settings")}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </div>
                <a 
                  href="/admin" 
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Admin Dashboard
                </a>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard welcome section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.firstName || "Client"}!
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
              <button 
                onClick={() => setLocation("/dashboard/analytics")}
                className="text-sm font-medium text-primary hover:underline"
              >
                View Detailed Analytics
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analyticsData.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500">{item.name}</h3>
                    <span className={`text-xs font-medium ${
                      item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.change}
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-gray-900">{item.value}</p>
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
                      <div className="h-8 bg-gray-200 rounded w-1/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map(project => (
                  <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
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

          {/* Documents section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Documents</h2>
              <button 
                onClick={() => setLocation("/dashboard/documents")}
                className="text-sm font-medium text-primary hover:underline"
              >
                View All Documents
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentDocuments.map((doc, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{doc.updated}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{doc.size}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-primary hover:text-primary/80">Download</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}