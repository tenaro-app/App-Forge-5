import { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Send, X, Minimize2, Maximize2, Bot, User, Phone, CreditCard, 
  FileQuestion, HelpCircle, PenTool, Code, Server, ChevronRight, ChevronDown, 
  ExternalLink, FileText, Headphones, BookOpen, Bell, RefreshCcw, Bookmark, 
  ThumbsUp, ThumbsDown, ClipboardList, CalendarCheck, Settings, Download, Link2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define departments
type Department = 'sales' | 'billing' | 'technical' | 'support' | 'general';

// Message types and interfaces
type MessageType = 'bot' | 'user' | 'system';
interface Message {
  id: string;
  text: string;
  type: MessageType;
  timestamp: Date;
  department?: Department;
  hasAction?: boolean;
  actionLabel?: string;
  actionUrl?: string;
  actionIcon?: React.ReactNode;
  richContent?: React.ReactNode;
}

// Department information
interface DepartmentInfo {
  id: Department;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  responseTime: string;
  availability: string;
}

const departments: DepartmentInfo[] = [
  {
    id: 'sales',
    name: 'Sales & Partnerships',
    icon: <PenTool className="w-5 h-5" />,
    description: 'Questions about our services, pricing, and custom solutions',
    color: 'bg-blue-600',
    responseTime: 'Usually responds in under 10 minutes',
    availability: 'Available 9AM-6PM (Mon-Fri)'
  },
  {
    id: 'billing',
    name: 'Billing & Accounts',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Invoices, payments, and subscription inquiries',
    color: 'bg-emerald-600',
    responseTime: 'Usually responds in under 15 minutes',
    availability: 'Available 9AM-5PM (Mon-Fri)'
  },
  {
    id: 'technical',
    name: 'Technical Development',
    icon: <Code className="w-5 h-5" />,
    description: 'Technical questions about your app development',
    color: 'bg-violet-600',
    responseTime: 'Usually responds in under 20 minutes',
    availability: 'Available 24/7 for urgent matters'
  },
  {
    id: 'support',
    name: 'Customer Support',
    icon: <Headphones className="w-5 h-5" />,
    description: 'General support and assistance with your account',
    color: 'bg-amber-600',
    responseTime: 'Usually responds in under 5 minutes',
    availability: 'Available 24/7'
  },
  {
    id: 'general',
    name: 'General Inquiries',
    icon: <HelpCircle className="w-5 h-5" />,
    description: 'General questions about our company and offerings',
    color: 'bg-primary',
    responseTime: 'Usually responds immediately',
    availability: 'Available 24/7'
  }
];

// Quick actions for the chatbot
interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  url?: string;
  external?: boolean;
  action?: () => void;
}

const quickActions: QuickAction[] = [
  { 
    id: 'create-ticket', 
    label: 'Create Support Ticket', 
    icon: <FileText className="w-4 h-4" />,
    url: '/dashboard/tickets/new'
  },
  { 
    id: 'faq', 
    label: 'View FAQ', 
    icon: <FileQuestion className="w-4 h-4" />,
    url: '#faq',
    action: () => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }) 
  },
  { 
    id: 'knowledge-base', 
    label: 'Knowledge Base', 
    icon: <BookOpen className="w-4 h-4" />,
    url: '/help/knowledge-base',
    external: true 
  },
  { 
    id: 'schedule-call', 
    label: 'Schedule a Call', 
    icon: <Phone className="w-4 h-4" />,
    url: '/schedule'
  },
  { 
    id: 'client-portal', 
    label: 'Client Portal', 
    icon: <Server className="w-4 h-4" />,
    url: '/dashboard'
  }
];

// Common questions by department
interface Question {
  id: string;
  text: string;
  department: Department;
}

