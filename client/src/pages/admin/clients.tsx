import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Users,
  Search,
  UserPlus,
  Building,
  Mail,
  Phone,
  Calendar,
  FileText,
  Package,
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowUpDown,
  Filter,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Filter options
const statusFilterOptions = [
  { label: "All Clients", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" }
];

// Dummy client data (will be replaced with API data in production)
const dummyClients = [
  {
    id: "1",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@acmecorp.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corp",
    position: "CTO",
    status: "active",
    joinDate: new Date(2023, 0, 15), // January 15, 2023
    projectsCount: 3,
    lastActivity: new Date(2023, 5, 10), // June 10, 2023
    billingType: "monthly",
    notes: "Enterprise client with multiple automation projects"
  },
  {
    id: "2",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@betaindustries.com",
    phone: "+1 (555) 234-5678",
    company: "Beta Industries",
    position: "COO",
    status: "active",
    joinDate: new Date(2023, 1, 20), // February 20, 2023
    projectsCount: 2,
    lastActivity: new Date(2023, 5, 12), // June 12, 2023
    billingType: "project",
    notes: "Mid-sized manufacturing company focusing on inventory automation"
  },
  {
    id: "3",
    firstName: "Alice",
    lastName: "Brown",
    email: "alice.brown@gammasolutions.com",
    phone: "+1 (555) 345-6789",
    company: "Gamma Solutions",
    position: "CEO",
    status: "active",
    joinDate: new Date(2023, 2, 5), // March 5, 2023
    projectsCount: 1,
    lastActivity: new Date(2023, 5, 8), // June 8, 2023
    billingType: "annual",
    notes: "Small business with growth potential, interested in CRM solutions"
  },
  {
    id: "4",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.johnson@deltatech.com",
    phone: "+1 (555) 456-7890",
    company: "Delta Tech",
    position: "CIO",
    status: "inactive",
    joinDate: new Date(2022, 10, 10), // November 10, 2022
    projectsCount: 1,
    lastActivity: new Date(2023, 3, 15), // April 15, 2023
    billingType: "project",
    notes: "On hold due to internal restructuring, expecting to resume in Q3"
  },
  {
    id: "5",
    firstName: "Emily",
    lastName: "Taylor",
    email: "emily.taylor@epsilonsystems.com",
    phone: "+1 (555) 567-8901",
    company: "Epsilon Systems",
    position: "Director of Operations",
    status: "active",
    joinDate: new Date(2023, 4, 1), // May 1, 2023
    projectsCount: 1,
    lastActivity: new Date(2023, 5, 14), // June 14, 2023
    billingType: "monthly",
    notes: "Healthcare industry client, focused on patient management workflows"
  }
];

export default function AdminClients() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("company");
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
  
  // Fetch all clients
  const { 
    data: clients, 
    isLoading: isClientsLoading 
  } = useQuery({
    queryKey: ["/api/admin/clients"],
    enabled: isAuthenticated && isAdmin,
    // For development we're using dummy data
    initialData: dummyClients
  });
  
  // Filter clients based on search query and status
  const filteredClients = clients?.filter(client => {
    const matchesSearch = searchQuery === "" || 
      client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort clients based on selected field and direction
  const sortedClients = filteredClients?.sort((a, b) => {
    let compareA, compareB;
    
    // Determine which field to sort by
    switch (sortField) {
      case "name":
        compareA = a.firstName + a.lastName;
        compareB = b.firstName + b.lastName;
        break;
      case "company":
        compareA = a.company;
        compareB = b.company;
        break;
      case "joinDate":
        compareA = new Date(a.joinDate).getTime();
        compareB = new Date(b.joinDate).getTime();
        break;
      case "lastActivity":
        compareA = new Date(a.lastActivity).getTime();
        compareB = new Date(b.lastActivity).getTime();
        break;
      case "projectsCount":
        compareA = a.projectsCount;
        compareB = b.projectsCount;
        break;
      default:
        compareA = a.company;
        compareB = b.company;
    }
    
    // Determine sort direction
    if (sortDirection === "asc") {
      return compareA > compareB ? 1 : -1;
    } else {
      return compareA < compareB ? 1 : -1;
    }
  });
  
  // Delete client mutation
  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/clients/${clientId}`);
      if (!response.ok) {
        throw new Error(`Failed to delete client: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      toast({
        title: "Client deleted",
        description: "The client has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete client",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Toggle client status mutation
  const toggleClientStatusMutation = useMutation({
    mutationFn: async ({ clientId, status }: { clientId: string, status: string }) => {
      const newStatus = status === "active" ? "inactive" : "active";
      const response = await apiRequest("PUT", `/api/admin/clients/${clientId}/status`, { status: newStatus });
      if (!response.ok) {
        throw new Error(`Failed to update client status: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      toast({
        title: "Client status updated",
        description: "The client's status has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update client status",
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
  
  const handleDeleteClient = (clientId: string) => {
    if (window.confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      deleteClientMutation.mutate(clientId);
    }
  };
  
  const handleToggleClientStatus = (clientId: string, currentStatus: string) => {
    toggleClientStatusMutation.mutate({ clientId, status: currentStatus });
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
                    className="px-3 py-2 rounded-md text-sm font-medium bg-gray-800 text-white"
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
            <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
            <p className="mt-1 text-gray-600">
              Manage client accounts and their projects
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={() => setLocation("/admin/clients/new")} 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add New Client
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
                placeholder="Search clients..."
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
                <div className="flex items-center">
                  <Filter className="mr-2 h-5 w-5 text-gray-400" />
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
        </div>
        
        {/* Clients Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Clients ({sortedClients?.length || 0})
            </h3>
          </div>
          
          {isClientsLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : sortedClients && sortedClients.length > 0 ? (
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
                        Client Name
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("company")}
                    >
                      <div className="flex items-center">
                        Company
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("joinDate")}
                    >
                      <div className="flex items-center">
                        Joined
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("projectsCount")}
                    >
                      <div className="flex items-center">
                        Projects
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-medium text-primary">
                              {client.firstName.charAt(0) + client.lastName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {client.firstName} {client.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {client.position}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-900">{client.company}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Mail className="h-4 w-4 text-gray-500 mr-2" />
                          {client.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Phone className="h-4 w-4 text-gray-500 mr-2" />
                          {client.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          {format(new Date(client.joinDate), 'MMM d, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-900">{client.projectsCount}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Last active: {format(new Date(client.lastActivity), 'MMM d, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          client.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => setLocation(`/admin/clients/${client.id}`)}
                            className="text-gray-500 hover:text-primary"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setLocation(`/admin/clients/${client.id}/edit`)}
                            className="text-gray-500 hover:text-primary"
                            title="Edit Client"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleToggleClientStatus(client.id, client.status)}
                            className="text-gray-500 hover:text-primary"
                            title={client.status === 'active' ? 'Deactivate Client' : 'Activate Client'}
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClient(client.id)}
                            className="text-gray-500 hover:text-red-500"
                            title="Delete Client"
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
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No clients found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? `No clients match your search for "${searchQuery}"` : 'There are no clients in this category yet.'}
              </p>
              <button 
                onClick={() => setLocation("/admin/clients/new")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Client
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}