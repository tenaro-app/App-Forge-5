import type { LucideIcon } from "lucide-react";
import { 
  Repeat, Database, Users, Clipboard, Calendar, FileText,
  Briefcase, ShoppingBag, Home, Activity, Truck, BookOpen,
  Check, ArrowRight 
} from "lucide-react";

export const statsData = [
  { value: "98%", label: "Client Satisfaction" },
  { value: "200+", label: "Apps Delivered" },
  { value: "30K+", label: "Hours Saved Monthly" },
  { value: "$2.5M", label: "Client Savings Annually" }
];

type SolutionType = {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
};

export const solutionsData: SolutionType[] = [
  {
    title: "Process Automation",
    description: "Automate repetitive workflows from data entry to report generation, reducing manual effort and errors.",
    icon: Repeat,
    features: [
      "Form-based data collection",
      "Workflow approval systems",
      "Automated reporting"
    ]
  },
  {
    title: "Data Management",
    description: "Centralize your data storage and access with custom databases and user-friendly interfaces.",
    icon: Database,
    features: [
      "Custom databases",
      "Advanced search capabilities",
      "Data visualization dashboards"
    ]
  },
  {
    title: "Customer Management",
    description: "Build stronger customer relationships with custom CRM solutions tailored to your specific needs.",
    icon: Users,
    features: [
      "Client portals",
      "Interaction tracking",
      "Automated communications"
    ]
  },
  {
    title: "Inventory Management",
    description: "Track inventory levels, manage suppliers, and automate reorder processes with custom inventory apps.",
    icon: Clipboard,
    features: [
      "Real-time stock tracking",
      "Automated purchase orders",
      "Barcode/QR code integration"
    ]
  },
  {
    title: "Scheduling & Booking",
    description: "Streamline appointment booking, staff scheduling, and resource allocation with automated systems.",
    icon: Calendar,
    features: [
      "Online booking portals",
      "Staff availability management",
      "Automated reminders"
    ]
  },
  {
    title: "Document Management",
    description: "Organize, store, and control document versions with intelligent document management systems.",
    icon: FileText,
    features: [
      "Version control",
      "Automated document generation",
      "Digital signature integration"
    ]
  }
];

type IndustryType = {
  name: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
};

export const industriesData: IndustryType[] = [
  {
    name: "Professional Services",
    description: "Client management, billing automation, and project tracking for law firms, accounting practices, and consultancies.",
    icon: Briefcase,
    tags: ["Time Tracking", "Billing", "Document Management"]
  },
  {
    name: "Retail & E-commerce",
    description: "Inventory management, order processing, and customer loyalty programs for retail businesses of all sizes.",
    icon: ShoppingBag,
    tags: ["Inventory", "Order Processing", "Customer Management"]
  },
  {
    name: "Real Estate",
    description: "Property management, tenant applications, lease tracking, and maintenance request systems.",
    icon: Home,
    tags: ["Property Management", "Tenant Portals", "Maintenance Requests"]
  },
  {
    name: "Healthcare",
    description: "Patient scheduling, medical records management, and billing systems for clinics and healthcare providers.",
    icon: Activity,
    tags: ["Appointment Scheduling", "Patient Records", "HIPAA Compliant"]
  },
  {
    name: "Manufacturing & Logistics",
    description: "Supply chain management, production scheduling, quality control, and distribution tracking.",
    icon: Truck,
    tags: ["Inventory Control", "Order Fulfillment", "Quality Assurance"]
  },
  {
    name: "Education",
    description: "Student information systems, course management, assignment tracking, and learning platforms.",
    icon: BookOpen,
    tags: ["Student Management", "Course Scheduling", "Assessment Tools"]
  }
];

type CaseStudyType = {
  company: string;
  category: string;
  roi: string;
  description: string;
  metricIcon: string;
  metric: string;
  imageUrl: string;
  imageAlt: string;
};

export const caseStudiesData: CaseStudyType[] = [
  {
    company: "Smith & Partners Law Firm",
    category: "Professional Services",
    roi: "350%",
    description: "Automated client intake and document management system reduced administrative time by 68% and saved $157,000 annually.",
    metricIcon: "clock",
    metric: "Time Saved: 120 hrs/month",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&h=720&q=80",
    imageAlt: "Business professionals in a meeting"
  },
  {
    company: "Metro Furnishings",
    category: "Retail",
    roi: "280%",
    description: "Custom inventory and order management system reduced stockouts by 92% and increased sales by 34% in the first quarter.",
    metricIcon: "trending-up",
    metric: "Revenue Increase: $235K",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&h=720&q=80",
    imageAlt: "Retail store interior with staff working"
  }
];

export const processStepsData = [
  {
    title: "Discovery & Requirements",
    description: "We work closely with you to understand your business processes, pain points, and objectives to define clear requirements.",
    features: [
      "Process mapping and workflow analysis",
      "ROI and cost-saving calculations",
      "Detailed project scoping document"
    ]
  },
  {
    title: "Design & Prototyping",
    description: "We create intuitive interface designs and interactive prototypes to visualize your application before development.",
    features: [
      "User experience (UX) design",
      "Interactive prototypes for testing",
      "Design review and feedback cycles"
    ]
  },
  {
    title: "Development & Testing",
    description: "Our developers bring your application to life, with rigorous testing to ensure quality and reliability.",
    features: [
      "Agile development methodology",
      "Regular progress demonstrations",
      "Comprehensive testing and QA"
    ]
  },
  {
    title: "Deployment & Support",
    description: "We handle the deployment process and provide ongoing support to ensure your application continues to deliver value.",
    features: [
      "Smooth deployment and data migration",
      "User training and documentation",
      "Ongoing support and maintenance plans"
    ]
  }
];

