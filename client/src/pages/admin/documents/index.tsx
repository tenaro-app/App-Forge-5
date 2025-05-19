import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Folder,
  Upload,
  Download,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  File,
  FileIcon,
  Clock,
  User,
  Package,
  Trash2,
  Edit,
  Share2,
  ArrowUpDown,
  Eye,
  AlertCircle,
  FolderPlus,
  Save,
  Loader2,
  FileImage,
  FileCode,
  FileType as FilePdf,
  Archive as FileArchive,
  Table as FileSpreadsheet
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// File types and their icons
const fileTypeIcons: Record<string, React.ReactNode> = {
  "image": <FileImage className="w-5 h-5" />,
  "pdf": <FilePdf className="w-5 h-5" />,
  "document": <FileText className="w-5 h-5" />,
  "spreadsheet": <FileSpreadsheet className="w-5 h-5" />,
  "code": <FileCode className="w-5 h-5" />,
  "archive": <FileArchive className="w-5 h-5" />,
  "other": <FileIcon className="w-5 h-5" />
};

// Category filter options
const categoryFilterOptions = [
  { label: "All Categories", value: "all" },
  { label: "Project Documents", value: "project" },
  { label: "Client Deliverables", value: "deliverable" },
  { label: "Internal Documents", value: "internal" },
  { label: "Templates", value: "template" },
  { label: "Contracts", value: "contract" }
];

// Dummy projects data (for document association)
const dummyProjects = [
  { id: 1, name: "E-commerce Dashboard", client: "Acme Corp" },
  { id: 2, name: "CRM Integration", client: "Beta Industries" },
  { id: 3, name: "Inventory System", client: "Gamma Solutions" },
  { id: 4, name: "HR Portal", client: "Delta Tech" },
  { id: 5, name: "Content Management System", client: "Epsilon Systems" }
];

// Dummy folders data
const dummyFolders = [
  { id: 1, name: "Project Documents", path: "/documents/projects", itemCount: 8 },
  { id: 2, name: "Client Deliverables", path: "/documents/deliverables", itemCount: 12 },
  { id: 3, name: "Internal Documents", path: "/documents/internal", itemCount: 5 },
  { id: 4, name: "Templates", path: "/documents/templates", itemCount: 4 },
  { id: 5, name: "Contracts", path: "/documents/contracts", itemCount: 7 }
];

