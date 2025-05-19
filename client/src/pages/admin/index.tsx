import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useQuery } from "@tanstack/react-query";
import { 
  Users,
  Package,
  MessageSquare,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  BarChart4,
  PieChart,
  UserCog,
  Briefcase,
  Bell,
  Search
} from "lucide-react";
import { format } from "date-fns";

// Dummy data (will be replaced with API data in production)
const dummyOverviewData = {
  activeClients: 12,
  totalProjects: 27,
  activeProjects: 18,
  supportTickets: 5,
  teamMembers: 15,
  recentActivities: [
    {
      id: 1,
      type: "project_milestone",
      content: "E-commerce Dashboard - Completed milestone: 'User Authentication Module'",
      timestamp: new Date(2023, 5, 15, 10, 30), // June 15, 2023, 10:30 AM
      projectId: 1,
      projectName: "E-commerce Dashboard",
      userId: "1",
      userName: "Sarah Johnson"
    },
    {
      id: 2,
      type: "new_project",
      content: "New project created: 'CRM Integration' for Beta Industries",
      timestamp: new Date(2023, 5, 14, 14, 15), // June 14, 2023, 2:15 PM
      projectId: 2,
      projectName: "CRM Integration",
      userId: "6",
      userName: "Alex Smith"
    },
    {
      id: 3,
      type: "support_message",
      content: "New support message from Gamma Solutions regarding Inventory System",
      timestamp: new Date(2023, 5, 14, 9, 45), // June 14, 2023, 9:45 AM
      projectId: 3,
      projectName: "Inventory System",
      userId: "3",
      userName: "Robert Johnson"
    },
    {
      id: 4,
      type: "team_assignment",
      content: "Michael Lee assigned to 'HR Portal' project",
      timestamp: new Date(2023, 5, 13, 16, 20), // June 13, 2023, 4:20 PM
      projectId: 4,
      projectName: "HR Portal",
      userId: "2",
      userName: "Michael Lee"
    },
    {
      id: 5,
      type: "project_status",
      content: "'Content Management System' project status updated to On Hold",
      timestamp: new Date(2023, 5, 13, 11, 10), // June 13, 2023, 11:10 AM
      projectId: 5,
      projectName: "Content Management System",
      userId: "6",
      userName: "Alex Smith"
    }
  ],
  projectsByStatus: [
    { status: "planning", count: 4 },
    { status: "in-progress", count: 12 },
    { status: "on-hold", count: 2 },
    { status: "completed", count: 8 },
    { status: "cancelled", count: 1 }
  ],
  projectsByMonth: [
    { month: "Jan", count: 2 },
    { month: "Feb", count: 3 },
    { month: "Mar", count: 1 },
    { month: "Apr", count: 5 },
    { month: "May", count: 3 },
    { month: "Jun", count: 4 },
    { month: "Jul", count: 0 },
    { month: "Aug", count: 0 },
    { month: "Sep", count: 0 },
    { month: "Oct", count: 0 },
    { month: "Nov", count: 0 },
    { month: "Dec", count: 0 }
  ],
  upcomingDeadlines: [
    {
      id: 1,
      projectName: "CRM Integration",
      milestoneName: "API Integration Module",
      dueDate: new Date(2023, 5, 20), // June 20, 2023
      clientName: "Beta Industries",
      progress: 65
    },
    {
      id: 2,
      projectName: "E-commerce Dashboard",
      milestoneName: "Payment Processing Feature",
      dueDate: new Date(2023, 5, 25), // June 25, 2023
      clientName: "Acme Corp",
      progress: 40
    },
    {
      id: 3,
      projectName: "Content Management System",
      milestoneName: "Content Editor Interface",
      dueDate: new Date(2023, 6, 5), // July 5, 2023
      clientName: "Beta Industries",
      progress: 25
    }
  ]
};

