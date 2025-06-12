import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Mail, 
  Phone, 
  Building, 
  Globe, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle,
  User,
  Filter,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { fadeIn } from "@/lib/animations";
import type { ConsultationLead } from "@shared/schema";

export default function AdminLeads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["/api/admin/consultation-leads"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/consultation-leads");
      return response.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await apiRequest("PUT", `/api/admin/consultation-leads/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/consultation-leads"] });
      toast({
        title: "Status Updated",
        description: "Lead status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredLeads = leads.filter((lead: ConsultationLead) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "contacted":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "scheduled":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Clock className="h-3 w-3" />;
      case "contacted":
        return <Mail className="h-3 w-3" />;
      case "scheduled":
        return <Calendar className="h-3 w-3" />;
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      case "closed":
        return <XCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const handleStatusChange = (leadId: number, newStatus: string) => {
    updateStatusMutation.mutate({ id: leadId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        variants={fadeIn("up", "tween", 0.1, 1)}
        initial="hidden"
        animate="show"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Consultation Leads</h1>
        <p className="text-gray-600">Manage incoming consultation requests and track their progress.</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        variants={fadeIn("up", "tween", 0.2, 1)}
        initial="hidden"
        animate="show"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search leads by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
        variants={fadeIn("up", "tween", 0.3, 1)}
        initial="hidden"
        animate="show"
      >
        {[
          { label: "Total Leads", value: leads.length, color: "text-blue-600" },
          { label: "New", value: leads.filter((l: ConsultationLead) => l.status === "new").length, color: "text-blue-600" },
          { label: "Contacted", value: leads.filter((l: ConsultationLead) => l.status === "contacted").length, color: "text-yellow-600" },
          { label: "Scheduled", value: leads.filter((l: ConsultationLead) => l.status === "scheduled").length, color: "text-purple-600" },
          { label: "Completed", value: leads.filter((l: ConsultationLead) => l.status === "completed").length, color: "text-green-600" },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Leads List */}
      <motion.div
        className="space-y-4"
        variants={fadeIn("up", "tween", 0.4, 1)}
        initial="hidden"
        animate="show"
      >
        {filteredLeads.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Consultation requests will appear here when submitted."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredLeads.map((lead: ConsultationLead, index: number) => (
            <Card key={lead.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{lead.name}</CardTitle>
                      <p className="text-sm text-gray-600">{lead.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(lead.status)} flex items-center space-x-1`}>
                      {getStatusIcon(lead.status)}
                      <span className="capitalize">{lead.status}</span>
                    </Badge>
                    <Select
                      value={lead.status}
                      onValueChange={(value) => handleStatusChange(lead.id, value)}
                      disabled={updateStatusMutation.isPending}
                    >
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{lead.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{lead.phone}</span>
                  </div>
                  {lead.website && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Globe className="h-4 w-4" />
                      <a 
                        href={lead.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {lead.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
                
                {lead.message && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Project Details:</p>
                        <p className="text-sm text-gray-700">{lead.message}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Submitted {new Date(lead.createdAt).toLocaleDateString()}</span>
                  </div>
                  {lead.updatedAt !== lead.createdAt && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Updated {new Date(lead.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </motion.div>
    </div>
  );
}