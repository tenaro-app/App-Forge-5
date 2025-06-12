import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Redirect } from 'wouter';
import { 
  Users, 
  FolderOpen, 
  MessageSquare, 
  Settings,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Redirect if not authenticated or not admin
  if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
    return <Redirect to="/auth" />;
  }

  const { data: allProjects = [], isLoading: projectsLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/projects'],
    enabled: !!user && user.role === 'admin',
  });

  const { data: allContacts = [], isLoading: contactsLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/contacts'],
    enabled: !!user && user.role === 'admin',
  });

  const { data: allTickets = [], isLoading: ticketsLoading } = useQuery<any[]>({
    queryKey: ['/api/chat/tickets'],
    enabled: !!user && user.role === 'admin',
  });

  const { data: allLeads = [], isLoading: leadsLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/consultation-leads'],
    enabled: !!user && user.role === 'admin',
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeProjects = allProjects.filter((p: any) => p.status === 'active' || p.status === 'in_progress');
  const openTickets = allTickets.filter((t: any) => t.status === 'open' || t.status === 'pending');
  const recentContacts = allContacts.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage clients, projects, and system operations</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin: {user?.firstName}</p>
                <p className="text-sm text-gray-500">System Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900">{allProjects.length}</p>
                <p className="text-sm text-green-600 mt-1">{activeProjects.length} active</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Consultation Leads</p>
                <p className="text-3xl font-bold text-gray-900">{allLeads.length}</p>
                <p className="text-sm text-blue-600 mt-1">{allLeads.filter((l: any) => l.status === 'new').length} new</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-3xl font-bold text-gray-900">{openTickets.length}</p>
                <p className="text-sm text-yellow-600 mt-1">Needs attention</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <MessageSquare className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-gray-900">$42,500</p>
                <p className="text-sm text-green-600 mt-1">+12% this month</p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Project Management</h2>
                <a href="/admin/projects" className="text-primary hover:underline text-sm">View all</a>
              </div>
            </div>
            <div className="p-6">
              {projectsLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : allProjects.length === 0 ? (
                <div className="text-center py-8">
                  <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No projects yet</p>
                  <button className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
                    Create First Project
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {allProjects.slice(0, 4).map((project: any) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{project.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">Client: {project.clientName || 'Unassigned'}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${project.status === 'active' ? 'bg-green-100 text-green-800' : 
                              project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'}`}>
                            {project.status}
                          </span>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${project.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{project.progress || 0}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a href="/admin/clients" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Users className="w-5 h-5 text-primary mr-3" />
                  <span className="font-medium text-gray-900">Manage Clients</span>
                </a>
                <a href="/admin/projects/new" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Plus className="w-5 h-5 text-primary mr-3" />
                  <span className="font-medium text-gray-900">New Project</span>
                </a>
                <a href="/admin/clients/new" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Users className="w-5 h-5 text-primary mr-3" />
                  <span className="font-medium text-gray-900">Add Client</span>
                </a>
                <a href="/admin/leads" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Users className="w-5 h-5 text-primary mr-3" />
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">Consultation Leads</span>
                    {allLeads.filter((l: any) => l.status === 'new').length > 0 && (
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {allLeads.filter((l: any) => l.status === 'new').length} new
                      </span>
                    )}
                  </div>
                </a>
                <a href="/admin/support" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageSquare className="w-5 h-5 text-primary mr-3" />
                  <span className="font-medium text-gray-900">Support Center</span>
                </a>
                <a href="/admin/settings" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Settings className="w-5 h-5 text-primary mr-3" />
                  <span className="font-medium text-gray-900">System Settings</span>
                </a>
              </div>
            </div>

            {/* Urgent Alerts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Urgent Alerts</h3>
              <div className="space-y-3">
                {openTickets.length > 0 && (
                  <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                    <div>
                      <p className="font-medium text-red-900">{openTickets.length} open support tickets</p>
                      <p className="text-sm text-red-700">Require immediate attention</p>
                    </div>
                  </div>
                )}
                
                {activeProjects.filter((p: any) => new Date(p.endDate) < new Date()).length > 0 && (
                  <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="font-medium text-yellow-900">Overdue projects</p>
                      <p className="text-sm text-yellow-700">Need timeline review</p>
                    </div>
                  </div>
                )}

                {allContacts.length > 5 && (
                  <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-blue-900">New leads waiting</p>
                      <p className="text-sm text-blue-700">Follow up required</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Contacts & System Overview */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Contacts */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Recent Leads</h2>
                <a href="/admin/contacts" className="text-primary hover:underline text-sm">View all</a>
              </div>
            </div>
            <div className="p-6">
              {contactsLoading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : recentContacts.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No new contacts</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentContacts.map((contact: any) => (
                    <div key={contact.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                        <p className="text-xs text-gray-500">{contact.company}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <Edit className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Server Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-green-600">Online</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Database</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-green-600">Healthy</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Email Service</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Storage Usage</span>
                <span className="text-sm text-gray-600">68% (34GB/50GB)</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}