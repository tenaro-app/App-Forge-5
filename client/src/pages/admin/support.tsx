import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Clock, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  User, 
  RefreshCw,
  Filter,
  ChevronDown,
  Phone,
  Mail,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminSupport() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("tickets");

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

  // Fetch support tickets
  const { data: tickets, isLoading: isTicketsLoading } = useQuery({
    queryKey: ["/api/admin/support/tickets"],
    enabled: isAuthenticated && isAdmin && activeTab === "tickets",
    // For development, use dummy data
    placeholderData: [
      {
        id: 1,
        clientId: "123",
        clientName: "Jane Doe",
        clientEmail: "jane@example.com",
        subject: "Need help with dashboard configuration",
        message: "I'm trying to configure my dashboard but can't find the widget settings. Can you help?",
        status: "new",
        priority: "medium",
        assignedTo: null,
        createdAt: new Date(2023, 11, 28, 9, 30).toISOString(),
        updatedAt: new Date(2023, 11, 28, 9, 30).toISOString(),
        lastRepliedAt: null,
        projectId: 1,
        projectName: "E-commerce Platform"
      },
      {
        id: 2,
        clientId: "124",
        clientName: "Bob Johnson",
        clientEmail: "bob@company.com",
        subject: "Payment processing error",
        message: "We're getting an error when trying to process payments through the new integration. The error message says: 'Invalid API credentials'.",
        status: "in_progress",
        priority: "high",
        assignedTo: "3",
        createdAt: new Date(2023, 11, 27, 14, 15).toISOString(),
        updatedAt: new Date(2023, 11, 28, 10, 45).toISOString(),
        lastRepliedAt: new Date(2023, 11, 28, 10, 45).toISOString(),
        projectId: 3,
        projectName: "Mobile App Development"
      },
      {
        id: 3,
        clientId: "125",
        clientName: "Alice Williams",
        clientEmail: "alice@bigcorp.com",
        subject: "Feature request - Export to PDF",
        message: "We'd like to have the ability to export reports as PDF files. Is this something that can be added to our dashboard?",
        status: "completed",
        priority: "low",
        assignedTo: "2",
        createdAt: new Date(2023, 11, 25, 11, 20).toISOString(),
        updatedAt: new Date(2023, 11, 27, 16, 30).toISOString(),
        lastRepliedAt: new Date(2023, 11, 27, 16, 30).toISOString(),
        projectId: 2,
        projectName: "CRM Integration"
      },
      {
        id: 4,
        clientId: "127",
        clientName: "David Green",
        clientEmail: "david@startup.co",
        subject: "Can't access analytics tab",
        message: "When I try to access the analytics section, I get an error message saying 'Access denied'. I should have permission to view this data.",
        status: "new",
        priority: "high",
        assignedTo: null,
        createdAt: new Date(2023, 11, 28, 8, 10).toISOString(),
        updatedAt: new Date(2023, 11, 28, 8, 10).toISOString(),
        lastRepliedAt: null,
        projectId: 5,
        projectName: "Data Analytics Dashboard"
      },
      {
        id: 5,
        clientId: "126",
        clientName: "Charlie Brown",
        clientEmail: "charlie@enterprise.com",
        subject: "Feedback on new design",
        message: "Just wanted to say that the new design looks great! The navigation is much more intuitive now. One small suggestion: could the font size be increased slightly for better readability?",
        status: "in_progress",
        priority: "medium",
        assignedTo: "4",
        createdAt: new Date(2023, 11, 26, 15, 45).toISOString(),
        updatedAt: new Date(2023, 11, 28, 9, 50).toISOString(),
        lastRepliedAt: new Date(2023, 11, 27, 11, 30).toISOString(),
        projectId: 4,
        projectName: "Website Redesign"
      }
    ]
  });

  // Fetch chat sessions
  const { data: chatSessions, isLoading: isChatSessionsLoading } = useQuery({
    queryKey: ["/api/admin/support/chat-sessions"],
    enabled: isAuthenticated && isAdmin && activeTab === "chats",
    // For development, use dummy data
    placeholderData: [
      {
        id: 1,
        clientId: "123",
        clientName: "Jane Doe",
        clientEmail: "jane@example.com",
        status: "active",
        assignedTo: "2",
        assigneeName: "Sarah Davis",
        lastMessageAt: new Date(2023, 11, 28, 11, 15).toISOString(),
        createdAt: new Date(2023, 11, 28, 10, 30).toISOString(),
        unreadMessages: 2,
        projectId: 1,
        projectName: "E-commerce Platform"
      },
      {
        id: 2,
        clientId: "125",
        clientName: "Alice Williams",
        clientEmail: "alice@bigcorp.com",
        status: "active",
        assignedTo: "3",
        assigneeName: "Mike Lee",
        lastMessageAt: new Date(2023, 11, 28, 9, 45).toISOString(),
        createdAt: new Date(2023, 11, 27, 14, 20).toISOString(),
        unreadMessages: 0,
        projectId: 2,
        projectName: "CRM Integration"
      },
      {
        id: 3,
        clientId: "126",
        clientName: "Charlie Brown",
        clientEmail: "charlie@enterprise.com",
        status: "idle",
        assignedTo: "4",
        assigneeName: "Lisa Chen",
        lastMessageAt: new Date(2023, 11, 27, 16, 50).toISOString(),
        createdAt: new Date(2023, 11, 27, 11, 15).toISOString(),
        unreadMessages: 0,
        projectId: 4,
        projectName: "Website Redesign"
      },
      {
        id: 4,
        clientId: "124",
        clientName: "Bob Johnson",
        clientEmail: "bob@company.com",
        status: "closed",
        assignedTo: "2",
        assigneeName: "Sarah Davis",
        lastMessageAt: new Date(2023, 11, 26, 15, 30).toISOString(),
        createdAt: new Date(2023, 11, 26, 10, 45).toISOString(),
        unreadMessages: 0,
        projectId: 3,
        projectName: "Mobile App Development"
      }
    ]
  });

  // Format date function
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
  };

  // Format time ago function
  const formatTimeAgo = (dateString: string) => {
    const date = parseISO(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800">Low</Badge>;
      case 'medium':
        return <Badge className="bg-blue-100 text-blue-800">Medium</Badge>;
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{priority}</Badge>;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">New</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">In Progress</Badge>;
      case 'on_hold':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">On Hold</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'idle':
        return <Badge className="bg-amber-100 text-amber-800">Idle</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filter tickets
  const filteredTickets = tickets?.filter(ticket => {
    const matchesSearch = searchQuery === "" || 
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesAssignment = assignmentFilter === "all" || 
      (assignmentFilter === "assigned" && ticket.assignedTo) ||
      (assignmentFilter === "unassigned" && !ticket.assignedTo);
    
    return matchesSearch && matchesStatus && matchesAssignment;
  });

  // Filter chat sessions
  const filteredChatSessions = chatSessions?.filter(session => {
    const matchesSearch = searchQuery === "" || 
      session.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || session.status === statusFilter;
    const matchesAssignment = assignmentFilter === "all" || 
      (assignmentFilter === "assigned" && session.assignedTo) ||
      (assignmentFilter === "unassigned" && !session.assignedTo);
    
    return matchesSearch && matchesStatus && matchesAssignment;
  });

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
            Manage support tickets and live chat sessions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tickets?.filter(t => t.status !== 'completed').length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Unassigned Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {tickets?.filter(t => !t.assignedTo).length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Chats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {chatSessions?.filter(c => c.status === 'active').length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {tickets?.filter(t => t.priority === 'high' && t.status !== 'completed').length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs 
          defaultValue="tickets" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="bg-white border">
            <TabsTrigger value="tickets" className="data-[state=active]:bg-gray-50">
              <AlertCircle className="h-4 w-4 mr-2" />
              Support Tickets
            </TabsTrigger>
            <TabsTrigger value="chats" className="data-[state=active]:bg-gray-50">
              <MessageSquare className="h-4 w-4 mr-2" />
              Live Chat Sessions
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-white rounded-lg border p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder={`Search ${activeTab === 'tickets' ? 'tickets' : 'chats'}...`}
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status filter" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {activeTab === 'tickets' ? (
                    <>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="idle">Idle</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Assignment" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="tickets" className="space-y-4 mt-4">
            {isTicketsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : filteredTickets?.length ? (
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredTickets.map(ticket => (
                        <tr key={ticket.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(ticket.clientName)}&background=dc2626&color=fff`} />
                                <AvatarFallback>{ticket.clientName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-900">{ticket.clientName}</div>
                                <div className="text-xs text-gray-500">{ticket.clientEmail}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900 max-w-xs truncate">{ticket.subject}</div>
                            <div className="text-xs text-gray-500 max-w-xs truncate">{ticket.message}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {getStatusBadge(ticket.status)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {getPriorityBadge(ticket.priority)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{ticket.projectName}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatTimeAgo(ticket.createdAt)}</div>
                            <div className="text-xs text-gray-500">{format(parseISO(ticket.createdAt), 'MMM d, h:mm a')}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {ticket.assignedTo ? (
                              <div className="text-sm text-gray-900">Team Member {ticket.assignedTo}</div>
                            ) : (
                              <div className="text-sm text-gray-500">Unassigned</div>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                toast({
                                  title: "Viewing ticket details",
                                  description: `Now viewing ticket #${ticket.id}`
                                });
                              }}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-gray-50">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <AlertCircle className="h-12 w-12" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No tickets found</h3>
                <p className="mt-2 text-gray-500">
                  No support tickets match your current filters.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setAssignmentFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="chats" className="space-y-4 mt-4">
            {isChatSessionsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : filteredChatSessions?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChatSessions.map(session => (
                  <Card key={session.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(session.clientName)}&background=dc2626&color=fff`} />
                            <AvatarFallback>{session.clientName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-lg">{session.clientName}</CardTitle>
                        </div>
                        {getStatusBadge(session.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="text-gray-500 flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {session.clientEmail}
                        </div>
                        <div className="text-gray-500 flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2 text-gray-400" />
                          Project: {session.projectName}
                        </div>
                        <div className="border-t border-gray-100 pt-2 mt-2">
                          <div className="text-gray-500 flex justify-between">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-400" />
                              Started: {formatTimeAgo(session.createdAt)}
                            </span>
                            <span>
                              {session.unreadMessages > 0 && (
                                <span className="px-2 py-1 text-xs font-medium leading-none bg-primary text-white rounded-full">
                                  {session.unreadMessages} new
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="text-gray-500 flex items-center mt-1">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            Last activity: {formatTimeAgo(session.lastMessageAt)}
                          </div>
                        </div>
                        <div className="text-gray-500 flex items-center pt-1">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          Assigned: {session.assigneeName || "Unassigned"}
                        </div>
                      </div>
                    </CardContent>
                    <div className="px-6 pb-4">
                      <Button
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: "Opening chat session",
                            description: `Now viewing chat with ${session.clientName}`
                          });
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {session.status === 'active' ? 'Join Chat' : 'View History'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-gray-50">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <MessageSquare className="h-12 w-12" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No chat sessions found</h3>
                <p className="mt-2 text-gray-500">
                  No chat sessions match your current filters.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setAssignmentFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}