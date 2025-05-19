import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { 
  ArrowLeft, 
  Search, 
  UserPlus, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Shield
} from "lucide-react";

// Dummy data for team members
const teamMembers = [
  { 
    id: 1, 
    name: "Sarah Johnson", 
    role: "Project Manager",
    email: "sarah.johnson@appforge.io",
    phone: "+1 (555) 123-4567",
    status: "active",
    avatar: null,
    projects: ["E-commerce Dashboard", "CRM Integration"],
    isAdmin: true
  },
  { 
    id: 2, 
    name: "Michael Lee", 
    role: "Lead Developer",
    email: "michael.lee@appforge.io",
    phone: "+1 (555) 234-5678",
    status: "active",
    avatar: null,
    projects: ["E-commerce Dashboard", "Inventory System"],
    isAdmin: false
  },
  { 
    id: 3, 
    name: "Emily Chen", 
    role: "UI/UX Designer",
    email: "emily.chen@appforge.io",
    phone: "+1 (555) 345-6789",
    status: "active",
    avatar: null,
    projects: ["E-commerce Dashboard", "CRM Integration", "Inventory System"],
    isAdmin: false
  },
  { 
    id: 4, 
    name: "David Wilson", 
    role: "Backend Developer",
    email: "david.wilson@appforge.io",
    phone: "+1 (555) 456-7890",
    status: "active",
    avatar: null,
    projects: ["CRM Integration"],
    isAdmin: false
  },
  { 
    id: 5, 
    name: "James Taylor", 
    role: "DevOps Engineer",
    email: "james.taylor@appforge.io",
    phone: "+1 (555) 567-8901",
    status: "inactive",
    avatar: null,
    projects: ["Inventory System"],
    isAdmin: false
  }
];

export default function Team() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [isAuthLoading, isAuthenticated]);
  
  // Filter team members based on search query and selected role
  const filteredTeamMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole ? member.role === selectedRole : true;
    return matchesSearch && matchesRole;
  });
  
  // Get unique roles for filter
  const roles = Array.from(new Set(teamMembers.map(member => member.role)));
  
  if (isAuthLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <button 
                onClick={() => setLocation("/dashboard")}
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Team Management</h1>
            </div>
            <div>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Team Member
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="relative flex-grow max-w-md">
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
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <label htmlFor="role-filter" className="sr-only">Filter by role</label>
              <select
                id="role-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                value={selectedRole || ""}
                onChange={(e) => setSelectedRole(e.target.value || null)}
              >
                <option value="">All Roles</option>
                {roles.map((role, index) => (
                  <option key={index} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Team Members List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Team Members ({filteredTeamMembers.length})
            </h3>
            {selectedRole && (
              <button 
                onClick={() => setSelectedRole(null)}
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                Clear Filter
              </button>
            )}
          </div>
          
          {filteredTeamMembers.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredTeamMembers.map((member) => (
                <li key={member.id} className="px-6 py-5 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary text-lg font-semibold">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium text-gray-900">{member.name}</h4>
                          {member.isAdmin && (
                            <span className="ml-2 flex items-center text-xs font-medium text-indigo-600">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{member.role}</div>
                        <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {member.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {member.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`mr-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                      <button className="text-gray-400 hover:text-gray-500">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-xs font-medium text-gray-500 mb-1">Assigned to projects:</div>
                    <div className="flex flex-wrap gap-2">
                      {member.projects.map((project, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {project}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-1">No team members found</h3>
              <p className="text-gray-500">
                {searchQuery ? `No team members match your search for "${searchQuery}"` : 'No team members in this category yet'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}