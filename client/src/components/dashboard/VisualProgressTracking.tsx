import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle, 
  FileClock, 
  FileCheck, 
  FileEdit, 
  FileText, 
  Hourglass, 
  Zap, 
  ChevronRight, 
  Calendar,
  Users
} from "lucide-react";
import { motion } from "framer-motion";

type ProjectStatus = "requested" | "planning" | "development" | "testing" | "review" | "completed" | "on_hold";

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: Date;
  completedDate?: Date;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  startDate: Date;
  dueDate?: Date;
  milestones: Milestone[];
  team: TeamMember[];
}

export default function VisualProgressTracking() {
  const { user, isAuthenticated } = useAuth();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Fetch projects
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: isAuthenticated,
    // Using mock data for now
    initialData: [
      {
        id: "1",
        name: "E-commerce Platform",
        description: "A custom e-commerce platform with product management, checkout, and customer accounts.",
        status: "development",
        progress: 65,
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45), // 45 days from now
        milestones: [
          {
            id: "m1",
            title: "Requirements Gathering",
            description: "Define project scope and technical requirements",
            completed: true,
            completedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25) // 25 days ago
          },
          {
            id: "m2",
            title: "Design Phase",
            description: "UI/UX design and prototyping",
            completed: true,
            completedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15) // 15 days ago
          },
          {
            id: "m3",
            title: "Frontend Development",
            description: "Implement responsive user interface",
            completed: true,
            completedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
          },
          {
            id: "m4",
            title: "Backend Development",
            description: "Build API and database architecture",
            completed: false,
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10) // 10 days from now
          },
          {
            id: "m5",
            title: "Payment Integration",
            description: "Implement secure payment processing",
            completed: false,
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20) // 20 days from now
          },
          {
            id: "m6",
            title: "Testing & QA",
            description: "Quality assurance and bug fixing",
            completed: false,
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days from now
          },
          {
            id: "m7",
            title: "Deployment",
            description: "Launch to production environment",
            completed: false,
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45) // 45 days from now
          }
        ],
        team: [
          { id: "t1", name: "Sarah Johnson", role: "Project Manager" },
          { id: "t2", name: "Michael Chen", role: "Lead Developer" },
          { id: "t3", name: "Aisha Patel", role: "UI/UX Designer" },
          { id: "t4", name: "Carlos Rodriguez", role: "Backend Developer" }
        ]
      },
      {
        id: "2",
        name: "CRM Integration",
        description: "Integrate existing CRM system with custom reporting dashboard.",
        status: "planning",
        progress: 25,
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 50), // 50 days from now
        milestones: [
          {
            id: "m1",
            title: "Requirements Analysis",
            description: "Document integration requirements and data mapping",
            completed: true,
            completedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
          },
          {
            id: "m2",
            title: "API Assessment",
            description: "Review CRM API capabilities and limitations",
            completed: false,
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5) // 5 days from now
          },
          {
            id: "m3",
            title: "Dashboard Design",
            description: "Design custom reporting interface",
            completed: false,
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15) // 15 days from now
          },
          {
            id: "m4",
            title: "Integration Development",
            description: "Build data connectors and processing logic",
            completed: false,
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days from now
          },
          {
            id: "m5",
            title: "Testing & Deployment",
            description: "Verify data accuracy and deploy solution",
            completed: false,
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45) // 45 days from now
          }
        ],
        team: [
          { id: "t1", name: "David Wilson", role: "Integration Specialist" },
          { id: "t2", name: "Emma Lewis", role: "Data Analyst" },
          { id: "t3", name: "James Taylor", role: "Frontend Developer" }
        ]
      }
    ]
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <FileClock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-gray-900 font-medium text-lg mb-1">No projects yet</h3>
        <p className="text-gray-500 mb-4">
          Once you submit a project request, you'll be able to track its progress here.
        </p>
        <a 
          href="/new" 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
        >
          <Zap className="w-4 h-4 mr-2" />
          Request New Project
        </a>
      </div>
    );
  }

  // Sort projects by startDate (newest first)
  const sortedProjects = [...projects].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  // Get the selected project or default to the first one
  const activeProject = selectedProject 
    ? projects.find(p => p.id === selectedProject) 
    : sortedProjects[0];

  // If no active project is found, return empty state
  if (!activeProject) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FileCheck className="w-5 h-5 text-primary mr-2" />
          Project Progress Tracking
        </h3>
      </div>

      {/* Project selector tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 px-4">
        {sortedProjects.map(project => (
          <button
            key={project.id}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 ${
              activeProject.id === project.id 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setSelectedProject(project.id)}
          >
            {project.name}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* Project header with status and progress */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
            <div>
              <h4 className="text-xl font-semibold text-gray-900">{activeProject.name}</h4>
              <p className="text-gray-600">{activeProject.description}</p>
            </div>
            
            <div className="mt-2 md:mt-0 flex items-center">
              <div className="mr-4">
                {getStatusBadge(activeProject.status)}
              </div>
              <div className="text-2xl font-bold text-primary">{activeProject.progress}%</div>
            </div>
          </div>
          
          {/* Project timeline and team */}
          <div className="flex flex-col md:flex-row text-sm text-gray-500 space-y-2 md:space-y-0 md:space-x-6 mt-3">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>Started: {formatDate(activeProject.startDate)}</span>
            </div>
            {activeProject.dueDate && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                <span>Due: {formatDate(activeProject.dueDate)}</span>
              </div>
            )}
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{activeProject.team.length} team members</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-2.5 w-full bg-gray-200 rounded-full">
            <div 
              className="h-2.5 bg-primary rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${activeProject.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Milestone timeline */}
        <div className="mb-6">
          <h5 className="text-sm font-medium text-gray-900 mb-4">Project Timeline</h5>
          
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute top-0 bottom-0 left-[18px] w-0.5 bg-gray-200"></div>

            {/* Milestones */}
            <div className="space-y-6">
              {activeProject.milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative pl-10">
                  {/* Milestone marker */}
                  <div className="absolute left-0 top-0">
                    {milestone.completed ? (
                      <CheckCircle2 className="w-9 h-9 text-green-500 bg-white rounded-full" />
                    ) : (
                      <Circle className="w-9 h-9 text-gray-300 bg-white rounded-full" />
                    )}
                  </div>
                  
                  {/* Milestone content */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg ${
                      milestone.completed 
                        ? 'bg-green-50 border border-green-100' 
                        : 'bg-gray-50 border border-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h6 className="font-medium text-gray-900">{milestone.title}</h6>
                        <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                      </div>
                      <div className="text-right text-xs">
                        {milestone.completed ? (
                          <div className="text-green-600">
                            Completed on {formatDate(milestone.completedDate!)}
                          </div>
                        ) : milestone.dueDate ? (
                          <div className={`${
                            new Date(milestone.dueDate) < new Date() 
                              ? 'text-red-600' 
                              : 'text-amber-600'
                          }`}>
                            Due {formatDate(milestone.dueDate)}
                          </div>
                        ) : (
                          <div className="text-gray-500">Scheduled</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team members */}
        <div>
          <h5 className="text-sm font-medium text-gray-900 mb-3">Project Team</h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeProject.team.map(member => (
              <div key={member.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium mr-3">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{member.name}</div>
                  <div className="text-sm text-gray-500">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getStatusBadge(status: ProjectStatus) {
  switch (status) {
    case "requested":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <FileClock className="w-3 h-3 mr-1" />
          Requested
        </span>
      );
    case "planning":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          <FileEdit className="w-3 h-3 mr-1" />
          Planning
        </span>
      );
    case "development":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <FileText className="w-3 h-3 mr-1" />
          Development
        </span>
      );
    case "testing":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Testing
        </span>
      );
    case "review":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <FileCheck className="w-3 h-3 mr-1" />
          Review
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Completed
        </span>
      );
    case "on_hold":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <Hourglass className="w-3 h-3 mr-1" />
          On Hold
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}