// Dummy documents data
const dummyDocuments = [
  {
    id: 1,
    name: "Project Requirements Specification",
    description: "Detailed requirements document for the E-commerce Dashboard project",
    type: "document",
    category: "project",
    extension: ".docx",
    size: 1240000, // in bytes
    path: "/documents/projects/requirements.docx",
    projectId: 1,
    projectName: "E-commerce Dashboard",
    createdBy: "Sarah Johnson",
    createdAt: new Date(2023, 5, 10), // June 10, 2023
    updatedAt: new Date(2023, 5, 15), // June 15, 2023
    version: 2,
    isShared: true,
    sharedWith: ["client"]
  },
  {
    id: 2,
    name: "CRM Integration Architecture",
    description: "System architecture diagram and documentation for the CRM integration",
    type: "pdf",
    category: "deliverable",
    extension: ".pdf",
    size: 2350000, // in bytes
    path: "/documents/deliverables/crm_architecture.pdf",
    projectId: 2,
    projectName: "CRM Integration",
    createdBy: "Michael Lee",
    createdAt: new Date(2023, 5, 5), // June 5, 2023
    updatedAt: new Date(2023, 5, 12), // June 12, 2023
    version: 1,
    isShared: true,
    sharedWith: ["client", "team"]
  },
  {
    id: 3,
    name: "Database Schema",
    description: "Database schema design for the Inventory System",
    type: "image",
    category: "project",
    extension: ".png",
    size: 850000, // in bytes
    path: "/documents/projects/database_schema.png",
    projectId: 3,
    projectName: "Inventory System",
    createdBy: "James Taylor",
    createdAt: new Date(2023, 5, 8), // June 8, 2023
    updatedAt: new Date(2023, 5, 8), // June 8, 2023
    version: 1,
    isShared: false,
    sharedWith: []
  },
  {
    id: 4,
    name: "Project Timeline",
    description: "Project timeline and milestone tracking spreadsheet",
    type: "spreadsheet",
    category: "internal",
    extension: ".xlsx",
    size: 980000, // in bytes
    path: "/documents/internal/project_timeline.xlsx",
    projectId: 1,
    projectName: "E-commerce Dashboard",
    createdBy: "Sarah Johnson",
    createdAt: new Date(2023, 5, 1), // June 1, 2023
    updatedAt: new Date(2023, 5, 14), // June 14, 2023
    version: 3,
    isShared: false,
    sharedWith: []
  },
  {
    id: 5,
    name: "API Documentation",
    description: "API documentation for the HR Portal integration endpoints",
    type: "code",
    category: "deliverable",
    extension: ".json",
    size: 560000, // in bytes
    path: "/documents/deliverables/api_docs.json",
    projectId: 4,
    projectName: "HR Portal",
    createdBy: "Michael Lee",
    createdAt: new Date(2023, 5, 12), // June 12, 2023
    updatedAt: new Date(2023, 5, 12), // June 12, 2023
    version: 1,
    isShared: true,
    sharedWith: ["client"]
  },
  {
    id: 6,
    name: "Service Agreement Template",
    description: "Standard service agreement template for client projects",
    type: "document",
    category: "template",
    extension: ".docx",
    size: 780000, // in bytes
    path: "/documents/templates/service_agreement.docx",
    projectId: null,
    projectName: null,
    createdBy: "Alex Smith",
    createdAt: new Date(2023, 4, 20), // May 20, 2023
    updatedAt: new Date(2023, 4, 20), // May 20, 2023
    version: 1,
    isShared: false,
    sharedWith: []
  },
  {
    id: 7,
    name: "Client Contract - Beta Industries",
    description: "Signed contract for the CRM Integration project",
    type: "pdf",
    category: "contract",
    extension: ".pdf",
    size: 1650000, // in bytes
    path: "/documents/contracts/beta_contract.pdf",
    projectId: 2,
    projectName: "CRM Integration",
    createdBy: "Alex Smith",
    createdAt: new Date(2023, 3, 15), // April 15, 2023
    updatedAt: new Date(2023, 3, 15), // April 15, 2023
    version: 1,
    isShared: false,
    sharedWith: []
  }
];

