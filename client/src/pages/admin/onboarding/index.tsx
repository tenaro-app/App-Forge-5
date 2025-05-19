import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Building,
  Mail,
  Phone,
  Package,
  FileText,
  Settings,
  Clock,
  Calendar,
  CreditCard,
  Rocket,
  Briefcase,
  Lock
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Step 1: Client Information Schema
const clientSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
  company: z.string().min(2, { message: "Company name is required" }),
  position: z.string().min(2, { message: "Position is required" }),
  industry: z.string().min(2, { message: "Industry is required" }),
  companySize: z.enum(["1-10", "11-50", "51-200", "201-500", "501+"]),
  notes: z.string().optional(),
});

// Step 2: Project Information Schema
const projectSchema = z.object({
  name: z.string().min(3, { message: "Project name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  startDate: z.date(),
  estimatedDueDate: z.date().optional(),
  projectType: z.enum(["web", "mobile", "desktop", "integration", "other"]),
  projectGoals: z.string().min(10, { message: "Project goals must be at least 10 characters" }),
  initialMilestones: z.string().optional(),
});

// Step 3: Access and Permissions Schema
const accessSchema = z.object({
  loginEnabled: z.boolean(),
  dashboardAccess: z.boolean(),
  documentsAccess: z.boolean(),
  billingAccess: z.boolean(),
  additionalTeamMembers: z.array(
    z.object({
      name: z.string().min(2, { message: "Name must be at least 2 characters" }),
      email: z.string().email({ message: "Please enter a valid email address" }),
      role: z.enum(["admin", "viewer", "editor"]),
    })
  ).optional(),
});

// Step 4: Billing Information Schema
const billingSchema = z.object({
  billingType: z.enum(["monthly", "annual", "project"]),
  billingCycle: z.enum(["monthly", "quarterly", "annual"]).optional(),
  paymentMethod: z.enum(["credit_card", "bank_transfer", "check", "other"]),
  billingEmail: z.string().email({ message: "Please enter a valid email address" }),
  billingAddress: z.string().min(10, { message: "Please enter a complete billing address" }),
  taxId: z.string().optional(),
  poNumber: z.string().optional(),
});

// Combined schema for all steps
const onboardingSchema = z.object({
  clientInfo: clientSchema,
  projectInfo: projectSchema,
  accessInfo: accessSchema,
  billingInfo: billingSchema,
});

type OnboardingData = z.infer<typeof onboardingSchema>;

export default function ClientOnboarding() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({
    clientInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      industry: "",
      companySize: "1-10",
      notes: "",
    },
    projectInfo: {
      name: "",
      description: "",
      startDate: new Date(),
      projectType: "web",
      projectGoals: "",
      initialMilestones: "",
    },
    accessInfo: {
      loginEnabled: true,
      dashboardAccess: true,
      documentsAccess: true,
      billingAccess: false,
      additionalTeamMembers: [],
    },
    billingInfo: {
      billingType: "monthly",
      billingCycle: "monthly",
      paymentMethod: "credit_card",
      billingEmail: "",
      billingAddress: "",
    },
  });
  
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
  
  // Step 1 Form
  const clientForm = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: onboardingData.clientInfo,
  });
  
  // Step 2 Form
  const projectForm = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: onboardingData.projectInfo,
  });
  
  // Step 3 Form
  const accessForm = useForm({
    resolver: zodResolver(accessSchema),
    defaultValues: onboardingData.accessInfo,
  });
  
  // Step 4 Form
  const billingForm = useForm({
    resolver: zodResolver(billingSchema),
    defaultValues: onboardingData.billingInfo,
  });
  
  // Add team member to form
  const [newTeamMember, setNewTeamMember] = useState({ name: "", email: "", role: "viewer" as const });
  
  const addTeamMember = () => {
    const currentMembers = accessForm.getValues("additionalTeamMembers") || [];
    accessForm.setValue("additionalTeamMembers", [
      ...currentMembers,
      { ...newTeamMember }
    ]);
    setNewTeamMember({ name: "", email: "", role: "viewer" as const });
  };
  
  const removeTeamMember = (index: number) => {
    const currentMembers = accessForm.getValues("additionalTeamMembers") || [];
    accessForm.setValue("additionalTeamMembers", 
      currentMembers.filter((_, i) => i !== index)
    );
  };
  
  // Complete onboarding mutation
  const completeOnboardingMutation = useMutation({
    mutationFn: async (data: OnboardingData) => {
      const response = await apiRequest("POST", "/api/admin/onboarding/complete", data);
      if (!response.ok) {
        throw new Error(`Failed to complete onboarding: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      setOnboardingComplete(true);
      toast({
        title: "Onboarding complete",
        description: "The client has been successfully onboarded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to complete onboarding",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle step changes and form submissions
  const handleNextStep = () => {
    if (currentStep === 1) {
      clientForm.handleSubmit((data) => {
        setOnboardingData({
          ...onboardingData,
          clientInfo: data,
        });
        setCurrentStep(2);
      })();
    } else if (currentStep === 2) {
      projectForm.handleSubmit((data) => {
        setOnboardingData({
          ...onboardingData,
          projectInfo: data,
        });
        setCurrentStep(3);
      })();
    } else if (currentStep === 3) {
      accessForm.handleSubmit((data) => {
        setOnboardingData({
          ...onboardingData,
          accessInfo: data,
        });
        setCurrentStep(4);
      })();
    } else if (currentStep === 4) {
      billingForm.handleSubmit((data) => {
        const completeData = {
          ...onboardingData,
          billingInfo: data,
        } as OnboardingData;
        
        // In a real application, this would be an API call
        completeOnboardingMutation.mutate(completeData);
      })();
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Update email field when client info changes
  useEffect(() => {
    if (currentStep === 4 && onboardingData.clientInfo?.email) {
      billingForm.setValue("billingEmail", onboardingData.clientInfo.email);
    }
  }, [currentStep, onboardingData.clientInfo?.email]);
  
  if (isAuthLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect in useEffect
  }
  
  if (onboardingComplete) {
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
              <Rocket className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Onboarding Complete!</h2>
            <p className="text-gray-600 mb-6">
              The client and project have been successfully set up in the system.
            </p>
            <div className="space-y-4 mb-8 max-w-md mx-auto text-left">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-gray-900 mb-2 flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  Client Details
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Name:</strong> {onboardingData.clientInfo?.firstName} {onboardingData.clientInfo?.lastName}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Company:</strong> {onboardingData.clientInfo?.company}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {onboardingData.clientInfo?.email}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-gray-900 mb-2 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-primary" />
                  Project Details
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Name:</strong> {onboardingData.projectInfo?.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Start Date:</strong> {onboardingData.projectInfo?.startDate && 
                    format(new Date(onboardingData.projectInfo.startDate), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setLocation("/admin/clients")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                View Clients
              </button>
              <button
                onClick={() => setLocation("/admin/projects")}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                View Projects
              </button>
              <button
                onClick={() => {
                  setOnboardingComplete(false);
                  setCurrentStep(1);
                  clientForm.reset();
                  projectForm.reset();
                  accessForm.reset();
                  billingForm.reset();
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                New Onboarding
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
          <h1 className="ml-4 text-2xl font-bold text-gray-900">Client Onboarding Wizard</h1>
        </div>
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <User className="w-5 h-5" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-600">Client Info</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${
              currentStep > 1 ? 'bg-primary' : 'bg-gray-200'
            }`}></div>
            
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <Package className="w-5 h-5" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-600">Project</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${
              currentStep > 2 ? 'bg-primary' : 'bg-gray-200'
            }`}></div>
            
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <Lock className="w-5 h-5" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-600">Access</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${
              currentStep > 3 ? 'bg-primary' : 'bg-gray-200'
            }`}></div>
            
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                currentStep >= 4 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-600">Billing</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {currentStep === 1 && "Step 1: Client Information"}
                {currentStep === 2 && "Step 2: Project Information"}
                {currentStep === 3 && "Step 3: Access & Permissions"}
                {currentStep === 4 && "Step 4: Billing Information"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {currentStep === 1 && "Enter client contact and company details"}
                {currentStep === 2 && "Provide information about the project requirements"}
                {currentStep === 3 && "Set up client portal access and team members"}
                {currentStep === 4 && "Configure billing settings for this client"}
              </p>
            </div>
            <div className="p-6">
              {/* Step 1: Client Information */}
              {currentStep === 1 && (
                <form onSubmit={clientForm.handleSubmit(() => {})}>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Contact Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              id="firstName"
                              className={`pl-10 ${clientForm.formState.errors.firstName ? 'border-red-500' : ''}`}
                              {...clientForm.register("firstName")}
                            />
                          </div>
                          {clientForm.formState.errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">{clientForm.formState.errors.firstName.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            className={clientForm.formState.errors.lastName ? 'border-red-500' : ''}
                            {...clientForm.register("lastName")}
                          />
                          {clientForm.formState.errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">{clientForm.formState.errors.lastName.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              id="email"
                              type="email"
                              className={`pl-10 ${clientForm.formState.errors.email ? 'border-red-500' : ''}`}
                              {...clientForm.register("email")}
                            />
                          </div>
                          {clientForm.formState.errors.email && (
                            <p className="text-red-500 text-sm mt-1">{clientForm.formState.errors.email.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              id="phone"
                              className={`pl-10 ${clientForm.formState.errors.phone ? 'border-red-500' : ''}`}
                              {...clientForm.register("phone")}
                            />
                          </div>
                          {clientForm.formState.errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{clientForm.formState.errors.phone.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Company Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="company">Company Name *</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Building className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              id="company"
                              className={`pl-10 ${clientForm.formState.errors.company ? 'border-red-500' : ''}`}
                              {...clientForm.register("company")}
                            />
                          </div>
                          {clientForm.formState.errors.company && (
                            <p className="text-red-500 text-sm mt-1">{clientForm.formState.errors.company.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="position">Position/Title *</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Briefcase className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              id="position"
                              className={`pl-10 ${clientForm.formState.errors.position ? 'border-red-500' : ''}`}
                              {...clientForm.register("position")}
                            />
                          </div>
                          {clientForm.formState.errors.position && (
                            <p className="text-red-500 text-sm mt-1">{clientForm.formState.errors.position.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry *</Label>
                          <select
                            id="industry"
                            className={`w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary ${
                              clientForm.formState.errors.industry ? 'border-red-500' : ''
                            }`}
                            {...clientForm.register("industry")}
                          >
                            <option value="">Select an industry</option>
                            <option value="Technology">Technology</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Finance">Finance</option>
                            <option value="Education">Education</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Retail">Retail</option>
                            <option value="Hospitality">Hospitality</option>
                            <option value="Construction">Construction</option>
                            <option value="Other">Other</option>
                          </select>
                          {clientForm.formState.errors.industry && (
                            <p className="text-red-500 text-sm mt-1">{clientForm.formState.errors.industry.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="companySize">Company Size *</Label>
                          <select
                            id="companySize"
                            className={`w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary ${
                              clientForm.formState.errors.companySize ? 'border-red-500' : ''
                            }`}
                            {...clientForm.register("companySize")}
                          >
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="51-200">51-200 employees</option>
                            <option value="201-500">201-500 employees</option>
                            <option value="501+">501+ employees</option>
                          </select>
                          {clientForm.formState.errors.companySize && (
                            <p className="text-red-500 text-sm mt-1">{clientForm.formState.errors.companySize.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        rows={4}
                        placeholder="Enter any additional information about this client..."
                        {...clientForm.register("notes")}
                      />
                    </div>
                  </div>
                </form>
              )}
              
              {/* Step 2: Project Information */}
              {currentStep === 2 && (
                <form onSubmit={projectForm.handleSubmit(() => {})}>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Project Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Project Name *</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              id="name"
                              className={`pl-10 ${projectForm.formState.errors.name ? 'border-red-500' : ''}`}
                              {...projectForm.register("name")}
                            />
                          </div>
                          {projectForm.formState.errors.name && (
                            <p className="text-red-500 text-sm mt-1">{projectForm.formState.errors.name.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="projectType">Project Type *</Label>
                          <select
                            id="projectType"
                            className={`w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary ${
                              projectForm.formState.errors.projectType ? 'border-red-500' : ''
                            }`}
                            {...projectForm.register("projectType")}
                          >
                            <option value="web">Web Application</option>
                            <option value="mobile">Mobile Application</option>
                            <option value="desktop">Desktop Application</option>
                            <option value="integration">System Integration</option>
                            <option value="other">Other</option>
                          </select>
                          {projectForm.formState.errors.projectType && (
                            <p className="text-red-500 text-sm mt-1">{projectForm.formState.errors.projectType.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Start Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                id="startDate"
                                className={`w-full flex items-center rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary ${
                                  projectForm.formState.errors.startDate ? 'border-red-500' : ''
                                }`}
                                type="button"
                              >
                                <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                {projectForm.getValues("startDate") ? (
                                  format(new Date(projectForm.getValues("startDate")), "PPP")
                                ) : (
                                  <span className="text-gray-400">Select a date</span>
                                )}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={projectForm.getValues("startDate") as Date}
                                onSelect={(date) => {
                                  if (date) projectForm.setValue("startDate", date);
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {projectForm.formState.errors.startDate && (
                            <p className="text-red-500 text-sm mt-1">{projectForm.formState.errors.startDate.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="estimatedDueDate">Estimated Due Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                id="estimatedDueDate"
                                className="w-full flex items-center rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                                type="button"
                              >
                                <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                {projectForm.getValues("estimatedDueDate") ? (
                                  format(new Date(projectForm.getValues("estimatedDueDate")), "PPP")
                                ) : (
                                  <span className="text-gray-400">Select a date</span>
                                )}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={projectForm.getValues("estimatedDueDate") as Date}
                                onSelect={(date) => {
                                  projectForm.setValue("estimatedDueDate", date as Date);
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Project Description *</Label>
                      <Textarea
                        id="description"
                        rows={3}
                        className={projectForm.formState.errors.description ? 'border-red-500' : ''}
                        placeholder="Describe the project's purpose and scope..."
                        {...projectForm.register("description")}
                      />
                      {projectForm.formState.errors.description && (
                        <p className="text-red-500 text-sm mt-1">{projectForm.formState.errors.description.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="projectGoals">Project Goals *</Label>
                      <Textarea
                        id="projectGoals"
                        rows={3}
                        className={projectForm.formState.errors.projectGoals ? 'border-red-500' : ''}
                        placeholder="What are the main goals and objectives of this project?"
                        {...projectForm.register("projectGoals")}
                      />
                      {projectForm.formState.errors.projectGoals && (
                        <p className="text-red-500 text-sm mt-1">{projectForm.formState.errors.projectGoals.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="initialMilestones">Initial Milestones</Label>
                      <p className="text-xs text-gray-500 mb-2">
                        Enter one milestone per line. You can add more detailed milestones later.
                      </p>
                      <Textarea
                        id="initialMilestones"
                        rows={5}
                        placeholder="Requirements gathering&#10;Design phase&#10;Development&#10;Testing&#10;Deployment"
                        {...projectForm.register("initialMilestones")}
                      />
                    </div>
                  </div>
                </form>
              )}
              
              {/* Step 3: Access and Permissions */}
              {currentStep === 3 && (
                <form onSubmit={accessForm.handleSubmit(() => {})}>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Client Portal Access</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="loginEnabled" className="text-base">Enable Client Portal Login</Label>
                            <p className="text-sm text-gray-500 mt-1">
                              Allow the client to log in to their dashboard
                            </p>
                          </div>
                          <div className="flex items-center h-6">
                            <input
                              id="loginEnabled"
                              type="checkbox"
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                              {...accessForm.register("loginEnabled")}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="pl-7 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="dashboardAccess" className="flex-1">Dashboard Access</Label>
                              <p className="text-xs text-gray-500">View project analytics and status updates</p>
                            </div>
                            <div className="flex items-center h-6">
                              <input
                                id="dashboardAccess"
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                disabled={!accessForm.getValues("loginEnabled")}
                                {...accessForm.register("dashboardAccess")}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="documentsAccess" className="flex-1">Documents Access</Label>
                              <p className="text-xs text-gray-500">Access project documents and deliverables</p>
                            </div>
                            <div className="flex items-center h-6">
                              <input
                                id="documentsAccess"
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                disabled={!accessForm.getValues("loginEnabled")}
                                {...accessForm.register("documentsAccess")}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label htmlFor="billingAccess" className="flex-1">Billing Access</Label>
                              <p className="text-xs text-gray-500">View and manage billing information</p>
                            </div>
                            <div className="flex items-center h-6">
                              <input
                                id="billingAccess"
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                disabled={!accessForm.getValues("loginEnabled")}
                                {...accessForm.register("billingAccess")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Additional Team Members</h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Add additional team members from the client's organization who need access to the portal
                      </p>
                      
                      <div className="space-y-4">
                        {/* Team member list */}
                        {accessForm.getValues("additionalTeamMembers")?.map((member, index) => (
                          <div key={index} className="flex items-center p-3 bg-white rounded border border-gray-200">
                            <div className="flex-1">
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                Role: {member.role === "admin" ? "Administrator" : 
                                       member.role === "editor" ? "Editor" : "Viewer"}
                              </div>
                            </div>
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => removeTeamMember(index)}
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                        
                        {/* Add new team member form */}
                        <div className="p-4 bg-white rounded border border-gray-200">
                          <h5 className="text-sm font-medium text-gray-900 mb-3">Add Team Member</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <Input
                              placeholder="Name"
                              value={newTeamMember.name}
                              onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})}
                            />
                            <Input
                              placeholder="Email"
                              type="email"
                              value={newTeamMember.email}
                              onChange={(e) => setNewTeamMember({...newTeamMember, email: e.target.value})}
                            />
                            <select
                              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                              value={newTeamMember.role}
                              onChange={(e) => setNewTeamMember({
                                ...newTeamMember, 
                                role: e.target.value as "admin" | "editor" | "viewer"
                              })}
                            >
                              <option value="viewer">Viewer</option>
                              <option value="editor">Editor</option>
                              <option value="admin">Administrator</option>
                            </select>
                          </div>
                          <button
                            type="button"
                            disabled={!newTeamMember.name || !newTeamMember.email}
                            className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={addTeamMember}
                          >
                            Add Team Member
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}
              
              {/* Step 4: Billing Information */}
              {currentStep === 4 && (
                <form onSubmit={billingForm.handleSubmit(() => {})}>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Billing Details</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="billingType">Billing Type *</Label>
                            <div className="space-y-3">
                              <RadioGroup 
                                defaultValue={billingForm.getValues("billingType")}
                                onValueChange={(value) => billingForm.setValue("billingType", value as "monthly" | "annual" | "project")}
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
                            </div>
                          </div>
                          
                          {(billingForm.getValues("billingType") === "monthly" || billingForm.getValues("billingType") === "annual") && (
                            <div className="space-y-2">
                              <Label htmlFor="billingCycle">Billing Cycle *</Label>
                              <select
                                id="billingCycle"
                                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                                {...billingForm.register("billingCycle")}
                              >
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="annual">Annual</option>
                              </select>
                            </div>
                          )}
                          
                          <div className="space-y-2">
                            <Label htmlFor="paymentMethod">Payment Method *</Label>
                            <select
                              id="paymentMethod"
                              className={`w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary ${
                                billingForm.formState.errors.paymentMethod ? 'border-red-500' : ''
                              }`}
                              {...billingForm.register("paymentMethod")}
                            >
                              <option value="credit_card">Credit Card</option>
                              <option value="bank_transfer">Bank Transfer</option>
                              <option value="check">Check</option>
                              <option value="other">Other</option>
                            </select>
                            {billingForm.formState.errors.paymentMethod && (
                              <p className="text-red-500 text-sm mt-1">{billingForm.formState.errors.paymentMethod.message}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Billing Contact</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="billingEmail">Billing Email *</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                              id="billingEmail"
                              type="email"
                              className={`pl-10 ${billingForm.formState.errors.billingEmail ? 'border-red-500' : ''}`}
                              {...billingForm.register("billingEmail")}
                            />
                          </div>
                          {billingForm.formState.errors.billingEmail && (
                            <p className="text-red-500 text-sm mt-1">{billingForm.formState.errors.billingEmail.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                          <Input
                            id="taxId"
                            {...billingForm.register("taxId")}
                          />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="billingAddress">Billing Address *</Label>
                          <Textarea
                            id="billingAddress"
                            rows={3}
                            className={billingForm.formState.errors.billingAddress ? 'border-red-500' : ''}
                            {...billingForm.register("billingAddress")}
                          />
                          {billingForm.formState.errors.billingAddress && (
                            <p className="text-red-500 text-sm mt-1">{billingForm.formState.errors.billingAddress.message}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="poNumber">Purchase Order Number</Label>
                          <Input
                            id="poNumber"
                            placeholder="Optional"
                            {...billingForm.register("poNumber")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button
                type="button"
                onClick={handlePreviousStep}
                disabled={currentStep === 1}
                className={`px-4 py-2 rounded-md ${
                  currentStep === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </div>
              </button>
              
              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                <div className="flex items-center">
                  {currentStep < 4 ? (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Complete Onboarding
                      <Check className="w-4 h-4 ml-2" />
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}