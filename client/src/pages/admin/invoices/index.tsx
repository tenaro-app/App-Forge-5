import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  Search,
  Plus,
  Download,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Building,
  Package,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  CircleDollarSign,
  Printer,
  Mail,
  Eye,
  Edit,
  Trash2,
  ChevronDown
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Filter options
const statusFilterOptions = [
  { label: "All Invoices", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Overdue", value: "overdue" },
  { label: "Cancelled", value: "cancelled" }
];

// Dummy invoice data (will be replaced with API data in production)
const dummyInvoices = [
  {
    id: "INV-001",
    clientId: "1",
    clientName: "Acme Corp",
    projectId: 1,
    projectName: "E-commerce Dashboard",
    amount: 4500,
    status: "paid",
    issueDate: new Date(2023, 5, 1), // June 1, 2023
    dueDate: new Date(2023, 5, 15), // June 15, 2023
    paidDate: new Date(2023, 5, 10), // June 10, 2023
    items: [
      { description: "Web Development - Phase 1", quantity: 1, unitPrice: 3500, total: 3500 },
      { description: "UI/UX Design", quantity: 1, unitPrice: 1000, total: 1000 }
    ]
  },
  {
    id: "INV-002",
    clientId: "2",
    clientName: "Beta Industries",
    projectId: 2,
    projectName: "CRM Integration",
    amount: 3200,
    status: "pending",
    issueDate: new Date(2023, 5, 10), // June 10, 2023
    dueDate: new Date(2023, 6, 10), // July 10, 2023
    paidDate: null,
    items: [
      { description: "API Integration Services", quantity: 1, unitPrice: 2500, total: 2500 },
      { description: "Custom API Development", quantity: 1, unitPrice: 700, total: 700 }
    ]
  },
  {
    id: "INV-003",
    clientId: "3",
    clientName: "Gamma Solutions",
    projectId: 3,
    projectName: "Inventory System",
    amount: 5800,
    status: "overdue",
    issueDate: new Date(2023, 4, 15), // May 15, 2023
    dueDate: new Date(2023, 5, 1), // June 1, 2023
    paidDate: null,
    items: [
      { description: "Backend Development", quantity: 1, unitPrice: 4200, total: 4200 },
      { description: "Database Configuration", quantity: 1, unitPrice: 800, total: 800 },
      { description: "Testing & QA", quantity: 1, unitPrice: 800, total: 800 }
    ]
  },
  {
    id: "INV-004",
    clientId: "4",
    clientName: "Delta Tech",
    projectId: 4,
    projectName: "HR Portal",
    amount: 2800,
    status: "draft",
    issueDate: new Date(2023, 5, 14), // June 14, 2023
    dueDate: new Date(2023, 6, 14), // July 14, 2023
    paidDate: null,
    items: [
      { description: "UI Development", quantity: 1, unitPrice: 1800, total: 1800 },
      { description: "Integration with HR System", quantity: 1, unitPrice: 1000, total: 1000 }
    ]
  },
  {
    id: "INV-005",
    clientId: "5",
    clientName: "Epsilon Systems",
    projectId: 5,
    projectName: "Content Management System",
    amount: 6500,
    status: "cancelled",
    issueDate: new Date(2023, 3, 5), // April 5, 2023
    dueDate: new Date(2023, 4, 5), // May 5, 2023
    paidDate: null,
    items: [
      { description: "CMS Development", quantity: 1, unitPrice: 4500, total: 4500 },
      { description: "Content Migration", quantity: 1, unitPrice: 1200, total: 1200 },
      { description: "Staff Training", quantity: 1, unitPrice: 800, total: 800 }
    ]
  }
];

export default function InvoiceManagement() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("issueDate");
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
  
  // Fetch all invoices
  const { 
    data: invoices, 
    isLoading: isInvoicesLoading 
  } = useQuery({
    queryKey: ["/api/admin/invoices"],
    enabled: isAuthenticated && isAdmin,
    // For development we're using dummy data
    initialData: dummyInvoices
  });
  
  // Filter invoices based on search query and status
  const filteredInvoices = invoices?.filter(invoice => {
    const matchesSearch = searchQuery === "" || 
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort invoices based on selected field and direction
  const sortedInvoices = filteredInvoices?.sort((a, b) => {
    let compareA, compareB;
    
    // Determine which field to sort by
    switch (sortField) {
      case "id":
        compareA = a.id;
        compareB = b.id;
        break;
      case "clientName":
        compareA = a.clientName;
        compareB = b.clientName;
        break;
      case "amount":
        compareA = a.amount;
        compareB = b.amount;
        break;
      case "status":
        compareA = a.status;
        compareB = b.status;
        break;
      case "issueDate":
        compareA = new Date(a.issueDate).getTime();
        compareB = new Date(b.issueDate).getTime();
        break;
      case "dueDate":
        compareA = new Date(a.dueDate).getTime();
        compareB = new Date(b.dueDate).getTime();
        break;
      default:
        compareA = new Date(a.issueDate).getTime();
        compareB = new Date(b.issueDate).getTime();
    }
    
    // Determine sort direction
    if (sortDirection === "asc") {
      return compareA > compareB ? 1 : -1;
    } else {
      return compareA < compareB ? 1 : -1;
    }
  });
  
  // Mark invoice as paid mutation
  const markAsPaidMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      const response = await apiRequest("PUT", `/api/admin/invoices/${invoiceId}/paid`, {
        paidDate: new Date()
      });
      if (!response.ok) {
        throw new Error(`Failed to mark invoice as paid: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/invoices"] });
      toast({
        title: "Invoice marked as paid",
        description: "The invoice status has been updated to paid.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update invoice",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Send invoice reminder mutation
  const sendReminderMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      const response = await apiRequest("POST", `/api/admin/invoices/${invoiceId}/reminder`);
      if (!response.ok) {
        throw new Error(`Failed to send reminder: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Reminder sent",
        description: "A payment reminder has been sent to the client.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to send reminder",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete invoice mutation
  const deleteInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/invoices/${invoiceId}`);
      if (!response.ok) {
        throw new Error(`Failed to delete invoice: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/invoices"] });
      toast({
        title: "Invoice deleted",
        description: "The invoice has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete invoice",
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
      setSortDirection(field === "issueDate" || field === "dueDate" ? "desc" : "asc");
    }
  };
  
  const handleMarkAsPaid = (invoiceId: string) => {
    if (window.confirm("Are you sure you want to mark this invoice as paid?")) {
      markAsPaidMutation.mutate(invoiceId);
    }
  };
  
  const handleSendReminder = (invoiceId: string) => {
    sendReminderMutation.mutate(invoiceId);
  };
  
  const handleDeleteInvoice = (invoiceId: string) => {
    if (window.confirm("Are you sure you want to delete this invoice? This action cannot be undone.")) {
      deleteInvoiceMutation.mutate(invoiceId);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Get status badge component
  const getStatusBadge = (status: string) => {
    let badgeClass = "";
    let icon = null;
    
    switch (status) {
      case "draft":
        badgeClass = "bg-gray-100 text-gray-800";
        icon = <FileText className="w-3 h-3 mr-1" />;
        break;
      case "pending":
        badgeClass = "bg-yellow-100 text-yellow-800";
        icon = <Clock className="w-3 h-3 mr-1" />;
        break;
      case "paid":
        badgeClass = "bg-green-100 text-green-800";
        icon = <CheckCircle className="w-3 h-3 mr-1" />;
        break;
      case "overdue":
        badgeClass = "bg-red-100 text-red-800";
        icon = <AlertCircle className="w-3 h-3 mr-1" />;
        break;
      case "cancelled":
        badgeClass = "bg-gray-100 text-gray-800";
        icon = <X className="w-3 h-3 mr-1" />;
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800";
    }
    
    return (
      <Badge variant="outline" className={`${badgeClass} flex items-center`}>
        {icon}
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };
  
  // Calculate total revenue
  const totalRevenue = filteredInvoices?.reduce((sum, invoice) => {
    if (invoice.status === "paid") {
      return sum + invoice.amount;
    }
    return sum;
  }, 0);
  
  // Calculate pending revenue
  const pendingRevenue = filteredInvoices?.reduce((sum, invoice) => {
    if (invoice.status === "pending") {
      return sum + invoice.amount;
    }
    return sum;
  }, 0);
  
  // Calculate overdue revenue
  const overdueRevenue = filteredInvoices?.reduce((sum, invoice) => {
    if (invoice.status === "overdue") {
      return sum + invoice.amount;
    }
    return sum;
  }, 0);
  
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
            <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
            <p className="mt-1 text-gray-600">
              Create, manage, and track client invoices
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={() => setLocation("/admin/invoices/new")} 
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </button>
          </div>
        </div>
        
        {/* Revenue Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 font-medium text-sm">Paid Revenue</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatCurrency(totalRevenue || 0)}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 font-medium text-sm">Pending Revenue</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatCurrency(pendingRevenue || 0)}
                </p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 font-medium text-sm">Overdue Revenue</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {formatCurrency(overdueRevenue || 0)}
                </p>
              </div>
              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
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
                placeholder="Search invoices..."
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
              
              <button 
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
        
        {/* Invoices Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Invoices ({sortedInvoices?.length || 0})
            </h3>
          </div>
          
          {isInvoicesLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : sortedInvoices && sortedInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("id")}
                    >
                      <div className="flex items-center">
                        Invoice
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("clientName")}
                    >
                      <div className="flex items-center">
                        Client
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("amount")}
                    >
                      <div className="flex items-center">
                        Amount
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("issueDate")}
                    >
                      <div className="flex items-center">
                        Issue Date
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSortChange("dueDate")}
                    >
                      <div className="flex items-center">
                        Due Date
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
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                        <div className="text-xs text-gray-500">{invoice.projectName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building className="h-4 w-4 text-primary" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{invoice.clientName}</div>
                            <div className="text-xs text-gray-500">ID: {invoice.clientId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(invoice.amount)}</div>
                        <div className="text-xs text-gray-500">{invoice.items.length} items</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(invoice.issueDate), 'MMM d, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                        </div>
                        {invoice.status === 'overdue' && (
                          <div className="text-xs text-red-500">
                            Overdue
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setLocation(`/admin/invoices/${invoice.id}`)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            
                            {(invoice.status === 'draft' || invoice.status === 'pending') && (
                              <DropdownMenuItem onClick={() => setLocation(`/admin/invoices/${invoice.id}/edit`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Invoice
                              </DropdownMenuItem>
                            )}
                            
                            {invoice.status === 'pending' && (
                              <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice.id)}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Paid
                              </DropdownMenuItem>
                            )}
                            
                            {(invoice.status === 'pending' || invoice.status === 'overdue') && (
                              <DropdownMenuItem onClick={() => handleSendReminder(invoice.id)}>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Reminder
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuItem onClick={() => window.open(`/api/admin/invoices/${invoice.id}/pdf`)}>
                              <Printer className="w-4 h-4 mr-2" />
                              Print / Download
                            </DropdownMenuItem>
                            
                            {invoice.status === 'draft' && (
                              <DropdownMenuItem onClick={() => handleDeleteInvoice(invoice.id)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Invoice
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center">
              <CircleDollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No invoices found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? `No invoices match your search for "${searchQuery}"` : 'There are no invoices in this category yet.'}
              </p>
              <button 
                onClick={() => setLocation("/admin/invoices/new")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}