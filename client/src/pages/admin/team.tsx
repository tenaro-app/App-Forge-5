import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Mail, 
  Phone, 
  Calendar, 
  MoreHorizontal,
  UserPlus,
  Search,
  Filter
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminTeam() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [newTeamDialogOpen, setNewTeamDialogOpen] = useState(false);
  
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
  const { data: teamMembers, isLoading: isTeamLoading } = useQuery({
    queryKey: ["/api/admin/team"],
    enabled: isAuthenticated && isAdmin,
    // For development, we're using dummy data
    placeholderData: [
      {
        id: "1",
        firstName: "John",
        lastName: "Smith",
        email: "john@appforge.com",
        phone: "+1 (555) 123-4567",
        role: "admin",
        department: "Management",
        title: "CEO & Lead Developer",
        joinDate: new Date(2022, 0, 15).toISOString(),
        profileImageUrl: null,
        status: "active"
      },
      {
        id: "2",
        firstName: "Sarah",
        lastName: "Davis",
        email: "sarah@appforge.com",
        phone: "+1 (555) 234-5678",
        role: "support",
        department: "Customer Support",
        title: "Customer Success Manager",
        joinDate: new Date(2022, 3, 10).toISOString(),
        profileImageUrl: null,
        status: "active"
      },
      {
        id: "3",
        firstName: "Mike",
        lastName: "Lee",
        email: "mike@appforge.com",
        phone: "+1 (555) 345-6789",
        role: "admin",
        department: "Development",
        title: "Lead Developer",
        joinDate: new Date(2022, 2, 5).toISOString(),
        profileImageUrl: null,
        status: "active"
      },
      {
        id: "4",
        firstName: "Lisa",
        lastName: "Chen",
        email: "lisa@appforge.com",
        phone: "+1 (555) 456-7890",
        role: "support",
        department: "Design",
        title: "UI/UX Designer",
        joinDate: new Date(2022, 5, 20).toISOString(),
        profileImageUrl: null,
        status: "active"
      },
      {
        id: "5",
        firstName: "David",
        lastName: "Johnson",
        email: "david@appforge.com",
        phone: "+1 (555) 567-8901",
        role: "developer",
        department: "Development",
        title: "Senior Developer",
        joinDate: new Date(2022, 6, 12).toISOString(),
        profileImageUrl: null,
        status: "active"
      },
      {
        id: "6",
        firstName: "Emily",
        lastName: "Wilson",
        email: "emily@appforge.com",
        phone: "+1 (555) 678-9012",
        role: "developer",
        department: "Development",
        title: "Junior Developer",
        joinDate: new Date(2023, 1, 8).toISOString(),
        profileImageUrl: null,
        status: "active"
      }
    ]
  });

  // Delete team member mutation (would connect to backend in production)
  const deleteTeamMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Team member deleted",
        description: "The team member has been successfully removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete team member",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const handleDeleteTeamMember = (memberId: string) => {
    if (window.confirm("Are you sure you want to delete this team member? This action cannot be undone.")) {
      deleteTeamMemberMutation.mutate(memberId);
    }
  };

  // Filter team members by search query and role
  const filteredTeamMembers = teamMembers?.filter((member) => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      fullName.includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  if (isAuthLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect in useEffect
  }

  // Function to get role badge with appropriate style
  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Badge className="bg-primary">Admin</Badge>;
      case "support":
        return <Badge className="bg-blue-500">Support</Badge>;
      case "developer":
        return <Badge className="bg-green-500">Developer</Badge>;
      default:
        return <Badge className="bg-gray-500">{role}</Badge>;
    }
  };

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
                    className="px-3 py-2 rounded-md text-sm font-medium bg-gray-800 text-white"
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Team Management</h1>
            <p className="text-gray-600 mt-1">
              Manage your team members and their permissions
            </p>
          </div>
          <Dialog open={newTeamDialogOpen} onOpenChange={setNewTeamDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Team Member</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new team member to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="firstName" className="text-right">
                    First Name
                  </label>
                  <Input id="firstName" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="lastName" className="text-right">
                    Last Name
                  </label>
                  <Input id="lastName" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="text-right">
                    Email
                  </label>
                  <Input id="email" type="email" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="role" className="text-right">
                    Role
                  </label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="department" className="text-right">
                    Department
                  </label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="management">Management</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="support">Customer Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewTeamDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "Team member added",
                    description: "The new team member has been successfully added.",
                  });
                  setNewTeamDialogOpen(false);
                }}>
                  Add Member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search team members..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by role" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isTeamLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : filteredTeamMembers?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeamMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex justify-end">
                    {getRoleBadge(member.role)}
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-2">
                      <AvatarImage src={member.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${member.firstName} ${member.lastName}`)}&background=dc2626&color=fff`} />
                      <AvatarFallback className="bg-primary text-white text-xl">
                        {member.firstName[0]}{member.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="mt-2">{member.firstName} {member.lastName}</CardTitle>
                    <CardDescription className="text-base font-medium text-gray-700">
                      {member.title}
                    </CardDescription>
                    <CardDescription>
                      {member.department}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 pb-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Joined {formatDate(member.joinDate)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="mt-6 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setLocation(`/admin/team/${member.id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setLocation(`/admin/team/${member.id}`)}>
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.location.href = `mailto:${member.email}`}>
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLocation(`/admin/team/${member.id}/assignments`)}>
                        View Assignments
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteTeamMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-gray-50">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No team members found</h3>
            <p className="mt-2 text-gray-500">No team members match your current filters.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}