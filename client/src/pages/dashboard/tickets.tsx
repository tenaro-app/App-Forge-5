import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { 
  TicketIcon, 
  PlusCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Users,
  Filter
} from "lucide-react";

// Sample ticket data for demonstration
const SAMPLE_TICKETS = [
  {
    id: "TKT-1001",
    title: "API Integration Issue",
    description: "Having trouble with the third-party payment gateway integration",
    status: "open",
    priority: "high",
    created: "2023-08-15T10:30:00",
    updated: "2023-08-16T14:22:00",
    assignee: "John Developer",
    messages: 4
  },
  {
    id: "TKT-1002",
    title: "Mobile Responsiveness Bug",
    description: "Dashboard doesn't display correctly on iPhone devices",
    status: "in_progress",
    priority: "medium",
    created: "2023-08-12T09:15:00",
    updated: "2023-08-15T11:45:00",
    assignee: "Sarah Designer",
    messages: 6
  },
  {
    id: "TKT-1003",
    title: "Feature Request: Export to PDF",
    description: "Would like the ability to export reports to PDF format",
    status: "pending",
    priority: "low",
    created: "2023-08-10T15:20:00",
    updated: "2023-08-10T16:30:00",
    assignee: "Unassigned",
    messages: 2
  },
  {
    id: "TKT-1004",
    title: "Database Performance Issue",
    description: "Reports are loading very slowly during peak hours",
    status: "closed",
    priority: "high",
    created: "2023-08-05T11:10:00",
    updated: "2023-08-09T13:25:00",
    assignee: "Mike Database",
    messages: 8
  }
];

function getStatusBadge(status: string) {
  switch (status) {
    case "open":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Open
        </span>
      );
    case "in_progress":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          In Progress
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    case "closed":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Resolved
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Unknown
        </span>
      );
  }
}

function getPriorityBadge(priority: string) {
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
          Normal
        </span>
      );
  }
}

// Format date to a readable string
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export default function TicketsPage() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter tickets based on status and search query
  const filteredTickets = SAMPLE_TICKETS.filter(ticket => {
    // Apply status filter if selected
    if (filterStatus && ticket.status !== filterStatus) {
      return false;
    }
    
    // Apply search query if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        ticket.title.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query) ||
        ticket.id.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Support Tickets</h1>
            <div>
              <button
                onClick={() => setLocation("/dashboard")}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 mr-4"
              >
                Dashboard
              </button>
              <button
                onClick={() => alert("Coming soon: Create a new support ticket")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none"
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                New Ticket
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                Status:
              </label>
              <select
                id="status-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                value={filterStatus || ""}
                onChange={(e) => setFilterStatus(e.target.value === "" ? null : e.target.value)}
              >
                <option value="">All</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="pending">Pending</option>
                <option value="closed">Resolved</option>
              </select>
              <button
                onClick={() => {
                  setFilterStatus(null);
                  setSearchQuery("");
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Filter className="h-4 w-4 mr-1" />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <div className="flex items-start">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                          <span className="mr-2">{ticket.title}</span>
                          <span className="text-sm text-gray-500">({ticket.id})</span>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {ticket.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center space-x-2">
                      {getStatusBadge(ticket.status)}
                      {getPriorityBadge(ticket.priority)}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{ticket.assignee}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{ticket.messages} messages</span>
                      </div>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0">
                      <span>Updated {formatDate(ticket.updated)}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => alert(`Viewing ticket ${ticket.id}`)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary hover:text-primary/80 focus:outline-none"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                  <TicketIcon className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery || filterStatus
                    ? "Try adjusting your search or filter criteria."
                    : "You don't have any support tickets yet."}
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => alert("Coming soon: Create a new support ticket")}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none"
                  >
                    <PlusCircle className="w-4 h-4 mr-1.5" />
                    New Ticket
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}