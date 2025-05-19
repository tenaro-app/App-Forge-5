import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Shield,
  Plus,
  Save,
  Loader2,
  Check,
  X,
  Info,
  Lock,
  User,
  Users,
  FileText,
  Settings,
  Package,
  CreditCard,
  MessageSquare,
  BarChart4,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

// Define permission categories and their permissions
const permissionCategories = [
  {
    id: 'clients',
    name: 'Client Management',
    icon: <User className="w-5 h-5" />,
    permissions: [
      { id: 'clients.view', name: 'View Clients', description: 'View client list and details' },
      { id: 'clients.create', name: 'Create Clients', description: 'Add new clients to the system' },
      { id: 'clients.edit', name: 'Edit Clients', description: 'Modify existing client information' },
      { id: 'clients.delete', name: 'Delete Clients', description: 'Remove clients from the system' }
    ]
  },
  {
    id: 'projects',
    name: 'Project Management',
    icon: <Package className="w-5 h-5" />,
    permissions: [
      { id: 'projects.view', name: 'View Projects', description: 'View project list and details' },
      { id: 'projects.create', name: 'Create Projects', description: 'Create new projects' },
      { id: 'projects.edit', name: 'Edit Projects', description: 'Modify existing project details' },
      { id: 'projects.delete', name: 'Delete Projects', description: 'Remove projects from the system' },
      { id: 'projects.milestones', name: 'Manage Milestones', description: 'Create and update project milestones' }
    ]
  },
  {
    id: 'team',
    name: 'Team Management',
    icon: <Users className="w-5 h-5" />,
    permissions: [
      { id: 'team.view', name: 'View Team', description: 'View team members and their details' },
      { id: 'team.create', name: 'Create Team Members', description: 'Add new team members' },
      { id: 'team.edit', name: 'Edit Team Members', description: 'Update team member information' },
      { id: 'team.delete', name: 'Delete Team Members', description: 'Remove team members from the system' },
      { id: 'team.assign', name: 'Assign to Projects', description: 'Assign team members to projects' }
    ]
  },
  {
    id: 'billing',
    name: 'Billing & Invoices',
    icon: <CreditCard className="w-5 h-5" />,
    permissions: [
      { id: 'billing.view', name: 'View Invoices', description: 'View all invoices and billing information' },
      { id: 'billing.create', name: 'Create Invoices', description: 'Generate new invoices' },
      { id: 'billing.edit', name: 'Edit Invoices', description: 'Modify existing invoice information' },
      { id: 'billing.delete', name: 'Delete Invoices', description: 'Remove invoices from the system' },
      { id: 'billing.payment', name: 'Process Payments', description: 'Process and record payments' }
    ]
  },
  {
    id: 'documents',
    name: 'Document Management',
    icon: <FileText className="w-5 h-5" />,
    permissions: [
      { id: 'documents.view', name: 'View Documents', description: 'View all documents' },
      { id: 'documents.create', name: 'Create Documents', description: 'Upload and create new documents' },
      { id: 'documents.edit', name: 'Edit Documents', description: 'Modify existing documents' },
      { id: 'documents.delete', name: 'Delete Documents', description: 'Remove documents from the system' },
      { id: 'documents.share', name: 'Share Documents', description: 'Share documents with clients or team members' }
    ]
  },
  {
    id: 'support',
    name: 'Support Management',
    icon: <MessageSquare className="w-5 h-5" />,
    permissions: [
      { id: 'support.view', name: 'View Tickets', description: 'View support tickets and conversations' },
      { id: 'support.respond', name: 'Respond to Tickets', description: 'Reply to support tickets' },
      { id: 'support.assign', name: 'Assign Tickets', description: 'Assign tickets to team members' },
      { id: 'support.close', name: 'Close Tickets', description: 'Mark tickets as resolved or closed' },
      { id: 'support.delete', name: 'Delete Tickets', description: 'Remove support tickets from the system' }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics & Reporting',
    icon: <BarChart4 className="w-5 h-5" />,
    permissions: [
      { id: 'analytics.view', name: 'View Analytics', description: 'Access analytics dashboard' },
      { id: 'analytics.export', name: 'Export Reports', description: 'Export analytics reports' },
      { id: 'analytics.customize', name: 'Customize Reports', description: 'Create and customize reports' }
    ]
  },
  {
    id: 'settings',
    name: 'System Settings',
    icon: <Settings className="w-5 h-5" />,
    permissions: [
      { id: 'settings.view', name: 'View Settings', description: 'View system settings' },
      { id: 'settings.edit', name: 'Edit Settings', description: 'Modify system settings' },
      { id: 'settings.users', name: 'Manage Users', description: 'Manage user accounts and permissions' },
      { id: 'settings.roles', name: 'Manage Roles', description: 'Create and modify user roles' }
    ]
  }
];

// Dummy role data for development
const dummyRoles = [
  {
    id: 1,
    name: 'Administrator',
    description: 'Full system access with all permissions',
    isSystem: true,
    permissions: permissionCategories.flatMap(category => 
      category.permissions.map(permission => permission.id)
    ),
    userCount: 2
  },
  {
    id: 2,
    name: 'Project Manager',
    description: 'Manages client projects and team assignments',
    isSystem: true,
    permissions: [
      'clients.view', 'clients.edit',
      'projects.view', 'projects.create', 'projects.edit', 'projects.milestones',
      'team.view', 'team.assign',
      'billing.view',
      'documents.view', 'documents.create', 'documents.edit', 'documents.share',
      'support.view', 'support.respond', 'support.assign', 'support.close',
      'analytics.view', 'analytics.export'
    ],
    userCount: 3
  },
  {
    id: 3,
    name: 'Developer',
    description: 'Works on assigned projects with limited access',
    isSystem: true,
    permissions: [
      'clients.view',
      'projects.view', 'projects.milestones',
      'team.view',
      'documents.view', 'documents.create', 'documents.edit',
      'support.view', 'support.respond'
    ],
    userCount: 5
  },
  {
    id: 4,
    name: 'Support Specialist',
    description: 'Handles client support tickets and inquiries',
    isSystem: true,
    permissions: [
      'clients.view',
      'projects.view',
      'support.view', 'support.respond', 'support.assign', 'support.close',
      'documents.view'
    ],
    userCount: 2
  },
  {
    id: 5,
    name: 'Client Success Manager',
    description: 'Manages client relationships and success metrics',
    isSystem: false,
    permissions: [
      'clients.view', 'clients.edit',
      'projects.view',
      'billing.view',
      'documents.view', 'documents.share',
      'support.view', 'support.respond',
      'analytics.view'
    ],
    userCount: 1
  }
];

export default function RolePermissions() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // UI state
  const [activeTab, setActiveTab] = useState("roles");
  const [editingRole, setEditingRole] = useState<typeof dummyRoles[0] | null>(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);
  
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
  
  // Fetch roles
  const { 
    data: roles, 
    isLoading: isRolesLoading 
  } = useQuery({
    queryKey: ["/api/admin/roles"],
    enabled: isAuthenticated && isAdmin,
    // For development we're using dummy data
    initialData: dummyRoles
  });
  
  // Create role mutation
  const createRoleMutation = useMutation({
    mutationFn: async ({ name, description, permissions }: { name: string; description: string; permissions: string[] }) => {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This would be a real API call in production
      const response = await apiRequest("POST", "/api/admin/roles", {
        name,
        description,
        permissions
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create role: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roles"] });
      setIsCreateDialogOpen(false);
      setNewRoleName("");
      setNewRoleDescription("");
      setNewRolePermissions([]);
      toast({
        title: "Role created",
        description: "The role has been successfully created.",
        action: (
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-5 w-5 text-green-600" />
          </div>
        ),
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create role",
        description: error.message,
        variant: "destructive",
        action: (
          <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
            <X className="h-5 w-5 text-red-600" />
          </div>
        ),
      });
    },
  });
  
  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, name, description, permissions }: { id: number; name: string; description: string; permissions: string[] }) => {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This would be a real API call in production
      const response = await apiRequest("PUT", `/api/admin/roles/${id}`, {
        name,
        description,
        permissions
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update role: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roles"] });
      setEditingRole(null);
      toast({
        title: "Role updated",
        description: "The role has been successfully updated.",
        action: (
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-5 w-5 text-green-600" />
          </div>
        ),
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update role",
        description: error.message,
        variant: "destructive",
        action: (
          <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
            <X className="h-5 w-5 text-red-600" />
          </div>
        ),
      });
    },
  });
  
  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: async (id: number) => {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This would be a real API call in production
      const response = await apiRequest("DELETE", `/api/admin/roles/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to delete role: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/roles"] });
      setIsDeleteDialogOpen(false);
      setRoleToDelete(null);
      toast({
        title: "Role deleted",
        description: "The role has been successfully deleted.",
        action: (
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-5 w-5 text-green-600" />
          </div>
        ),
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete role",
        description: error.message,
        variant: "destructive",
        action: (
          <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
            <X className="h-5 w-5 text-red-600" />
          </div>
        ),
      });
    },
  });
  
  // Handle create role
  const handleCreateRole = () => {
    if (!newRoleName) {
      toast({
        title: "Validation Error",
        description: "Role name is required.",
        variant: "destructive",
      });
      return;
    }
    
    createRoleMutation.mutate({
      name: newRoleName,
      description: newRoleDescription,
      permissions: newRolePermissions
    });
  };
  
  // Handle update role
  const handleUpdateRole = () => {
    if (!editingRole) return;
    
    updateRoleMutation.mutate({
      id: editingRole.id,
      name: editingRole.name,
      description: editingRole.description,
      permissions: editingRole.permissions
    });
  };
  
  // Handle delete role
  const handleDeleteRole = () => {
    if (roleToDelete !== null) {
      deleteRoleMutation.mutate(roleToDelete);
    }
  };
  
  // Toggle permission for editing role
  const togglePermission = (permissionId: string) => {
    if (!editingRole) return;
    
    const newPermissions = [...editingRole.permissions];
    const index = newPermissions.indexOf(permissionId);
    
    if (index === -1) {
      newPermissions.push(permissionId);
    } else {
      newPermissions.splice(index, 1);
    }
    
    setEditingRole({
      ...editingRole,
      permissions: newPermissions
    });
  };
  
  // Toggle permission for new role
  const toggleNewPermission = (permissionId: string) => {
    const newPermissions = [...newRolePermissions];
    const index = newPermissions.indexOf(permissionId);
    
    if (index === -1) {
      newPermissions.push(permissionId);
    } else {
      newPermissions.splice(index, 1);
    }
    
    setNewRolePermissions(newPermissions);
  };
  
  // Toggle all permissions in a category for editing role
  const toggleCategoryPermissions = (categoryId: string, enabled: boolean) => {
    if (!editingRole) return;
    
    const category = permissionCategories.find(c => c.id === categoryId);
    if (!category) return;
    
    const categoryPermissionIds = category.permissions.map(p => p.id);
    let newPermissions = [...editingRole.permissions];
    
    if (enabled) {
      // Add all permissions from this category that aren't already included
      categoryPermissionIds.forEach(id => {
        if (!newPermissions.includes(id)) {
          newPermissions.push(id);
        }
      });
    } else {
      // Remove all permissions from this category
      newPermissions = newPermissions.filter(id => !categoryPermissionIds.includes(id));
    }
    
    setEditingRole({
      ...editingRole,
      permissions: newPermissions
    });
  };
  
  // Toggle all permissions in a category for new role
  const toggleNewCategoryPermissions = (categoryId: string, enabled: boolean) => {
    const category = permissionCategories.find(c => c.id === categoryId);
    if (!category) return;
    
    const categoryPermissionIds = category.permissions.map(p => p.id);
    let newPermissions = [...newRolePermissions];
    
    if (enabled) {
      // Add all permissions from this category that aren't already included
      categoryPermissionIds.forEach(id => {
        if (!newPermissions.includes(id)) {
          newPermissions.push(id);
        }
      });
    } else {
      // Remove all permissions from this category
      newPermissions = newPermissions.filter(id => !categoryPermissionIds.includes(id));
    }
    
    setNewRolePermissions(newPermissions);
  };
  
  // Check if all permissions in a category are selected
  const areCategoryPermissionsSelected = (categoryId: string, permissions: string[]) => {
    const category = permissionCategories.find(c => c.id === categoryId);
    if (!category) return false;
    
    return category.permissions.every(p => permissions.includes(p.id));
  };
  
  // Check if any permissions in a category are selected
  const areAnyCategoryPermissionsSelected = (categoryId: string, permissions: string[]) => {
    const category = permissionCategories.find(c => c.id === categoryId);
    if (!category) return false;
    
    return category.permissions.some(p => permissions.includes(p.id));
  };
  
  if (isAuthLoading || isRolesLoading) {
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
        <div className="mb-8 flex items-center">
          <Shield className="h-8 w-8 text-gray-500 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Role & Permission Management</h1>
            <p className="mt-1 text-gray-600">
              Manage user roles and their access permissions
            </p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="roles" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              Permissions
            </TabsTrigger>
          </TabsList>
          
          {/* Roles Tab */}
          <TabsContent value="roles">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">User Roles</h3>
                
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Role</DialogTitle>
                      <DialogDescription>
                        Define a new role and its permissions.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 my-4">
                      <div className="space-y-2">
                        <Label htmlFor="roleName">Role Name *</Label>
                        <Input
                          id="roleName"
                          value={newRoleName}
                          onChange={(e) => setNewRoleName(e.target.value)}
                          placeholder="e.g. Sales Manager"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="roleDescription">Description</Label>
                        <Input
                          id="roleDescription"
                          value={newRoleDescription}
                          onChange={(e) => setNewRoleDescription(e.target.value)}
                          placeholder="e.g. Manages sales activities and client relationships"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="mb-2 block">Permissions</Label>
                        <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                          {permissionCategories.map((category) => (
                            <div key={category.id} className="border border-gray-200 rounded-md overflow-hidden">
                              <div className="bg-gray-50 p-3 flex items-center justify-between border-b border-gray-200">
                                <div className="flex items-center">
                                  <div className="mr-2">{category.icon}</div>
                                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                                </div>
                                <Switch
                                  checked={areCategoryPermissionsSelected(category.id, newRolePermissions)}
                                  onCheckedChange={(checked) => toggleNewCategoryPermissions(category.id, checked)}
                                />
                              </div>
                              <div className="p-3 divide-y divide-gray-100">
                                {category.permissions.map((permission) => (
                                  <div key={permission.id} className="py-2 flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-gray-700">{permission.name}</p>
                                      <p className="text-xs text-gray-500">{permission.description}</p>
                                    </div>
                                    <Switch
                                      checked={newRolePermissions.includes(permission.id)}
                                      onCheckedChange={() => toggleNewPermission(permission.id)}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateRole}
                        disabled={createRoleMutation.isPending}
                      >
                        {createRoleMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Create Role
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="p-6">
                {/* System Roles */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">System Roles</h4>
                  <div className="space-y-4">
                    {roles && roles.filter(role => role.isSystem).map((role) => (
                      <div key={role.id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <h5 className="text-lg font-medium text-gray-900">{role.name}</h5>
                              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                System
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{role.description}</p>
                            <p className="mt-2 text-xs text-gray-500">{role.userCount} users with this role</p>
                          </div>
                          <div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingRole(role)}
                            >
                              View Permissions
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Custom Roles */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Custom Roles</h4>
                  <div className="space-y-4">
                    {roles && roles.filter(role => !role.isSystem).length > 0 ? (
                      roles.filter(role => !role.isSystem).map((role) => (
                        <div key={role.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <div className="px-6 py-4 flex justify-between items-start">
                            <div>
                              <h5 className="text-lg font-medium text-gray-900">{role.name}</h5>
                              <p className="mt-1 text-sm text-gray-500">{role.description}</p>
                              <p className="mt-2 text-xs text-gray-500">{role.userCount} users with this role</p>
                            </div>
                            <div className="space-x-2 flex">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingRole(role)}
                              >
                                Edit Role
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setRoleToDelete(role.id);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No custom roles yet</h3>
                        <p className="text-gray-500 mb-4">
                          Create custom roles to define specific access levels for your team.
                        </p>
                        <Button
                          onClick={() => setIsCreateDialogOpen(true)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create First Role
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Permissions Tab */}
          <TabsContent value="permissions">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">System Permissions</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Overview of all available permissions in the system
                </p>
              </div>
              
              <div className="p-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Permissions cannot be created or deleted. They are predefined based on system features. Create roles to define which users get which permissions.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Accordion type="multiple" className="space-y-4">
                  {permissionCategories.map((category) => (
                    <AccordionItem
                      key={category.id}
                      value={category.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-center">
                          <div className="mr-3 bg-gray-100 p-2 rounded-full">
                            {category.icon}
                          </div>
                          <span className="font-medium text-gray-900">{category.name}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="border-t border-gray-200 pt-4 divide-y divide-gray-100">
                          {category.permissions.map((permission) => (
                            <div key={permission.id} className="py-3">
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">{permission.name}</p>
                                  <p className="text-sm text-gray-500">{permission.description}</p>
                                </div>
                                <div className="text-xs text-gray-500">
                                  Permission ID: {permission.id}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Edit Role Dialog */}
      {editingRole && (
        <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editingRole.isSystem ? 'View Role Permissions' : 'Edit Role'}</DialogTitle>
              <DialogDescription>
                {editingRole.isSystem
                  ? `View permissions for the ${editingRole.name} role.`
                  : `Modify permissions for the ${editingRole.name} role.`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 my-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editRoleName">Role Name</Label>
                  <Input
                    id="editRoleName"
                    value={editingRole.name}
                    onChange={(e) => setEditingRole({...editingRole, name: e.target.value})}
                    disabled={editingRole.isSystem}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editRoleDescription">Description</Label>
                  <Input
                    id="editRoleDescription"
                    value={editingRole.description}
                    onChange={(e) => setEditingRole({...editingRole, description: e.target.value})}
                    disabled={editingRole.isSystem}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="mb-2 block">Permissions</Label>
                  {editingRole.isSystem && (
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      System Role - Permissions cannot be modified
                    </div>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                  {permissionCategories.map((category) => (
                    <div key={category.id} className="border border-gray-200 rounded-md overflow-hidden">
                      <div className="bg-gray-50 p-3 flex items-center justify-between border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="mr-2">{category.icon}</div>
                          <h4 className="font-medium text-gray-900">{category.name}</h4>
                        </div>
                        <Switch
                          checked={areCategoryPermissionsSelected(category.id, editingRole.permissions)}
                          onCheckedChange={(checked) => toggleCategoryPermissions(category.id, checked)}
                          disabled={editingRole.isSystem}
                        />
                      </div>
                      <div className="p-3 divide-y divide-gray-100">
                        {category.permissions.map((permission) => (
                          <div key={permission.id} className="py-2 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">{permission.name}</p>
                              <p className="text-xs text-gray-500">{permission.description}</p>
                            </div>
                            <Switch
                              checked={editingRole.permissions.includes(permission.id)}
                              onCheckedChange={() => togglePermission(permission.id)}
                              disabled={editingRole.isSystem}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditingRole(null)}
              >
                {editingRole.isSystem ? 'Close' : 'Cancel'}
              </Button>
              {!editingRole.isSystem && (
                <Button
                  onClick={handleUpdateRole}
                  disabled={updateRoleMutation.isPending}
                >
                  {updateRoleMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Role Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Users with this role will lose these permissions and need to be reassigned to a different role.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setRoleToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRole}
              disabled={deleteRoleMutation.isPending}
            >
              {deleteRoleMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Role
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}