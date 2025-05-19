import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft,
  Calendar,
  Package,
  Save,
  Loader2,
  Users
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

// Dummy client data (will be replaced with API data in production)
const dummyClients = [
  { id: "1", firstName: "Jane", lastName: "Doe", company: "Acme Corp" },
  { id: "2", firstName: "John", lastName: "Smith", company: "Beta Industries" },
  { id: "3", firstName: "Alice", lastName: "Brown", company: "Gamma Solutions" },
  { id: "4", firstName: "Robert", lastName: "Johnson", company: "Delta Tech" }
];

// Form validation schema
const projectSchema = z.object({
  name: z.string().min(3, { message: "Project name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  clientId: z.string().min(1, { message: "Client is required" }),
  startDate: z.date(),
  dueDate: z.date().optional(),
  status: z.enum(["planning", "in-progress", "on-hold", "completed", "cancelled"]),
  initialMilestones: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function NewProject() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);
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
  
  // Fetch clients for dropdown
  const { 
    data: clients, 
    isLoading: isClientsLoading 
  } = useQuery({
    queryKey: ["/api/admin/clients"],
    enabled: isAuthenticated && isAdmin,
    // For development we're using dummy data
    initialData: dummyClients
  });
  
  // Initialize form with defaultValues
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      clientId: "",
      startDate: new Date(),
      status: "planning",
      initialMilestones: "",
    },
  });
  
  // Create new project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormValues) => {
      const response = await apiRequest("POST", "/api/admin/projects", data);
      if (!response.ok) {
        throw new Error(`Failed to create project: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      setSubmitted(true);
      toast({
        title: "Project created",
        description: "The project has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create project",
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
  
  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect in useEffect
  }
  
  if (submitted) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <header className="bg-gray-900 text-white shadow-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-lg">AF</span>
                  </div>
                  <span className="ml-2 text-xl font-bold">AppForge Admin</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Created Successfully</h2>
            <p className="text-gray-600 mb-6">
              The new project has been created and is now ready for development.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setLocation("/admin/projects")}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                View All Projects
              </button>
              <button
                onClick={() => {
                  form.reset();
                  setSubmitted(false);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Create Another Project
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
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
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => setLocation("/admin/projects")}
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Projects
          </button>
          <h1 className="ml-4 text-2xl font-bold text-gray-900">Create New Project</h1>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Project Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create a new project and assign it to a client.
              </p>
            </div>
            <div className="p-6">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  {/* Project Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name *
                    </label>
                    <Input
                      id="name"
                      {...form.register("name")}
                      className={`${form.formState.errors.name ? 'border-red-500' : ''}`}
                      placeholder="Enter project name"
                    />
                    {form.formState.errors.name && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  
                  {/* Project Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Description *
                    </label>
                    <Textarea
                      id="description"
                      {...form.register("description")}
                      className={`${form.formState.errors.description ? 'border-red-500' : ''}`}
                      placeholder="Describe the project's purpose and goals"
                      rows={4}
                    />
                    {form.formState.errors.description && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.description.message}</p>
                    )}
                  </div>
                  
                  {/* Client Selection */}
                  <div>
                    <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
                      Client *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="clientId"
                        {...form.register("clientId")}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm ${
                          form.formState.errors.clientId ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select a client</option>
                        {clients?.map(client => (
                          <option key={client.id} value={client.id}>
                            {client.company} ({client.firstName} {client.lastName})
                          </option>
                        ))}
                      </select>
                    </div>
                    {form.formState.errors.clientId && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.clientId.message}</p>
                    )}
                  </div>
                  
                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Start Date */}
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date *
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              form.formState.errors.startDate ? 'border-red-500' : ''
                            }`}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {form.getValues("startDate") ? (
                              format(form.getValues("startDate"), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={form.getValues("startDate")}
                            onSelect={(date) => date && form.setValue("startDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {form.formState.errors.startDate && (
                        <p className="mt-1 text-sm text-red-600">{form.formState.errors.startDate.message}</p>
                      )}
                    </div>
                    
                    {/* Due Date */}
                    <div>
                      <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              form.formState.errors.dueDate ? 'border-red-500' : ''
                            }`}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {form.getValues("dueDate") ? (
                              format(form.getValues("dueDate") as Date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={form.getValues("dueDate") || undefined}
                            onSelect={(date) => form.setValue("dueDate", date || undefined)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {form.formState.errors.dueDate && (
                        <p className="mt-1 text-sm text-red-600">{form.formState.errors.dueDate.message}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Initial Status *
                    </label>
                    <select
                      id="status"
                      {...form.register("status")}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                    >
                      <option value="planning">Planning</option>
                      <option value="in-progress">In Progress</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  {/* Initial Milestones */}
                  <div>
                    <label htmlFor="initialMilestones" className="block text-sm font-medium text-gray-700 mb-1">
                      Initial Milestones
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Enter one milestone per line. You can add more detailed milestones later.
                    </p>
                    <Textarea
                      id="initialMilestones"
                      {...form.register("initialMilestones")}
                      placeholder="Requirements analysis&#10;Design phase&#10;Development&#10;Testing&#10;Deployment"
                      rows={6}
                    />
                  </div>
                  
                  {/* Form Actions */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setLocation("/admin/projects")}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-4 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createProjectMutation.isPending}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {createProjectMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Create Project
                        </>
                      )}
                    </button>
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