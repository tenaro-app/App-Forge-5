import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  CalendarDays, 
  User, 
  DollarSign, 
  ChevronLeft,
  ArrowLeft
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the form validation schema
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Project name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  clientId: z.string({
    required_error: "Please select a client.",
  }),
  startDate: z.string().refine(value => !isNaN(Date.parse(value)), {
    message: "Please enter a valid date.",
  }),
  dueDate: z.string().refine(value => !isNaN(Date.parse(value)), {
    message: "Please enter a valid date.",
  }),
  budget: z.string().refine(value => !isNaN(parseFloat(value)) && parseFloat(value) > 0, {
    message: "Budget must be a positive number.",
  }),
  status: z.string({
    required_error: "Please select a status.",
  }),
  teamMembers: z.array(z.string()).min(1, {
    message: "Please select at least one team member.",
  }),
});

// Define the form value types
type FormValues = z.infer<typeof formSchema>;

export default function NewProject() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for dropdowns
  const clients = [
    { id: "123", name: "Jane Doe" },
    { id: "124", name: "Bob Johnson" },
    { id: "125", name: "Alice Williams" },
    { id: "126", name: "Charlie Brown" },
    { id: "127", name: "David Green" },
    { id: "128", name: "Eva Black" },
  ];

  const teamMembers = [
    { id: "1", name: "John Smith" },
    { id: "2", name: "Sarah Davis" },
    { id: "3", name: "Mike Lee" },
    { id: "4", name: "Lisa Chen" },
    { id: "5", name: "David Johnson" },
    { id: "6", name: "Emily Wilson" },
  ];

  // React Hook Form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      clientId: "",
      startDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      budget: "",
      status: "planning",
      teamMembers: [],
    },
  });

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

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return await apiRequest("POST", "/api/admin/projects", {
        ...values,
        budget: parseFloat(values.budget),
        startDate: new Date(values.startDate).toISOString(),
        dueDate: new Date(values.dueDate).toISOString(),
      });
    },
    onSuccess: () => {
      toast({
        title: "Project created",
        description: "The project has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      setLocation("/admin/projects");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Form submission handler
  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    
    // In a real implementation, this would connect to an actual API
    // For now, we'll simulate a successful creation
    setTimeout(() => {
      console.log("Project values:", values);
      toast({
        title: "Project created",
        description: "The project has been created successfully.",
      });
      setIsSubmitting(false);
      setLocation("/admin/projects");
    }, 1500);
    
    // This is how you would connect to a real API:
    // createProjectMutation.mutate(values);
  };

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
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/admin/projects")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Project</h1>
            <p className="text-gray-600 mt-1">
              Set up a new project and assign it to a client
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>
                  Enter the basic information for the new project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter project name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the project and its objectives" 
                              className="min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="clientId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a client" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {clients.map(client => (
                                  <SelectItem key={client.id} value={client.id}>
                                    {client.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="planning">Planning</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="on_hold">On Hold</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                <Input type="date" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Due Date</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                <Input type="date" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget (USD)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                              <Input 
                                type="number" 
                                min="0" 
                                step="100" 
                                className="pl-10" 
                                placeholder="5000" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Enter the total budget for this project
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="teamMembers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Members</FormLabel>
                          
                          <div className="mb-3">
                            <div className="flex items-center space-x-2 p-3 border border-primary/20 bg-primary/5 rounded-md">
                              <input
                                type="checkbox"
                                id="auto-select-team"
                                onChange={e => {
                                  if (e.target.checked) {
                                    // Special value to indicate auto-selection
                                    field.onChange(["auto"]);
                                  } else {
                                    field.onChange([]);
                                  }
                                }}
                                checked={field.value.includes("auto")}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <label htmlFor="auto-select-team" className="font-medium">
                                Let App Forge decide the best team members for this project
                              </label>
                            </div>
                          </div>
                          
                          {!field.value.includes("auto") && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {teamMembers.map(member => (
                                <div key={member.id} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`member-${member.id}`}
                                    value={member.id}
                                    checked={field.value.includes(member.id)}
                                    onChange={e => {
                                      const checked = e.target.checked;
                                      const updatedValue = checked
                                        ? [...field.value, member.id]
                                        : field.value.filter(id => id !== member.id);
                                      field.onChange(updatedValue);
                                    }}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                  />
                                  <label htmlFor={`member-${member.id}`} className="text-sm">
                                    {member.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <FormDescription>
                            {field.value.includes("auto") 
                              ? "Our AI will analyze the project requirements and assign the most qualified team members"
                              : "Select team members who will work on this project"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4 flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setLocation("/admin/projects")}
                        className="mr-2"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Create Project
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Project Creation Guide</CardTitle>
                <CardDescription>
                  Tips for setting up successful projects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm">1. Clear Project Name</h3>
                  <p className="text-gray-500 text-sm">Choose a name that clearly identifies the project and its purpose.</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">2. Detailed Description</h3>
                  <p className="text-gray-500 text-sm">Include the project scope, goals, and any specific requirements.</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">3. Realistic Timeline</h3>
                  <p className="text-gray-500 text-sm">Set reasonable start and due dates, accounting for potential delays.</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">4. Appropriate Budget</h3>
                  <p className="text-gray-500 text-sm">Ensure the budget covers all aspects of the project including contingencies.</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm">5. Right Team Members</h3>
                  <p className="text-gray-500 text-sm">Assign team members with the skills needed for this specific project.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}