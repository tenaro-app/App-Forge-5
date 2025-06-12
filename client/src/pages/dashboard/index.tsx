import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { Redirect } from 'wouter';
import { 
  FolderOpen, 
  Clock, 
  MessageSquare, 
  FileText, 
  Calendar,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  User,
  Phone,
  Mail
} from 'lucide-react';

interface Project {
  id: number;
  name: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string;
  description: string;
}

export default function ClientDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    enabled: !!user,
  });

  const { data: tickets = [], isLoading: ticketsLoading } = useQuery<any[]>({
    queryKey: ['/api/chat/tickets'],
    enabled: !!user,
  });

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Redirect to="/auth" />;
  }

  // Redirect admins to admin dashboard
  if (!isLoading && user?.role === 'admin') {
    return <Redirect to="/admin" />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'on_hold':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Track your automation projects and get support
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-gray-500">{user?.company}</p>
              </div>
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt={user.firstName || 'User'} 
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'active' || p.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Projects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <MessageSquare className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter((t: any) => t.status === 'open').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Projects */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">My Projects</h2>
              <p className="text-gray-600 mt-1">Track your automation project progress</p>
            </div>
            <div className="p-6">
              {projectsLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8">
                  <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No projects assigned yet</p>
                  <p className="text-sm text-gray-400 mt-1">Contact support to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-4">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${project.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          {project.progress || 0}%
                        </span>
                      </div>
                    </div>
                  ))}
                  {projects.length > 3 && (
                    <div className="text-center pt-4">
                      <a href="/dashboard/projects" className="text-primary hover:underline text-sm">
                        View all projects ({projects.length})
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Support & Communication */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Support & Communication</h2>
              <p className="text-gray-600 mt-1">Get help and track support requests</p>
            </div>
            <div className="p-6 space-y-4">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href="/dashboard/chat"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Live Chat</p>
                    <p className="text-xs text-gray-600">Get instant help</p>
                  </div>
                </a>
                <a 
                  href="/dashboard/tickets/new"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-5 h-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">New Ticket</p>
                    <p className="text-xs text-gray-600">Submit request</p>
                  </div>
                </a>
              </div>

              {/* Recent Tickets */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Recent Support Tickets</h3>
                {ticketsLoading ? (
                  <div className="animate-pulse space-y-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : tickets.length === 0 ? (
                  <p className="text-gray-500 text-sm">No support tickets yet</p>
                ) : (
                  <div className="space-y-2">
                    {tickets.slice(0, 2).map((ticket: any) => (
                      <div key={ticket.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-sm text-gray-900">{ticket.subject}</p>
                          <p className="text-xs text-gray-600">{ticket.category}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                    ))}
                    {tickets.length > 2 && (
                      <div className="text-center pt-2">
                        <a href="/dashboard/tickets" className="text-primary hover:underline text-sm">
                          View all tickets
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a 
              href="/dashboard/projects"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FolderOpen className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-medium text-gray-900">All Projects</span>
            </a>
            <a 
              href="/dashboard/tickets"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-medium text-gray-900">Support Tickets</span>
            </a>
            <a 
              href="/dashboard/billing"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-medium text-gray-900">Billing</span>
            </a>
            <a 
              href="/dashboard/settings"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <User className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-medium text-gray-900">Settings</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}