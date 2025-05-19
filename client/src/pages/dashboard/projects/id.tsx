import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Project, Milestone } from "@shared/schema";
import { format } from "date-fns";
import { 
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  PauseCircle,
  ExternalLink,
  MessageSquare
} from "lucide-react";

interface ProjectDetailProps {
  id: string;
}

export default function ProjectDetail({ id }: ProjectDetailProps) {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [isAuthLoading, isAuthenticated]);

  // Fetch project details
  const { 
    data: project, 
    isLoading: isProjectLoading, 
    error: projectError
  } = useQuery<Project>({
    queryKey: ["/api/projects", parseInt(id)],
    enabled: isAuthenticated,
  });

  // Fetch project milestones
  const { 
    data: milestones, 
    isLoading: isMilestonesLoading 
  } = useQuery<Milestone[]>({
    queryKey: ["/api/projects", parseInt(id), "milestones"],
    enabled: isAuthenticated && !!project,
  });

  if (isAuthLoading || isProjectLoading) {
    return <ProjectDetailLoading />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (projectError || !project) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <Link href="/dashboard">
                <a className="flex items-center text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </a>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
            <p className="text-gray-600 mb-6">
              The project you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link href="/dashboard">
              <a className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors">
                Return to Dashboard
              </a>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard">
                <a className="flex items-center text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Dashboard
                </a>
              </Link>
              <h1 className="ml-8 text-xl font-semibold text-gray-900 hidden sm:block truncate max-w-md">
                {project.name}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/dashboard/chat">
                <a className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors">
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  Support
                </a>
              </Link>
              {project.replitUrl && (
                <a 
                  href={project.replitUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  View App
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between">
            <div className="flex-grow">
              <div className="flex items-center flex-wrap gap-2 mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mr-2">
                  {project.name}
                </h2>
                <StatusBadge status={project.status} />
              </div>
              
              <div className="text-gray-600 mb-4">
                {project.description}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span>Started: {format(new Date(project.startDate), 'MMM d, yyyy')}</span>
                </div>
                
                {project.dueDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Due: {format(new Date(project.dueDate), 'MMM d, yyyy')}</span>
                  </div>
                )}
                
                {project.completedDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    <span>Completed: {format(new Date(project.completedDate), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Milestones</h3>
          
          {isMilestonesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : milestones && milestones.length > 0 ? (
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div 
                  key={milestone.id} 
                  className={`${index !== milestones.length - 1 ? 'border-b border-gray-200 pb-6' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-semibold text-gray-900">{milestone.title}</h4>
                    <MilestoneStatusBadge status={milestone.status} />
                  </div>
                  
                  <p className="text-gray-600 mt-1 mb-3">
                    {milestone.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    {milestone.dueDate && (
                      <span className="text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                        Due: {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                      </span>
                    )}
                    
                    {milestone.completedDate && (
                      <span className="text-gray-500 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1.5 text-green-500" />
                        Completed: {format(new Date(milestone.completedDate), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No milestones have been added to this project yet.</p>
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

function MilestoneStatusBadge({ status }: { status: string }) {
  let color = "";
  let Icon = Clock;
  let label = "Unknown";

  switch (status) {
    case "pending":
      color = "bg-gray-100 text-gray-800";
      Icon = Clock;
      label = "Pending";
      break;
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

function ProjectDetailLoading() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="ml-8 h-6 w-48 bg-gray-200 rounded animate-pulse hidden sm:block"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/5 mb-6"></div>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="flex gap-4">
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}