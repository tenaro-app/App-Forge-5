import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { MessageSquare, User, Calendar, CheckCircle, Clock, Filter, Search, Plus, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminSupport() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  // Fetch chat sessions
  const { data: chatSessions, isLoading: isSessionsLoading, refetch: refetchSessions } = useQuery({
    queryKey: ["/api/admin/chatsessions"],
    enabled: isAuthenticated && isAdmin,
    // For development, we're using dummy data
    placeholderData: [
      {
        id: 1,
        clientName: "Jane Doe",
        clientId: "123",
        clientEmail: "jane@example.com",
        projectId: 1,
        projectName: "E-commerce Platform",
        status: "active",
        lastMessage: "When will the next milestone be completed?",
        lastActivity: new Date(2023, 11, 15, 14, 30).toISOString(),
        unreadCount: 2,
        supportName: "John Smith",
      },
      {
        id: 2,
        clientName: "Bob Johnson",
        clientId: "124",
        clientEmail: "bob@company.com",
        projectId: 3,
        projectName: "Mobile App Development",
        status: "active",
        lastMessage: "I have some questions about the design.",
        lastActivity: new Date(2023, 11, 16, 9, 15).toISOString(),
        unreadCount: 0,
        supportName: "John Smith",
      },
      {
        id: 3,
        clientName: "Alice Williams",
        clientId: "125",
        clientEmail: "alice@bigcorp.com",
        projectId: 2,
        projectName: "CRM Integration",
        status: "closed",
        lastMessage: "Thanks for resolving my issues!",
        lastActivity: new Date(2023, 11, 10, 16, 45).toISOString(),
        unreadCount: 0,
        supportName: "Sarah Davis",
      }
    ]
  });

  // Fetch support tickets
  const { data: supportTickets, isLoading: isTicketsLoading, refetch: refetchTickets } = useQuery({
    queryKey: ["/api/admin/tickets"],
    enabled: isAuthenticated && isAdmin,
    // For development, we're using dummy data
    placeholderData: [
      {
        id: 1,
        subject: "Payment processing error",
        clientName: "Jane Doe",
        clientId: "123",
        clientEmail: "jane@example.com",
        projectId: 1,
        projectName: "E-commerce Platform",
        status: "open",
        priority: "high",
        createdAt: new Date(2023, 11, 14, 10, 30).toISOString(),
        assignedTo: "John Smith",
        lastResponse: new Date(2023, 11, 15, 9, 15).toISOString(),
      },
      {
        id: 2,
        subject: "Feature request: Export to PDF",
        clientName: "Bob Johnson",
        clientId: "124",
        clientEmail: "bob@company.com",
        projectId: 3,
        projectName: "Mobile App Development",
        status: "in-progress",
        priority: "medium",
        createdAt: new Date(2023, 11, 12, 15, 45).toISOString(),
        assignedTo: "Sarah Davis",
        lastResponse: new Date(2023, 11, 14, 11, 30).toISOString(),
      },
      {
        id: 3,
        subject: "Database connection issues",
        clientName: "Alice Williams",
        clientId: "125",
        clientEmail: "alice@bigcorp.com",
        projectId: 2,
        projectName: "CRM Integration",
        status: "resolved",
        priority: "high",
        createdAt: new Date(2023, 11, 8, 9, 20).toISOString(),
        assignedTo: "John Smith",
        lastResponse: new Date(2023, 11, 10, 16, 45).toISOString(),
        resolvedAt: new Date(2023, 11, 10, 16, 45).toISOString(),
      }
    ]
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy h:mm a");
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
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
    
    return formatDate(dateString);
  };

  if (isAuthLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect in useEffect
  }

  // Filter and search chat sessions
  const filteredChatSessions = chatSessions?.filter(session => {
    const matchesSearch = searchQuery === "" || 
      session.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || session.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Filter and search support tickets
  const filteredSupportTickets = supportTickets?.filter(ticket => {
    const matchesSearch = searchQuery === "" || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
                  <button 
                    onClick={() => setLocation("/admin-access")}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Admin Portal
                  </button>
                </div>
              </nav>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="text-white"
                onClick={() => setLocation("/dashboard")}
              >
                Exit Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Support Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage all client support interactions and tickets from this central dashboard.
          </p>
        </div>

        <Tabs defaultValue="chats">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
            <TabsList className="mb-4 sm:mb-0">
              <TabsTrigger value="chats">Live Chat Support</TabsTrigger>
              <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" onClick={() => {
                refetchSessions();
                refetchTickets();
              }}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="chats" className="mt-0">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium">Live Chat Sessions</h2>
                  <p className="text-sm text-gray-500">
                    {filteredChatSessions?.filter(s => s.status === 'active').length} active, 
                    {filteredChatSessions?.filter(s => s.status === 'closed').length} closed
                  </p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </div>

              {isSessionsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                </div>
              ) : filteredChatSessions?.length ? (
                <div className="grid gap-4">
                  {filteredChatSessions.map((session) => (
                    <Card key={session.id} className={session.unreadCount > 0 ? "border-l-4 border-l-primary" : ""}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(session.clientName)}&background=dc2626&color=fff`} />
                              <AvatarFallback>{session.clientName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg font-semibold">{session.clientName}</CardTitle>
                              <CardDescription>
                                Project: {session.projectName}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                            {session.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            <span className="font-medium">Last message:</span> {session.lastMessage}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{getTimeAgo(session.lastActivity)}</span>
                            {session.supportName && (
                              <>
                                <span className="mx-2">•</span>
                                <User className="h-3 w-3 mr-1" />
                                <span>Assigned to: {session.supportName}</span>
                              </>
                            )}
                            {session.unreadCount > 0 && (
                              <>
                                <span className="mx-2">•</span>
                                <Badge variant="destructive" className="text-xs">
                                  {session.unreadCount} unread
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="ml-auto"
                          onClick={() => setLocation(`/admin/support/chat/${session.id}`)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {session.status === 'active' ? 'Continue Chat' : 'View Chat'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No chat sessions found</h3>
                  <p className="mt-2 text-gray-500">No chat sessions match your current filters.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="mt-0">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium">Support Tickets</h2>
                  <p className="text-sm text-gray-500">
                    {filteredSupportTickets?.filter(t => t.status === 'open').length} open, 
                    {filteredSupportTickets?.filter(t => t.status === 'in-progress').length} in progress, 
                    {filteredSupportTickets?.filter(t => t.status === 'resolved').length} resolved
                  </p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Ticket
                </Button>
              </div>

              {isTicketsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                </div>
              ) : filteredSupportTickets?.length ? (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ticket
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigned To
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSupportTickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              #{ticket.id}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                              {ticket.subject}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <Avatar>
                                  <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(ticket.clientName)}&background=dc2626&color=fff`} />
                                  <AvatarFallback>{ticket.clientName.charAt(0)}</AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {ticket.clientName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {ticket.clientEmail}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(ticket.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              variant={
                                ticket.status === 'open' ? 'default' :
                                ticket.status === 'in-progress' ? 'warning' :
                                ticket.status === 'resolved' ? 'success' : 'secondary'
                              }
                              className="text-xs capitalize"
                            >
                              {ticket.status.replace('-', ' ')}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span 
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                                ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}
                            >
                              {ticket.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {ticket.assignedTo || 'Unassigned'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setLocation(`/admin/support/ticket/${ticket.id}`)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No support tickets found</h3>
                  <p className="mt-2 text-gray-500">No support tickets match your current filters.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}