import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Project, Milestone } from "@shared/schema";
import { format } from "date-fns";
import { 
  ArrowLeft,
  Calendar,
  CheckSquare,
  Clock,
  Download,
  FileText,
  Users,
  BarChart,
  ChevronDown,
  MessageSquare,
  ExternalLink,
  PlusSquare
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Dummy data for visualization - in a real app this would come from the API
const teamMembers = [
  { id: 1, name: "John Smith", role: "Project Manager", imageUrl: null },
  { id: 2, name: "Sarah Johnson", role: "Lead Developer", imageUrl: null },
  { id: 3, name: "Michael Lee", role: "UI/UX Designer", imageUrl: null }
];

const activityData = [
  { id: 1, action: "Milestone completed", target: "User Authentication", time: "2 hours ago", icon: CheckSquare },
  { id: 2, action: "New document added", target: "Project Requirements", time: "Yesterday", icon: FileText },
  { id: 3, action: "Comment added", target: "Homepage Design", time: "2 days ago", icon: MessageSquare }
];

type ProjectDetailProps = {
  id: string;
};

export default function ProjectDetail({ id }: ProjectDetailProps) {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [isAuthLoading, isAuthenticated]);
  
  // Get project details
  const { 
    data: project, 
    isLoading: isProjectLoading,
    error: projectError
  } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    enabled: isAuthenticated && !!id,
  });
  
  // Get project milestones
  const { 
    data: milestones, 
    isLoading: isMilestonesLoading,
    error: milestonesError
  } = useQuery<Milestone[]>({
    queryKey: ["/api/projects", id, "milestones"],
    enabled: isAuthenticated && !!id,
  });
  
  // Calculate project progress based on completed milestones
  const calculateProgress = () => {
    if (!milestones || milestones.length === 0) return 0;
    
    const completedCount = milestones.filter(m => m.status === "completed").length;
    return Math.round((completedCount / milestones.length) * 100);
  };
  
  // Update milestone status mutation
  const updateMilestoneMutation = useMutation({
    mutationFn: async ({ milestoneId, status }: { milestoneId: number, status: string }) => {
      const response = await apiRequest("PUT", `/api/milestones/${milestoneId}`, { status });
      if (!response.ok) {
        throw new Error("Failed to update milestone status");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "milestones"] });
    },
  });
  
  if (isAuthLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  if (projectError) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error loading project</h2>
        <p className="text-gray-500">Unable to load project details. Please try again.</p>
        <button 
          onClick={() => setLocation("/dashboard")}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  if (isProjectLoading) {
    return <ProjectDetailSkeleton />;
  }
  
  if (!project) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
        <p className="text-gray-500">The project you're looking for doesn't exist or you don't have access to it.</p>
        <button 
          onClick={() => setLocation("/dashboard")}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Back to Dashboard
        </button>
      </div>
    );
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
              <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
            </div>
            {project.replitUrl && (
              <a 
                href={project.replitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90"
              >
                View Live Application
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Overview Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="sm:flex sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
              <p className="mt-1 text-gray-600">{project.description}</p>
              <div className="flex flex-wrap gap-4 mt-2">
                {project.startDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Started: {format(new Date(project.startDate), 'MMM d, yyyy')}</span>
                  </div>
                )}
                {project.dueDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Due: {format(new Date(project.dueDate), 'MMM d, yyyy')}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <CheckSquare className="w-4 h-4 mr-1" />
                  <span>Status: <span className="font-medium capitalize">{project.status}</span></span>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex flex-col items-end">
              <div className="bg-gray-50 py-2 px-4 rounded-md shadow-sm border border-gray-200">
                <div className="text-sm text-gray-700 mb-1">Overall Progress</div>
                <div className="flex items-center">
                  <Progress value={calculateProgress()} className="h-2 w-32 mr-3" />
                  <span className="text-lg font-semibold text-gray-900">{calculateProgress()}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs for different sections */}
        <Tabs defaultValue="milestones" className="w-full">
          <TabsList className="border-b border-gray-200 w-full mb-6 flex bg-transparent p-0 h-auto">
            <div className="flex space-x-2 overflow-x-auto pb-px">
              <TabsTrigger 
                value="milestones" 
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary py-2 px-4 text-gray-500 rounded-none hover:text-gray-900 focus:outline-none"
              >
                Milestones
              </TabsTrigger>
              <TabsTrigger 
                value="team" 
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary py-2 px-4 text-gray-500 rounded-none hover:text-gray-900 focus:outline-none"
              >
                Team
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary py-2 px-4 text-gray-500 rounded-none hover:text-gray-900 focus:outline-none"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary py-2 px-4 text-gray-500 rounded-none hover:text-gray-900 focus:outline-none"
              >
                Documents
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary py-2 px-4 text-gray-500 rounded-none hover:text-gray-900 focus:outline-none"
              >
                Activity
              </TabsTrigger>
            </div>
          </TabsList>
          
          {/* Milestones Tab */}
          <TabsContent value="milestones" className="space-y-6 mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="sm:flex sm:items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Project Milestones</h3>
                <div className="mt-2 sm:mt-0">
                  <div className="flex items-center text-sm">
                    <div className="flex items-center mr-4">
                      <div className="w-3 h-3 bg-gray-200 rounded-full mr-1"></div>
                      <span>Not Started</span>
                    </div>
                    <div className="flex items-center mr-4">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></div>
                      <span>In Progress</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                      <span>Completed</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {isMilestonesLoading ? (
                <div className="p-6">
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                        <div className="flex justify-between items-center">
                          <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                          <div className="h-8 bg-gray-200 rounded w-1/6"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : milestones && milestones.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {milestones.map(milestone => (
                    <div key={milestone.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{milestone.title}</h4>
                          <p className="mt-1 text-gray-600">{milestone.description}</p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>
                              Due: {milestone.dueDate ? format(new Date(milestone.dueDate), 'MMM d, yyyy') : 'Not set'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <select
                            value={milestone.status}
                            onChange={(e) => updateMilestoneMutation.mutate({
                              milestoneId: milestone.id,
                              status: e.target.value
                            })}
                            className={`rounded-md border text-sm py-1.5 pl-3 pr-8 ${
                              milestone.status === 'completed' 
                                ? 'bg-green-50 text-green-800 border-green-200' 
                                : milestone.status === 'in-progress'
                                  ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                                  : 'bg-gray-50 text-gray-800 border-gray-200'
                            }`}
                            disabled={updateMilestoneMutation.isPending}
                          >
                            <option value="not-started">Not Started</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No milestones have been defined for this project yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6 mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Project Team</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map(member => (
                    <div key={member.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                      <div className="p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary text-lg font-semibold">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-3">
                            <h4 className="text-lg font-medium text-gray-900">{member.name}</h4>
                            <p className="text-sm text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <button className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Contact
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Project Analytics</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                    <div className="text-green-800 text-sm font-medium mb-1">Milestone Completion</div>
                    <div className="text-2xl font-bold text-green-900">{calculateProgress()}%</div>
                    <div className="mt-1 text-sm text-green-700">
                      {milestones ? `${milestones.filter(m => m.status === "completed").length} of ${milestones.length} complete` : 'No milestones'}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="text-blue-800 text-sm font-medium mb-1">Time to Completion</div>
                    <div className="text-2xl font-bold text-blue-900">65%</div>
                    <div className="mt-1 text-sm text-blue-700">On schedule</div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                    <div className="text-purple-800 text-sm font-medium mb-1">Budget Utilization</div>
                    <div className="text-2xl font-bold text-purple-900">48%</div>
                    <div className="mt-1 text-sm text-purple-700">Under budget</div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-6 text-center">
                  <BarChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Detailed analytics coming soon</h4>
                  <p className="text-gray-500 max-w-md mx-auto">
                    We're working on comprehensive analytics and visualization tools to help you better track and understand your project performance.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6 mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="sm:flex sm:items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Project Documents</h3>
                <button className="mt-2 sm:mt-0 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90">
                  <PlusSquare className="w-4 h-4 mr-2" />
                  Request Document
                </button>
              </div>
              <div className="p-6">
                <div className="divide-y divide-gray-200">
                  <div className="py-4 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-base font-medium text-gray-900">Project Requirements</h4>
                      <p className="text-sm text-gray-500">PDF • Updated 3 days ago</p>
                    </div>
                    <div>
                      <button className="flex items-center px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/5">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                  
                  <div className="py-4 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-base font-medium text-gray-900">User Guide</h4>
                      <p className="text-sm text-gray-500">PDF • Updated 1 week ago</p>
                    </div>
                    <div>
                      <button className="flex items-center px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/5">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                  
                  <div className="py-4 flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-purple-100 rounded-md flex items-center justify-center">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-base font-medium text-gray-900">Technical Documentation</h4>
                      <p className="text-sm text-gray-500">PDF • Updated 2 weeks ago</p>
                    </div>
                    <div>
                      <button className="flex items-center px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/5">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6 mt-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Project Activity</h3>
              </div>
              <div className="p-6">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {activityData.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== activityData.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <activity.icon className="h-4 w-4 text-gray-600" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-900">
                                  {activity.action}{' '}
                                  <span className="font-medium text-gray-900">
                                    "{activity.target}"
                                  </span>
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {activity.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 text-center">
                  <button className="text-sm font-medium text-primary hover:text-primary/80">
                    View all activity
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function ProjectDetailSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex-1 flex items-center space-x-8">
              <div className="h-5 w-36 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="animate-pulse flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="h-16 w-36 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-200 h-12 w-full rounded mb-6 animate-pulse"></div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}