import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart4,
  TrendingUp,
  Calendar,
  Download,
  Sliders,
  Users,
  Package,
  CircleDollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Filter,
  BarChart,
  PieChart,
  LineChart,
  User,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  Legend,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";

// Dummy data for analytics
const dummyAnalyticsData = {
  summary: {
    revenue: {
      total: 124500,
      change: 12.5,
      timeframe: 'month'
    },
    clients: {
      total: 24,
      change: 8.3,
      timeframe: 'month'
    },
    projects: {
      total: 38,
      change: 15.2,
      timeframe: 'month'
    },
    teamUtilization: {
      total: 83,
      change: -2.1,
      timeframe: 'month'
    }
  },
  revenueOverTime: [
    { month: 'Jan', revenue: 78000, expenses: 65000, profit: 13000 },
    { month: 'Feb', revenue: 85000, expenses: 68000, profit: 17000 },
    { month: 'Mar', revenue: 92000, expenses: 72000, profit: 20000 },
    { month: 'Apr', revenue: 88000, expenses: 71000, profit: 17000 },
    { month: 'May', revenue: 99000, expenses: 75000, profit: 24000 },
    { month: 'Jun', revenue: 115000, expenses: 82000, profit: 33000 },
    { month: 'Jul', revenue: 124500, expenses: 86000, profit: 38500 },
    { month: 'Aug', revenue: 0, expenses: 0, profit: 0 },
    { month: 'Sep', revenue: 0, expenses: 0, profit: 0 },
    { month: 'Oct', revenue: 0, expenses: 0, profit: 0 },
    { month: 'Nov', revenue: 0, expenses: 0, profit: 0 },
    { month: 'Dec', revenue: 0, expenses: 0, profit: 0 }
  ],
  projectStatus: [
    { name: 'Planning', count: 8 },
    { name: 'In Progress', count: 12 },
    { name: 'On Hold', count: 4 },
    { name: 'Completed', count: 11 },
    { name: 'Cancelled', count: 3 }
  ],
  teamPerformance: [
    { name: 'Sarah Johnson', role: 'Project Manager', assignedProjects: 5, utilization: 92, rating: 4.8 },
    { name: 'Michael Lee', role: 'Lead Developer', assignedProjects: 3, utilization: 87, rating: 4.7 },
    { name: 'Emily Chen', role: 'UI/UX Designer', assignedProjects: 4, utilization: 78, rating: 4.5 },
    { name: 'James Taylor', role: 'DevOps Engineer', assignedProjects: 2, utilization: 95, rating: 4.9 },
    { name: 'Jessica Martinez', role: 'Support Specialist', assignedProjects: 0, utilization: 65, rating: 4.2 }
  ],
  topClients: [
    { name: 'Acme Corp', revenue: 35000, projects: 3, satisfaction: 4.8 },
    { name: 'Beta Industries', revenue: 28000, projects: 2, satisfaction: 4.5 },
    { name: 'Gamma Solutions', revenue: 18500, projects: 1, satisfaction: 4.7 },
    { name: 'Delta Tech', revenue: 15000, projects: 1, satisfaction: 4.2 },
    { name: 'Epsilon Systems', revenue: 12500, projects: 1, satisfaction: 4.6 }
  ],
  revenueByService: [
    { name: 'Web Development', value: 42000 },
    { name: 'Mobile Apps', value: 28500 },
    { name: 'Integration', value: 24000 },
    { name: 'Maintenance', value: 18000 },
    { name: 'Consulting', value: 12000 }
  ],
  forecastedRevenue: [
    { month: 'Aug', predicted: 132000, lowerBound: 125000, upperBound: 138000 },
    { month: 'Sep', predicted: 138000, lowerBound: 130000, upperBound: 145000 },
    { month: 'Oct', predicted: 145000, lowerBound: 135000, upperBound: 155000 },
    { month: 'Nov', predicted: 155000, lowerBound: 145000, upperBound: 165000 },
    { month: 'Dec', predicted: 168000, lowerBound: 158000, upperBound: 180000 }
  ],
  clientAcquisition: [
    { month: 'Jan', organic: 1, referral: 0, outbound: 0 },
    { month: 'Feb', organic: 1, referral: 1, outbound: 0 },
    { month: 'Mar', organic: 2, referral: 0, outbound: 1 },
    { month: 'Apr', organic: 1, referral: 1, outbound: 0 },
    { month: 'May', organic: 2, referral: 1, outbound: 1 },
    { month: 'Jun', organic: 3, referral: 2, outbound: 1 },
    { month: 'Jul', organic: 2, referral: 2, outbound: 2 }
  ],
  supportMetrics: {
    averageResponseTime: '2h 15m',
    averageResolutionTime: '9h 30m',
    ticketsResolved: 28,
    satisfactionScore: 4.6
  }
};

