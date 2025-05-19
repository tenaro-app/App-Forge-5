import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  Search, 
  File, 
  FileText, 
  Image, 
  FilePlus2,
  AlertCircle,
  Folder,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";

// Dummy data for document categories
const documentCategories = [
  { id: 1, name: "Requirements", count: 5 },
  { id: 2, name: "Design", count: 8 },
  { id: 3, name: "Development", count: 12 },
  { id: 4, name: "Testing", count: 4 },
  { id: 5, name: "User Guides", count: 6 },
];

// Dummy data for documents
const documents = [
  { 
    id: 1, 
    name: "Project Requirements Specification", 
    category: "Requirements",
    type: "pdf", 
    size: "2.4 MB", 
    lastModified: new Date(2023, 4, 15), 
    uploadedBy: "Sarah Johnson" 
  },
  { 
    id: 2, 
    name: "System Architecture", 
    category: "Design",
    type: "pdf", 
    size: "3.8 MB", 
    lastModified: new Date(2023, 4, 20), 
    uploadedBy: "Michael Lee" 
  },
  { 
    id: 3, 
    name: "User Interface Mockups", 
    category: "Design",
    type: "png", 
    size: "5.2 MB", 
    lastModified: new Date(2023, 5, 1), 
    uploadedBy: "Emily Chen" 
  },
  { 
    id: 4, 
    name: "Database Schema", 
    category: "Development",
    type: "pdf", 
    size: "1.1 MB", 
    lastModified: new Date(2023, 5, 5), 
    uploadedBy: "David Wilson" 
  },
  { 
    id: 5, 
    name: "API Documentation", 
    category: "Development",
    type: "docx", 
    size: "920 KB", 
    lastModified: new Date(2023, 5, 10), 
    uploadedBy: "James Taylor" 
  },
  { 
    id: 6, 
    name: "User Manual", 
    category: "User Guides",
    type: "pdf", 
    size: "4.6 MB", 
    lastModified: new Date(2023, 5, 15), 
    uploadedBy: "Sarah Johnson" 
  },
];

export default function Documents() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [isAuthLoading, isAuthenticated]);
  
  // Filter documents based on search query and selected category
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? doc.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  
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
              <h1 className="text-xl font-semibold text-gray-900">Documents</h1>
            </div>
            <div>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Categories</h3>
              </div>
              <div className="p-6">
                <div className="space-y-1">
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                      !selectedCategory ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Documents ({documents.length})
                  </button>
                  {documentCategories.map(category => (
                    <button 
                      key={category.id}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                        selectedCategory === category.name ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Quick Actions</h4>
                  <div className="space-y-1">
                    <button className="w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                      <FilePlus2 className="w-4 h-4 mr-2" />
                      Request New Document
                    </button>
                    <button className="w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                      <Folder className="w-4 h-4 mr-2" />
                      Manage Folders
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Search Bar */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search documents by name..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Documents List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedCategory ? `${selectedCategory} Documents` : 'All Documents'}
                </h3>
                {selectedCategory && (
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="text-sm font-medium text-primary hover:text-primary/80"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              
              {filteredDocuments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Modified
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Uploaded By
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDocuments.map((document) => (
                        <tr key={document.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {document.type === 'pdf' ? (
                                <FileText className="h-5 w-5 text-gray-400" />
                              ) : document.type === 'png' ? (
                                <Image className="h-5 w-5 text-gray-400" />
                              ) : (
                                <File className="h-5 w-5 text-gray-400" />
                              )}
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {document.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {document.type.toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              {document.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {document.size}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(document.lastModified, 'MMM d, yyyy')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {document.uploadedBy}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-primary hover:text-primary/80 mr-4">
                              <Download className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-500">
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No documents found</h3>
                  <p className="text-gray-500">
                    {searchQuery ? `No documents match your search for "${searchQuery}"` : 'No documents in this category yet'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}