const commonQuestions: Question[] = [
  { id: 'sales-pricing', text: 'What are your pricing plans?', department: 'sales' },
  { id: 'sales-customization', text: 'Can you build a custom solution for my business?', department: 'sales' },
  { id: 'sales-timeline', text: 'How long does it take to develop an application?', department: 'sales' },
  { id: 'billing-payment', text: 'What payment methods do you accept?', department: 'billing' },
  { id: 'billing-invoice', text: 'Where can I find my past invoices?', department: 'billing' },
  { id: 'billing-refund', text: 'What is your refund policy?', department: 'billing' },
  { id: 'technical-features', text: 'What technologies do you use for development?', department: 'technical' },
  { id: 'technical-integrations', text: 'Can you integrate with my existing systems?', department: 'technical' },
  { id: 'technical-security', text: 'How do you ensure application security?', department: 'technical' },
  { id: 'support-account', text: 'I need help accessing my account', department: 'support' },
  { id: 'support-issue', text: 'I found a bug in my application', department: 'support' },
  { id: 'support-feature', text: 'How do I request a new feature?', department: 'support' }
];

// Bot responses for different departments and common questions
interface BotResponseData {
  text: string;
  followUp?: string[];
  hasAction?: boolean;
  actionLabel?: string;
  actionUrl?: string;
  actionIcon?: React.ReactNode;
  richContent?: React.ReactNode;
}