export default function AdminDashboard() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  const currentDate = new Date();
  
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
  
  // Fetch overview data
  const { 
    data: overviewData, 
    isLoading: isOverviewDataLoading 
  } = useQuery({
    queryKey: ["/api/admin/overview"],
    enabled: isAuthenticated && isAdmin,
    // For development we're using dummy data
    initialData: dummyOverviewData
  });
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project_milestone":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "new_project":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "support_message":
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case "team_assignment":
        return <UserCog className="h-5 w-5 text-orange-500" />;
      case "project_status":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} sec ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hr ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    return format(new Date(date), 'MMM d, yyyy');
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
                    className="px-3 py-2 rounded-md text-sm font-medium bg-gray-800 text-white"
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
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-gray-600">
                Overview of all system activities and key metrics
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="relative max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Today is {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5 flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium text-sm">Active Clients</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {isOverviewDataLoading ? "..." : overviewData?.activeClients}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="bg-blue-50 px-5 py-2">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setLocation("/admin/clients"); }}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View all clients →
              </a>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5 flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium text-sm">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {isOverviewDataLoading ? "..." : overviewData?.activeProjects}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  of {isOverviewDataLoading ? "..." : overviewData?.totalProjects} total
                </p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="bg-primary/5 px-5 py-2">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setLocation("/admin/projects"); }}
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                Manage projects →
              </a>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5 flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium text-sm">Support Tickets</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {isOverviewDataLoading ? "..." : overviewData?.supportTickets}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  requiring attention
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="bg-purple-50 px-5 py-2">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setLocation("/admin/support"); }}
                className="text-sm font-medium text-purple-600 hover:text-purple-800"
              >
                View support tickets →
              </a>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5 flex items-center justify-between">
              <div>
                <p className="text-gray-500 font-medium text-sm">Team Members</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {isOverviewDataLoading ? "..." : overviewData?.teamMembers}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <UserCog className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="bg-green-50 px-5 py-2">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setLocation("/admin/team"); }}
                className="text-sm font-medium text-green-600 hover:text-green-800"
              >
                Manage team →
              </a>
            </div>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              
              {isOverviewDataLoading ? (
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-14 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : overviewData?.recentActivities && overviewData.recentActivities.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {overviewData.recentActivities.map((activity) => (
                    <div key={activity.id} className="px-6 py-4 flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          {activity.content}
                        </p>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <span className="truncate">
                            by {activity.userName}
                          </span>
                          <span className="mx-1">•</span>
                          <Clock className="flex-shrink-0 mr-1 h-3 w-3" />
                          <span>{formatTimeAgo(new Date(activity.timestamp))}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => setLocation(`/admin/projects/${activity.projectId}`)}
                          className="bg-white rounded-md font-medium text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-xs"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No recent activity</h3>
                  <p className="text-gray-500">
                    Activity from projects and team members will appear here.
                  </p>
                </div>
              )}
              
              <div className="bg-gray-50 px-6 py-3 flex justify-center">
                <button className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  View all activity
                </button>
              </div>
            </div>
          </div>
          
          {/* Project Status */}
          <div>
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Projects by Status</h3>
              </div>
              <div className="p-6">
                {isOverviewDataLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-40 bg-gray-200 rounded"></div>
                  </div>
                ) : overviewData?.projectsByStatus ? (
                  <div className="space-y-4">
                    {overviewData.projectsByStatus.map((item) => (
                      <div key={item.status} className="flex items-center">
                        <div className="w-32 text-sm font-medium text-gray-900 capitalize">
                          {item.status.replace('-', ' ')}
                        </div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                item.status === 'planning' ? 'bg-blue-500' :
                                item.status === 'in-progress' ? 'bg-primary' :
                                item.status === 'on-hold' ? 'bg-yellow-500' :
                                item.status === 'completed' ? 'bg-green-500' :
                                'bg-red-500'
                              }`} 
                              style={{ 
                                width: `${Math.round((item.count / overviewData.totalProjects) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-12 text-right text-sm font-medium text-gray-900">
                          {item.count}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No project data available</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Monthly Projects */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">New Projects by Month</h3>
              </div>
              <div className="p-6">
                {isOverviewDataLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-40 bg-gray-200 rounded"></div>
                  </div>
                ) : overviewData?.projectsByMonth ? (
                  <div className="flex h-40 items-end space-x-2">
                    {overviewData.projectsByMonth.map((item) => {
                      const maxCount = Math.max(...overviewData.projectsByMonth.map(i => i.count));
                      const height = maxCount === 0 ? 0 : Math.max(10, Math.round((item.count / maxCount) * 100));
                      
                      return (
                        <div 
                          key={item.month} 
                          className="flex-1 flex flex-col items-center"
                        >
                          <div 
                            className={`w-full bg-primary/80 rounded-t ${height === 0 ? 'h-1' : ''}`}
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="text-xs font-medium text-gray-500 mt-2">
                            {item.month}
                          </div>
                          <div className="text-xs font-medium text-gray-900">
                            {item.count}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <BarChart4 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No monthly data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Upcoming Deadlines */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Upcoming Deadlines</h3>
            </div>
            
            {isOverviewDataLoading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : overviewData?.upcomingDeadlines && overviewData.upcomingDeadlines.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Milestone
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {overviewData.upcomingDeadlines.map((deadline) => (
                      <tr key={deadline.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {deadline.projectName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {deadline.clientName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {deadline.milestoneName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <span>{format(new Date(deadline.dueDate), 'MMM d, yyyy')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                            <div 
                              className="h-1.5 rounded-full bg-primary" 
                              style={{ width: `${deadline.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {deadline.progress}% complete
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setLocation(`/admin/projects/${deadline.id}`)}
                            className="text-primary hover:text-primary/80"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming deadlines</h3>
                <p className="text-gray-500">
                  There are no project milestones due soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}