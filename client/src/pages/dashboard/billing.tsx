import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { 
  CreditCard, 
  Download, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  DollarSign, 
  Shield, 
  ArrowRight,
  BarChart
} from "lucide-react";

// Sample billing plan data
const currentPlan = {
  name: "ACCELERATE",
  price: "$299",
  billingCycle: "monthly",
  nextBillingDate: "2023-09-15T00:00:00",
  status: "active",
  features: [
    "Unlimited projects",
    "Priority support",
    "Advanced analytics",
    "Team collaboration",
    "Custom integrations",
    "API access",
    "White-labeling"
  ]
};

// Sample payment method data
const paymentMethod = {
  type: "visa",
  lastFour: "4242",
  expiryMonth: 12,
  expiryYear: 2024,
  name: "John Smith",
  isDefault: true
};

// Sample invoice data
const invoices = [
  {
    id: "INV-2023-008",
    date: "2023-08-01T00:00:00",
    amount: "$299.00",
    status: "paid",
    items: [
      { description: "ACCELERATE Plan - Monthly", amount: "$299.00" }
    ],
    pdf: "/invoices/INV-2023-008.pdf"
  },
  {
    id: "INV-2023-007",
    date: "2023-07-01T00:00:00",
    amount: "$299.00",
    status: "paid",
    items: [
      { description: "ACCELERATE Plan - Monthly", amount: "$299.00" }
    ],
    pdf: "/invoices/INV-2023-007.pdf"
  },
  {
    id: "INV-2023-006",
    date: "2023-06-01T00:00:00",
    amount: "$299.00",
    status: "paid",
    items: [
      { description: "ACCELERATE Plan - Monthly", amount: "$299.00" }
    ],
    pdf: "/invoices/INV-2023-006.pdf"
  },
  {
    id: "INV-2023-005",
    date: "2023-05-01T00:00:00",
    amount: "$299.00",
    status: "paid",
    items: [
      { description: "ACCELERATE Plan - Monthly", amount: "$299.00" }
    ],
    pdf: "/invoices/INV-2023-005.pdf"
  },
  {
    id: "INV-2023-004",
    date: "2023-04-01T00:00:00",
    amount: "$299.00",
    status: "paid",
    items: [
      { description: "ACCELERATE Plan - Monthly", amount: "$299.00" }
    ],
    pdf: "/invoices/INV-2023-004.pdf"
  }
];

// Sample billing usage data for the chart
const usageData = [
  { month: 'Jan', apiCalls: 15420, storageMB: 528 },
  { month: 'Feb', apiCalls: 18240, storageMB: 632 },
  { month: 'Mar', apiCalls: 21150, storageMB: 703 },
  { month: 'Apr', apiCalls: 25800, storageMB: 845 },
  { month: 'May', apiCalls: 30100, storageMB: 925 },
  { month: 'Jun', apiCalls: 42500, storageMB: 1250 },
  { month: 'Jul', apiCalls: 48700, storageMB: 1380 },
  { month: 'Aug', apiCalls: 52300, storageMB: 1520 }
];

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