export default function DocumentManagement() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState("updatedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<typeof dummyDocuments[0] | null>(null);
  const [uploadFormData, setUploadFormData] = useState({
    name: "",
    description: "",
    category: "project",
    projectId: "",
    isShared: false,
    sharedWith: [] as string[]
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
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
  
  // Fetch folders
  const { 
    data: folders, 
    isLoading: isFoldersLoading 
  } = useQuery({
    queryKey: ["/api/admin/documents/folders"],
    enabled: isAuthenticated && isAdmin,
    // For development we're using dummy data
    initialData: dummyFolders
  });
  
  // Fetch documents
  const { 
    data: documents, 
    isLoading: isDocumentsLoading 
  } = useQuery({
    queryKey: ["/api/admin/documents", currentFolder],
    enabled: isAuthenticated && isAdmin,
    // For development we're using dummy data
    initialData: dummyDocuments
  });
  
  // Fetch projects for document association
  const { 
    data: projects, 
    isLoading: isProjectsLoading 
  } = useQuery({
    queryKey: ["/api/admin/projects"],
    enabled: isAuthenticated && isAdmin,
    // For development we're using dummy data
    initialData: dummyProjects
  });
  
  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest("POST", "/api/admin/documents/folders", { name });
      if (!response.ok) {
        throw new Error(`Failed to create folder: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/documents/folders"] });
      setIsCreateFolderDialogOpen(false);
      setNewFolderName("");
      toast({
        title: "Folder created",
        description: "The folder has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create folder",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Upload document mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/admin/documents", formData);
      if (!response.ok) {
        throw new Error(`Failed to upload document: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      setUploadFormData({
        name: "",
        description: "",
        category: "project",
        projectId: "",
        isShared: false,
        sharedWith: []
      });
      toast({
        title: "Document uploaded",
        description: "The document has been successfully uploaded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to upload document",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Share document mutation
  const shareDocumentMutation = useMutation({
    mutationFn: async ({ documentId, sharedWith }: { documentId: number, sharedWith: string[] }) => {
      const response = await apiRequest("PUT", `/api/admin/documents/${documentId}/share`, { sharedWith });
      if (!response.ok) {
        throw new Error(`Failed to share document: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
      setIsShareDialogOpen(false);
      setSelectedDocument(null);
      toast({
        title: "Document shared",
        description: "The document sharing settings have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to share document",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: number) => {
      const response = await apiRequest("DELETE", `/api/admin/documents/${documentId}`);
      if (!response.ok) {
        throw new Error(`Failed to delete document: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/documents"] });
      toast({
        title: "Document deleted",
        description: "The document has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete document",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Filter documents based on search query, category, and current folder/tab
  const filteredDocuments = documents?.filter(document => {
    const matchesSearch = searchQuery === "" || 
      document.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      document.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (document.projectName && document.projectName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || document.category === categoryFilter;
    
    // If a folder is selected, only show documents in that category
    const matchesFolder = currentFolder === null || 
      (currentFolder === "projects" && document.category === "project") ||
      (currentFolder === "deliverables" && document.category === "deliverable") ||
      (currentFolder === "internal" && document.category === "internal") ||
      (currentFolder === "templates" && document.category === "template") ||
      (currentFolder === "contracts" && document.category === "contract");
    
    // If on shared tab, only show shared documents
    const matchesShared = activeTab !== "shared" || document.isShared;
    
    return matchesSearch && matchesCategory && matchesFolder && matchesShared;
  });
  
  // Sort documents based on selected field and direction
  const sortedDocuments = filteredDocuments?.sort((a, b) => {
    let compareA, compareB;
    
    // Determine which field to sort by
    switch (sortField) {
      case "name":
        compareA = a.name;
        compareB = b.name;
        break;
      case "type":
        compareA = a.type;
        compareB = b.type;
        break;
      case "size":
        compareA = a.size;
        compareB = b.size;
        break;
      case "createdAt":
        compareA = new Date(a.createdAt).getTime();
        compareB = new Date(b.createdAt).getTime();
        break;
      case "updatedAt":
        compareA = new Date(a.updatedAt).getTime();
        compareB = new Date(b.updatedAt).getTime();
        break;
      default:
        compareA = new Date(a.updatedAt).getTime();
        compareB = new Date(b.updatedAt).getTime();
    }
    
    // Determine sort direction
    if (sortDirection === "asc") {
      return compareA > compareB ? 1 : -1;
    } else {
      return compareA < compareB ? 1 : -1;
    }
  });
  
  // Handle creating a new folder
  const handleCreateFolder = () => {
    if (!newFolderName) {
      toast({
        title: "Folder name required",
        description: "Please enter a name for the folder.",
        variant: "destructive",
      });
      return;
    }
    
    createFolderMutation.mutate(newFolderName);
  };
  
  // Handle file selection for upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Auto-fill the name field with the file name (without extension)
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      setUploadFormData({
        ...uploadFormData,
        name: fileName
      });
    }
  };
  
  // Handle document upload
  const handleUploadDocument = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    if (!uploadFormData.name) {
      toast({
        title: "Document name required",
        description: "Please enter a name for the document.",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("name", uploadFormData.name);
    formData.append("description", uploadFormData.description);
    formData.append("category", uploadFormData.category);
    formData.append("projectId", uploadFormData.projectId);
    formData.append("isShared", String(uploadFormData.isShared));
    formData.append("sharedWith", JSON.stringify(uploadFormData.sharedWith));
    
    uploadDocumentMutation.mutate(formData);
  };
  
  // Handle document sharing
  const handleShareDocument = () => {
    if (!selectedDocument) return;
    
    const sharedWith = [];
    if (uploadFormData.isShared) {
      sharedWith.push(...uploadFormData.sharedWith);
    }
    
    shareDocumentMutation.mutate({
      documentId: selectedDocument.id,
      sharedWith
    });
  };
  
  // Handle document deletion
  const handleDeleteDocument = (documentId: number) => {
    if (window.confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      deleteDocumentMutation.mutate(documentId);
    }
  };
  
  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      // If already sorting by this field, toggle direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Otherwise, sort by this field in descending order for dates, ascending for text
      setSortField(field);
      setSortDirection(field === "updatedAt" || field === "createdAt" ? "desc" : "asc");
    }
  };
  
  // Format file size for display
  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else if (sizeInBytes < 1024 * 1024 * 1024) {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
  };
  
  // Get file type icon
  const getFileTypeIcon = (type: string) => {
    return fileTypeIcons[type] || fileTypeIcons.other;
  };
  
  // Get category badge
  const getCategoryBadge = (category: string) => {
    let badgeClass = "";
    
    switch (category) {
      case "project":
        badgeClass = "bg-blue-100 text-blue-800 border-blue-200";
        break;
      case "deliverable":
        badgeClass = "bg-green-100 text-green-800 border-green-200";
        break;
      case "internal":
        badgeClass = "bg-gray-100 text-gray-800 border-gray-200";
        break;
      case "template":
        badgeClass = "bg-purple-100 text-purple-800 border-purple-200";
        break;
      case "contract":
        badgeClass = "bg-red-100 text-red-800 border-red-200";
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800 border-gray-200";
    }
    
    return (
      <Badge variant="outline" className={badgeClass}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };
  
  if (isAuthLoading || isFoldersLoading || isDocumentsLoading || isProjectsLoading) {
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
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
            <p className="mt-1 text-gray-600">
              Manage and organize project documents and client deliverables
            </p>
          </div>
          <div className="mt-4 md:mt-0 space-x-3">
            <Dialog open={isCreateFolderDialogOpen} onOpenChange={setIsCreateFolderDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FolderPlus className="w-4 h-4 mr-2" />
                  New Folder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                  <DialogDescription>
                    Create a new folder to organize your documents.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 my-4">
                  <div className="space-y-2">
                    <Label htmlFor="folderName">Folder Name</Label>
                    <Input
                      id="folderName"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Enter folder name"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateFolderDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateFolder}
                    disabled={createFolderMutation.isPending}
                  >
                    {createFolderMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Folder
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Document</DialogTitle>
                  <DialogDescription>
                    Upload a new document to the system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 my-4">
                  <div>
                    <Label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                      File *
                    </Label>
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center hover:border-primary cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        id="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      {selectedFile ? (
                        <div className="text-center">
                          <FileText className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-1 text-sm text-gray-900 font-medium">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-1 text-sm text-gray-500">
                            Click to select a file or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            Support for documents, images, PDFs, and more
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Document Name *</Label>
                    <Input
                      id="name"
                      value={uploadFormData.name}
                      onChange={(e) => setUploadFormData({...uploadFormData, name: e.target.value})}
                      placeholder="Enter document name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={uploadFormData.description}
                      onChange={(e) => setUploadFormData({...uploadFormData, description: e.target.value})}
                      placeholder="Enter document description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={uploadFormData.category}
                        onValueChange={(value) => setUploadFormData({...uploadFormData, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="project">Project Document</SelectItem>
                          <SelectItem value="deliverable">Client Deliverable</SelectItem>
                          <SelectItem value="internal">Internal Document</SelectItem>
                          <SelectItem value="template">Template</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="projectId">Related Project</Label>
                      <Select
                        value={uploadFormData.projectId}
                        onValueChange={(value) => setUploadFormData({...uploadFormData, projectId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {projects?.map((project) => (
                            <SelectItem key={project.id} value={String(project.id)}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isShared"
                        checked={uploadFormData.isShared}
                        onChange={(e) => setUploadFormData({...uploadFormData, isShared: e.target.checked})}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <Label htmlFor="isShared" className="text-sm font-medium text-gray-700">
                        Share this document
                      </Label>
                    </div>
                    
                    {uploadFormData.isShared && (
                      <div className="pl-6 space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="shareWithClient"
                            checked={uploadFormData.sharedWith.includes("client")}
                            onChange={(e) => {
                              const newSharedWith = [...uploadFormData.sharedWith];
                              if (e.target.checked) {
                                if (!newSharedWith.includes("client")) {
                                  newSharedWith.push("client");
                                }
                              } else {
                                const index = newSharedWith.indexOf("client");
                                if (index !== -1) {
                                  newSharedWith.splice(index, 1);
                                }
                              }
                              setUploadFormData({...uploadFormData, sharedWith: newSharedWith});
                            }}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <Label htmlFor="shareWithClient" className="text-sm font-medium text-gray-700">
                            Share with client
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="shareWithTeam"
                            checked={uploadFormData.sharedWith.includes("team")}
                            onChange={(e) => {
                              const newSharedWith = [...uploadFormData.sharedWith];
                              if (e.target.checked) {
                                if (!newSharedWith.includes("team")) {
                                  newSharedWith.push("team");
                                }
                              } else {
                                const index = newSharedWith.indexOf("team");
                                if (index !== -1) {
                                  newSharedWith.splice(index, 1);
                                }
                              }
                              setUploadFormData({...uploadFormData, sharedWith: newSharedWith});
                            }}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <Label htmlFor="shareWithTeam" className="text-sm font-medium text-gray-700">
                            Share with team
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsUploadDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUploadDocument}
                    disabled={uploadDocumentMutation.isPending}
                  >
                    {uploadDocumentMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Folders Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Folders</h3>
              </div>
              <nav className="p-4 space-y-1">
                <button
                  onClick={() => {
                    setCurrentFolder(null);
                    setActiveTab("all");
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    currentFolder === null && activeTab === "all"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:text-primary hover:bg-gray-100"
                  }`}
                >
                  <Folder className="w-5 h-5 mr-3" />
                  <span>All Documents</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentFolder(null);
                    setActiveTab("shared");
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeTab === "shared"
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:text-primary hover:bg-gray-100"
                  }`}
                >
                  <Share2 className="w-5 h-5 mr-3" />
                  <span>Shared Documents</span>
                </button>
                
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <h4 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Categories
                  </h4>
                  <div className="mt-2 space-y-1">
                    {folders?.map((folder) => (
                      <button
                        key={folder.id}
                        onClick={() => {
                          setCurrentFolder(folder.path.split('/').pop() || null);
                          setActiveTab("all");
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
                          currentFolder === folder.path.split('/').pop()
                            ? "bg-primary text-white"
                            : "text-gray-700 hover:text-primary hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center">
                          <Folder className="w-5 h-5 mr-3" />
                          <span>{folder.name}</span>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                          {folder.itemCount}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </nav>
            </div>
          </div>
          
          {/* Documents Main Content */}
          <div className="lg:col-span-3">
            {/* Filters and Search */}
            <div className="bg-white p-6 shadow rounded-lg mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative md:max-w-xs w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div>
                    <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1 sm:hidden">
                      Filter by Category
                    </label>
                    <div className="flex items-center">
                      <Filter className="mr-2 h-5 w-5 text-gray-400" />
                      <select
                        id="category-filter"
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                      >
                        {categoryFilterOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Documents Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {activeTab === "shared" ? "Shared Documents" : "All Documents"} ({sortedDocuments?.length || 0})
                </h3>
              </div>
              
              {isDocumentsLoading ? (
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : sortedDocuments && sortedDocuments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSortChange("name")}
                        >
                          <div className="flex items-center">
                            Document
                            <ArrowUpDown className="w-4 h-4 ml-1" />
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSortChange("type")}
                        >
                          <div className="flex items-center">
                            Type
                            <ArrowUpDown className="w-4 h-4 ml-1" />
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSortChange("size")}
                        >
                          <div className="flex items-center">
                            Size
                            <ArrowUpDown className="w-4 h-4 ml-1" />
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSortChange("updatedAt")}
                        >
                          <div className="flex items-center">
                            Last Modified
                            <ArrowUpDown className="w-4 h-4 ml-1" />
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sortedDocuments.map((document) => (
                        <tr key={document.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                {getFileTypeIcon(document.type)}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{document.name}</div>
                                <div className="text-xs text-gray-500 mt-1">{document.description}</div>
                                <div className="flex items-center mt-1 space-x-2">
                                  {getCategoryBadge(document.category)}
                                  {document.isShared && (
                                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                      Shared
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {document.extension}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Version {document.version}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {document.projectName ? (
                              <div className="flex items-center text-sm text-gray-900">
                                <Package className="w-4 h-4 text-gray-500 mr-1" />
                                {document.projectName}
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500 italic">None</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatFileSize(document.size)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="text-sm text-gray-900 flex items-center">
                                <Clock className="w-4 h-4 text-gray-500 mr-1" />
                                {format(new Date(document.updatedAt), 'MMM d, yyyy')}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 flex items-center">
                                <User className="w-3 h-3 text-gray-400 mr-1" />
                                {document.createdBy}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                                  <MoreHorizontal className="h-5 w-5" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => window.open(`/api/admin/documents/${document.id}`)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Document
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem onClick={() => window.open(`/api/admin/documents/${document.id}/download`)}>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem onClick={() => {
                                  setSelectedDocument(document);
                                  setUploadFormData({
                                    ...uploadFormData,
                                    isShared: document.isShared,
                                    sharedWith: document.sharedWith
                                  });
                                  setIsShareDialogOpen(true);
                                }}>
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Share Document
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem onClick={() => setLocation(`/admin/documents/${document.id}/edit`)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Document
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem onClick={() => handleDeleteDocument(document.id)}>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Document
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No documents found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery ? `No documents match your search for "${searchQuery}"` : 'There are no documents in this category yet.'}
                  </p>
                  <button 
                    onClick={() => setIsUploadDialogOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Share Document Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
            <DialogDescription>
              Configure sharing settings for "{selectedDocument?.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="dialogIsShared"
                checked={uploadFormData.isShared}
                onChange={(e) => setUploadFormData({...uploadFormData, isShared: e.target.checked})}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <Label htmlFor="dialogIsShared" className="text-sm font-medium text-gray-700">
                Share this document
              </Label>
            </div>
            
            {uploadFormData.isShared && (
              <div className="pl-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="dialogShareWithClient"
                    checked={uploadFormData.sharedWith.includes("client")}
                    onChange={(e) => {
                      const newSharedWith = [...uploadFormData.sharedWith];
                      if (e.target.checked) {
                        if (!newSharedWith.includes("client")) {
                          newSharedWith.push("client");
                        }
                      } else {
                        const index = newSharedWith.indexOf("client");
                        if (index !== -1) {
                          newSharedWith.splice(index, 1);
                        }
                      }
                      setUploadFormData({...uploadFormData, sharedWith: newSharedWith});
                    }}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <Label htmlFor="dialogShareWithClient" className="text-sm font-medium text-gray-700">
                    Share with client
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="dialogShareWithTeam"
                    checked={uploadFormData.sharedWith.includes("team")}
                    onChange={(e) => {
                      const newSharedWith = [...uploadFormData.sharedWith];
                      if (e.target.checked) {
                        if (!newSharedWith.includes("team")) {
                          newSharedWith.push("team");
                        }
                      } else {
                        const index = newSharedWith.indexOf("team");
                        if (index !== -1) {
                          newSharedWith.splice(index, 1);
                        }
                      }
                      setUploadFormData({...uploadFormData, sharedWith: newSharedWith});
                    }}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <Label htmlFor="dialogShareWithTeam" className="text-sm font-medium text-gray-700">
                    Share with team
                  </Label>
                </div>
                
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Shared documents will be visible to the selected audiences in their respective portals.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsShareDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleShareDocument}
              disabled={shareDocumentMutation.isPending}
            >
              {shareDocumentMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  Save Sharing Settings
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}