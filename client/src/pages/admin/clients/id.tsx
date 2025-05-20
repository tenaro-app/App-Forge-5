import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CreditCard, 
  Edit, 
  FileText, 
  MailCheck, 
  MessageSquare, 
  Phone, 
  Smile, 
  User, 
  Users, 
  Building,
  Tag,
  Activity
} from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminClientDetail({ id }: { id: string }) {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isAdmin = useIsAdmin();

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || !isAdmin)) {
      setLocation('/admin-access');
    }
  }, [isAuthenticated, isAdmin, isAuthLoading, setLocation]);

  // Fetch client data
  const { data: client, isLoading: isClientLoading } = useQuery({
    queryKey: ['/api/clients', id],
    enabled: isAuthenticated && isAdmin,
    // For testing purpose, we're using placeholder data
    placeholderData: {
      id,
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@acmecorp.com",
      phone: "+1 (555) 123-4567",
      company: "Acme Corporation",
      status: "active",
      role: "client",
      createdAt: new Date(2023, 5, 15).toISOString(),
      updatedAt: new Date(2023, 11, 10).toISOString(),
    }
  });

  // Fetch client projects
  const { data: projects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ['/api/projects', { clientId: id }],
    enabled: isAuthenticated && isAdmin,
    // For testing purpose, we're using placeholder data
    placeholderData: [
      {
        id: "1",
        name: "E-commerce Platform",
        description: "A fully featured online store with payment processing and inventory management",
        status: "in-progress",
        startDate: new Date(2023, 6, 10).toISOString(),
        endDate: new Date(2023, 12, 25).toISOString(),
        budget: 15000,
        clientId: id,
      },
      {
        id: "2",
        name: "CRM Integration",
        description: "Custom CRM solution integrated with existing systems",
        status: "planning",
        startDate: new Date(2023, 11, 1).toISOString(),
        endDate: new Date(2024, 3, 30).toISOString(),
        budget: 8500,
        clientId: id,
      }
    ]
  });

  // Fetch client invoices
  const { data: invoices, isLoading: isInvoicesLoading } = useQuery({
    queryKey: ['/api/invoices', { clientId: id }],
    enabled: isAuthenticated && isAdmin,
    // For testing purpose, we're using placeholder data
    placeholderData: [
      {
        id: "INV-2023-001",
        amount: 5000,
        status: "paid",
        dueDate: new Date(2023, 7, 15).toISOString(),
        paidDate: new Date(2023, 7, 12).toISOString(),
        projectId: "1",
        description: "Initial payment for E-commerce Platform"
      },
      {
        id: "INV-2023-002",
        amount: 5000,
        status: "paid",
        dueDate: new Date(2023, 9, 15).toISOString(),
        paidDate: new Date(2023, 9, 14).toISOString(),
        projectId: "1",
        description: "Progress payment for E-commerce Platform"
      },
      {
        id: "INV-2023-003",
        amount: 5000,
        status: "pending",
        dueDate: new Date(2023, 11, 15).toISOString(),
        projectId: "1",
        description: "Final payment for E-commerce Platform"
      }
    ]
  });

  // Fetch client communication history
  const { data: communications, isLoading: isCommunicationsLoading } = useQuery({
    queryKey: ['/api/communications', { clientId: id }],
    enabled: isAuthenticated && isAdmin,
    // For testing purpose, we're using placeholder data
    placeholderData: [
      {
        id: "1",
        type: "email",
        subject: "Project Kickoff Meeting",
        date: new Date(2023, 6, 8).toISOString(),
        summary: "Initial project discussion and requirements gathering"
      },
      {
        id: "2",
        type: "call",
        subject: "Project Progress Update",
        date: new Date(2023, 8, 20).toISOString(),
        summary: "Discussed current progress and upcoming milestones"
      },
      {
        id: "3",
        type: "meeting",
        subject: "UI/UX Review Session",
        date: new Date(2023, 10, 5).toISOString(),
        summary: "Reviewed design mockups and collected feedback"
      }
    ]
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isAuthLoading || isClientLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
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
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLocation("/admin/clients")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Client Details</h1>
          <div className="ml-auto">
            <Button 
              onClick={() => setLocation(`/admin/clients/${id}/edit`)}
              className="flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Client
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Info Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Client Information</CardTitle>
                <Badge variant={client?.status === 'active' ? 'success' : 'secondary'}>
                  {client?.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${client?.firstName}+${client?.lastName}&background=dc2626&color=fff`} />
                  <AvatarFallback className="bg-primary text-white text-xl">
                    {client?.firstName?.[0]}{client?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{client?.firstName} {client?.lastName}</h2>
                <p className="text-gray-500">{client?.role}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-start">
                  <MailCheck className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{client?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{client?.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Building className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium">{client?.company || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Client Since</p>
                    <p className="font-medium">{formatDate(client?.createdAt || new Date().toISOString())}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{formatDate(client?.updatedAt || new Date().toISOString())}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Details Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="projects">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="communications">Communications</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="projects">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Projects</CardTitle>
                      <Button size="sm" variant="outline">
                        New Project
                      </Button>
                    </div>
                    <CardDescription>
                      Client has {projects?.length || 0} projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isProjectsLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                      </div>
                    ) : projects?.length ? (
                      <div className="space-y-4">
                        {projects.map((project) => (
                          <Card key={project.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{project.name}</CardTitle>
                                  <CardDescription className="mt-1">
                                    {project.description}
                                  </CardDescription>
                                </div>
                                <Badge className="capitalize">{project.status.replace('-', ' ')}</Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pb-3 pt-0">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Start Date</p>
                                  <p className="font-medium">{formatDate(project.startDate)}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">End Date</p>
                                  <p className="font-medium">{formatDate(project.endDate)}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Budget</p>
                                  <p className="font-medium">{formatCurrency(project.budget)}</p>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="bg-gray-50 border-t">
                              <Button variant="ghost" size="sm" className="ml-auto"
                                onClick={() => setLocation(`/admin/projects/${project.id}`)}>
                                View Project
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No projects found for this client
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="invoices">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Invoices & Payments</CardTitle>
                      <Button size="sm" variant="outline">
                        New Invoice
                      </Button>
                    </div>
                    <CardDescription>
                      {invoices?.filter(inv => inv.status === 'paid').length || 0} paid, {invoices?.filter(inv => inv.status === 'pending').length || 0} pending
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isInvoicesLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                      </div>
                    ) : invoices?.length ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left font-medium px-4 py-3">Invoice</th>
                              <th className="text-left font-medium px-4 py-3">Description</th>
                              <th className="text-left font-medium px-4 py-3">Due Date</th>
                              <th className="text-left font-medium px-4 py-3">Amount</th>
                              <th className="text-left font-medium px-4 py-3">Status</th>
                              <th className="text-right font-medium px-4 py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoices.map((invoice) => (
                              <tr key={invoice.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3">{invoice.id}</td>
                                <td className="px-4 py-3">{invoice.description}</td>
                                <td className="px-4 py-3">{formatDate(invoice.dueDate)}</td>
                                <td className="px-4 py-3 font-medium">{formatCurrency(invoice.amount)}</td>
                                <td className="px-4 py-3">
                                  <Badge 
                                    variant={invoice.status === 'paid' ? 'success' : 'outline'}
                                    className="capitalize"
                                  >
                                    {invoice.status}
                                    {invoice.status === 'paid' && invoice.paidDate && ` (${formatDate(invoice.paidDate)})`}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <Button variant="ghost" size="sm">View</Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No invoices found for this client
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="communications">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Communication History</CardTitle>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MailCheck className="w-4 h-4 mr-2" />
                          Send Email
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Start Chat
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isCommunicationsLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                      </div>
                    ) : communications?.length ? (
                      <div className="space-y-4">
                        {communications.map((comm) => (
                          <div key={comm.id} className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex-shrink-0 mt-1">
                              {comm.type === 'email' && <MailCheck className="w-8 h-8 text-blue-500" />}
                              {comm.type === 'call' && <Phone className="w-8 h-8 text-green-500" />}
                              {comm.type === 'meeting' && <Users className="w-8 h-8 text-purple-500" />}
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                <h3 className="font-medium">{comm.subject}</h3>
                                <span className="text-sm text-gray-500">{formatDate(comm.date)}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{comm.summary}</p>
                              <div className="mt-2">
                                <button className="text-sm text-primary hover:underline">View Details</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No communication history found
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notes">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Client Notes</CardTitle>
                      <Button size="sm" variant="outline">
                        Add Note
                      </Button>
                    </div>
                    <CardDescription>
                      Important information about the client
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      No notes have been added yet
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}