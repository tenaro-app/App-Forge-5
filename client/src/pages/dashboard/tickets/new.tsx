import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  ArrowLeft,
  Send
} from "lucide-react";

// Schema for ticket creation
const ticketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["low", "medium", "high"]),
  projectId: z.string().optional(),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

export default function NewTicket() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch projects for dropdown
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
  });
  
  // Form setup
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: "",
      description: "",
      priority: "medium",
      projectId: "",
    },
  });
  
  // Create ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: async (data: TicketFormValues) => {
      try {
        const response = await apiRequest("POST", "/api/chat/tickets", data);
        return response;
      } catch (error) {
        console.error("Error creating ticket:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your support ticket has been created. Our team will respond shortly.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/chat/tickets"],
      });
      setLocation("/dashboard/tickets");
    },
    onError: (error: any) => {
      console.error("Ticket creation error:", error);
      toast({
        title: "Error",
        description: "Failed to create ticket. Our team has been notified of the issue.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: TicketFormValues) => {
    createTicketMutation.mutate(data);
  };
  
  if (isAuthLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    window.location.href = "/api/login";
    return null;
  }
  
  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-medium text-gray-900">
              Create New Support Ticket
            </h1>
            <button
              onClick={() => setLocation("/dashboard/tickets")}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Tickets
            </button>
          </div>
        </div>
      </header>
      
      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Ticket Information</h3>
            <p className="mt-1 text-sm text-gray-500">
              Please provide details about your issue so our support team can help you effectively.
            </p>
          </div>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject *
              </label>
              <input
                id="subject"
                {...form.register("subject")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Brief description of your issue"
              />
              {form.formState.errors.subject && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.subject.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority *
              </label>
              <select
                id="priority"
                {...form.register("priority")}
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="low">Low - General questions or minor issues</option>
                <option value="medium">Medium - Functionality issues affecting work</option>
                <option value="high">High - Critical problems requiring immediate attention</option>
              </select>
              {form.formState.errors.priority && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.priority.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">
                Related Project (Optional)
              </label>
              <select
                id="projectId"
                {...form.register("projectId")}
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="">-- Select a project --</option>
                {projects.map((project: any) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                {...form.register("description")}
                rows={5}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Please provide as much detail as possible about your issue"
              />
              {form.formState.errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setLocation("/dashboard/tickets")}
                className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createTicketMutation.isPending}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center"
              >
                {createTicketMutation.isPending ? "Submitting..." : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Ticket
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}