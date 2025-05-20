import { useState } from 'react';
import { useLocation } from "wouter";

export default function AdminAccess() {
  const [, setLocation] = useLocation();
  const [accessGranted, setAccessGranted] = useState(true); // For testing, we'll default to granted access
  
  // For a real implementation, we would check user roles here
  // But for testing purposes, we're bypassing authentication

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6 border-b pb-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Access Portal</h1>
            <p className="mt-2 text-gray-600">
              Welcome, Administrator. You have admin privileges.
              Select one of the links below to access the admin areas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/admin" 
              target="_blank"
              className="block p-6 bg-primary/10 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              <h2 className="text-xl font-bold text-primary mb-2">Admin Dashboard</h2>
              <p className="text-gray-600">Access the main admin dashboard with overview stats and activities.</p>
            </a>
            
            <a 
              href="/admin/clients" 
              target="_blank"
              className="block p-6 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <h2 className="text-xl font-bold text-blue-600 mb-2">Client Management</h2>
              <p className="text-gray-600">Manage clients, view client details and their projects.</p>
            </a>
            
            <a 
              href="/admin/projects" 
              target="_blank"
              className="block p-6 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
            >
              <h2 className="text-xl font-bold text-green-600 mb-2">Project Management</h2>
              <p className="text-gray-600">View and manage all projects across the platform.</p>
            </a>
            
            <a 
              href="/admin/contacts" 
              target="_blank"
              className="block p-6 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              <h2 className="text-xl font-bold text-purple-600 mb-2">Contact Management</h2>
              <p className="text-gray-600">View and manage contact form submissions.</p>
            </a>
            
            <a 
              href="/admin/support" 
              target="_blank"
              className="block p-6 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors"
            >
              <h2 className="text-xl font-bold text-orange-600 mb-2">Support Dashboard</h2>
              <p className="text-gray-600">Manage support tickets and chat sessions.</p>
            </a>
            
            <a 
              href="/admin/settings" 
              target="_blank"
              className="block p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <h2 className="text-xl font-bold text-gray-700 mb-2">Admin Settings</h2>
              <p className="text-gray-600">Configure platform settings and system preferences.</p>
            </a>
          </div>
          
          <div className="mt-8 text-center">
            <a 
              href="/dashboard" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none"
            >
              Return to Client Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}