// Colors for charts
const COLORS = ['#ff0033', '#1a1a1a', '#3F88C5', '#764C7B', '#4da3a3', '#D5573B'];

export default function AdminAnalytics() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  const [timeframe, setTimeframe] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  
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
  
  // Fetch analytics data
  const { 
    data: analyticsData, 
    isLoading: isAnalyticsLoading 
  } = useQuery({
    queryKey: ["/api/admin/analytics", timeframe],
    enabled: isAuthenticated && isAdmin,
    // For development we're using dummy data
    initialData: dummyAnalyticsData
  });
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };
  
  // Handle change in timeframe
  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.name.includes('Revenue') || entry.name.includes('Profit') || entry.name.includes('Expenses') 
                ? formatCurrency(entry.value) 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  if (isAuthLoading || isAnalyticsLoading) {
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
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <BarChart4 className="h-8 w-8 text-gray-500 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Business Analytics</h1>
              <p className="mt-1 text-gray-600">
                Comprehensive analytics and performance metrics
              </p>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <div className="relative">
              <button 
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <span>
                  {timeframe === 'week' && 'This Week'}
                  {timeframe === 'month' && 'This Month'}
                  {timeframe === 'quarter' && 'This Quarter'}
                  {timeframe === 'year' && 'This Year'}
                </span>
                <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
              </button>
              <div className="absolute right-0 mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button 
                    onClick={() => handleTimeframeChange('week')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    This Week
                  </button>
                  <button 
                    onClick={() => handleTimeframeChange('month')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    This Month
                  </button>
                  <button 
                    onClick={() => handleTimeframeChange('quarter')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    This Quarter
                  </button>
                  <button 
                    onClick={() => handleTimeframeChange('year')}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    This Year
                  </button>
                </div>
              </div>
            </div>
            
            <button 
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Download className="w-4 h-4 mr-2 text-gray-500" />
              Export
            </button>
            
            <button 
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Sliders className="w-4 h-4 mr-2 text-gray-500" />
              Options
            </button>
          </div>
        </div>
        
        {/* Tabs for different analytics views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 gap-4 max-w-lg mx-auto mb-8 bg-gray-100">
            <TabsTrigger value="overview" className="flex items-center justify-center">
              <BarChart4 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center justify-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center justify-center">
              <Users className="w-4 h-4 mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center justify-center">
              <User className="w-4 h-4 mr-2" />
              Clients
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {/* Revenue Card */}
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 font-medium text-sm">Total Revenue</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      {formatCurrency(analyticsData.summary.revenue.total)}
                    </p>
                  </div>
                  <div className="rounded-full bg-primary/10 p-3">
                    <CircleDollarSign className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  {analyticsData.summary.revenue.change > 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={analyticsData.summary.revenue.change > 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatPercentage(analyticsData.summary.revenue.change)}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    vs. prev. {analyticsData.summary.revenue.timeframe}
                  </span>
                </div>
              </div>
              
              {/* Clients Card */}
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 font-medium text-sm">Total Clients</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      {analyticsData.summary.clients.total}
                    </p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  {analyticsData.summary.clients.change > 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={analyticsData.summary.clients.change > 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatPercentage(analyticsData.summary.clients.change)}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    vs. prev. {analyticsData.summary.clients.timeframe}
                  </span>
                </div>
              </div>
              
              {/* Projects Card */}
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 font-medium text-sm">Active Projects</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      {analyticsData.summary.projects.total}
                    </p>
                  </div>
                  <div className="rounded-full bg-green-100 p-3">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  {analyticsData.summary.projects.change > 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={analyticsData.summary.projects.change > 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatPercentage(analyticsData.summary.projects.change)}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    vs. prev. {analyticsData.summary.projects.timeframe}
                  </span>
                </div>
              </div>
              
              {/* Team Utilization Card */}
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 font-medium text-sm">Team Utilization</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      {analyticsData.summary.teamUtilization.total}%
                    </p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-3">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-3 flex items-center">
                  {analyticsData.summary.teamUtilization.change > 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={analyticsData.summary.teamUtilization.change > 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatPercentage(analyticsData.summary.teamUtilization.change)}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    vs. prev. {analyticsData.summary.teamUtilization.timeframe}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Revenue Over Time Chart */}
              <div className="bg-white rounded-lg shadow p-5 col-span-1 lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Over Time</h3>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                      <BarChart className="w-3 h-3 inline mr-1" />
                      Monthly
                    </button>
                    <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                      <LineChart className="w-3 h-3 inline mr-1" />
                      Quarterly
                    </button>
                    <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                      <Filter className="w-3 h-3 inline mr-1" />
                      Filters
                    </button>
                  </div>
                </div>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart
                      data={analyticsData.revenueOverTime}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        name="Revenue"
                        stackId="1" 
                        stroke="#ff0033" 
                        fill="#ff0033" 
                        fillOpacity={0.2} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="expenses" 
                        name="Expenses"
                        stackId="2" 
                        stroke="#757575" 
                        fill="#b3b3b3" 
                        fillOpacity={0.2} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="profit" 
                        name="Profit"
                        stroke="#4da3a3" 
                        fill="#4da3a3" 
                        fillOpacity={0.4} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Project Status Chart */}
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Project Status</h3>
                  <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    <Download className="w-3 h-3 inline mr-1" />
                    Export
                  </button>
                </div>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={analyticsData.projectStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analyticsData.projectStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Client Acquisition Chart */}
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Client Acquisition</h3>
                  <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    <Download className="w-3 h-3 inline mr-1" />
                    Export
                  </button>
                </div>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={analyticsData.clientAcquisition}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="organic" name="Organic" fill="#ff0033" />
                      <Bar dataKey="referral" name="Referral" fill="#1a1a1a" />
                      <Bar dataKey="outbound" name="Outbound" fill="#4da3a3" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Bottom Section - Team Performance & Support Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Team Performance */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
                  <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Team Member
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Projects
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Utilization
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analyticsData.teamPerformance.map((member, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-medium text-sm">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {member.role}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {member.assignedProjects}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                                <div 
                                  className={`h-2 rounded-full ${
                                    member.utilization > 90 ? 'bg-green-500' :
                                    member.utilization > 75 ? 'bg-blue-500' :
                                    member.utilization > 50 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`} 
                                  style={{ width: `${member.utilization}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-700">{member.utilization}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(member.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="ml-1">{member.rating}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Support Statistics */}
              <div className="bg-white rounded-lg shadow p-5">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Support Metrics</h3>
                  <button className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                    View Details
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Average Response Time</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          {analyticsData.supportMetrics.averageResponseTime}
                        </p>
                      </div>
                      <div className="rounded-full bg-blue-100 p-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Average Resolution Time</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          {analyticsData.supportMetrics.averageResolutionTime}
                        </p>
                      </div>
                      <div className="rounded-full bg-green-100 p-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Tickets Resolved</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          {analyticsData.supportMetrics.ticketsResolved}
                        </p>
                      </div>
                      <div className="rounded-full bg-purple-100 p-2">
                        <Package className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Satisfaction Score</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          {analyticsData.supportMetrics.satisfactionScore}/5
                        </p>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-5 h-5 ${i < Math.floor(analyticsData.supportMetrics.satisfactionScore) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Financial Tab (placeholder) */}
          <TabsContent value="financial">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="max-w-md mx-auto">
                <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Financial Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Detailed financial metrics, revenue forecasting, and profitability analysis.
                </p>
                <p className="text-sm text-gray-500">
                  This section would include revenue breakdown by service, client, and project, 
                  as well as expense tracking, profit margins, and financial forecasting.
                </p>
              </div>
            </div>
          </TabsContent>
          
          {/* Team Tab (placeholder) */}
          <TabsContent value="team">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="max-w-md mx-auto">
                <Users className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Team Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive team performance metrics and resource allocation.
                </p>
                <p className="text-sm text-gray-500">
                  This section would include team utilization rates, individual performance metrics,
                  project assignment analysis, and skill gap identification.
                </p>
              </div>
            </div>
          </TabsContent>
          
          {/* Clients Tab (placeholder) */}
          <TabsContent value="clients">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="max-w-md mx-auto">
                <User className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Client Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Detailed client metrics, satisfaction scores, and relationship health.
                </p>
                <p className="text-sm text-gray-500">
                  This section would include client acquisition data, retention rates,
                  satisfaction metrics, and lifetime value analysis.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}