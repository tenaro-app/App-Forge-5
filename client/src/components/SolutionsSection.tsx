import { Check, ArrowRight, Code, Database, Workflow, LineChart, Layers, Clock, Zap, Lock, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";
import IconRenderer from "./IconRenderer";

export default function SolutionsSection() {
  const solutionsData = [
    {
      icon: Code,
      title: "Custom Web Applications",
      description: "Bespoke web solutions engineered to solve your specific business challenges. Eliminates repetitive tasks and streamlines operations for maximum efficiency.",
      features: [
        "Fully custom UI/UX design",
        "Responsive across all devices",
        "Modern framework architecture"
      ]
    },
    {
      icon: Database,
      title: "Data Management Systems",
      description: "Powerful database solutions that organize, store, and analyze your critical business information. Turns raw data into actionable insights for better decision making.",
      features: [
        "Advanced search capabilities",
        "Real-time data synchronization",
        "Secure data storage & backup"
      ]
    },
    {
      icon: Workflow,
      title: "Workflow Automation",
      description: "End-to-end automation of your most complex business processes. Eliminates manual intervention, reduces errors, and increases your team's productivity by up to 40%.",
      features: [
        "Custom approval workflows",
        "Automated notifications",
        "Integration with existing tools"
      ]
    },
    {
      icon: LineChart,
      title: "Business Intelligence Dashboards",
      description: "Visual data analysis tools that transform your raw data into actionable business insights. Helps identify trends, opportunities, and potential issues before they impact growth.",
      features: [
        "Interactive data visualization",
        "Custom reporting tools",
        "KPI tracking & alerts"
      ]
    },
    {
      icon: Layers,
      title: "API Development & Integration",
      description: "Seamless connections between your systems and third-party services for unified operations. Eliminates data silos and creates a cohesive technology ecosystem for your business.",
      features: [
        "RESTful & GraphQL APIs",
        "Third-party API integration",
        "Secure authentication systems"
      ]
    },
    {
      icon: Clock,
      title: "Scheduling & Resource Management",
      description: "Smart systems that optimize time, resources, and scheduling for maximum efficiency. Reduces downtime, prevents double-booking, and ensures optimal resource allocation.",
      features: [
        "Drag-and-drop scheduling",
        "Resource conflict detection",
        "Automated reminders"
      ]
    },
    {
      icon: Zap,
      title: "E-commerce Solutions",
      description: "Full-featured online stores and marketplaces built for conversions and customer satisfaction. Includes inventory management, secure payments, and automated order fulfillment.",
      features: [
        "Inventory management",
        "Secure payment processing",
        "Order fulfillment automation"
      ]
    },
    {
      icon: Lock,
      title: "User Authentication Systems",
      description: "Enterprise-grade security solutions for managing user access and protecting sensitive data. Implements multi-factor authentication, role-based access, and single sign-on capabilities.",
      features: [
        "Multi-factor authentication",
        "Role-based access control",
        "Single sign-on integration"
      ]
    },
    {
      icon: Globe,
      title: "Content Management Systems",
      description: "Custom CMS solutions that make content creation, management, and publishing effortless. Includes intuitive editors, media libraries, and scheduled publishing functionality.",
      features: [
        "Intuitive content editor",
        "Digital asset management",
        "Scheduled publishing"
      ]
    }
  ];

  return (
    <section id="solutions" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          variants={fadeIn("up", "tween", 0.1, 1)}
        >
          <div className="inline-flex items-center justify-center mb-3">
            <div className="h-1 w-8 bg-primary mr-3"></div>
            <span className="text-sm font-bold text-primary uppercase tracking-widest">Redefining Possibilities</span>
            <div className="h-1 w-8 bg-primary ml-3"></div>
          </div>
          <h2 className="mt-4 text-4xl md:text-5xl font-heading font-extrabold text-secondary">
            Revolutionary Digital <span className="text-primary">Solutions</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Our custom applications eliminate repetitive tasks and streamline complex processes, 
            giving your team more time to focus on what truly matters.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {solutionsData.map((solution, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all p-5 md:p-8 border border-gray-100 group hover:-translate-y-2 duration-300 h-full flex flex-col"
              variants={fadeIn("up", "spring", index * 0.05 + 0.1, 0.5)}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary/90 to-primary/70 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-all duration-300">
                <IconRenderer icon={solution.icon} className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold font-heading mb-3 text-gray-800 group-hover:text-primary transition-colors duration-300">{solution.title}</h3>
              <div className="w-12 h-1 bg-primary/30 mb-4 group-hover:w-20 transition-all duration-500 ease-in-out"></div>
              <p className="text-gray-600 mb-6 text-lg group-hover:text-gray-800 transition-colors duration-300 line-clamp-none md:line-clamp-3">{solution.description}</p>
              
              <ul className="space-y-3 mb-8 flex-grow">
                {solution.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start transform transition-transform duration-300 hover:translate-x-1 cursor-pointer">
                    <div className="bg-primary/10 rounded-full p-1 mr-3 flex-shrink-0 mt-0.5 transition-all duration-300 group-hover:bg-primary/20 hover:bg-primary/30 hover:scale-110">
                      <Check className="h-4 w-4 text-primary transition-transform duration-300 hover:scale-110" />
                    </div>
                    <span className="text-gray-700 transition-colors duration-300 hover:text-primary">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <a href="#contact" className="text-primary font-semibold flex items-center text-lg transition-all mt-auto group-hover:font-bold relative overflow-hidden">
                <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full">
                  Explore Solution
                </span>
                <svg className="w-5 h-5 ml-2 group-hover:ml-3 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </a>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          variants={fadeIn("up", "tween", 0.5, 1)}
        >
          <a 
            href="#contact" 
            className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg"
          >
            <span>Find Your Perfect Solution</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
