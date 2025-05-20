import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { 
  Layers, 
  BarChart, 
  Clock, 
  Calendar, 
  Users, 
  AlertCircle, 
  MessageSquare, 
  FileText,
  Grip,
  Settings,
  Plus,
  X,
  MoreHorizontal
} from "lucide-react";
import { motion } from "framer-motion";

// Supported widget types
type WidgetType = 
  | "project_progress" 
  | "upcoming_deadlines" 
  | "team_activity" 
  | "recent_messages" 
  | "project_health" 
  | "documents"
  | "custom";

interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  gridColumn: number;
  gridRow: number;
  size: "small" | "medium" | "large";
  settings?: Record<string, any>;
  customData?: Record<string, any>;
}

export default function CustomizableWidgets() {
  const { user, isAuthenticated } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [availableWidgets, setAvailableWidgets] = useState<{type: WidgetType, title: string, icon: JSX.Element}[]>([
    { type: "project_progress", title: "Project Progress", icon: <BarChart className="w-5 h-5" /> },
    { type: "upcoming_deadlines", title: "Upcoming Deadlines", icon: <Clock className="w-5 h-5" /> },
    { type: "team_activity", title: "Team Activity", icon: <Users className="w-5 h-5" /> },
    { type: "recent_messages", title: "Recent Messages", icon: <MessageSquare className="w-5 h-5" /> },
    { type: "project_health", title: "Project Health", icon: <AlertCircle className="w-5 h-5" /> },
    { type: "documents", title: "Documents", icon: <FileText className="w-5 h-5" /> },
    { type: "custom", title: "Custom Widget", icon: <Layers className="w-5 h-5" /> },
  ]);
  
  const [isAddingWidget, setIsAddingWidget] = useState(false);
  
  // Fetch user's dashboard widgets
  const { data: widgets, isLoading } = useQuery<Widget[]>({
    queryKey: ["/api/dashboard/widgets"],
    enabled: isAuthenticated,
    // Using mock data for now
    initialData: [
      {
        id: "1",
        type: "project_progress",
        title: "Project Progress",
        gridColumn: 1,
        gridRow: 1,
        size: "medium",
      },
      {
        id: "2",
        type: "upcoming_deadlines",
        title: "Upcoming Deadlines",
        gridColumn: 2,
        gridRow: 1,
        size: "medium",
      },
      {
        id: "3",
        type: "project_health",
        title: "Project Health",
        gridColumn: 1,
        gridRow: 2,
        size: "small",
      },
      {
        id: "4",
        type: "recent_messages",
        title: "Recent Messages",
        gridColumn: 2,
        gridRow: 2,
        size: "small",
      },
    ],
  });
  
  const [localWidgets, setLocalWidgets] = useState<Widget[]>([]);
  
  // Initialize local widgets from fetched data
  useEffect(() => {
    if (widgets) {
      setLocalWidgets([...widgets]);
    }
  }, [widgets]);
  
  // Save dashboard layout
  const saveDashboardMutation = useMutation({
    mutationFn: async (updatedWidgets: Widget[]) => {
      // This would typically call an API endpoint to save the widgets
      // For now, we'll just mock the response
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/widgets"] });
      toast({
        title: "Dashboard saved",
        description: "Your dashboard layout has been updated.",
      });
      setIsEditMode(false);
    },
    onError: () => {
      toast({
        title: "Error saving dashboard",
        description: "There was a problem saving your dashboard layout.",
        variant: "destructive",
      });
    },
  });
  
  // Save dashboard changes
  const saveDashboard = () => {
    saveDashboardMutation.mutate(localWidgets);
  };
  
  // Add a new widget
  const addWidget = (type: WidgetType) => {
    const newWidgetTemplate = availableWidgets.find(w => w.type === type);
    if (!newWidgetTemplate) return;
    
    // Determine position for new widget - put it in the first column
    // or find the column with the least widgets
    const columnCounts = [0, 0]; // For 2 columns
    
    localWidgets.forEach(widget => {
      if (widget.gridColumn <= 2) {
        columnCounts[widget.gridColumn - 1]++;
      }
    });
    
    // Choose the column with fewer widgets
    const targetColumn = columnCounts[0] <= columnCounts[1] ? 1 : 2;
    
    // Find the next available row in that column
    const widgetsInColumn = localWidgets.filter(w => w.gridColumn === targetColumn);
    const lastRow = widgetsInColumn.length > 0 
      ? Math.max(...widgetsInColumn.map(w => w.gridRow), 0)
      : 0;
    
    const newWidget: Widget = {
      id: `new-${Date.now()}`,
      type,
      title: newWidgetTemplate.title,
      gridColumn: targetColumn,
      gridRow: lastRow + 1,
      size: "medium",
    };
    
    setLocalWidgets([...localWidgets, newWidget]);
    setIsAddingWidget(false);
  };
  
  // Remove a widget
  const removeWidget = (id: string) => {
    setLocalWidgets(localWidgets.filter(w => w.id !== id));
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setLocalWidgets(widgets || []);
    setIsEditMode(false);
  };
  
  // Render widget content based on type
  const renderWidgetContent = (widget: Widget) => {
    switch (widget.type) {
      case "project_progress":
        return <ProjectProgressWidget />;
      case "upcoming_deadlines":
        return <UpcomingDeadlinesWidget />;
      case "team_activity":
        return <TeamActivityWidget />;
      case "recent_messages":
        return <RecentMessagesWidget />;
      case "project_health":
        return <ProjectHealthWidget />;
      case "documents":
        return <DocumentsWidget />;
      case "custom":
        return <CustomWidget data={widget.customData} />;
      default:
        return <div className="p-4 text-gray-500">Widget not configured</div>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg shadow h-48 p-4">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Customize Your Dashboard</h2>
        
        <div className="flex space-x-2">
          {isEditMode ? (
            <>
              <button
                onClick={cancelEditing}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveDashboard}
                className="px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-70"
                disabled={saveDashboardMutation.isPending}
              >
                {saveDashboardMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditMode(true)}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 inline-flex items-center"
            >
              <Settings className="w-4 h-4 mr-1.5" />
              Customize
            </button>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {isEditMode 
            ? "Drag widgets to rearrange, click the 'Add Widget' button to add more widgets, or remove widgets you don't need." 
            : "Your personalized dashboard with the information that matters most to you."
          }
        </p>
      </div>
      
      {/* Widget layout options - only visible in edit mode */}
      {isEditMode && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Layout Options</h3>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Number of Columns</label>
              <div className="flex space-x-2">
                <button 
                  className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  onClick={() => alert('This would change to a single column layout (Coming soon)')}
                >
                  Single
                </button>
                <button 
                  className="px-2 py-1 text-xs border border-primary rounded bg-primary/10 text-primary font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  Double
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-xs text-gray-500 block mb-1">Column Width</label>
              <div className="flex space-x-2">
                <button 
                  className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  onClick={() => alert('This would set equal column widths (Coming soon)')}
                >
                  Equal
                </button>
                <button 
                  className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  onClick={() => alert('This would set left column wider (Coming soon)')}
                >
                  Left wider
                </button>
                <button 
                  className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  onClick={() => alert('This would set right column wider (Coming soon)')}
                >
                  Right wider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {localWidgets.map(widget => (
          <div 
            key={widget.id}
            className={`relative bg-white rounded-lg shadow overflow-hidden ${
              widget.size === "large" ? "md:col-span-2" : 
              widget.size === "small" ? "h-48" : "h-64"
            } ${isEditMode ? 'border-2 border-dashed border-gray-300 hover:border-primary' : ''}`}
          >
            {isEditMode && (
              <div className="absolute top-0 right-0 p-2 flex space-x-1 z-10">
                <button 
                  onClick={() => removeWidget(widget.id)}
                  className="p-1 text-gray-500 hover:text-red-500 bg-white rounded-full shadow-sm border border-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                {getWidgetIcon(widget.type)}
                <span className="ml-2">{widget.title}</span>
              </h3>
              
              {renderWidgetContent(widget)}
            </div>
          </div>
        ))}
        
        {isEditMode && (
          <button
            onClick={() => setIsAddingWidget(true)}
            className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary"
          >
            <Plus className="w-6 h-6 mr-2" />
            <span>Add Widget</span>
          </button>
        )}
      </div>
      
      {/* Widget selector modal - improved version */}
      {isAddingWidget && (
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            
            <div className="inline-block p-6 overflow-hidden text-left align-bottom bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add Widget</h3>
                <button 
                  onClick={() => setIsAddingWidget(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">
                Select a widget to add to your dashboard. You can add multiple widgets of the same type.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto py-2">
                {availableWidgets.map(widget => (
                  <button
                    key={widget.type}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 text-left flex items-center"
                    onClick={() => addWidget(widget.type)}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3 flex-shrink-0">
                      {widget.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{widget.title}</span>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={() => {
                    // Add a default widget (first in the list)
                    if (availableWidgets.length > 0) {
                      addWidget(availableWidgets[0].type);
                    }
                  }}
                >
                  Add Default Widget
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={() => setIsAddingWidget(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get widget icon
function getWidgetIcon(type: WidgetType): JSX.Element {
  switch (type) {
    case "project_progress":
      return <BarChart className="w-5 h-5 text-primary" />;
    case "upcoming_deadlines":
      return <Clock className="w-5 h-5 text-amber-500" />;
    case "team_activity":
      return <Users className="w-5 h-5 text-blue-500" />;
    case "recent_messages":
      return <MessageSquare className="w-5 h-5 text-indigo-500" />;
    case "project_health":
      return <AlertCircle className="w-5 h-5 text-green-500" />;
    case "documents":
      return <FileText className="w-5 h-5 text-orange-500" />;
    case "custom":
    default:
      return <Layers className="w-5 h-5 text-gray-500" />;
  }
}

// Widget Components
function ProjectProgressWidget() {
  return (
    <div>
      <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
        <span>Overall Progress</span>
        <span className="font-medium">65%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div className="bg-primary h-2.5 rounded-full" style={{ width: "65%" }}></div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
            <span>Design</span>
            <span>100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "100%" }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
            <span>Development</span>
            <span>70%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: "70%" }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
            <span>Testing</span>
            <span>25%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "25%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpcomingDeadlinesWidget() {
  const deadlines = [
    { id: 1, project: "E-commerce Platform", milestone: "User Testing", date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2) }, // 2 days from now
    { id: 2, project: "Mobile App", milestone: "Beta Release", date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) }, // 7 days from now
    { id: 3, project: "CRM Integration", milestone: "Final Review", date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14) }, // 14 days from now
  ];
  
  return (
    <div className="space-y-3">
      {deadlines.map(deadline => (
        <div key={deadline.id} className="flex items-start">
          <div className="mr-3 mt-0.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 text-xs font-medium">
              {deadline.date.getDate()}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{deadline.milestone}</p>
            <p className="text-xs text-gray-500">{deadline.project}</p>
            <p className="text-xs text-gray-400">
              {deadline.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamActivityWidget() {
  const activities = [
    { id: 1, user: "Sarah Johnson", action: "added a new comment", target: "Mobile App project", time: "2 hours ago" },
    { id: 2, user: "Michael Chen", action: "completed milestone", target: "Database Setup", time: "Yesterday" },
    { id: 3, user: "Aisha Patel", action: "uploaded document", target: "API Documentation", time: "2 days ago" },
  ];
  
  return (
    <div className="space-y-3">
      {activities.map(activity => (
        <div key={activity.id} className="flex items-start text-sm">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mr-3"></div>
          <div>
            <p className="text-gray-900">
              <span className="font-medium">{activity.user}</span>{" "}
              <span className="text-gray-600">{activity.action}</span>{" "}
              <span className="font-medium">{activity.target}</span>
            </p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentMessagesWidget() {
  const messages = [
    { id: 1, user: "David Wilson", message: "I've reviewed the latest design changes, looks great!", time: "10:23 AM" },
    { id: 2, user: "Emma Lewis", message: "When can we schedule the next progress meeting?", time: "Yesterday" },
  ];
  
  return (
    <div className="space-y-3">
      {messages.map(message => (
        <div key={message.id} className="p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-900">{message.user}</span>
            <span className="text-xs text-gray-500">{message.time}</span>
          </div>
          <p className="mt-1 text-sm text-gray-600">{message.message}</p>
        </div>
      ))}
      <a href="/dashboard/chat" className="block text-center text-sm text-primary hover:underline mt-2">
        View all messages
      </a>
    </div>
  );
}

function ProjectHealthWidget() {
  const projects = [
    { id: 1, name: "E-commerce Platform", status: "healthy", score: 92 },
    { id: 2, name: "Mobile App", status: "warning", score: 78 },
  ];
  
  return (
    <div className="space-y-3">
      {projects.map(project => (
        <div key={project.id} className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-900">{project.name}</p>
            <div className="flex items-center">
              <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                project.status === 'healthy' ? 'bg-green-500' : 
                project.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
              }`}></span>
              <span className="text-xs text-gray-500 capitalize">{project.status}</span>
            </div>
          </div>
          <div className={`text-xl font-semibold ${
            project.score >= 90 ? 'text-green-500' : 
            project.score >= 70 ? 'text-amber-500' : 'text-red-500'
          }`}>
            {project.score}
          </div>
        </div>
      ))}
    </div>
  );
}

function DocumentsWidget() {
  const documents = [
    { id: 1, name: "Requirements.pdf", updatedAt: "Today", type: "PDF" },
    { id: 2, name: "Design Assets.zip", updatedAt: "2 days ago", type: "ZIP" },
    { id: 3, name: "API Specification.docx", updatedAt: "Last week", type: "DOCX" },
  ];
  
  return (
    <div className="space-y-2">
      {documents.map(doc => (
        <div key={doc.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-medium text-gray-500 mr-3">
            {doc.type}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
            <p className="text-xs text-gray-500">Updated {doc.updatedAt}</p>
          </div>
          <button className="p-1 text-gray-400 hover:text-gray-500">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function CustomWidget({ data }: { data?: Record<string, any> }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <Layers className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Custom widget</p>
        <p className="text-xs text-gray-400">Configure in settings</p>
      </div>
    </div>
  );
}