const botResponses: Record<string, BotResponseData> = {
  'sales-pricing': {
    text: "Our pricing structure is designed to fit businesses of all sizes:\n\n• IGNITE: $5,000 - Perfect for startups and small businesses getting started with automation\n• ACCELERATE: $10,000 - For growing companies with more complex automation needs\n• DOMINATE: $20,000+ - Enterprise-grade solutions with unlimited automation capabilities\n\nAll plans include 1 year of FREE technical development and lifetime hosting.",
    hasAction: true,
    actionLabel: "View Detailed Pricing",
    actionUrl: "#pricing",
    actionIcon: <ExternalLink className="w-4 h-4" />,
  },
  'sales-customization': {
    text: "Absolutely! Custom solutions are our specialty. We take pride in understanding your unique business challenges and creating tailored automation solutions that fit your exact needs and workflows. Our process begins with a comprehensive discovery session where we learn about your business processes, pain points, and goals.",
    followUp: ["Would you like to schedule a free consultation to discuss your custom requirements?"],
    hasAction: true,
    actionLabel: "Schedule Free Consultation",
    actionUrl: "/schedule",
    actionIcon: <CalendarCheck className="w-4 h-4" />,
  },
  'sales-timeline': {
    text: "Development timelines vary based on project complexity:\n\n• Simple automations: 2-4 weeks\n• Medium complexity: 4-8 weeks\n• Enterprise solutions: 8-16 weeks\n\nWe provide detailed project timelines during our discovery process and keep you updated with regular progress reports throughout development.",
    followUp: ["What kind of application are you looking to develop?"]
  },
  'billing-payment': {
    text: "We accept multiple payment methods for your convenience:\n\n• Credit/Debit Cards (Visa, Mastercard, Amex)\n• ACH/Bank Transfers\n• PayPal\n• Cryptocurrency (Bitcoin, Ethereum)\n\nPayments are securely processed and can be made monthly, quarterly, or annually with discounts for longer commitments.",
    hasAction: true,
    actionLabel: "Manage Payment Methods",
    actionUrl: "/dashboard/billing",
    actionIcon: <Settings className="w-4 h-4" />,
  },
  'billing-invoice': {
    text: "You can find all your past invoices in your client dashboard under the Billing section. Each invoice includes detailed information about your charges and can be downloaded as PDF for your records.",
    hasAction: true,
    actionLabel: "View Invoices",
    actionUrl: "/dashboard/invoices",
    actionIcon: <Download className="w-4 h-4" />,
  },
  'billing-refund': {
    text: "Our refund policy provides for a full refund within 30 days of your initial payment if you're not satisfied with our services. After this period, refunds are prorated based on service usage. For custom development projects, refund terms are specified in your contract.",
    hasAction: true,
    actionLabel: "View Full Policy",
    actionUrl: "/terms/refund-policy",
    actionIcon: <FileText className="w-4 h-4" />,
  },
  'technical-features': {
    text: "We leverage cutting-edge technologies for optimal performance and scalability:\n\n• Frontend: React, Vue.js, Next.js, TypeScript\n• Backend: Node.js, Express, Python, Go\n• Databases: PostgreSQL, MongoDB, Redis\n• Cloud Services: AWS, GCP, Azure\n• DevOps: Docker, Kubernetes, CI/CD pipelines\n\nWe customize the tech stack based on your project's specific requirements.",
    hasAction: true,
    actionLabel: "View Technical Capabilities",
    actionUrl: "#technologies",
    actionIcon: <Link2 className="w-4 h-4" />,
  },
  'technical-integrations': {
    text: "Yes, we specialize in seamless integrations with existing systems. We can connect with most APIs, databases, and third-party services including CRMs, ERPs, payment processors, and more. Our integration specialists ensure data flows smoothly across your entire technology ecosystem.",
    followUp: ["Which specific systems would you like to integrate with?"]
  },
  'technical-security': {
    text: "Security is our top priority. We implement multiple layers of protection:\n\n• Secure authentication (OAuth2, MFA)\n• Data encryption (in transit and at rest)\n• Regular security audits and penetration testing\n• GDPR and regulatory compliance\n• Automated vulnerability scanning\n• Secure coding practices\n\nWe follow industry best practices and can adhere to specific security standards required by your industry.",
    hasAction: true,
    actionLabel: "Security Documentation",
    actionUrl: "/help/security",
    actionIcon: <FileText className="w-4 h-4" />,
  },
  'support-account': {
    text: "I'm sorry to hear you're having trouble accessing your account. Here are some quick troubleshooting steps:\n\n1. Make sure you're using the correct email address\n2. Try the 'Forgot Password' option\n3. Clear your browser cache and cookies\n\nIf you're still having issues, our support team can help reset your account access.",
    hasAction: true,
    actionLabel: "Contact Support Team",
    actionUrl: "/dashboard/tickets/new",
    actionIcon: <Headphones className="w-4 h-4" />,
  },
  'support-issue': {
    text: "I'm sorry to hear about the bug you've encountered. To help us resolve it quickly, please provide:\n\n1. A detailed description of the issue\n2. Steps to reproduce the problem\n3. Screenshots if possible\n4. When you first noticed the bug\n\nOur development team treats bug reports with high priority.",
    hasAction: true,
    actionLabel: "Report Bug",
    actionUrl: "/dashboard/tickets/new?type=bug",
    actionIcon: <ClipboardList className="w-4 h-4" />,
  },
  'support-feature': {
    text: "We love getting feature requests from our clients! You can submit new feature ideas through your client dashboard or directly to your project manager. Each request is evaluated based on implementation feasibility and added to our development roadmap based on priority.",
    hasAction: true,
    actionLabel: "Submit Feature Request",
    actionUrl: "/dashboard/tickets/new?type=feature",
    actionIcon: <PenTool className="w-4 h-4" />,
  }
};

