import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { 
  Plus,
  Search,
  Filter,
  MessageSquare,
  AlertCircle,
  Clock,
  CheckCircle,
  SortAsc,
  ArrowDownUp
} from "lucide-react";
import { format } from "date-fns";

export default function TicketsOverview() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, open, closed
  const [sortBy, setSortBy] = useState("date"); // date, priority, status
  const [sortDir, setSortDir] = useState("desc"); // asc, desc
  
  // Fetch tickets
  const { data: tickets = [], isLoading: isTicketsLoading } = useQuery<any[]>({
    queryKey: ["/api/chat/tickets"],
    enabled: isAuthenticated,
  });
  
  // Filter and sort tickets
  const filteredTickets = [...tickets]
    .filter((ticket: any) => {
      // Apply search
      if (searchTerm && !ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply status filter
      if (filter === "open" && ticket.status === "closed") return false;
      if (filter === "closed" && ticket.status !== "closed") return false;
      
      return true;
    })
    .sort((a: any, b: any) => {
      // Apply sorting
      if (sortBy === "date") {
        return sortDir === "asc" 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      
      if (sortBy === "priority") {
        const priorityValue = { low: 0, medium: 1, high: 2 };
        return sortDir === "asc"
          ? priorityValue[a.priority as keyof typeof priorityValue] - priorityValue[b.priority as keyof typeof priorityValue]
          : priorityValue[b.priority as keyof typeof priorityValue] - priorityValue[a.priority as keyof typeof priorityValue];
      }
      
      if (sortBy === "status") {
        return sortDir === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      
      return 0;
    });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" /> New
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" /> In Progress
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" /> Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
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
            Unknown
          </span>
        );
    }
  };
  
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("desc");
    }
  };
  
  if (isAuthLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    window.location.href = "/api/login";
    return null;
  }
  
  // Mock data for development until backend is implemented
  const mockTickets = [
    {
      id: 1,
      subject: "Error in dashboard analytics module",
      description: "I'm seeing incorrect data in the analytics dashboard. Numbers don't match our internal reporting.",
      status: "new",
      priority: "high",
      createdAt: new Date(2023, 4, 15).toISOString(),
      updatedAt: new Date(2023, 4, 15).toISOString(),
      messages: 3,
      projectName: "E-commerce Dashboard"
    },
    {
      id: 2,
      subject: "Feature request: Export to PDF",
      description: "We need to be able to export reports as PDF files for our weekly meetings.",
      status: "in_progress",
      priority: "medium",
      createdAt: new Date(2023, 4, 10).toISOString(),
      updatedAt: new Date(2023, 4, 14).toISOString(),
      messages: 5,
      projectName: "Analytics Portal"
    },
    {
      id: 3,
      subject: "Login issues from mobile app",
      description: "Several of our team members are having trouble logging in from the mobile app but desktop works fine.",
      status: "closed",
      priority: "high",
      createdAt: new Date(2023, 4, 5).toISOString(),
      updatedAt: new Date(2023, 4, 8).toISOString(),
      messages: 8,
      projectName: "Mobile Application"
    },
    {
      id: 4,
      subject: "Question about API usage limits",
      description: "I'm wondering if there are any limits to how many API calls we can make each day?",
      status: "in_progress",
      priority: "low",
      createdAt: new Date(2023, 4, 12).toISOString(),
      updatedAt: new Date(2023, 4, 12).toISOString(),
      messages: 2,
      projectName: "API Integration"
    }
  ];
  
  // Use mock data for development or actual data in production
  const displayTickets = tickets.length > 0 ? filteredTickets : mockTickets;
  
  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-medium text-gray-900">
              Support Tickets
            </h1>
            <button
              onClick={() => setLocation("/dashboard/tickets/new")}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Plus className="w-4 h-4 mr-1" />
              Create New Ticket
            </button>
          </div>
        </div>
      </header>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-4">
          {/* Filter and Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="w-full sm:w-auto flex space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full sm:w-auto pr-8 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="all">All Tickets</option>
                <option value="open">Open Tickets</option>
                <option value="closed">Resolved Tickets</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Sort by:</span>
              <button 
                onClick={() => toggleSort("date")}
                className={`flex items-center px-2 py-1 rounded-md text-sm ${
                  sortBy === "date" ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                Date
                {sortBy === "date" && (
                  <ArrowDownUp className={`h-3 w-3 ml-1 ${sortDir === "asc" ? "transform rotate-180" : ""}`} />
                )}
              </button>
              <button 
                onClick={() => toggleSort("priority")}
                className={`flex items-center px-2 py-1 rounded-md text-sm ${
                  sortBy === "priority" ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                Priority
                {sortBy === "priority" && (
                  <ArrowDownUp className={`h-3 w-3 ml-1 ${sortDir === "asc" ? "transform rotate-180" : ""}`} />
                )}
              </button>
              <button 
                onClick={() => toggleSort("status")}
                className={`flex items-center px-2 py-1 rounded-md text-sm ${
                  sortBy === "status" ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                Status
                {sortBy === "status" && (
                  <ArrowDownUp className={`h-3 w-3 ml-1 ${sortDir === "asc" ? "transform rotate-180" : ""}`} />
                )}
              </button>
            </div>
          </div>
          
          {/* Tickets List */}
          {isTicketsLoading ? (
            <div className="bg-white shadow overflow-hidden rounded-md p-4 text-center">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 mx-auto"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
              </div>
            </div>
          ) : displayTickets.length === 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No tickets found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filter !== "all" 
                  ? "Try changing your search or filter settings"
                  : "You don't have any support tickets yet"}
              </p>
              <button
                onClick={() => setLocation("/dashboard/tickets/new")}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create Your First Ticket
              </button>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {displayTickets.map((ticket: any) => (
                  <li key={ticket.id}>
                    <div 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setLocation(`/dashboard/tickets/${ticket.id}`)}
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 mr-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <MessageSquare className="h-5 w-5 text-primary" />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-primary truncate">
                                {ticket.subject}
                              </p>
                              <div className="mt-1 flex items-center">
                                <p className="text-xs text-gray-500 truncate">
                                  <span className="font-medium">Project:</span> {ticket.projectName || "General Support"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            {getStatusBadge(ticket.status)}
                            <div className="mt-1">
                              {getPriorityBadge(ticket.priority)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <p>
                              Created on <time dateTime={ticket.createdAt}>{format(new Date(ticket.createdAt), 'MMM d, yyyy')}</time>
                            </p>
                          </div>
                          <div className="mt-2 sm:mt-0 flex items-center text-sm text-gray-500">
                            <MessageSquare className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <p>{ticket.messages || 0} messages</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}