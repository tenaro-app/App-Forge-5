import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft,
  Building,
  Mail,
  Phone,
  User,
  Briefcase,
  Save,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Form validation schema
const clientSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
  company: z.string().min(2, { message: "Company name is required" }),
  position: z.string().min(2, { message: "Position is required" }),
  billingType: z.enum(["monthly", "annual", "project"], { 
    required_error: "Billing type is required" 
  }),
  notes: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export default function NewClient() {
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
  
  // Initialize form with defaultValues
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      billingType: "monthly",
      notes: "",
    },
  });
  
  // Create new client mutation
  const createClientMutation = useMutation({
    mutationFn: async (data: ClientFormValues) => {
      const response = await apiRequest("POST", "/api/admin/clients", data);
      if (!response.ok) {
        throw new Error(`Failed to create client: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      setSubmitted(true);
      toast({
        title: "Client created",
        description: "The client has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create client",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: ClientFormValues) => {
    createClientMutation.mutate(data);
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
              <User className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Client Added Successfully</h2>
            <p className="text-gray-600 mb-6">
              The new client has been created and is now available in your client list.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setLocation("/admin/clients")}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                View All Clients
              </button>
              <button
                onClick={() => {
                  form.reset();
                  setSubmitted(false);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Add Another Client
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
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => setLocation("/admin/clients")}
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Clients
          </button>
          <h1 className="ml-4 text-2xl font-bold text-gray-900">Add New Client</h1>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Client Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add a new client to the system. All fields marked with * are required.
              </p>
            </div>
            <div className="p-6">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* First Name */}
                      <div>
                        <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="firstName"
                            {...form.register("firstName")}
                            className={`pl-10 ${form.formState.errors.firstName ? 'border-red-500' : ''}`}
                            placeholder="Enter first name"
                          />
                        </div>
                        {form.formState.errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{form.formState.errors.firstName.message}</p>
                        )}
                      </div>
                      
                      {/* Last Name */}
                      <div>
                        <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          {...form.register("lastName")}
                          className={`${form.formState.errors.lastName ? 'border-red-500' : ''}`}
                          placeholder="Enter last name"
                        />
                        {form.formState.errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{form.formState.errors.lastName.message}</p>
                        )}
                      </div>
                      
                      {/* Email */}
                      <div>
                        <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="email"
                            type="email"
                            {...form.register("email")}
                            className={`pl-10 ${form.formState.errors.email ? 'border-red-500' : ''}`}
                            placeholder="client@example.com"
                          />
                        </div>
                        {form.formState.errors.email && (
                          <p className="mt-1 text-sm text-red-600">{form.formState.errors.email.message}</p>
                        )}
                      </div>
                      
                      {/* Phone */}
                      <div>
                        <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="phone"
                            {...form.register("phone")}
                            className={`pl-10 ${form.formState.errors.phone ? 'border-red-500' : ''}`}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        {form.formState.errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{form.formState.errors.phone.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Company Information */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Company Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Company Name */}
                      <div>
                        <Label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                          Company Name *
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="company"
                            {...form.register("company")}
                            className={`pl-10 ${form.formState.errors.company ? 'border-red-500' : ''}`}
                            placeholder="Enter company name"
                          />
                        </div>
                        {form.formState.errors.company && (
                          <p className="mt-1 text-sm text-red-600">{form.formState.errors.company.message}</p>
                        )}
                      </div>
                      
                      {/* Position */}
                      <div>
                        <Label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                          Position *
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Briefcase className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="position"
                            {...form.register("position")}
                            className={`pl-10 ${form.formState.errors.position ? 'border-red-500' : ''}`}
                            placeholder="e.g. CEO, CTO, Director"
                          />
                        </div>
                        {form.formState.errors.position && (
                          <p className="mt-1 text-sm text-red-600">{form.formState.errors.position.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Billing Type */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Billing Preferences</h4>
                    
                    <div className="space-y-4">
                      <Label className="block text-sm font-medium text-gray-700">
                        Billing Type *
                      </Label>
                      
                      <RadioGroup 
                        defaultValue={form.getValues("billingType")}
                        onValueChange={(value) => form.setValue("billingType", value as "monthly" | "annual" | "project")}
                      >
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <Label htmlFor="monthly" className="font-normal">
                            <span className="font-medium">Monthly</span>
                            <p className="text-sm text-gray-500">
                              Client will be billed on a monthly basis.
                            </p>
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="annual" id="annual" />
                          <Label htmlFor="annual" className="font-normal">
                            <span className="font-medium">Annual</span>
                            <p className="text-sm text-gray-500">
                              Client will be billed annually (10% discount applied).
                            </p>
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <RadioGroupItem value="project" id="project" />
                          <Label htmlFor="project" className="font-normal">
                            <span className="font-medium">Per Project</span>
                            <p className="text-sm text-gray-500">
                              Client will be billed on a per-project basis.
                            </p>
                          </Label>
                        </div>
                      </RadioGroup>
                      
                      {form.formState.errors.billingType && (
                        <p className="mt-1 text-sm text-red-600">{form.formState.errors.billingType.message}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Additional Notes */}
                  <div>
                    <Label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </Label>
                    <Textarea
                      id="notes"
                      {...form.register("notes")}
                      className="min-h-[100px]"
                      placeholder="Enter any additional information about this client..."
                    />
                  </div>
                  
                  {/* Form Actions */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setLocation("/admin/clients")}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-4 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createClientMutation.isPending}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      {createClientMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Add Client
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