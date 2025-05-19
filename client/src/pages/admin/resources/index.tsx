import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Package,
  Calendar,
  Check,
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  Info,
  Save,
  Loader2,
  XCircle,
  Briefcase,
  Code,
  Paintbrush,
  Server,
  MessageSquare,
  Clock,
  AlertCircle,
  UserCog
} from "lucide-react";
import { format, addDays, isAfter, differenceInCalendarDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Skill categories for team members
const skillCategories = [
  {
    id: "frontend",
    name: "Frontend",
    skills: ["React", "Angular", "Vue", "TypeScript", "JavaScript", "HTML/CSS", "Next.js", "Tailwind CSS"]
  },
  {
    id: "backend",
    name: "Backend",
    skills: ["Node.js", "Express", "Python", "Django", "Java", "Spring", "PHP", "Laravel", "Ruby on Rails", "GraphQL", "RESTful APIs"]
  },
  {
    id: "database",
    name: "Database",
    skills: ["SQL", "MySQL", "PostgreSQL", "MongoDB", "Firebase", "Redis", "Elasticsearch"]
  },
  {
    id: "devops",
    name: "DevOps",
    skills: ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "CI/CD", "Jenkins", "GitLab CI", "Terraform"]
  },
  {
    id: "design",
    name: "Design",
    skills: ["UI Design", "UX Design", "Figma", "Adobe XD", "Sketch", "Illustrator", "Photoshop"]
  },
  {
    id: "mobile",
    name: "Mobile",
    skills: ["React Native", "Flutter", "Swift", "Kotlin", "iOS", "Android"]
  },
  {
    id: "other",
    name: "Other",
    skills: ["Project Management", "Agile", "Scrum", "Technical Writing", "SEO", "Analytics", "QA", "Testing"]
  }
];

// Role icons
const roleIcons: Record<string, React.ReactNode> = {
  "project_manager": <Briefcase className="w-4 h-4" />,
  "developer": <Code className="w-4 h-4" />,
  "designer": <Paintbrush className="w-4 h-4" />,
  "devops": <Server className="w-4 h-4" />,
  "support": <MessageSquare className="w-4 h-4" />
};

// Dummy team member data (will be replaced with API data in production)
const dummyTeamMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "project_manager",
    email: "sarah.johnson@appforge.io",
    skills: ["Project Management", "Agile", "Scrum", "JIRA", "Technical Writing"],
    currentUtilization: 75,
    availability: "partial",
    currentProjects: [
      { id: 1, name: "E-commerce Dashboard", role: "Project Manager", endDate: addDays(new Date(), 30) }
    ]
  },
  {
    id: 2,
    name: "Michael Lee",
    role: "developer",
    email: "michael.lee@appforge.io",
    skills: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "GraphQL"],
    currentUtilization: 90,
    availability: "limited",
    currentProjects: [
      { id: 2, name: "CRM Integration", role: "Lead Developer", endDate: addDays(new Date(), 15) },
      { id: 1, name: "E-commerce Dashboard", role: "Developer", endDate: addDays(new Date(), 30) }
    ]
  },
  {
    id: 3,
    name: "Emily Chen",
    role: "designer",
    email: "emily.chen@appforge.io",
    skills: ["UI Design", "UX Design", "Figma", "Sketch", "Adobe XD", "Illustrator", "Photoshop"],
    currentUtilization: 60,
    availability: "available",
    currentProjects: [
      { id: 1, name: "E-commerce Dashboard", role: "UI/UX Designer", endDate: addDays(new Date(), 10) }
    ]
  },
  {
    id: 4,
    name: "James Taylor",
    role: "devops",
    email: "james.taylor@appforge.io",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform", "Linux", "Bash"],
    currentUtilization: 85,
    availability: "partial",
    currentProjects: [
      { id: 3, name: "Inventory System", role: "DevOps Engineer", endDate: addDays(new Date(), 20) }
    ]
  },
  {
    id: 5,
    name: "Jessica Martinez",
    role: "support",
    email: "jessica.martinez@appforge.io",
    skills: ["Customer Support", "Technical Writing", "Troubleshooting", "Documentation"],
    currentUtilization: 50,
    availability: "available",
    currentProjects: []
  }
];

