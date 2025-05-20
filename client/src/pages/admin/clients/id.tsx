import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useQuery } from "@tanstack/react-query";
import { 
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  FileText,
  Package,
  Clock,
  ArrowLeft,
  Edit,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Briefcase,
  CreditCard
} from "lucide-react";
import { format } from "date-fns";

type ClientDetailProps = {
  id: string;
};

export default function ClientDetail({ id }: ClientDetailProps) {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  
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
  
  // Fetch client details
  const { 
    data: client, 
    isLoading: isClientLoading 
  } = useQuery({
    queryKey: [`/api/admin/clients/${id}`],
    enabled: isAuthenticated && isAdmin && !!id,
    // For development we're using dummy data
    initialData: {
      id,
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
      notes: "Enterprise client with multiple automation projects",
      address: "123 Business Ave, Suite 400, San Francisco, CA 94107",
      website: "https://www.acmecorp.com",
      industry: "Technology",
      contactPreference: "Email",
    }
  });
  
  // Fetch client projects
  const { 
    data: projects, 
    isLoading: isProjectsLoading 
  } = useQuery({
    queryKey: [`/api/admin/clients/${id}/projects`],
    enabled: isAuthenticated && isAdmin && !!id,
    // For development we're using dummy data
    initialData: [
      {
        id: 1,
        name: "E-commerce Dashboard",
        description: "Custom analytics dashboard for tracking sales performance across multiple platforms",
        status: "in_progress",
        startDate: new Date(2023, 1, 15), // February 15, 2023
        dueDate: new Date(2023, 7, 30), // August 30, 2023
        progress: 65,
        budget: 18000,
        spent: 11700
      },
      {
        id: 2,
        name: "Inventory Management System",
        description: "Automated inventory tracking and reordering system with warehouse integration",
        status: "in_progress",
        startDate: new Date(2023, 3, 10), // April 10, 2023
        dueDate: new Date(2023, 9, 15), // October 15, 2023
        progress: 40,
        budget: 25000,
        spent: 10000
      },
      {
        id: 3,
        name: "Customer Service Portal",
        description: "Self-service portal for customers to track orders and submit support tickets",
        status: "completed",
        startDate: new Date(2023, 0, 5), // January 5, 2023
        dueDate: new Date(2023, 3, 30), // April 30, 2023
        progress: 100,
        budget: 12000,
        spent: 12000
      }
    ]
  });
  
  // Fetch client invoices
  const { 
    data: invoices, 
    isLoading: isInvoicesLoading 
  } = useQuery({
    queryKey: [`/api/admin/clients/${id}/invoices`],
    enabled: isAuthenticated && isAdmin && !!id,
    // For development we're using dummy data
    initialData: [
      {
        id: "INV-2023-001",
        date: new Date(2023, 0, 31), // January 31, 2023
        dueDate: new Date(2023, 1, 15), // February 15, 2023
        amount: 5000,
        status: "paid",
        project: "Customer Service Portal",
        paidDate: new Date(2023, 1, 14) // February 14, 2023
      },
      {
        id: "INV-2023-002",
        date: new Date(2023, 2, 31), // March 31, 2023
        dueDate: new Date(2023, 3, 15), // April 15, 2023
        amount: 7000,
        status: "paid",
        project: "Customer Service Portal & E-commerce Dashboard",
        paidDate: new Date(2023, 3, 10) // April 10, 2023
      },
      {
        id: "INV-2023-003",
        date: new Date(2023, 4, 31), // May 31, 2023
        dueDate: new Date(2023, 5, 15), // June 15, 2023
        amount: 8500,
        status: "pending",
        project: "E-commerce Dashboard & Inventory Management System"
      }
    ]
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
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button 
                onClick={() => setLocation("/admin")}
                className="hover:text-primary"
              >
                Dashboard
              </button>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1" />
              <button 
                onClick={() => setLocation("/admin/clients")}
                className="hover:text-primary"
              >
                Clients
              </button>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-gray-900 font-medium">
                {isClientLoading ? "Loading..." : `${client.firstName} ${client.lastName}`}
              </span>
            </li>
          </ol>
        </nav>
        
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => setLocation("/admin/clients")}
              className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
              title="Back to Clients"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isClientLoading ? "Loading..." : `${client.firstName} ${client.lastName}`}
              </h1>
              <p className="mt-1 text-gray-600 flex items-center">
                <Building className="h-4 w-4 mr-1 text-gray-400" />
                {client?.company} 
                <span className="mx-2">•</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  client?.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {client?.status === "active" ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Inactive
                    </>
                  )}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setLocation(`/admin/clients/${id}/edit`)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Client
            </button>
          </div>
        </div>
        
        {/* Client Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Client Information */}
          <div className="bg-white shadow rounded-lg overflow-hidden md:col-span-2">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Client Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{client?.email}</p>
                        <p className="text-xs text-gray-500">Email</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{client?.phone}</p>
                        <p className="text-xs text-gray-500">Phone</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Building className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{client?.address}</p>
                        <p className="text-xs text-gray-500">Address</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <FileText className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{client?.website}</p>
                        <p className="text-xs text-gray-500">Website</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Company Information</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Briefcase className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{client?.position}</p>
                        <p className="text-xs text-gray-500">Position</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Package className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{client?.industry}</p>
                        <p className="text-xs text-gray-500">Industry</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {client?.joinDate ? format(new Date(client.joinDate), 'MMMM d, yyyy') : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">Client since</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CreditCard className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{client?.billingType}</p>
                        <p className="text-xs text-gray-500">Billing type</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Notes</h4>
                <p className="text-sm text-gray-700 whitespace-pre-line">{client?.notes || 'No notes available.'}</p>
              </div>
            </div>
          </div>
          
          {/* Client Activity */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-500">Projects</h4>
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {projects?.length || 0}
                    </span>
                  </div>
                  <button 
                    onClick={() => setLocation(`/admin/clients/${id}/projects`)} 
                    className="mt-2 w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View all projects
                  </button>
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-500">Recent activity</h4>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-700">
                        Last active on {client?.lastActivity ? format(new Date(client.lastActivity), 'MMMM d, yyyy') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-500">Invoices</h4>
                    <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {invoices?.length || 0}
                    </span>
                  </div>
                  <button 
                    onClick={() => setLocation(`/admin/clients/${id}/invoices`)} 
                    className="mt-2 w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View all invoices
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Projects */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Projects ({projects?.length || 0})</h3>
            <button 
              onClick={() => setLocation(`/admin/projects/new?client=${id}`)}
              className="text-sm text-primary font-medium hover:text-primary/80"
            >
              + Add new project
            </button>
          </div>
          
          {isProjectsLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timeline
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{project.name}</div>
                            <div className="text-sm text-gray-500 max-w-md truncate">{project.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.status === "completed" 
                            ? "bg-green-100 text-green-800" 
                            : project.status === "in_progress" 
                              ? "bg-blue-100 text-blue-800"
                              : project.status === "on_hold"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                        }`}>
                          {project.status === "in_progress" ? "In Progress" : 
                           project.status === "completed" ? "Completed" :
                           project.status === "on_hold" ? "On Hold" : "Cancelled"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          {project.startDate ? format(new Date(project.startDate), 'MMM d, yyyy') : 'N/A'} – 
                          {project.dueDate ? format(new Date(project.dueDate), 'MMM d, yyyy') : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{project.progress}% complete</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${project.budget.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">${project.spent.toLocaleString()} spent</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => setLocation(`/admin/projects/${project.id}`)}
                          className="text-primary hover:text-primary/80"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">No projects found for this client.</p>
              <button 
                onClick={() => setLocation(`/admin/projects/new?client=${id}`)}
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none"
              >
                Create a new project
              </button>
            </div>
          )}
        </div>
        
        {/* Invoices */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Invoices ({invoices?.length || 0})</h3>
            <button 
              onClick={() => setLocation(`/admin/invoices/new?client=${id}`)}
              className="text-sm text-primary font-medium hover:text-primary/80"
            >
              + Create invoice
            </button>
          </div>
          
          {isInvoicesLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : invoices && invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Issued: {invoice.date ? format(new Date(invoice.date), 'MMM d, yyyy') : 'N/A'}</div>
                        <div>Due: {invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM d, yyyy') : 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${invoice.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === "paid" 
                            ? "bg-green-100 text-green-800" 
                            : invoice.status === "pending" 
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}>
                          {invoice.status === "paid" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Paid
                            </>
                          ) : invoice.status === "pending" ? (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Overdue
                            </>
                          )}
                        </span>
                        {invoice.paidDate && (
                          <div className="text-xs text-gray-500 mt-1">
                            Paid on {format(new Date(invoice.paidDate), 'MMM d, yyyy')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.project}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => setLocation(`/admin/invoices/${invoice.id}`)}
                          className="text-primary hover:text-primary/80"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">No invoices found for this client.</p>
              <button 
                onClick={() => setLocation(`/admin/invoices/new?client=${id}`)}
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none"
              >
                Create a new invoice
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}