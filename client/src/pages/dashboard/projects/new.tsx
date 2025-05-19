import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  ArrowLeft, 
  CalendarIcon,
  CheckCircle,
  Loader2
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

// Form validation schema
const projectSchema = z.object({
  name: z.string().min(3, { message: "Project name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  startDate: z.date().optional(),
  requirements: z.string().min(20, { message: "Requirements must be at least 20 characters" })
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function NewProject() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [isAuthLoading, isAuthenticated]);
  
  // Initialize form with defaultValues
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      requirements: "",
      startDate: new Date(),
    },
  });
  
  // Create new project request mutation
  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormValues) => {
      const response = await apiRequest("POST", "/api/projects", data);
      if (!response.ok) {
        throw new Error("Failed to create project request");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setSubmitted(true);
      toast({
        title: "Project request submitted",
        description: "We'll review your request and get back to you soon.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to submit project request",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: ProjectFormValues) => {
    createProjectMutation.mutate(data);
  };
  
  if (isAuthLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  if (submitted) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button 
                onClick={() => setLocation("/dashboard")}
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Request Submitted</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your project request. Our team will review it and get back to you soon.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setLocation("/dashboard")}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => {
                  form.reset();
                  setSubmitted(false);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button 
              onClick={() => setLocation("/dashboard")}
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">New Project Request</h3>
            </div>
            <div className="p-6">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name *
                    </label>
                    <Input
                      id="name"
                      placeholder="Enter project name"
                      {...form.register("name")}
                      className={`${form.formState.errors.name ? 'border-red-500' : ''}`}
                    />
                    {form.formState.errors.name && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Description *
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Briefly describe your project"
                      rows={3}
                      {...form.register("description")}
                      className={`${form.formState.errors.description ? 'border-red-500' : ''}`}
                    />
                    {form.formState.errors.description && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.description.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Start Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            form.formState.errors.startDate ? 'border-red-500' : ''
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.getValues("startDate") ? (
                            format(form.getValues("startDate"), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={form.getValues("startDate") || undefined}
                          onSelect={(date) => form.setValue("startDate", date || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Requirements *
                    </label>
                    <Textarea
                      id="requirements"
                      placeholder="Describe what you need this application to accomplish"
                      rows={6}
                      {...form.register("requirements")}
                      className={`${form.formState.errors.requirements ? 'border-red-500' : ''}`}
                    />
                    {form.formState.errors.requirements && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.requirements.message}</p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Please be specific about your project requirements, including any functionality, integrations, or specific features you need.
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setLocation("/dashboard")}
                      className="mr-4"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createProjectMutation.isPending}
                    >
                      {createProjectMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Request"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}