export const pricingPlansData = [
  {
    name: "Standard Plan",
    description: "Perfect for small businesses with straightforward automation needs.",
    price: "$2,999",
    annualPrice: "$2,399",
    tag: "MOST POPULAR",
    highlighted: false,
    custom: false,
    features: [
      { text: "1 custom application", included: true },
      { text: "Up to 5 automation workflows", included: true },
      { text: "Basic reporting and analytics", included: true },
      { text: "Email support", included: true },
      { text: "30-day post-launch support", included: true },
      { text: "Custom integrations", included: false },
      { text: "Advanced security features", included: false }
    ]
  },
  {
    name: "Professional Plan",
    description: "Ideal for growing businesses with more complex automation requirements.",
    price: "$4,999",
    annualPrice: "$3,999",
    tag: "RECOMMENDED",
    highlighted: true,
    custom: false,
    features: [
      { text: "1 custom application", included: true },
      { text: "Up to 15 automation workflows", included: true },
      { text: "Advanced reporting and analytics", included: true },
      { text: "Priority email & phone support", included: true },
      { text: "90-day post-launch support", included: true },
      { text: "Up to 3 third-party integrations", included: true },
      { text: "Advanced security features", included: false }
    ]
  },
  {
    name: "Enterprise",
    description: "Custom solutions for larger organizations with complex automation needs.",
    custom: true,
    features: [
      { text: "Multiple custom applications", included: true },
      { text: "Unlimited automation workflows", included: true },
      { text: "Custom reporting and dashboards", included: true },
      { text: "Dedicated support manager", included: true },
      { text: "12-month post-launch support", included: true },
      { text: "Unlimited integrations", included: true },
      { text: "Advanced security features", included: true }
    ]
  }
];

export const testimonialsData = [
  {
    quote: "The custom CRM AppForge built for us has completely transformed how we manage client relationships. We're saving at least 20 hours per week on administrative tasks.",
    name: "Jennifer Smith",
    title: "Marketing Director",
    company: "Elevate Marketing",
    initials: "JS"
  },
  {
    quote: "Our inventory management was a nightmare before AppForge. Their custom solution has eliminated stockouts, reduced waste, and increased our profit margins by 15%.",
    name: "Robert Johnson",
    title: "Operations Manager",
    company: "Quantum Retail",
    initials: "RJ"
  },
  {
    quote: "As a healthcare provider, we needed a scheduling system that respected patient privacy while improving efficiency. AppForge delivered exactly what we needed. Appointment no-shows down 67%!",
    name: "Dr. Michelle Patel",
    title: "Director",
    company: "Wellness Medical Center",
    initials: "MP"
  }
];

export const teamMembersData = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    bio: "15+ years in software development and business process optimization.",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    socialLinks: [
      { type: "linkedin", url: "#" },
      { type: "twitter", url: "#" }
    ]
  },
  {
    name: "David Chen",
    role: "Chief Technology Officer",
    bio: "Former tech lead at major tech companies with expertise in cloud architecture.",
    photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    socialLinks: [
      { type: "linkedin", url: "#" },
      { type: "github", url: "#" }
    ]
  },
  {
    name: "Maria Rodriguez",
    role: "Lead UX Designer",
    bio: "Crafting intuitive user experiences that balance aesthetics and functionality.",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    socialLinks: [
      { type: "linkedin", url: "#" },
      { type: "dribbble", url: "#" }
    ]
  },
  {
    name: "Michael Taylor",
    role: "Business Solutions Architect",
    bio: "Translating business requirements into technical specifications and architecture.",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    socialLinks: [
      { type: "linkedin", url: "#" },
      { type: "twitter", url: "#" }
    ]
  }
];

export const faqsData = [
  {
    question: "How long does it typically take to develop a custom app?",
    answer: "Development timelines vary based on the complexity of your application. Simple automation apps can be completed in 4-6 weeks, while more complex solutions may take 2-3 months. During our initial consultation, we'll provide a detailed timeline based on your specific requirements."
  },
  {
    question: "Do you provide ongoing support after the app is launched?",
    answer: "Yes, all our plans include post-launch support ranging from 30 days to 12 months depending on the package. We also offer ongoing maintenance plans to ensure your application continues to run smoothly and stays up-to-date with any necessary updates or enhancements."
  },
  {
    question: "Can you integrate with our existing systems and software?",
    answer: "Absolutely. We specialize in creating applications that integrate seamlessly with your existing tools and systems. Whether you're using popular CRMs, ERPs, accounting software, or custom systems, we can build integrations that allow for smooth data flow between platforms."
  },
  {
    question: "How do you ensure the security of our business data?",
    answer: "Security is a top priority for us. We implement industry-standard security measures including data encryption, secure authentication methods, regular security audits, and role-based access controls. Our enterprise solutions also include advanced security features such as IP restrictions, two-factor authentication, and comprehensive audit logging."
  },
  {
    question: "Do we own the source code of our custom application?",
    answer: "Yes, once the project is completed and all payments are made, you own the intellectual property rights to your custom application, including the source code. This gives you complete control over your application's future and allows for further development by any developer if needed."
  }
];
