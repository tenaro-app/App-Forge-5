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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/chat" component={DashboardChat} />
      <Route path="/dashboard/projects/:id">
        {(params) => (
          <Suspense fallback={<div className="p-8 text-center">Loading project details...</div>}>
            <ProjectDetail id={params.id} />
          </Suspense>
        )}
      </Route>
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
