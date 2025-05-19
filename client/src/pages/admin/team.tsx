import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Users,
  Search,
  UserPlus,
  Mail,
  Phone,
  Briefcase,
  Edit,
  Trash2,
  UserCheck,
  ShieldCheck,
  Shield,
  Clock,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Filter options for team members
const roleFilterOptions = [
  { label: "All Roles", value: "all" },
  { label: "Administrators", value: "admin" },
  { label: "Project Managers", value: "project_manager" },
  { label: "Developers", value: "developer" },
  { label: "Designers", value: "designer" },
  { label: "Support Staff", value: "support" }
];

// Dummy team member data (will be replaced with API data in production)
const dummyTeamMembers = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@appforge.io",
    phone: "+1 (555) 123-4567",
    position: "Project Manager",
    role: "project_manager",
    isAdmin: false,
    status: "active",
    avatar: null,
    joinDate: new Date(2022, 5, 15), // June 15, 2022
    assignedProjects: 3,
    hoursLastMonth: 160
  },
  {
    id: 2,
    firstName: "Michael",
    lastName: "Lee",
    email: "michael.lee@appforge.io",
    phone: "+1 (555) 234-5678",
    position: "Lead Developer",
    role: "developer",
    isAdmin: false,
    status: "active",
    avatar: null,
    joinDate: new Date(2022, 3, 10), // April 10, 2022
    assignedProjects: 4,
    hoursLastMonth: 172
  },
  {
    id: 3,
    firstName: "Emily",
    lastName: "Chen",
    email: "emily.chen@appforge.io",
    phone: "+1 (555) 345-6789",
    position: "UI/UX Designer",
    role: "designer",
    isAdmin: false,
    status: "active",
    avatar: null,
    joinDate: new Date(2022, 7, 5), // August 5, 2022
    assignedProjects: 5,
    hoursLastMonth: 155
  },
  {
    id: 4,
    firstName: "James",
    lastName: "Taylor",
    email: "james.taylor@appforge.io",
    phone: "+1 (555) 456-7890",
    position: "DevOps Engineer",
    role: "developer",
    isAdmin: false,
    status: "active",
    avatar: null,
    joinDate: new Date(2022, 8, 20), // September 20, 2022
    assignedProjects: 2,
    hoursLastMonth: 168
  },
  {
    id: 5,
    firstName: "Jessica",
    lastName: "Martinez",
    email: "jessica.martinez@appforge.io",
    phone: "+1 (555) 567-8901",
    position: "Customer Support",
    role: "support",
    isAdmin: false,
    status: "active",
    avatar: null,
    joinDate: new Date(2022, 10, 1), // November 1, 2022
    assignedProjects: 0,
    hoursLastMonth: 145
  },
  {
    id: 6,
    firstName: "Alex",
    lastName: "Smith",
    email: "alex.smith@appforge.io",
    phone: "+1 (555) 678-9012",
    position: "Administrator",
    role: "admin",
    isAdmin: true,
    status: "active",
    avatar: null,
    joinDate: new Date(2021, 5, 1), // June 1, 2021
    assignedProjects: 0,
    hoursLastMonth: 170
  }
];

export default function AdminTeam() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
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
  
  // Fetch all team members
  const { 
    data: teamMembers, 
    isLoading: isTeamMembersLoading 
  } = useQuery({
    queryKey: ["/api/admin/team"],
    enabled: isAuthenticated && isAdmin,
    // For development we're using dummy data
    initialData: dummyTeamMembers
  });
  
  // Filter team members based on search query and role
  const filteredTeamMembers = teamMembers?.filter(member => {
    const matchesSearch = searchQuery === "" || 
      member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  // Toggle admin status mutation
  const toggleAdminStatusMutation = useMutation({
    mutationFn: async ({ memberId, isAdmin }: { memberId: number, isAdmin: boolean }) => {
      const response = await apiRequest("PUT", `/api/admin/team/${memberId}/admin-status`, { isAdmin });
      if (!response.ok) {
        throw new Error(`Failed to update admin status: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      toast({
        title: "Admin status updated",
        description: "The team member's admin status has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update admin status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Toggle active status mutation
  const toggleActiveStatusMutation = useMutation({
    mutationFn: async ({ memberId, status }: { memberId: number, status: string }) => {
      const newStatus = status === "active" ? "inactive" : "active";
      const response = await apiRequest("PUT", `/api/admin/team/${memberId}/status`, { status: newStatus });
      if (!response.ok) {
        throw new Error(`Failed to update member status: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      toast({
        title: "Status updated",
        description: "The team member's status has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete team member mutation
  const deleteTeamMemberMutation = useMutation({
    mutationFn: async (memberId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/team/${memberId}`);
      if (!response.ok) {
        throw new Error(`Failed to delete team member: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      toast({
        title: "Team member deleted",
        description: "The team member has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete team member",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleToggleAdminStatus = (memberId: number, currentStatus: boolean) => {
    toggleAdminStatusMutation.mutate({ memberId, isAdmin: !currentStatus });
  };
  
  const handleToggleActiveStatus = (memberId: number, currentStatus: string) => {
    toggleActiveStatusMutation.mutate({ memberId, status: currentStatus });
  };
  
  const handleDeleteTeamMember = (memberId: number) => {
    if (window.confirm("Are you sure you want to delete this team member? This action cannot be undone.")) {
      deleteTeamMemberMutation.mutate(memberId);
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
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Projects
                  </button>
                  <button 
                    onClick={() => setLocation("/admin/team")}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-gray-800 text-white"
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
            <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
            <p className="mt-1 text-gray-600">
              Manage team members and their permissions
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={() => setLocation("/admin/team/new")} 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Team Member
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
                placeholder="Search team members..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div>
                <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1 sm:hidden">
                  Filter by Role
                </label>
                <div className="flex items-center">
                  <Filter className="mr-2 h-5 w-5 text-gray-400" />
                  <select
                    id="role-filter"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    {roleFilterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Team Members Grid */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Team Members ({filteredTeamMembers?.length || 0})
            </h3>
          </div>
          
          {isTeamMembersLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : filteredTeamMembers && filteredTeamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredTeamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {member.firstName.charAt(0) + member.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-lg font-medium text-gray-900 flex items-center">
                          {member.firstName} {member.lastName}
                          {member.isAdmin && (
                            <Shield className="ml-1 h-4 w-4 text-primary" />
                          )}
                        </h4>
                        <p className="text-sm text-gray-500">{member.position}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">{member.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">{member.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">
                          Joined: {format(new Date(member.joinDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-gray-700">
                          {member.assignedProjects} Projects | {member.hoursLastMonth} hrs (last month)
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button 
                        onClick={() => setLocation(`/admin/team/${member.id}/edit`)}
                        className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleToggleAdminStatus(member.id, member.isAdmin)}
                        className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <ShieldCheck className="w-4 h-4 mr-1" />
                        {member.isAdmin ? 'Remove Admin' : 'Make Admin'}
                      </button>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <button 
                        onClick={() => handleToggleActiveStatus(member.id, member.status)}
                        className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        {member.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleDeleteTeamMember(member.id)}
                        className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No team members found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? `No team members match your search for "${searchQuery}"` : 'No team members in this category yet.'}
              </p>
              <button 
                onClick={() => setLocation("/admin/team/new")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Team Member
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}