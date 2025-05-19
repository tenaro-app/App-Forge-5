import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Package,
  Search, 
  Plus,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Filter options for projects list
const statusFilterOptions = [
  { label: "All Projects", value: "all" },
  { label: "Planning", value: "planning" },
  { label: "In Progress", value: "in-progress" },
  { label: "On Hold", value: "on-hold" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" }
];

// Dummy project data (will be replaced with API data in production)
const dummyProjects = [
  {
    id: 1,
    name: "E-commerce Dashboard",
    description: "Custom e-commerce analytics and order processing automation system",
    status: "in-progress",
    startDate: new Date(2023, 4, 15), // May 15, 2023
    dueDate: new Date(2023, 6, 20), // July 20, 2023
    clientId: "1",
    clientName: "Acme Corp",
    progress: 68,
    milestonesTotal: 12,
    milestonesCompleted: 8
  },
  {
    id: 2,
    name: "CRM Integration",
    description: "Custom CRM integration with email marketing platform and customer support system",
    status: "in-progress",
    startDate: new Date(2023, 3, 10), // April 10, 2023
    dueDate: new Date(2023, 5, 15), // June 15, 2023
    clientId: "2",
    clientName: "Beta Industries",
    progress: 32,
    milestonesTotal: 10,
    milestonesCompleted: 3
  },
  {
    id: 3,
    name: "Inventory System",
    description: "Automated inventory management system with supplier integration and reorder automation",
    status: "planning",
    startDate: new Date(2023, 4, 20), // May 20, 2023
    dueDate: new Date(2023, 7, 30), // August 30, 2023
    clientId: "3",
    clientName: "Gamma Solutions",
    progress: 10,
    milestonesTotal: 14,
    milestonesCompleted: 1
  },
  {
    id: 4,
    name: "HR Portal",
    description: "Employee self-service portal with time tracking and benefits management",
    status: "completed",
    startDate: new Date(2023, 1, 5), // February 5, 2023
    dueDate: new Date(2023, 3, 30), // April 30, 2023
    clientId: "4",
    clientName: "Delta Tech",
    progress: 100,
    milestonesTotal: 8,
    milestonesCompleted: 8
  },
  {
    id: 5,
    name: "Content Management System",
    description: "Custom headless CMS with API-first architecture and multi-channel publishing",
    status: "on-hold",
    startDate: new Date(2023, 2, 15), // March 15, 2023
    dueDate: new Date(2023, 5, 1), // June 1, 2023
    clientId: "2",
    clientName: "Beta Industries",
    progress: 45,
    milestonesTotal: 9,
    milestonesCompleted: 4
  }
];

export default function AdminProjects() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("dueDate");
  const [sortDirection, setSortDirection] = useState("asc");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
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
  
  // Fetch all projects
  const { 
    data: projects, 
    isLoading: isProjectsLoading 
  } = useQuery({
    queryKey: ["/api/admin/projects"],
    enabled: isAuthenticated && isAdmin,
    // For development we're using dummy data
    initialData: dummyProjects
  });
  
  // Filter projects based on search query and status
  const filteredProjects = projects?.filter(project => {
    const matchesSearch = searchQuery === "" || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort projects based on selected field and direction
  const sortedProjects = filteredProjects?.sort((a, b) => {
    let compareA, compareB;
    
    // Determine which field to sort by
    switch (sortField) {
      case "name":
        compareA = a.name;
        compareB = b.name;
        break;
      case "client":
        compareA = a.clientName;
        compareB = b.clientName;
        break;
      case "status":
        compareA = a.status;
        compareB = b.status;
        break;
      case "progress":
        compareA = a.progress;
        compareB = b.progress;
        break;
      case "startDate":
        compareA = new Date(a.startDate).getTime();
        compareB = new Date(b.startDate).getTime();
        break;
      case "dueDate":
        compareA = new Date(a.dueDate).getTime();
        compareB = new Date(b.dueDate).getTime();
        break;
      default:
        compareA = a.name;
        compareB = b.name;
    }
    
    // Determine sort direction
    if (sortDirection === "asc") {
      return compareA > compareB ? 1 : -1;
    } else {
      return compareA < compareB ? 1 : -1;
    }
  });
  
  // Update project status mutation
  const updateProjectStatusMutation = useMutation({
    mutationFn: async ({ projectId, status }: { projectId: number, status: string }) => {
      const response = await apiRequest("PUT", `/api/admin/projects/${projectId}/status`, { status });
      if (!response.ok) {
        throw new Error(`Failed to update project status: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({
        title: "Project status updated",
        description: "The project status has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update project status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/projects/${projectId}`);
      if (!response.ok) {
        throw new Error(`Failed to delete project: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete project",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      // If already sorting by this field, toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Otherwise, sort by this field in ascending order
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const handleDeleteProject = (projectId: number) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      deleteProjectMutation.mutate(projectId);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planning":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Planning
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            In Progress
          </span>
        );
      case "on-hold":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            On Hold
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };
  
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
                    className="px-3 py-2 rounded-md text-sm font-medium bg-gray-800 text-white"
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
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
            <p className="mt-1 text-gray-600">
              Manage all client projects and their statuses
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={() => setLocation("/admin/projects/new")} 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Project
            </button>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white p-6 shadow rounded-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative md:max-w-xs w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1 sm:hidden">
                  Filter by Status
                </label>
                <select
                  id="status-filter"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusFilterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Projects Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Projects ({sortedProjects?.length || 0})
            </h3>
          </div>
          
          {isProjectsLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : sortedProjects && sortedProjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("name")}
                    >
                      <div className="flex items-center">
                        Project Name
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("client")}
                    >
                      <div className="flex items-center">
                        Client
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("status")}
                    >
                      <div className="flex items-center">
                        Status
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("progress")}
                    >
                      <div className="flex items-center">
                        Progress
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("dueDate")}
                    >
                      <div className="flex items-center">
                        Timeline
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {project.name}
                            </div>
                            <div className="text-xs text-gray-500 max-w-xs truncate">
                              {project.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{project.clientName}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          Client ID: {project.clientId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 mr-4">
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  project.status === 'completed' ? 'bg-purple-500' :
                                  project.status === 'on-hold' ? 'bg-yellow-500' :
                                  'bg-primary'
                                }`} 
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{project.progress}%</span>
                              <span>
                                {project.milestonesCompleted}/{project.milestonesTotal} milestones
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>Start: {format(new Date(project.startDate), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>Due: {format(new Date(project.dueDate), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => setLocation(`/admin/projects/${project.id}`)}
                            className="text-gray-500 hover:text-primary"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setLocation(`/admin/projects/${project.id}/edit`)}
                            className="text-gray-500 hover:text-primary"
                            title="Edit Project"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-gray-500 hover:text-red-500"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No projects found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? `No projects match your search for "${searchQuery}"` : 'There are no projects in this category yet.'}
              </p>
              <button 
                onClick={() => setLocation("/admin/projects/new")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Project
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}