import { CheckCircle, ArrowRight, Zap, FileSearch, Code, Database, Smartphone, CheckCheck, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";

export default function ProcessSection() {
  const processStepsData = [
    {
      title: "Discovery & Strategy",
      description: "We analyze your business processes to identify repetitive tasks and workflows that can be automated for maximum efficiency.",
      icon: <FileSearch className="w-8 h-8" />,
      features: [
        "Business process analysis",
        "Automation opportunity identification",
        "ROI calculation & planning",
        "Technology stack recommendation"
      ],
      color: "from-rose-600 to-primary"
    },
    {
      title: "Design & Architecture",
      description: "Our experts design an intuitive user experience and robust technical architecture tailored to your specific business needs.",
      icon: <Smartphone className="w-8 h-8" />,
      features: [
        "User experience design",
        "Workflow mapping",
        "Database schema design",
        "API integration planning"
      ],
      color: "from-orange-600 to-red-600"
    },
    {
      title: "Development & Testing",
      description: "We rapidly build your custom solution using Replit's powerful development environment, with continuous testing throughout.",
      icon: <Code className="w-8 h-8" />,
      features: [
        "Agile development methodology",
        "Regular progress updates",
        "Comprehensive testing",
        "Quality assurance"
      ],
      color: "from-yellow-600 to-orange-600"
    },
    {
      title: "Deployment & Integration",
      description: "Your application is deployed with zero downtime and seamlessly integrated with your existing systems and data sources.",
      icon: <Database className="w-8 h-8" />,
      features: [
        "Zero-downtime deployment",
        "Data migration assistance",
        "Third-party integrations",
        "Team training & onboarding"
      ],
      color: "from-primary to-purple-600"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-secondary-500 to-secondary text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
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
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-1 w-10 bg-primary mr-3"></div>
            <span className="text-sm font-bold text-primary uppercase tracking-widest font-heading">Our Process</span>
            <div className="h-1 w-10 bg-primary ml-3"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white">
            How We <span className="text-primary">Transform</span> Your Business
          </h2>
          <p className="mt-6 text-xl text-gray-300">
            Our proven 4-step process delivers custom automation solutions that eliminate repetitive tasks and save your team thousands of hours.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {processStepsData.map((step, index) => (
            <motion.div 
              key={index}
              className="relative"
              variants={fadeIn("up", "spring", index * 0.1 + 0.2, 0.75)}
            >
              {/* Step Number */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/20 z-10">
                <span className="text-white font-extrabold text-xl">{index + 1}</span>
              </div>
              
              {/* Step Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 p-6 pt-8 h-full group hover:-translate-y-2 transition-all duration-300 shadow-2xl">
                {/* Header */}
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${step.color} mr-4`}>
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                </div>
                
                {/* Description */}
                <p className="text-gray-300 mb-6">
                  {step.description}
                </p>
                
                {/* Features */}
                <ul className="space-y-3">
                  {step.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="bg-primary/20 rounded-full p-1 mr-3 flex-shrink-0">
                        <CheckCheck className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-gray-200">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Arrow to next step */}
                {index < processStepsData.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="bg-primary rounded-full p-2 shadow-lg">
                      <ArrowRight className="h-6 w-6 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-20 text-center"
          variants={fadeIn("up", "tween", 0.6, 1)}
        >
          <a 
            href="#contact" 
            className="inline-flex items-center space-x-2 px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-primary/90 transition-all transform hover:-translate-y-1 group"
          >
            <Rocket className="h-6 w-6 mr-2" />
            <span>Start Your Transformation Today</span>
            <ArrowRight className="h-5 w-5 ml-2 group-hover:ml-3 transition-all" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