// Intent detection function - simple keyword matching for demo
const detectIntent = (message: string): {intent: string, department: Department} => {
  message = message.toLowerCase();
  
  // Department detection
  let department: Department = 'general';
  
  if (message.includes('price') || message.includes('cost') || message.includes('expensive') || 
      message.includes('quote') || message.includes('proposal') || message.includes('demo') ||
      message.includes('partner') || message.includes('service')) {
    department = 'sales';
  }
  else if (message.includes('bill') || message.includes('invoice') || message.includes('payment') || 
           message.includes('subscription') || message.includes('refund') || message.includes('charge')) {
    department = 'billing';
  }
  else if (message.includes('bug') || message.includes('error') || message.includes('issue') || 
           message.includes('help') || message.includes('problem') || message.includes('support')) {
    department = 'support';
  }
  else if (message.includes('code') || message.includes('development') || message.includes('api') || 
           message.includes('integration') || message.includes('feature') || message.includes('tech')) {
    department = 'technical';
  }

  // Try to match against common questions
  for (const question of commonQuestions) {
    // Check if most words in the question match the input
    const questionWords = question.text.toLowerCase().split(' ');
    const matchCount = questionWords.filter(word => message.includes(word)).length;
    
    if (matchCount >= questionWords.length / 2) {
      return { intent: question.id, department: question.department };
    }
  }
  
  return { intent: 'unknown', department };
};

