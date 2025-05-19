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
  MessageSquare
} from "lucide-react";

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

  if (isAuthLoading) {
    return <DashboardLoading />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex">
              <Link href="/">
                <a className="flex items-center">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-lg">AF</span>
                  </div>
                  <span className="ml-3 text-xl font-bold text-gray-900">AppForge</span>
                </a>
              </Link>
              <h1 className="ml-8 text-2xl font-semibold text-gray-900 hidden sm:block">Client Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/chat">
                <a className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                  <MessageSquare className="w-6 h-6 text-gray-600" />
                  {/* Notification indicator would go here */}
                </a>
              </Link>
              
              <div className="flex items-center">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt={user.firstName || "User"} 
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-medium text-sm">
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
                <span className="ml-2 font-medium text-sm text-gray-700 hidden sm:block">
                  {user?.firstName || user?.email?.split('@')[0] || "User"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <a 
                href="/api/logout" 
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              >
                Sign Out
              </a>
            </div>
          </div>
        </div>

        {/* Projects section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Projects</h2>
            <Link href="/dashboard/chat">
              <a className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors">
                <MessageSquare className="w-4 h-4 mr-2" />
                Support Chat
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
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-3">
                      <Link href={`/dashboard/projects/${project.id}`}>
                        <a className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md bg-white hover:bg-primary/5 transition-colors">
                          <BarChart className="w-4 h-4 mr-1" />
                          View Details
                        </a>
                      </Link>
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
                <Link href="/dashboard/chat">
                  <a className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Support
                  </a>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Helper components
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