// Dummy projects data (will be replaced with API data in production)
const dummyProjects = [
  {
    id: 1,
    name: "E-commerce Dashboard",
    client: "Acme Corp",
    status: "in-progress",
    startDate: new Date(2023, 4, 15), // May 15, 2023
    endDate: addDays(new Date(), 30),
    teamMembers: [
      { memberId: 1, role: "Project Manager" },
      { memberId: 2, role: "Developer" },
      { memberId: 3, role: "UI/UX Designer" }
    ],
    requiredSkills: ["React", "Node.js", "MongoDB", "UI Design", "Project Management"],
    teamNeeds: [
      { role: "developer", skills: ["React", "MongoDB"], count: 1, status: "unfilled", priority: "high" }
    ]
  },
  {
    id: 2,
    name: "CRM Integration",
    client: "Beta Industries",
    status: "in-progress",
    startDate: new Date(2023, 3, 10), // April 10, 2023
    endDate: addDays(new Date(), 15),
    teamMembers: [
      { memberId: 2, role: "Lead Developer" }
    ],
    requiredSkills: ["Node.js", "Express", "GraphQL", "TypeScript"],
    teamNeeds: [
      { role: "project_manager", skills: ["Project Management", "Agile"], count: 1, status: "unfilled", priority: "medium" }
    ]
  },
  {
    id: 3,
    name: "Inventory System",
    client: "Gamma Solutions",
    status: "planning",
    startDate: new Date(2023, 4, 20), // May 20, 2023
    endDate: addDays(new Date(), 60),
    teamMembers: [
      { memberId: 4, role: "DevOps Engineer" }
    ],
    requiredSkills: ["React", "Node.js", "PostgreSQL", "Docker", "AWS"],
    teamNeeds: [
      { role: "developer", skills: ["React", "Node.js", "PostgreSQL"], count: 2, status: "unfilled", priority: "high" },
      { role: "designer", skills: ["UI Design", "UX Design"], count: 1, status: "unfilled", priority: "medium" }
    ]
  }
];

// Dummy resource allocation data (will be replaced with API data in production)
const dummyAllocations = [
  {
    id: 1,
    memberId: 2,
    projectId: 1,
    role: "Developer",
    startDate: new Date(2023, 4, 15), // May 15, 2023
    endDate: addDays(new Date(), 30),
    allocationPercentage: 50,
    status: "active"
  },
  {
    id: 2,
    memberId: 2,
    projectId: 2,
    role: "Lead Developer",
    startDate: new Date(2023, 3, 10), // April 10, 2023
    endDate: addDays(new Date(), 15),
    allocationPercentage: 40,
    status: "active"
  },
  {
    id: 3,
    memberId: 1,
    projectId: 1,
    role: "Project Manager",
    startDate: new Date(2023, 4, 15), // May 15, 2023
    endDate: addDays(new Date(), 30),
    allocationPercentage: 75,
    status: "active"
  },
  {
    id: 4,
    memberId: 3,
    projectId: 1,
    role: "UI/UX Designer",
    startDate: new Date(2023, 4, 15), // May 15, 2023
    endDate: addDays(new Date(), 10),
    allocationPercentage: 60,
    status: "active"
  },
  {
    id: 5,
    memberId: 4,
    projectId: 3,
    role: "DevOps Engineer",
    startDate: new Date(2023, 4, 20), // May 20, 2023
    endDate: addDays(new Date(), 20),
    allocationPercentage: 85,
    status: "active"
  }
];

