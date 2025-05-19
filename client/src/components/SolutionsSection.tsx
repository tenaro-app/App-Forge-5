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
    <section id="solutions" className="py-24 bg-white relative">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-light-500 to-white"></div>
      
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          variants={fadeIn("up", "tween", 0.1, 1)}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest font-heading">Redefining Possibilities</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-heading font-extrabold text-secondary">
            Revolutionary Digital <span className="text-primary">Solutions</span> for Your Business
          </h2>
          <p className="mt-6 text-xl text-gray-600">
            Our custom applications eliminate repetitive tasks and streamline complex processes, 
            giving your team more time to focus on what truly matters.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {solutionsData.map((solution, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all p-8 border border-gray-100 group hover:-translate-y-2 duration-300"
              variants={fadeIn("up", "spring", index * 0.1 + 0.2, 0.75)}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <IconRenderer icon={solution.icon} className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-4 group-hover:text-primary transition-colors whitespace-nowrap overflow-hidden text-ellipsis">{solution.title}</h3>
              <p className="text-gray-600 mb-6 text-lg h-[4.5rem] line-clamp-3">{solution.description}</p>
              <ul className="space-y-3 mb-8">
                {solution.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <div className="bg-primary/10 rounded-full p-1 mr-3 flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact" className="text-primary font-semibold flex items-center text-lg group-hover:font-bold transition-all">
                Explore Solution <ArrowRight className="h-5 w-5 ml-2 group-hover:ml-3 transition-all" />
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-light-500 to-white"></div>
    </section>
  );
}
