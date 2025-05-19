import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { 
  ArrowLeft, 
  CreditCard, 
  Download, 
  ChevronDown,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText
} from "lucide-react";
import { format } from "date-fns";

// Dummy data for billing plan
const currentPlan = {
  name: "ACCELERATE",
  price: "$2,499",
  billingCycle: "monthly",
  nextBillingDate: new Date(2023, 6, 15),
  status: "active"
};

// Dummy data for payment methods
const paymentMethods = [
  {
    id: 1,
    type: "credit_card",
    brand: "visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2025,
    isDefault: true
  }
];

// Dummy data for invoices
const invoices = [
  { 
    id: "INV-2023-001", 
    amount: "$2,499.00", 
    status: "paid", 
    date: new Date(2023, 5, 15),
    items: [
      { name: "ACCELERATE Plan - Monthly", amount: "$2,499.00" }
    ]
  },
  { 
    id: "INV-2023-002", 
    amount: "$2,499.00", 
    status: "paid", 
    date: new Date(2023, 4, 15),
    items: [
      { name: "ACCELERATE Plan - Monthly", amount: "$2,499.00" }
    ]
  },
  { 
    id: "INV-2023-003", 
    amount: "$2,499.00", 
    status: "paid", 
    date: new Date(2023, 3, 15),
    items: [
      { name: "ACCELERATE Plan - Monthly", amount: "$2,499.00" }
    ]
  },
  { 
    id: "INV-2023-004", 
    amount: "$499.00", 
    status: "paid", 
    date: new Date(2023, 3, 10),
    items: [
      { name: "Additional Development Hours (10hrs)", amount: "$499.00" }
    ]
  }
];

export default function Billing() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      window.location.href = "/api/login";
    }
  }, [isAuthLoading, isAuthenticated]);
  
  if (isAuthLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </span>
        );
      default:
        return null;
    }
  };
  
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
              <h1 className="text-xl font-semibold text-gray-900">Billing & Payments</h1>
            </div>
            <div>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90">
                <CreditCard className="w-4 h-4 mr-2" />
                Update Payment Method
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-1 py-4 text-sm font-medium border-b-2 ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("payment-methods")}
              className={`px-1 py-4 text-sm font-medium border-b-2 ${
                activeTab === "payment-methods"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Payment Methods
            </button>
            <button
              onClick={() => setActiveTab("invoices")}
              className={`px-1 py-4 text-sm font-medium border-b-2 ${
                activeTab === "invoices"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Invoices
            </button>
          </nav>
        </div>
      </div>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">{currentPlan.name}</h4>
                    <p className="mt-1 text-gray-500">
                      {currentPlan.price}/{currentPlan.billingCycle === "monthly" ? "month" : "year"}
                    </p>
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">Next billing date: {format(currentPlan.nextBillingDate, 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button className="inline-flex items-center justify-center px-4 py-2 border border-primary rounded-md shadow-sm text-sm font-medium text-primary bg-white hover:bg-primary/5 focus:outline-none">
                    Change Plan
                  </button>
                  <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>
            
            {/* Plan Features */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Plan Features</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Up to 5 active projects</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">40 hours of development per month</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Priority support with 24-hour response time</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Unlimited team members</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Advanced analytics and reporting</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Free lifetime hosting</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Billing History Summary */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Recent Invoices</h3>
                <button
                  onClick={() => setActiveTab("invoices")}
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  View All
                </button>
              </div>
              <div className="px-6 py-5">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Download
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {invoices.slice(0, 3).map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {invoice.id}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(invoice.date, 'MMM d, yyyy')}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                            {invoice.amount}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getStatusBadge(invoice.status)}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            <button className="text-primary hover:text-primary/80">
                              <Download className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Payment Methods Tab */}
        {activeTab === "payment-methods" && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add Payment Method
                </button>
              </div>
              <div className="p-6">
                {paymentMethods.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {paymentMethods.map((method) => (
                      <li key={method.id} className="py-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <CreditCard className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} ending in {method.last4}
                            </p>
                            <p className="text-sm text-gray-500">
                              Expires {method.expMonth.toString().padStart(2, '0')}/{method.expYear}
                            </p>
                            {method.isDefault && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                            Edit
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-10">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      You haven't added any payment methods yet. Add a payment method to manage your billing.
                    </p>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Add Payment Method
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Invoices Tab */}
        {activeTab === "invoices" && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Invoices</h3>
              </div>
              <div className="p-6">
                {invoices.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Invoice
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {invoices.map((invoice) => (
                          <tr key={invoice.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {invoice.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {format(invoice.date, 'MMMM d, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {invoice.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getStatusBadge(invoice.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none mr-2">
                                <FileText className="h-4 w-4 mr-1" />
                                View
                              </button>
                              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      You don't have any invoices yet. They will appear here once you're billed.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}