// Rich content components
const PricingTable = () => (
  <div className="w-full bg-white p-3 rounded-md border border-gray-200 my-2">
    <h4 className="font-bold text-sm mb-2 text-gray-800">Pricing Plans</h4>
    <div className="text-xs grid grid-cols-3 gap-1">
      <div className="bg-gray-50 p-2 rounded">
        <span className="font-bold block text-primary">IGNITE</span>
        <span className="block text-gray-700">$5,000</span>
        <span className="text-gray-500 text-[10px]">Starter package</span>
      </div>
      <div className="bg-gray-50 p-2 rounded">
        <span className="font-bold block text-primary">ACCELERATE</span>
        <span className="block text-gray-700">$10,000</span>
        <span className="text-gray-500 text-[10px]">Growth package</span>
      </div>
      <div className="bg-gray-50 p-2 rounded">
        <span className="font-bold block text-primary">DOMINATE</span>
        <span className="block text-gray-700">$20,000+</span>
        <span className="text-gray-500 text-[10px]">Enterprise solutions</span>
      </div>
    </div>
  </div>
);

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [showDepartmentSelector, setShowDepartmentSelector] = useState(false);
  const [showQuickActionMenu, setShowQuickActionMenu] = useState(false);
  const [showDepartmentInfo, setShowDepartmentInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize welcome message based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    
    if (hour >= 5 && hour < 12) {
      greeting = 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      greeting = 'Good afternoon';
    }
    
    const initialMessage: Message = {
      id: '1',
      text: `${greeting}! 👋 Welcome to AppForge.\n\nI'm your virtual assistant here to help with your business automation needs. For the best experience, please select a department below or type your question anytime.`,
      type: 'bot',
      timestamp: new Date()
    };
    
    setMessages([initialMessage]);
  }, []);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Toggle chat open/closed
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  // Toggle minimize/maximize
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Toggle expanded view
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Select department
  const selectDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setShowDepartmentSelector(false);
    
    const dept = departments.find(d => d.id === department);
    if (dept) {
      const message: Message = {
        id: Date.now().toString(),
        text: `You're now connected to our *${dept.name}* department.\n\n${dept.description}.\n\n${dept.responseTime}.`,
        type: 'system',
        timestamp: new Date(),
        department
      };
      
      setMessages(prev => [...prev, message]);
      
      setTimeout(() => {
        const followUpMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: `How can our ${dept.name} team assist you today?`,
          type: 'bot',
          timestamp: new Date(),
          department
        };
        
        setMessages(prev => [...prev, followUpMessage]);
      }, 500);
    }
  };

  // Add a message to the chat
  const addMessage = (text: string, type: MessageType, extra: Partial<Message> = {}) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: new Date(),
      department: selectedDepartment || undefined,
      ...extra
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Handle user sending a message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    addMessage(inputValue, 'user');
    setInputValue('');
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Detect intent and respond after a delay
    const { intent, department } = detectIntent(inputValue);
    
    // Set a timeout to simulate processing
    setTimeout(() => {
      setIsTyping(false);
      
      // If department is detected but not currently selected, suggest switching
      if (selectedDepartment !== department && department !== 'general' && intent === 'unknown') {
        const deptInfo = departments.find(d => d.id === department);
        if (deptInfo) {
          addMessage(`It looks like your question might be best answered by our ${deptInfo.name} team. Would you like me to connect you?`, 'bot', {
            hasAction: true,
            actionLabel: `Connect to ${deptInfo.name}`,
            actionIcon: deptInfo.icon,
            actionUrl: `#connect-${department}`
          });
          return;
        }
      }
      
      // Check if we have a specific response for this intent
      if (intent !== 'unknown' && botResponses[intent]) {
        const response = botResponses[intent];
        
        // Add rich content if available
        if (intent === 'sales-pricing') {
          addMessage(response.text, 'bot', {
            hasAction: response.hasAction,
            actionLabel: response.actionLabel,
            actionUrl: response.actionUrl,
            actionIcon: response.actionIcon,
            richContent: <PricingTable />
          });
        } else {
          addMessage(response.text, 'bot', {
            hasAction: response.hasAction,
            actionLabel: response.actionLabel,
            actionUrl: response.actionUrl,
            actionIcon: response.actionIcon
          });
        }
        
        // Send follow-up questions if available
        if (response.followUp && response.followUp.length > 0) {
          setTimeout(() => {
            addMessage(response.followUp![0], 'bot');
          }, 2000);
        }
      } else {
        // Generic response if no specific intent is matched
        if (!selectedDepartment) {
          addMessage("I'm not sure I understand your question. It might help if you select a specific department that can best assist you. Alternatively, you can try one of our quick actions or rephrase your question.", 'bot');
          setShowDepartmentSelector(true);
        } else {
          const dept = departments.find(d => d.id === selectedDepartment);
          addMessage(`I don't have a specific answer for that query. Our ${dept?.name} team will need more information. Would you like to create a support ticket to get a detailed response from our team?`, 'bot', {
            hasAction: true,
            actionLabel: "Create Support Ticket",
            actionUrl: "/dashboard/tickets/new",
            actionIcon: <FileText className="w-4 h-4" />
          });
        }
      }
    }, 1500);
  };

  // Handle action button clicks
  const handleActionClick = (url: string) => {
    if (url.startsWith('#connect-')) {
      const dept = url.replace('#connect-', '') as Department;
      selectDepartment(dept);
    } else if (url.startsWith('#')) {
      // Handle anchor links
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsOpen(false);
    } else {
      // Handle navigation to other pages
      window.location.href = url;
    }
  };

  // Handle quick action selection
  const handleQuickAction = (action: QuickAction) => {
    setShowQuickActionMenu(false);
    
    // If action has a custom function, execute it
    if (action.action) {
      action.action();
      return;
    }
    
    // Otherwise handle the URL
    if (action.url) {
      addMessage(`I'll help you with: ${action.label}`, 'user');
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        
        if (action.external) {
          addMessage(`I'm opening the ${action.label} page in a new window for you.`, 'bot', {
            hasAction: true,
            actionLabel: action.label,
            actionUrl: action.url,
            actionIcon: action.icon
          });
          window.open(action.url, '_blank');
        } else {
          addMessage(`I'm taking you to the ${action.label} page now.`, 'bot', {
            hasAction: true,
            actionLabel: action.label,
            actionUrl: action.url,
            actionIcon: action.icon
          });
          
          // Wait a moment before navigating
          setTimeout(() => {
            if (action.url?.startsWith('#')) {
              const element = document.querySelector(action.url);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
              setIsOpen(false);
            } else {
              window.location.href = action.url!;
            }
          }, 1000);
        }
      }, 1000);
    }
  };

  // Handle common question selection
  const handleQuestionSelect = (question: Question) => {
    addMessage(question.text, 'user');
    
    // Simulate bot typing
    setIsTyping(true);
    
    // If department is different from selected, change department
    if (selectedDepartment !== question.department) {
      setSelectedDepartment(question.department);
    }
    
    setTimeout(() => {
      setIsTyping(false);
      const response = botResponses[question.id];
      
      if (response) {
        // Add rich content if available
        if (question.id === 'sales-pricing') {
          addMessage(response.text, 'bot', {
            hasAction: response.hasAction,
            actionLabel: response.actionLabel,
            actionUrl: response.actionUrl,
            actionIcon: response.actionIcon,
            richContent: <PricingTable />
          });
        } else {
          addMessage(response.text, 'bot', {
            hasAction: response.hasAction,
            actionLabel: response.actionLabel,
            actionUrl: response.actionUrl,
            actionIcon: response.actionIcon
          });
        }
        
        // Send follow-up questions if available
        if (response.followUp && response.followUp.length > 0) {
          setTimeout(() => {
            addMessage(response.followUp![0], 'bot');
          }, 1500);
        }
      }
    }, 1000 + Math.random() * 1000);
  };

  // Format timestamp for messages
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get department color
  const getDepartmentColor = (dept?: Department) => {
    if (!dept) return 'bg-primary';
    const department = departments.find(d => d.id === dept);
    return department?.color || 'bg-primary';
  };

  // Get width class based on current view
  const getWidthClass = () => {
    if (isExpanded) return 'w-full md:w-3/4 lg:w-2/3 xl:w-1/2';
    return 'w-80 sm:w-96';
  };

  return (
    <>
      {/* Chat button */}
      <button 
        onClick={toggleChat}
        className="fixed right-6 bottom-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-full bg-primary shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 group"
        aria-label="Chat with us"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="text-white font-medium hidden md:inline-block group-hover:underline">Chat with us</span>
      </button>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : isExpanded ? '90vh' : '600px',
              width: isExpanded ? '90vw' : 'auto'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`fixed ${isExpanded ? 'inset-0 m-auto' : 'right-6 bottom-20'} z-50 ${getWidthClass()} bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col`}
          >
            {/* Chat header */}
            <div className={`${getDepartmentColor(selectedDepartment)} text-white p-4 flex justify-between items-center`}>
              <div className="flex items-center">
                {selectedDepartment ? (
                  <div className="flex items-center">
                    {departments.find(d => d.id === selectedDepartment)?.icon || <Bot className="w-6 h-6 mr-2" />}
                    <div>
                      <h3 className="font-bold">{departments.find(d => d.id === selectedDepartment)?.name || 'AppForge Assistant'}</h3>
                      {showDepartmentInfo && (
                        <span className="text-xs opacity-80">{departments.find(d => d.id === selectedDepartment)?.availability}</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Bot className="w-6 h-6 mr-2" />
                    <h3 className="font-bold">AppForge Assistant</h3>
                  </div>
                )}
                <button 
                  onClick={() => setShowDepartmentInfo(!showDepartmentInfo)}
                  className="ml-2 p-1 hover:bg-white/20 rounded transition-colors duration-200"
                >
                  {showDepartmentInfo ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={toggleExpanded} className="p-1 hover:bg-white/20 rounded transition-colors duration-200">
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={toggleMinimize} className="p-1 hover:bg-white/20 rounded transition-colors duration-200">
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button onClick={toggleChat} className="p-1 hover:bg-white/20 rounded transition-colors duration-200">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Chat body - hidden when minimized */}
            {!isMinimized && (
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex flex-1 h-0">
                  {/* Main content area */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Messages area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : message.type === 'system' ? 'justify-center' : 'justify-start'}`}
                        >
                          {message.type === 'system' ? (
                            <div className="bg-gray-100 text-gray-600 text-sm py-2 px-4 rounded-lg max-w-[85%] text-center">
                              <div dangerouslySetInnerHTML={{ __html: message.text.replace(/\*(.*?)\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }} />
                            </div>
                          ) : (
                            <div 
                              className={`rounded-lg p-3 max-w-[85%] relative shadow-sm ${
                                message.type === 'user' 
                                  ? 'bg-primary text-white rounded-br-none ml-4' 
                                  : `${getDepartmentColor(message.department)} bg-opacity-10 text-gray-800 rounded-bl-none mr-4 border-l-4 ${getDepartmentColor(message.department)}`
                              }`}
                            >
                              <div className="flex items-start space-x-2">
                                {message.type === 'bot' && (
                                  <div className={`${getDepartmentColor(message.department)} p-1 rounded-full flex items-center justify-center flex-shrink-0`}>
                                    {message.department && departments.find(d => d.id === message.department)?.icon || <Bot className="w-4 h-4 text-white" />}
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br />') }} />
                                  
                                  {/* Rich content if available */}
                                  {message.richContent && (
                                    <div className="mt-2">
                                      {message.richContent}
                                    </div>
                                  )}
                                  
                                  {/* Action button if available */}
                                  {message.hasAction && message.actionLabel && message.actionUrl && (
                                    <button 
                                      onClick={() => handleActionClick(message.actionUrl!)}
                                      className="mt-2 text-xs font-medium px-3 py-1.5 rounded-md inline-flex items-center space-x-1 transition-colors duration-200"
                                      style={{
                                        backgroundColor: message.type === 'bot' ? '#f8f9fa' : 'rgba(255, 255, 255, 0.2)',
                                        color: message.type === 'bot' ? '#1a202c' : 'white',
                                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                                      }}
                                    >
                                      {message.actionIcon}
                                      <span>{message.actionLabel}</span>
                                    </button>
                                  )}
                                  
                                  <span className="text-xs opacity-70 block text-right mt-1">
                                    {formatTime(message.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* Department selector if shown */}
                      {showDepartmentSelector && (
                        <div className="mb-4">
                          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="text-sm font-bold mb-2 text-gray-700">Please select a department:</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {departments.map((dept) => (
                                <button
                                  key={dept.id}
                                  onClick={() => selectDepartment(dept.id)}
                                  className={`flex items-center space-x-2 p-2 rounded-md text-left text-sm hover:bg-gray-50 transition-colors duration-200 border border-gray-200`}
                                >
                                  <div className={`${dept.color} p-1.5 rounded-full text-white`}>
                                    {dept.icon}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-800">{dept.name}</div>
                                    <div className="text-xs text-gray-500 truncate">{dept.responseTime}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Common questions for selected department */}
                      {selectedDepartment && !showDepartmentSelector && (
                        <div className="mb-4">
                          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                            <h4 className="text-sm font-bold mb-2 text-gray-700">Frequently asked questions:</h4>
                            <div className="flex flex-col gap-1">
                              {commonQuestions
                                .filter(q => q.department === selectedDepartment)
                                .map((question) => (
                                  <button
                                    key={question.id}
                                    onClick={() => handleQuestionSelect(question)}
                                    className="text-left text-sm p-2 rounded-md hover:bg-gray-50 transition-colors duration-200 text-gray-700"
                                  >
                                    {question.text}
                                  </button>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Typing indicator */}
                      {isTyping && (
                        <div className="flex items-center mb-4">
                          <div className={`${getDepartmentColor(selectedDepartment)} bg-opacity-10 rounded-lg py-2 px-4 text-gray-500 max-w-[85%] border-l-4 ${getDepartmentColor(selectedDepartment)}`}>
                            <div className="flex space-x-1 items-center">
                              <div className={`${getDepartmentColor(selectedDepartment)} p-1 rounded-full flex items-center justify-center`}>
                                {selectedDepartment && departments.find(d => d.id === selectedDepartment)?.icon || <Bot className="w-4 h-4 text-white" />}
                              </div>
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Scroll anchor */}
                      <div ref={messagesEndRef} />
                    </div>
                    
                    {/* Feedback buttons - shown after a few bot messages */}
                    {messages.filter(m => m.type === 'bot').length >= 2 && (
                      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex justify-center space-x-4">
                        <button className="text-xs text-gray-500 flex items-center hover:text-gray-700 transition-colors duration-200">
                          <ThumbsUp className="w-3 h-3 mr-1" /> Helpful
                        </button>
                        <button className="text-xs text-gray-500 flex items-center hover:text-gray-700 transition-colors duration-200">
                          <ThumbsDown className="w-3 h-3 mr-1" /> Not helpful
                        </button>
                      </div>
                    )}
                    
                    {/* Action toolbar */}
                    <div className="px-4 py-2 bg-gray-100 border-t border-gray-200 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowDepartmentSelector(!showDepartmentSelector)}
                          className="text-gray-600 hover:text-primary p-1.5 rounded-full hover:bg-gray-200 transition-colors duration-200"
                          title="Change department"
                        >
                          <RefreshCcw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowQuickActionMenu(!showQuickActionMenu)}
                          className="text-gray-600 hover:text-primary p-1.5 rounded-full hover:bg-gray-200 transition-colors duration-200"
                          title="Quick actions"
                        >
                          <Bell className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-primary p-1.5 rounded-full hover:bg-gray-200 transition-colors duration-200"
                          title="Save conversation"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Quick actions menu */}
                      {showQuickActionMenu && (
                        <div className="absolute bottom-16 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
                          <h4 className="text-xs font-bold mb-2 text-gray-700 px-2">Quick Actions</h4>
                          <div className="grid grid-cols-1 gap-1">
                            {quickActions.map((action) => (
                              <button
                                key={action.id}
                                onClick={() => handleQuickAction(action)}
                                className="flex items-center space-x-2 p-2 text-sm hover:bg-gray-50 rounded-md transition-colors duration-200 text-gray-700 text-left"
                              >
                                <div className="text-primary">{action.icon}</div>
                                <span>{action.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                        Online now
                      </div>
                    </div>
                    
                    {/* Input area */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendMessage();
                        }}
                        className="flex items-center"
                      >
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder={`Type your message${selectedDepartment ? ` to ${departments.find(d => d.id === selectedDepartment)?.name}` : ''}...`}
                          className="flex-1 border border-gray-300 rounded-l-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                        />
                        <button
                          type="submit"
                          className={`${getDepartmentColor(selectedDepartment)} text-white p-3 rounded-r-lg hover:opacity-90 transition-colors duration-200`}
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  </div>
                  
                  {/* Side panel - only visible when expanded */}
                  {isExpanded && (
                    <div className="w-72 border-l border-gray-200 bg-white hidden md:block overflow-y-auto">
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 mb-4">Help Center</h3>
                        
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Departments</h4>
                          <div className="space-y-2">
                            {departments.map((dept) => (
                              <button
                                key={dept.id}
                                onClick={() => selectDepartment(dept.id)}
                                className={`flex items-center space-x-2 p-2 rounded-md text-left text-sm hover:bg-gray-50 transition-colors duration-200 border w-full ${
                                  selectedDepartment === dept.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                                }`}
                              >
                                <div className={`${dept.color} p-1 rounded-full text-white`}>
                                  {dept.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">{dept.name}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Resources</h4>
                          <div className="space-y-1">
                            {quickActions.map((action) => (
                              <button
                                key={action.id}
                                onClick={() => handleQuickAction(action)}
                                className="flex items-center space-x-2 p-2 text-sm hover:bg-gray-50 rounded-md transition-colors duration-200 text-gray-700 text-left w-full"
                              >
                                <div className="text-primary">{action.icon}</div>
                                <span>{action.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Business Hours</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex justify-between">
                              <span>Monday-Friday:</span>
                              <span>9AM-6PM</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Saturday:</span>
                              <span>10AM-2PM</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Sunday:</span>
                              <span>Closed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}