// Helper function to create a professional, downloadable invoice PDF
function generateInvoicePDF(invoice: any) {
  // Import jsPDF for PDF generation
  import('jspdf').then((jspdfModule) => {
    const { default: jsPDF } = jspdfModule;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set document properties
    doc.setProperties({
      title: `Invoice ${invoice.id}`,
      subject: 'Invoice',
      author: 'AppForge Inc.',
      keywords: 'invoice, billing, payment',
      creator: 'AppForge Billing System'
    });
    
    // Document dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    
    // Colors
    const primaryColor = '#FF0A36'; // AppForge brand color
    const textColor = '#333333';
    const lightGray = '#F8F8F8';
    const mediumGray = '#E0E0E0';
    
    // Add logo at the top
    try {
      // Add the company logo - in real implementation this would be an image
      // For now we'll create a styled header with the company name
      doc.setFillColor(primaryColor);
      doc.rect(margin, margin, 40, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('AppForge', margin + 8, margin + 10);
      
      // Company info
      doc.setTextColor(textColor);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('AppForge Inc.', margin + 50, margin + 5);
      doc.text('123 Tech Boulevard', margin + 50, margin + 10);
      doc.text('San Francisco, CA 94104', margin + 50, margin + 15);
    } catch (e) {
      console.error('Error adding logo:', e);
    }
    
    // Invoice title and number
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('INVOICE', margin, margin + 30);
    doc.setFontSize(12);
    doc.setTextColor(textColor);
    doc.text(`Invoice Number: ${invoice.id}`, margin, margin + 38);
    doc.text(`Date: ${formatDate(invoice.date)}`, margin, margin + 45);
    
    // Status badge
    const statusText = invoice.status === 'paid' ? 'PAID' : 'PENDING';
    doc.setFillColor(invoice.status === 'paid' ? '#10B981' : '#F59E0B');
    doc.setDrawColor(invoice.status === 'paid' ? '#10B981' : '#F59E0B');
    doc.roundedRect(pageWidth - margin - 30, margin, 30, 10, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(statusText, pageWidth - margin - 15, margin + 6, { align: 'center' });
    
    // Billing info
    doc.setTextColor(textColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Billed To:', margin, margin + 60);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('John Smith', margin, margin + 68);
    doc.text('Example Company Inc.', margin, margin + 74);
    doc.text('1234 Business Ave, Suite 500', margin, margin + 80);
    doc.text('San Francisco, CA 94105', margin, margin + 86);
    
    // Payment details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Method:', pageWidth - margin - 80, margin + 60);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Visa •••• 4242', pageWidth - margin - 80, margin + 68);
    doc.text('Payment Date: ' + formatDate(invoice.date), pageWidth - margin - 80, margin + 74);
    
    // Table header
    const tableTop = margin + 100;
    const tableColWidths = [(pageWidth - 2 * margin) * 0.6, (pageWidth - 2 * margin) * 0.4];
    
    // Draw table header background
    doc.setFillColor(lightGray);
    doc.rect(margin, tableTop, pageWidth - 2 * margin, 10, 'F');
    
    // Table header text
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor);
    doc.setFontSize(11);
    doc.text('Description', margin + 5, tableTop + 7);
    doc.text('Amount', margin + tableColWidths[0] + 5, tableTop + 7);
    
    // Table content
    let yPosition = tableTop + 10;
    
    // Draw table rows
    invoice.items.forEach((item: any, index: number) => {
      // Draw row background (alternating colors)
      if (index % 2 === 0) {
        doc.setFillColor(255, 255, 255);
      } else {
        doc.setFillColor(lightGray);
      }
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F');
      
      // Row content
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(textColor);
      doc.text(item.description, margin + 5, yPosition + 7);
      doc.setFont('helvetica', 'bold');
      doc.text(item.amount, margin + tableColWidths[0] + 5, yPosition + 7);
      
      yPosition += 10;
    });
    
    // Total section
    doc.setFillColor(primaryColor);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total', margin + 5, yPosition + 8);
    doc.text(invoice.amount, margin + tableColWidths[0] + 5, yPosition + 8);
    
    // Footer
    const footerY = pageHeight - margin - 20;
    doc.setDrawColor(mediumGray);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor);
    doc.setFontSize(9);
    doc.text('Thank you for your business!', margin, footerY + 7);
    doc.text('For questions about this invoice, please contact support@appforge.com', margin, footerY + 14);
    
    // Save the PDF
    doc.save(`${invoice.id}.pdf`);
  }).catch(err => {
    console.error('Error generating PDF:', err);
    alert('There was an error generating the PDF. Please try again.');
  });
}

export default function BillingPage() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Function to view invoice details in a modal
  const viewInvoiceDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Billing & Invoices</h1>
            <div>
              <button
                onClick={() => setLocation("/dashboard")}
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current subscription */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Current Subscription</h2>
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-bold text-gray-900">{currentPlan.name} Plan</h3>
                    <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Billed {currentPlan.billingCycle === 'monthly' ? 'monthly' : 'annually'} · Next payment on {formatDate(currentPlan.nextBillingDate)}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-2xl font-bold text-gray-900">{currentPlan.price}<span className="text-sm font-normal text-gray-500">/{currentPlan.billingCycle === 'monthly' ? 'mo' : 'yr'}</span></p>
                </div>
              </div>
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="ml-2 text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <button
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none"
                >
                  Change Plan
                </button>
                <button
                  className="mt-3 sm:mt-0 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {paymentMethod.type.charAt(0).toUpperCase() + paymentMethod.type.slice(1)} •••• {paymentMethod.lastFour}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                    </p>
                    <p className="text-sm text-gray-500">
                      {paymentMethod.name}
                    </p>
                  </div>
                </div>
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Billing history */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Billing History</h2>
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
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
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        {formatDate(invoice.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invoice.status === 'paid' ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Paid
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Pending
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => viewInvoiceDetails(invoice)}
                          className="text-primary hover:text-primary/80 mr-4"
                        >
                          View
                        </button>
                        <button
                          onClick={() => generateInvoicePDF(invoice)}
                          className="text-primary hover:text-primary/80 inline-flex items-center"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Usage stats */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Usage Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary/10 rounded-full p-3">
                  <BarChart className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">API Usage</h3>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-3xl font-bold text-gray-900">52,300</p>
                <p className="mt-1 text-sm text-green-600 flex items-center">
                  <ArrowRight className="h-4 w-4 mr-1 transform rotate-45" />
                  7.5% increase from last month
                </p>
              </div>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary/10 rounded-full p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Storage Used</h3>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-3xl font-bold text-gray-900">1.52 GB</p>
                <p className="mt-1 text-sm text-green-600 flex items-center">
                  <ArrowRight className="h-4 w-4 mr-1 transform rotate-45" />
                  10.1% increase from last month
                </p>
              </div>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary/10 rounded-full p-3">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Current Balance</h3>
                  <p className="text-sm text-gray-500">As of today</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-3xl font-bold text-gray-900">$0.00</p>
                <p className="mt-1 text-sm text-gray-600 flex items-center">
                  Next invoice: {formatDate(currentPlan.nextBillingDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ section */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Billing FAQ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">When am I charged?</h3>
              <p className="mt-1 text-sm text-gray-600">
                Your subscription is charged at the beginning of each billing cycle. For monthly plans, this is on the same day each month.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900">How do I update my payment method?</h3>
              <p className="mt-1 text-sm text-gray-600">
                You can update your payment method at any time from the Payment Method section above.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900">What happens if I cancel my subscription?</h3>
              <p className="mt-1 text-sm text-gray-600">
                Your service will continue until the end of your current billing period. After that, you'll lose access to premium features.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Are there any additional fees?</h3>
              <p className="mt-1 text-sm text-gray-600">
                No, the price you see is all-inclusive. There are no hidden fees or additional costs beyond your subscription.
              </p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <a href="#" className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              View our Billing Terms & Conditions
            </a>
          </div>
        </div>
      </main>

      {/* Invoice details modal */}
      {showModal && selectedInvoice && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Invoice {selectedInvoice.id}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Issued on {formatDate(selectedInvoice.date)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <div className="border-t border-gray-200 py-4">
                  <h4 className="text-sm font-medium text-gray-900">Items</h4>
                  <div className="mt-2 space-y-2">
                    {selectedInvoice.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.description}</span>
                        <span className="font-medium text-gray-900">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-gray-200 py-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{selectedInvoice.amount}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 py-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-medium ${selectedInvoice.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {selectedInvoice.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/90 focus:outline-none sm:col-start-2 sm:text-sm"
                  onClick={() => generateInvoicePDF(selectedInvoice)}
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}