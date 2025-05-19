import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";

const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().min(10, "Please provide more details about your project"),
  budget: z.string().min(1, "Please provide your budget"),
  timeline: z.string().min(1, "Please select an expected timeline"),
  type: z.string().min(1, "Please select a project type"),
  requirements: z.string().min(10, "Please provide some details about your requirements"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function NewProject() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, navigate] = useLocation();
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      budget: "",
      timeline: "",
      type: "",
      requirements: "",
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Not authenticated",
        description: "Please log in to request a project",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/projects/request", {
        ...data,
        clientId: user?.id,
        status: "requested",
      });
      
      // Invalidate projects cache
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      
      toast({
        title: "Project request submitted",
        description: "We'll review your request and get back to you soon!",
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting project request:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Request New Project</h1>
            </div>
            <div className="w-36"></div> {/* Spacer for balance */}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">New Project Request</h2>
              <p className="mt-1 text-gray-600">
                Tell us about your project requirements and our team will review your request.
              </p>
            </div>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...form.register("name")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="E.g., Customer Support Automation"
                />
                {form.formState.errors.name && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Project Type
                </label>
                <select
                  id="type"
                  {...form.register("type")}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Select project type</option>
                  <option value="web-application">Web Application</option>
                  <option value="automation">Business Automation</option>
                  <option value="data-analysis">Data Analysis Dashboard</option>
                  <option value="api-integration">API Integration</option>
                  <option value="chatbot">AI Chatbot</option>
                  <option value="custom">Custom Solution</option>
                </select>
                {form.formState.errors.type && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.type.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Project Description
                </label>
                <textarea
                  id="description"
                  {...form.register("description")}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Describe your project and its goals"
                />
                {form.formState.errors.description && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.description.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                  Key Requirements
                </label>
                <textarea
                  id="requirements"
                  {...form.register("requirements")}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="What specific features or functionality do you need?"
                />
                {form.formState.errors.requirements && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.requirements.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                    Budget Range
                  </label>
                  <select
                    id="budget"
                    {...form.register("budget")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select budget range</option>
                    <option value="under-5k">Under $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k-25k">$10,000 - $25,000</option>
                    <option value="25k-50k">$25,000 - $50,000</option>
                    <option value="over-50k">Over $50,000</option>
                    <option value="not-sure">Not sure / Need consultation</option>
                  </select>
                  {form.formState.errors.budget && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.budget.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
                    Expected Timeline
                  </label>
                  <select
                    id="timeline"
                    {...form.register("timeline")}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select timeline</option>
                    <option value="urgent">Urgent (Less than 2 weeks)</option>
                    <option value="short">Short (2-4 weeks)</option>
                    <option value="medium">Medium (1-3 months)</option>
                    <option value="long">Long (3+ months)</option>
                    <option value="flexible">Flexible / Not sure</option>
                  </select>
                  {form.formState.errors.timeline && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.timeline.message}</p>
                  )}
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Project Request"
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">What happens next?</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-xs font-medium">
                    1
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  Our team will review your project request within 1-2 business days
                </p>
              </li>
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-xs font-medium">
                    2
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  We'll schedule a consultation call to discuss your requirements in detail
                </p>
              </li>
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-xs font-medium">
                    3
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  You'll receive a detailed proposal with timeline and cost estimates
                </p>
              </li>
              <li className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-xs font-medium">
                    4
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  Once approved, we'll start development and provide regular updates
                </p>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}