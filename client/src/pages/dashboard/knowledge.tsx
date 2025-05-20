import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { 
  BookOpen, 
  File, 
  Video, 
  Monitor,
  Search,
  FileText,
  ChevronRight,
  ChevronDown,
  Clock
} from "lucide-react";

// Sample knowledge base categories
const categories = [
  {
    id: 1,
    name: "Getting Started",
    description: "Essential guides to help you get started with our platform",
    icon: <Monitor className="h-6 w-6 text-primary" />,
    count: 8
  },
  {
    id: 2,
    name: "API Documentation",
    description: "Comprehensive documentation for our API endpoints",
    icon: <FileText className="h-6 w-6 text-primary" />,
    count: 12
  },
  {
    id: 3,
    name: "Tutorials",
    description: "Step-by-step tutorials for common tasks",
    icon: <Video className="h-6 w-6 text-primary" />,
    count: 15
  },
  {
    id: 4,
    name: "Best Practices",
    description: "Recommended practices for optimal results",
    icon: <File className="h-6 w-6 text-primary" />,
    count: 9
  },
  {
    id: 5,
    name: "Troubleshooting",
    description: "Solutions to common issues and problems",
    icon: <File className="h-6 w-6 text-primary" />,
    count: 14
  },
  {
    id: 6,
    name: "Security Guidelines",
    description: "Important security information for your account",
    icon: <File className="h-6 w-6 text-primary" />,
    count: 6
  }
];

// Sample popular articles
const popularArticles = [
  {
    id: 1,
    title: "How to integrate with payment gateways",
    category: "API Documentation",
    views: 4289,
    updated: "3 days ago"
  },
  {
    id: 2,
    title: "Setting up your first project",
    category: "Getting Started",
    views: 3567,
    updated: "1 week ago"
  },
  {
    id: 3,
    title: "Understanding user roles and permissions",
    category: "Best Practices",
    views: 2945,
    updated: "2 weeks ago"
  },
  {
    id: 4,
    title: "Deploying your application to production",
    category: "Tutorials",
    views: 2456,
    updated: "1 month ago"
  },
  {
    id: 5,
    title: "Troubleshooting common API errors",
    category: "Troubleshooting",
    views: 2356,
    updated: "2 weeks ago"
  }
];

// Sample FAQ data
const faqs = [
  {
    question: "How do I reset my password?",
    answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. You will receive an email with instructions to create a new password.",
    expanded: false
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), as well as PayPal and bank transfers for annual plans.",
    expanded: false
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your subscription at any time from your account settings. Your service will continue until the end of the current billing period.",
    expanded: false
  },
  {
    question: "How do I contact customer support?",
    answer: "You can contact our customer support team through the 'Support' tab in your dashboard, by emailing support@appforge.com, or through the live chat option available during business hours.",
    expanded: false
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security very seriously. All data is encrypted in transit and at rest. We use industry-standard security measures and conduct regular security audits to protect your information.",
    expanded: false
  }
];

export default function KnowledgeBasePage() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqs, setExpandedFaqs] = useState<Record<number, boolean>>({});
  
  const toggleFaq = (index: number) => {
    setExpandedFaqs({
      ...expandedFaqs,
      [index]: !expandedFaqs[index]
    });
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Knowledge Base</h1>
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
        {/* Hero search section */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-8 mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How can we help you today?</h2>
            <p className="text-lg text-gray-600 mb-6">
              Search our knowledge base for answers to your questions
            </p>
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary text-base"
                placeholder="Search for articles, tutorials, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                className="absolute inset-y-0 right-0 px-4 text-white font-medium bg-primary rounded-r-md hover:bg-primary/90"
                onClick={() => alert("Search functionality will be implemented soon!")}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Categories grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div 
                key={category.id} 
                className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => alert(`Viewing ${category.name} category`)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {category.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                    <p className="mt-2 text-sm text-gray-500">{category.count} articles</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {popularArticles.map((article) => (
                <li key={article.id}>
                  <div 
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer flex items-center"
                    onClick={() => alert(`Reading article: ${article.title}`)}
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-medium text-primary hover:text-primary/80">{article.title}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="truncate">{article.category}</span>
                        <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-300"></span>
                        <span>{article.views.toLocaleString()} views</span>
                        <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-300"></span>
                        <span className="flex items-center">
                          <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          Updated {article.updated}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <div className="text-sm">
                <button
                  onClick={() => alert("View all articles feature coming soon!")}
                  className="font-medium text-primary hover:text-primary/80 flex items-center"
                >
                  View all articles
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <dl className="divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6">
                  <dt className="text-lg">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="text-left w-full flex justify-between items-center focus:outline-none"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <span className="ml-6 flex-shrink-0">
                        {expandedFaqs[index] ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        )}
                      </span>
                    </button>
                  </dt>
                  {expandedFaqs[index] && (
                    <dd className="mt-2 pr-12">
                      <p className="text-base text-gray-600">{faq.answer}</p>
                    </dd>
                  )}
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Still need help section */}
        <div className="bg-primary/10 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is ready to assist you with any questions or issues.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setLocation("/dashboard/chat")}
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 shadow-sm"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Live Chat
            </button>
            <button
              onClick={() => setLocation("/dashboard/tickets")}
              className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
            >
              <File className="mr-2 h-5 w-5" />
              Submit a Ticket
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}