import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import DashboardChat from "@/pages/dashboard/chat";
import { Suspense } from "react";
import ProjectDetail from "@/pages/dashboard/projects/id";
import NewProject from "@/pages/new";

// Import additional dashboard pages
import DashboardAnalytics from "@/pages/dashboard/analytics";
import DashboardDocuments from "@/pages/dashboard/documents";
import DashboardTeam from "@/pages/dashboard/team";
import DashboardBilling from "@/pages/dashboard/billing";
import DashboardSettings from "@/pages/dashboard/settings";
import EnhancedDashboard from "@/pages/dashboard/enhanced";
import HybridDashboard from "@/pages/dashboard/hybrid";

// Import admin dashboard pages
import AdminDashboard from "@/pages/admin";
import AdminClients from "@/pages/admin/clients";
import AdminNewClient from "@/pages/admin/clients/new";
import AdminContacts from "@/pages/admin/contacts";

function Router() {
  return (
    <Switch>
      {/* Main app routes */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      
      {/* Client dashboard routes */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/enhanced" component={EnhancedDashboard} />
      <Route path="/dashboard/hybrid" component={HybridDashboard} />
      <Route path="/dashboard/chat" component={DashboardChat} />
      <Route path="/dashboard/analytics" component={DashboardAnalytics} />
      <Route path="/dashboard/documents" component={DashboardDocuments} />
      <Route path="/dashboard/team" component={DashboardTeam} />
      <Route path="/dashboard/billing" component={DashboardBilling} />
      <Route path="/dashboard/settings" component={DashboardSettings} />
      <Route path="/new" component={NewProject} />
      <Route path="/dashboard/projects/:id">
        {(params) => (
          <Suspense fallback={<div className="p-8 text-center">Loading project details...</div>}>
            <ProjectDetail id={params.id} />
          </Suspense>
        )}
      </Route>
      
      {/* Admin dashboard routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/clients" component={AdminClients} />
      <Route path="/admin/clients/new" component={AdminNewClient} />
      <Route path="/admin/contacts" component={AdminContacts} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
