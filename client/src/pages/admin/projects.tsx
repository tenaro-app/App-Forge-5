import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Edit, 
  Eye, 
  Filter, 
  Plus, 
  Search, 
  Trash2,
  CalendarDays,
  Clock3,
  DollarSign,
  Users
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminProjects() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { isAdmin } = useIsAdmin();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState<"grid" | "table">("grid");

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

  // Fetch projects data
  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ["/api/admin/projects"],
    enabled: isAuthenticated && isAdmin,
    // For development, we're using dummy data
    placeholderData: [
      {
        id: 1,
        name: "E-commerce Platform",
        description: "Custom e-commerce solution with inventory management and payment processing",
        status: "in_progress",
        clientId: "123",
        clientName: "Jane Doe",
        clientEmail: "jane@example.com",
        startDate: new Date(2023, 6, 10).toISOString(),
        dueDate: new Date(2023, 12, 25).toISOString(),
        completedDate: null,
        budget: 15000,
        teamMembers: ["John Smith", "Sarah Davis"],
        progress: 60,
      },
      {
        id: 2,
        name: "CRM Integration",
        description: "Integration of custom CRM system with existing software stack",
        status: "planning",
        clientId: "125",
        clientName: "Alice Williams",
        clientEmail: "alice@bigcorp.com",
        startDate: new Date(2023, 11, 1).toISOString(),
        dueDate: new Date(2024, 3, 30).toISOString(),
        completedDate: null,
        budget: 8500,
        teamMembers: ["John Smith"],
        progress: 15,
      },
      {
        id: 3,
        name: "Mobile App Development",
        description: "Native mobile application for iOS and Android platforms",
        status: "in_progress",
        clientId: "124",
        clientName: "Bob Johnson",
        clientEmail: "bob@company.com",
        startDate: new Date(2023, 8, 15).toISOString(),
        dueDate: new Date(2024, 2, 28).toISOString(),
        completedDate: null,
        budget: 22000,
        teamMembers: ["Sarah Davis", "Mike Lee"],
        progress: 40,
      },
      {
        id: 4,
        name: "Website Redesign",
        description: "Complete overhaul of corporate website with new branding",
        status: "completed",
        clientId: "126",
        clientName: "Charlie Brown",
        clientEmail: "charlie@enterprise.com",
        startDate: new Date(2023, 5, 1).toISOString(),
        dueDate: new Date(2023, 8, 30).toISOString(),
        completedDate: new Date(2023, 8, 25).toISOString(),
        budget: 12000,
        teamMembers: ["Mike Lee", "John Smith"],
        progress: 100,
      },
      {
        id: 5,
        name: "Data Analytics Dashboard",
        description: "Custom analytics dashboard with real-time data visualization",
        status: "on_hold",
        clientId: "127",
        clientName: "David Green",
        clientEmail: "david@startup.co",
        startDate: new Date(2023, 7, 10).toISOString(),
        dueDate: new Date(2023, 10, 15).toISOString(),
        completedDate: null,
        budget: 9500,
        teamMembers: ["Sarah Davis"],
        progress: 35,
      },
      {
        id: 6,
        name: "Inventory Management System",
        description: "Automated inventory tracking and management system",
        status: "cancelled",
        clientId: "128",
        clientName: "Eva Black",
        clientEmail: "eva@retail.com",
        startDate: new Date(2023, 4, 1).toISOString(),
        dueDate: new Date(2023, 7, 30).toISOString(),
        completedDate: null,
        budget: 18000,
        teamMembers: ["John Smith", "Mike Lee"],
        progress: 20,
      }
    ]
  });

  // Create project mutation would go here in a real implementation

  // Delete project mutation would go here in a real implementation

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planning":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Planning
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="default" className="bg-amber-500">
            <Clock3 className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "on_hold":
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            On Hold
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status.replace('_', ' ')}
          </Badge>
        );
    }
  };

  // Filter projects
  const filteredProjects = projects?.filter(project => {
    const matchesSearch = searchQuery === "" || 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-gray-600 mt-1">
              Manage and track all client projects
            </p>
          </div>
          <Button onClick={() => setLocation("/admin/projects/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{projects?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">
                {projects?.filter(p => p.status === 'in_progress').length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {projects?.filter(p => p.status === 'completed').length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(projects?.reduce((sum, project) => sum + project.budget, 0) || 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search projects..."
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
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={view === "grid" ? "default" : "outline"} 
                size="sm"
                onClick={() => setView("grid")}
              >
                Grid
              </Button>
              <Button 
                variant={view === "table" ? "default" : "outline"} 
                size="sm"
                onClick={() => setView("table")}
              >
                Table
              </Button>
            </div>
          </div>
        </div>

        {isProjectsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : filteredProjects?.length ? (
          view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {project.description}
                        </CardDescription>
                      </div>
                      {getStatusBadge(project.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(project.clientName)}&background=dc2626&color=fff`} />
                          <AvatarFallback>{project.clientName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{project.clientName}</div>
                          <div className="text-xs text-gray-500">{project.clientEmail}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-1 text-gray-500" />
                          <span>Start: {formatDate(project.startDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-1 text-gray-500" />
                          <span>Due: {formatDate(project.dueDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{formatCurrency(project.budget)}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-500" />
                          <span>{project.teamMembers.length} team members</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Progress</span>
                          <span className="text-sm font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${project.progress}%`, 
                              backgroundColor: 
                                project.status === 'completed' ? '#22c55e' : 
                                project.status === 'on_hold' ? '#f97316' : 
                                project.status === 'cancelled' ? '#ef4444' : 
                                '#f59e0b'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLocation(`/admin/projects/${project.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLocation(`/admin/projects/${project.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          More
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setLocation(`/admin/projects/${project.id}/milestones`)}>
                          View Milestones
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLocation(`/admin/projects/${project.id}/invoices`)}>
                          View Invoices
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        <div>{project.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {project.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(project.clientName)}&background=dc2626&color=fff`} />
                            <AvatarFallback>{project.clientName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{project.clientName}</div>
                            <div className="text-xs text-gray-500">{project.clientEmail}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell>{formatDate(project.dueDate)}</TableCell>
                      <TableCell>{formatCurrency(project.budget)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full"
                              style={{ 
                                width: `${project.progress}%`, 
                                backgroundColor: 
                                  project.status === 'completed' ? '#22c55e' : 
                                  project.status === 'on_hold' ? '#f97316' : 
                                  project.status === 'cancelled' ? '#ef4444' : 
                                  '#f59e0b'
                              }}
                            ></div>
                          </div>
                          <span className="text-sm">{project.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setLocation(`/admin/projects/${project.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setLocation(`/admin/projects/${project.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              ...
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setLocation(`/admin/projects/${project.id}/milestones`)}>
                              View Milestones
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLocation(`/admin/projects/${project.id}/invoices`)}>
                              View Invoices
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Delete Project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        ) : (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No projects found</h3>
            <p className="mt-2 text-gray-500">No projects match your current filters.</p>
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
    </div>
  );
}