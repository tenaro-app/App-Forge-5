import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageSquare,
  Search,
  Filter,
  ChevronDown,
  Clock,
  User,
  Building,
  Package,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Eye,
  Reply,
  AlertCircle,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Filter options
const statusFilterOptions = [
  { label: "All Tickets", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in-progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" }
];

const priorityFilterOptions = [
  { label: "All Priorities", value: "all" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" }
];

// Dummy support ticket data (will be replaced with API data in production)
const dummySupportTickets = [
  {
    id: 1,
    subject: "Dashboard login issue",
    description: "Unable to log into the dashboard. Getting a 404 error.",
    status: "open",
    priority: "high",
    clientId: "1",
    clientName: "Jane Doe",
    companyName: "Acme Corp",
    projectId: 1,
    projectName: "E-commerce Dashboard",
    createdAt: new Date(2023, 5, 14, 9, 30), // June 14, 2023, 9:30 AM
    lastUpdated: new Date(2023, 5, 14, 10, 15), // June 14, 2023, 10:15 AM
    assignedTo: null,
    messageCount: 3,
    unreadCount: 1
  },
  {
    id: 2,
    subject: "Feature request: Export to CSV",
    description: "Would like to add the ability to export data to CSV format.",
    status: "in-progress",
    priority: "medium",
    clientId: "2",
    clientName: "John Smith",
    companyName: "Beta Industries",
    projectId: 2,
    projectName: "CRM Integration",
    createdAt: new Date(2023, 5, 12, 14, 45), // June 12, 2023, 2:45 PM
    lastUpdated: new Date(2023, 5, 13, 11, 30), // June 13, 2023, 11:30 AM
    assignedTo: {
      id: 2,
      name: "Michael Lee",
      role: "developer"
    },
    messageCount: 5,
    unreadCount: 0
  },
  {
    id: 3,
    subject: "API integration error",
    description: "Receiving 500 error when trying to connect to third-party API.",
    status: "in-progress",
    priority: "high",
    clientId: "3",
    clientName: "Alice Brown",
    companyName: "Gamma Solutions",
    projectId: 3,
    projectName: "Inventory System",
    createdAt: new Date(2023, 5, 13, 16, 20), // June 13, 2023, 4:20 PM
    lastUpdated: new Date(2023, 5, 14, 12, 10), // June 14, 2023, 12:10 PM
    assignedTo: {
      id: 4,
      name: "James Taylor",
      role: "developer"
    },
    messageCount: 4,
    unreadCount: 2
  },
  {
    id: 4,
    subject: "Billing question",
    description: "Need clarification on the latest invoice.",
    status: "open",
    priority: "low",
    clientId: "4",
    clientName: "Robert Johnson",
    companyName: "Delta Tech",
    projectId: 4,
    projectName: "HR Portal",
    createdAt: new Date(2023, 5, 14, 8, 15), // June 14, 2023, 8:15 AM
    lastUpdated: new Date(2023, 5, 14, 8, 15), // June 14, 2023, 8:15 AM
    assignedTo: null,
    messageCount: 1,
    unreadCount: 1
  },
  {
    id: 5,
    subject: "Documentation request",
    description: "Need additional documentation for the content management system.",
    status: "resolved",
    priority: "medium",
    clientId: "5",
    clientName: "Emily Taylor",
    companyName: "Epsilon Systems",
    projectId: 5,
    projectName: "Content Management System",
    createdAt: new Date(2023, 5, 10, 11, 45), // June 10, 2023, 11:45 AM
    lastUpdated: new Date(2023, 5, 12, 15, 30), // June 12, 2023, 3:30 PM
    assignedTo: {
      id: 5,
      name: "Jessica Martinez",
      role: "support"
    },
    messageCount: 7,
    unreadCount: 0
  }
];

// Dummy team member data for assignment
const dummyTeamMembers = [
  { id: 1, name: "Sarah Johnson", role: "project_manager" },
  { id: 2, name: "Michael Lee", role: "developer" },
  { id: 3, name: "Emily Chen", role: "designer" },
  { id: 4, name: "James Taylor", role: "developer" },
  { id: 5, name: "Jessica Martinez", role: "support" },
  { id: 6, name: "Alex Smith", role: "admin" }
];

export default function AdminSupport() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortField, setSortField] = useState("lastUpdated");
  const [sortDirection, setSortDirection] = useState("desc");
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
  
  // Fetch all support tickets
  const { 
    data: supportTickets, 
    isLoading: isTicketsLoading 
  } = useQuery({
    queryKey: ["/api/admin/support-tickets"],
    enabled: isAuthenticated && isAdmin,
    // For development we're using dummy data
    initialData: dummySupportTickets
  });
  
  // Fetch team members for assignment
  const { 
    data: teamMembers, 
    isLoading: isTeamMembersLoading 
  } = useQuery({
    queryKey: ["/api/admin/team"],
    enabled: isAuthenticated && isAdmin,
    // For development we're using dummy data
    initialData: dummyTeamMembers
  });
  
  // Filter tickets based on search query, status, and priority
  const filteredTickets = supportTickets?.filter(ticket => {
    const matchesSearch = searchQuery === "" || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  // Sort tickets based on selected field and direction
  const sortedTickets = filteredTickets?.sort((a, b) => {
    let compareA, compareB;
    
    // Determine which field to sort by
    switch (sortField) {
      case "subject":
        compareA = a.subject;
        compareB = b.subject;
        break;
      case "priority":
        // Sort by priority level (high > medium > low)
        const priorityLevel = { high: 3, medium: 2, low: 1 };
        compareA = priorityLevel[a.priority] || 0;
        compareB = priorityLevel[b.priority] || 0;
        break;
      case "status":
        compareA = a.status;
        compareB = b.status;
        break;
      case "client":
        compareA = a.clientName;
        compareB = b.clientName;
        break;
      case "createdAt":
        compareA = new Date(a.createdAt).getTime();
        compareB = new Date(b.createdAt).getTime();
        break;
      case "lastUpdated":
        compareA = new Date(a.lastUpdated).getTime();
        compareB = new Date(b.lastUpdated).getTime();
        break;
      default:
        compareA = new Date(a.lastUpdated).getTime();
        compareB = new Date(b.lastUpdated).getTime();
    }
    
    // Determine sort direction
    if (sortDirection === "asc") {
      return compareA > compareB ? 1 : -1;
    } else {
      return compareA < compareB ? 1 : -1;
    }
  });
  
  // Update ticket status mutation
  const updateTicketStatusMutation = useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: number, status: string }) => {
      const response = await apiRequest("PUT", `/api/admin/support-tickets/${ticketId}/status`, { status });
      if (!response.ok) {
        throw new Error(`Failed to update ticket status: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/support-tickets"] });
      toast({
        title: "Ticket status updated",
        description: "The support ticket status has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update ticket status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Assign ticket to team member mutation
  const assignTicketMutation = useMutation({
    mutationFn: async ({ ticketId, userId }: { ticketId: number, userId: number }) => {
      const response = await apiRequest("PUT", `/api/admin/support-tickets/${ticketId}/assign`, { userId });
      if (!response.ok) {
        throw new Error(`Failed to assign ticket: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/support-tickets"] });
      toast({
        title: "Ticket assigned",
        description: "The support ticket has been successfully assigned.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to assign ticket",
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
      // Otherwise, sort by this field in descending order for dates, ascending for text
      setSortField(field);
      setSortDirection(field === "createdAt" || field === "lastUpdated" ? "desc" : "asc");
    }
  };
  
  const handleUpdateStatus = (ticketId: number, newStatus: string) => {
    updateTicketStatusMutation.mutate({ ticketId, status: newStatus });
  };
  
  const handleAssignTicket = (ticketId: number, userId: number) => {
    assignTicketMutation.mutate({ ticketId, userId });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Open
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="w-3 h-3 mr-1" />
            Closed
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
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            High
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Medium
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Low
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {priority}
          </span>
        );
    }
  };
  
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} sec ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hr ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    return format(new Date(date), 'MMM d, yyyy');
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
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Team
                  </button>
                  <button 
                    onClick={() => setLocation("/admin/support")}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-gray-800 text-white"
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
            <h1 className="text-2xl font-bold text-gray-900">Support Management</h1>
            <p className="mt-1 text-gray-600">
              Manage support tickets and client inquiries
            </p>
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
                placeholder="Search tickets..."
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
              
              <div>
                <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1 sm:hidden">
                  Filter by Priority
                </label>
                <div className="flex items-center">
                  <Filter className="mr-2 h-5 w-5 text-gray-400" />
                  <select
                    id="priority-filter"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    {priorityFilterOptions.map((option) => (
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
        
        {/* Support Tickets Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Support Tickets ({sortedTickets?.length || 0})
            </h3>
          </div>
          
          {isTicketsLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : sortedTickets && sortedTickets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("subject")}
                    >
                      <div className="flex items-center">
                        Subject
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
                      onClick={() => handleSortChange("priority")}
                    >
                      <div className="flex items-center">
                        Priority
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Assigned To
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("lastUpdated")}
                    >
                      <div className="flex items-center">
                        Last Activity
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <MessageSquare className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {ticket.subject}
                              {ticket.unreadCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-white">
                                  {ticket.unreadCount} new
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                              {ticket.description}
                            </div>
                            <div className="text-xs flex items-center mt-1">
                              <Package className="w-3 h-3 text-gray-400 mr-1" />
                              <span className="text-gray-500">{ticket.projectName}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-1" />
                            {ticket.clientName}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <Building className="w-3 h-3 text-gray-400 mr-1" />
                            {ticket.companyName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-2">
                          {getStatusBadge(ticket.status)}
                          <div className="relative">
                            <select
                              className="text-xs border border-gray-300 rounded px-2 py-1 w-full appearance-none cursor-pointer pr-8"
                              value={ticket.status}
                              onChange={(e) => handleUpdateStatus(ticket.id, e.target.value)}
                            >
                              <option value="open">Set to Open</option>
                              <option value="in-progress">Set to In Progress</option>
                              <option value="resolved">Set to Resolved</option>
                              <option value="closed">Set to Closed</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1 h-4 w-4 text-gray-500 pointer-events-none" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPriorityBadge(ticket.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-2">
                          {ticket.assignedTo ? (
                            <div className="text-sm text-gray-900">
                              {ticket.assignedTo.name}
                              <span className="ml-1 text-xs text-gray-500">
                                ({ticket.assignedTo.role})
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 italic">Unassigned</span>
                          )}
                          <div className="relative">
                            <select
                              className="text-xs border border-gray-300 rounded px-2 py-1 w-full appearance-none cursor-pointer pr-8"
                              value={ticket.assignedTo?.id || ""}
                              onChange={(e) => handleAssignTicket(ticket.id, Number(e.target.value))}
                            >
                              <option value="">Assign to...</option>
                              {teamMembers?.map((member) => (
                                <option key={member.id} value={member.id}>
                                  {member.name} ({member.role})
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1 h-4 w-4 text-gray-500 pointer-events-none" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Clock className="w-4 h-4 text-gray-400 mr-1" />
                            {formatTimeAgo(ticket.lastUpdated)}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                            {`Created: ${format(new Date(ticket.createdAt), 'MMM d, yyyy')}`}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => setLocation(`/admin/support/${ticket.id}`)}
                            className="text-gray-500 hover:text-primary"
                            title="View Ticket"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setLocation(`/admin/support/${ticket.id}/reply`)}
                            className="text-gray-500 hover:text-primary"
                            title="Reply to Ticket"
                          >
                            <Reply className="w-4 h-4" />
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
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No support tickets found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery 
                  ? `No tickets match your search for "${searchQuery}"` 
                  : statusFilter !== "all" || priorityFilter !== "all"
                    ? "No tickets match your current filters."
                    : "There are no support tickets in the system yet."}
              </p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}