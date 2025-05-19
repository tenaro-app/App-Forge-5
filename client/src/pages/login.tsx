import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

export default function Login() {
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 overflow-hidden"
      >
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">AF</span>
            </div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute -bottom-1 -right-1 bg-white rounded-full shadow-md p-1"
            >
              <div className="bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome to AppForge</h1>
        <p className="text-center text-gray-600 mb-8">Sign in to access your client dashboard</p>
        
        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 disabled:opacity-70 flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Sign in securely"
            )}
          </button>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
        
        <div className="mt-10 flex items-center justify-center">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="px-3 text-sm text-gray-500 bg-white">Trusted by businesses worldwide</span>
          <div className="border-t border-gray-200 w-full"></div>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="h-12 rounded-md bg-gray-50 flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-12 rounded-md bg-gray-50 flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-12 rounded-md bg-gray-50 flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}