export default function ResourceAllocation() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("team");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [filterSkill, setFilterSkill] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<typeof dummyTeamMembers[0] | null>(null);
  const [selectedProject, setSelectedProject] = useState<typeof dummyProjects[0] | null>(null);
  const [assignmentRole, setAssignmentRole] = useState("");
  const [assignmentStartDate, setAssignmentStartDate] = useState<Date | undefined>(new Date());
  const [assignmentEndDate, setAssignmentEndDate] = useState<Date | undefined>(addDays(new Date(), 30));
  const [assignmentPercentage, setAssignmentPercentage] = useState(50);
  
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
  
  // Fetch team members
  const { 
    data: teamMembers, 
    isLoading: isTeamMembersLoading 
  } = useQuery({
    queryKey: ["/api/admin/team"],
    enabled: isAuthenticated && isAdmin,
    // For development we're using dummy data
    initialData: dummyTeamMembers
  });
  
  // Fetch projects
  const { 
    data: projects, 
    isLoading: isProjectsLoading 
  } = useQuery({
    queryKey: ["/api/admin/projects"],
    enabled: isAuthenticated && isAdmin,
    // For development we're using dummy data
    initialData: dummyProjects
  });
  
  // Fetch allocations
  const { 
    data: allocations, 
    isLoading: isAllocationsLoading 
  } = useQuery({
    queryKey: ["/api/admin/allocations"],
    enabled: isAuthenticated && isAdmin,
    // For development we're using dummy data
    initialData: dummyAllocations
  });
  
  // Create allocation mutation
  const createAllocationMutation = useMutation({
    mutationFn: async (allocationData: any) => {
      const response = await apiRequest("POST", "/api/admin/allocations", allocationData);
      if (!response.ok) {
        throw new Error(`Failed to create allocation: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/allocations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      setIsAssignDialogOpen(false);
      toast({
        title: "Assignment created",
        description: "The team member has been successfully assigned to the project.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create assignment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete allocation mutation
  const deleteAllocationMutation = useMutation({
    mutationFn: async (allocationId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/allocations/${allocationId}`);
      if (!response.ok) {
        throw new Error(`Failed to delete allocation: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/allocations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({
        title: "Assignment removed",
        description: "The team member has been successfully unassigned from the project.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove assignment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Filter team members based on search query, role, availability and skill
  const filteredTeamMembers = teamMembers?.filter(member => {
    const matchesSearch = searchQuery === "" || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === "all" || member.role === filterRole;
    
    const matchesAvailability = filterAvailability === "all" || member.availability === filterAvailability;
    
    const matchesSkill = filterSkill === "all" || member.skills.includes(filterSkill);
    
    return matchesSearch && matchesRole && matchesAvailability && matchesSkill;
  });
  
  // Sort team members based on selected field and direction
  const sortedTeamMembers = filteredTeamMembers?.sort((a, b) => {
    let compareA, compareB;
    
    // Determine which field to sort by
    switch (sortField) {
      case "name":
        compareA = a.name;
        compareB = b.name;
        break;
      case "role":
        compareA = a.role;
        compareB = b.role;
        break;
      case "utilization":
        compareA = a.currentUtilization;
        compareB = b.currentUtilization;
        break;
      case "availability":
        // Sort by availability status (available > partial > limited)
        const availabilityOrder = { available: 1, partial: 2, limited: 3 };
        compareA = availabilityOrder[a.availability as keyof typeof availabilityOrder] || 4;
        compareB = availabilityOrder[b.availability as keyof typeof availabilityOrder] || 4;
        break;
      case "projects":
        compareA = a.currentProjects.length;
        compareB = b.currentProjects.length;
        break;
      default:
        compareA = a.name;
        compareB = b.name;
    }
    
    // Determine sort direction
    if (sortDirection === "asc") {
      return compareA > compareB ? 1 : -1;
    } else {
      return compareA < compareB ? 1 : -1;
    }
  });
  
  // Filter projects that need resources
  const projectsNeedingResources = projects?.filter(project => 
    project.teamNeeds && project.teamNeeds.some(need => need.status === "unfilled")
  );
  
  // Get a list of all skills from team members
  const allSkills = teamMembers?.flatMap(member => member.skills)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort() || [];
  
  // Handle creating a new resource allocation
  const handleCreateAllocation = () => {
    if (!selectedMember || !selectedProject || !assignmentRole || !assignmentStartDate || !assignmentEndDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if allocation percentage is valid
    if (assignmentPercentage <= 0 || assignmentPercentage > 100) {
      toast({
        title: "Invalid allocation percentage",
        description: "Allocation percentage must be between 1% and 100%.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if end date is after start date
    if (assignmentEndDate <= assignmentStartDate) {
      toast({
        title: "Invalid date range",
        description: "End date must be after start date.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate new utilization
    const currentMemberUtilization = selectedMember.currentUtilization;
    const newUtilization = currentMemberUtilization + assignmentPercentage;
    
    // Check if assignment would overallocate the team member
    if (newUtilization > 100) {
      toast({
        title: "Overallocation warning",
        description: `This assignment would put ${selectedMember.name} at ${newUtilization}% utilization. Are you sure you want to proceed?`,
        variant: "destructive",
      });
      return;
    }
    
    // Create allocation
    createAllocationMutation.mutate({
      memberId: selectedMember.id,
      projectId: selectedProject.id,
      role: assignmentRole,
      startDate: assignmentStartDate,
      endDate: assignmentEndDate,
      allocationPercentage: assignmentPercentage,
      status: "active"
    });
  };
  
  // Handle removing a team member from a project
  const handleRemoveAssignment = (allocationId: number) => {
    if (window.confirm("Are you sure you want to remove this team member from the project?")) {
      deleteAllocationMutation.mutate(allocationId);
    }
  };
  
  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      // If already sorting by this field, toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Otherwise, sort by this field in ascending order
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Helper function to get availability badge
  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "available":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Available
          </Badge>
        );
      case "partial":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Partial Availability
          </Badge>
        );
      case "limited":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Limited Availability
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Helper function to get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            High Priority
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Medium Priority
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Low Priority
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Helper function to get role name
  const getRoleName = (roleId: string) => {
    switch (roleId) {
      case "project_manager":
        return "Project Manager";
      case "developer":
        return "Developer";
      case "designer":
        return "Designer";
      case "devops":
        return "DevOps Engineer";
      case "support":
        return "Support Specialist";
      default:
        return roleId;
    }
  };
  
  // Helper function to format role with icon
  const getRoleWithIcon = (role: string) => {
    const icon = roleIcons[role] || <UserCog className="w-4 h-4" />;
    return (
      <div className="flex items-center">
        {icon}
        <span className="ml-1">{getRoleName(role)}</span>
      </div>
    );
  };
  
  // Helper function to check if member's skills match project needs
  const memberMatchesProjectNeed = (member: typeof dummyTeamMembers[0], need: any) => {
    // Check if member's role matches the required role
    if (member.role !== need.role) return false;
    
    // Check if member has any of the required skills
    return need.skills.some((skill: string) => member.skills.includes(skill));
  };
  
  // Find suitable team members for a specific project need
  const getSuitableMembersForNeed = (need: any) => {
    return teamMembers?.filter(member => {
      // Check if member matches role and has at least one required skill
      const matchesRoleAndSkills = memberMatchesProjectNeed(member, need);
      
      // Check if member is available (not fully allocated)
      const isAvailable = member.currentUtilization < 100;
      
      return matchesRoleAndSkills && isAvailable;
    }).sort((a, b) => {
      // Sort by availability (less utilized first)
      return a.currentUtilization - b.currentUtilization;
    });
  };
  
  if (isAuthLoading || isTeamMembersLoading || isProjectsLoading || isAllocationsLoading) {
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
            <h1 className="text-2xl font-bold text-gray-900">Resource Allocation</h1>
            <p className="mt-1 text-gray-600">
              Manage team member assignments and project resource allocation
            </p>
          </div>
          
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 bg-primary hover:bg-primary/90">
                <UserCog className="w-4 h-4 mr-2" />
                Assign Resources
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Assign Team Member to Project</DialogTitle>
                <DialogDescription>
                  Allocate a team member to a project and define their role.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 my-4">
                <div className="space-y-2">
                  <Label htmlFor="teamMember">Team Member *</Label>
                  <Select
                    value={selectedMember ? String(selectedMember.id) : ""}
                    onValueChange={(value) => {
                      const member = teamMembers?.find(m => m.id === Number(value));
                      if (member) setSelectedMember(member);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers?.map((member) => (
                        <SelectItem key={member.id} value={String(member.id)}>
                          <div className="flex items-center">
                            <span>{member.name}</span>
                            <span className="ml-2 text-xs text-gray-500">
                              ({member.currentUtilization}% utilized)
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project">Project *</Label>
                  <Select
                    value={selectedProject ? String(selectedProject.id) : ""}
                    onValueChange={(value) => {
                      const project = projects?.find(p => p.id === Number(value));
                      if (project) setSelectedProject(project);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects?.map((project) => (
                        <SelectItem key={project.id} value={String(project.id)}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={assignmentRole}
                    onChange={(e) => setAssignmentRole(e.target.value)}
                    placeholder="e.g. Developer, Designer, Project Manager"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={"w-full justify-start text-left font-normal"}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {assignmentStartDate ? (
                            format(assignmentStartDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={assignmentStartDate}
                          onSelect={setAssignmentStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={"w-full justify-start text-left font-normal"}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {assignmentEndDate ? (
                            format(assignmentEndDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={assignmentEndDate}
                          onSelect={setAssignmentEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allocationPercentage">
                    Allocation Percentage: {assignmentPercentage}%
                  </Label>
                  <input
                    id="allocationPercentage"
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={assignmentPercentage}
                    onChange={(e) => setAssignmentPercentage(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>5%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                {selectedMember && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <Info className="w-4 h-4 inline-block mr-1" />
                      {selectedMember.name} is currently {selectedMember.currentUtilization}% utilized.
                      This assignment will bring utilization to {selectedMember.currentUtilization + assignmentPercentage}%.
                    </p>
                  </div>
                )}
                
                {selectedMember && selectedMember.currentUtilization + assignmentPercentage > 100 && (
                  <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800">
                      <AlertCircle className="w-4 h-4 inline-block mr-1" />
                      Warning: This assignment will overallocate this team member.
                    </p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAssignDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAllocation}
                  disabled={createAllocationMutation.isPending}
                >
                  {createAllocationMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Assign to Project
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="team" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Team Utilization
            </TabsTrigger>
            <TabsTrigger value="needs" className="flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Project Needs
            </TabsTrigger>
            <TabsTrigger value="allocations" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Current Allocations
            </TabsTrigger>
          </TabsList>
          
          {/* Team Utilization Tab */}
          <TabsContent value="team">
            <div className="bg-white p-6 shadow rounded-lg mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative md:max-w-xs w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search team members..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div>
                    <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1 sm:hidden">
                      Filter by Role
                    </label>
                    <div className="flex items-center">
                      <Filter className="mr-2 h-5 w-5 text-gray-400" />
                      <select
                        id="role-filter"
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                      >
                        <option value="all">All Roles</option>
                        <option value="project_manager">Project Managers</option>
                        <option value="developer">Developers</option>
                        <option value="designer">Designers</option>
                        <option value="devops">DevOps Engineers</option>
                        <option value="support">Support Specialists</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="availability-filter" className="block text-sm font-medium text-gray-700 mb-1 sm:hidden">
                      Filter by Availability
                    </label>
                    <div className="flex items-center">
                      <Filter className="mr-2 h-5 w-5 text-gray-400" />
                      <select
                        id="availability-filter"
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        value={filterAvailability}
                        onChange={(e) => setFilterAvailability(e.target.value)}
                      >
                        <option value="all">All Availability</option>
                        <option value="available">Available</option>
                        <option value="partial">Partial Availability</option>
                        <option value="limited">Limited Availability</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="skill-filter" className="block text-sm font-medium text-gray-700 mb-1 sm:hidden">
                      Filter by Skill
                    </label>
                    <div className="flex items-center">
                      <Filter className="mr-2 h-5 w-5 text-gray-400" />
                      <select
                        id="skill-filter"
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        value={filterSkill}
                        onChange={(e) => setFilterSkill(e.target.value)}
                      >
                        <option value="all">All Skills</option>
                        {allSkills.map((skill) => (
                          <option key={skill} value={skill}>{skill}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Team Member Utilization ({sortedTeamMembers?.length || 0})
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSortChange("name")}
                      >
                        <div className="flex items-center">
                          Team Member
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSortChange("role")}
                      >
                        <div className="flex items-center">
                          Role
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSortChange("utilization")}
                      >
                        <div className="flex items-center">
                          Utilization
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSortChange("availability")}
                      >
                        <div className="flex items-center">
                          Availability
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSortChange("projects")}
                      >
                        <div className="flex items-center">
                          Current Projects
                          <ArrowUpDown className="w-4 h-4 ml-1" />
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Skills
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedTeamMembers?.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-medium">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{member.name}</div>
                              <div className="text-xs text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getRoleWithIcon(member.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                              <div 
                                className={`h-2 rounded-full ${
                                  member.currentUtilization > 90 ? 'bg-red-500' :
                                  member.currentUtilization > 75 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`} 
                                style={{ width: `${member.currentUtilization}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-700">{member.currentUtilization}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getAvailabilityBadge(member.availability)}
                        </td>
                        <td className="px-6 py-4">
                          {member.currentProjects.length > 0 ? (
                            <div className="space-y-2">
                              {member.currentProjects.map((project, index) => (
                                <div key={index} className="flex items-center text-sm text-gray-900">
                                  <Package className="w-4 h-4 text-gray-500 mr-1" />
                                  <span>{project.name}</span>
                                  <span className="mx-1 text-gray-400">•</span>
                                  <span className="text-xs text-gray-500">
                                    {project.role}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500 italic">No active projects</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {member.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="bg-gray-100">
                                {skill}
                              </Badge>
                            ))}
                            {member.skills.length > 3 && (
                              <Badge variant="outline" className="bg-gray-100">
                                +{member.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedMember(member);
                              setIsAssignDialogOpen(true);
                            }}
                            className="text-primary hover:text-primary/80"
                          >
                            Assign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          {/* Project Needs Tab */}
          <TabsContent value="needs">
            <div className="space-y-8">
              {projectsNeedingResources && projectsNeedingResources.length > 0 ? (
                projectsNeedingResources.map((project) => (
                  <div key={project.id} className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-500">Client: {project.client}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${
                          project.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'in-progress' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Project Timeline</h4>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          <span>Start: {format(new Date(project.startDate), 'MMM d, yyyy')}</span>
                          <span className="mx-2">•</span>
                          <Clock className="w-4 h-4 mr-2 text-gray-500" />
                          <span>End: {format(new Date(project.endDate), 'MMM d, yyyy')}</span>
                          <span className="mx-2">•</span>
                          <span className="text-primary font-medium">
                            {differenceInCalendarDays(new Date(project.endDate), new Date())} days remaining
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Current Team</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {project.teamMembers.map((member, index) => {
                            const teamMember = teamMembers?.find(t => t.id === member.memberId);
                            return teamMember ? (
                              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-primary font-medium">
                                    {teamMember.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{teamMember.name}</div>
                                  <div className="text-xs text-gray-500">{member.role}</div>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Unfilled Positions</h4>
                        <div className="space-y-4">
                          {project.teamNeeds.filter(need => need.status === "unfilled").map((need, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center">
                                  <div className="mr-2">
                                    {roleIcons[need.role] || <UserCog className="w-5 h-5" />}
                                  </div>
                                  <div>
                                    <h5 className="text-md font-medium text-gray-900">
                                      {getRoleName(need.role)} ({need.count})
                                    </h5>
                                    <div className="text-xs text-gray-500">
                                      Required skills: {need.skills.join(", ")}
                                    </div>
                                  </div>
                                </div>
                                {getPriorityBadge(need.priority)}
                              </div>
                              
                              <h6 className="text-xs font-medium text-gray-500 uppercase mb-2">Suggested Team Members</h6>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {getSuitableMembersForNeed(need)?.slice(0, 4).map((member) => (
                                  <div key={member.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-medium text-xs">
                                          {member.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                      </div>
                                      <div className="ml-2">
                                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                                        <div className="text-xs text-gray-500">{member.currentUtilization}% utilized</div>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => {
                                        setSelectedMember(member);
                                        setSelectedProject(project);
                                        setAssignmentRole(getRoleName(need.role));
                                        setIsAssignDialogOpen(true);
                                      }}
                                      className="text-xs text-primary hover:text-primary/80"
                                    >
                                      Assign
                                    </button>
                                  </div>
                                ))}
                                
                                {getSuitableMembersForNeed(need)?.length === 0 && (
                                  <div className="col-span-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                                    <AlertCircle className="w-4 h-4 inline-block mr-1" />
                                    No suitable team members found with required skills and availability.
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-8 shadow rounded-lg text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No resource needs found</h3>
                  <p className="text-gray-500 mb-4">
                    All projects are currently fully staffed or there are no active projects.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Current Allocations Tab */}
          <TabsContent value="allocations">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Current Resource Allocations ({allocations?.length || 0})
                </h3>
              </div>
              
              {allocations && allocations.length > 0 ? (
                <div className="p-6">
                  <div className="space-y-6">
                    {projects?.map((project) => {
                      const projectAllocations = allocations.filter(a => a.projectId === project.id);
                      if (projectAllocations.length === 0) return null;
                      
                      return (
                        <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h4 className="font-medium text-gray-900">{project.name}</h4>
                            <p className="text-sm text-gray-500">Client: {project.client}</p>
                          </div>
                          <div className="divide-y divide-gray-200">
                            {projectAllocations.map((allocation) => {
                              const member = teamMembers?.find(m => m.id === allocation.memberId);
                              
                              return (
                                <div key={allocation.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                  <div className="flex items-center mb-3 sm:mb-0">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                      <span className="text-primary font-medium">
                                        {member?.name.split(' ').map(n => n[0]).join('') || '??'}
                                      </span>
                                    </div>
                                    <div className="ml-3">
                                      <div className="text-sm font-medium text-gray-900">
                                        {member?.name || 'Unknown Member'}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {allocation.role} • {allocation.allocationPercentage}% allocated
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col sm:items-end">
                                    <div className="text-sm text-gray-600 mb-2">
                                      {format(new Date(allocation.startDate), 'MMM d, yyyy')} - {format(new Date(allocation.endDate), 'MMM d, yyyy')}
                                    </div>
                                    <button
                                      onClick={() => handleRemoveAssignment(allocation.id)}
                                      className="text-xs text-red-600 hover:text-red-800"
                                    >
                                      Remove from project
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No allocations found</h3>
                  <p className="text-gray-500 mb-4">
                    There are currently no team members assigned to projects.
                  </p>
                  <Button
                    onClick={() => setIsAssignDialogOpen(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <UserCog className="w-4 h-4 mr-2" />
                    Assign Resources
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}