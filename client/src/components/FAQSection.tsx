import { useState } from "react";
import { ChevronDown, HelpCircle, CheckCircle, DollarSign, Clock, Rocket, Shield, BarChart, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default

  const customFaqsData = [
    {
      question: "What makes your business automation solutions different?",
      answer: "Our applications are custom-built specifically for your business needs, not generic templates. We use Replit's powerful technology to create solutions that eliminate repetitive tasks, scale with your growth, and include lifetime free hosting.",
      icon: <Rocket className="w-5 h-5 text-primary" />
    },
    {
      question: "How long does it take to develop a custom application?",
      answer: "Most custom solutions are delivered within 4-8 weeks, depending on complexity. Our rapid development approach means you'll see working prototypes within days, not months, allowing for quick feedback and iterations.",
      icon: <Clock className="w-5 h-5 text-primary" />
    },
    {
      question: "Do you offer any kind of free support after delivery?",
      answer: "Absolutely! All our plans include 1 YEAR of free technical development - meaning we'll continue to add features and improvements to your application for a full year after launch at no additional cost. We also provide lifetime free hosting on Replit's infrastructure.",
      icon: <CheckCircle className="w-5 h-5 text-primary" />
    },
    {
      question: "How much can I expect to save with your automation solutions?",
      answer: "Our clients typically see ROI between 200-350% within the first year. For a medium-sized business, this translates to approximately $150,000-$250,000 in annual savings through reduced labor costs, eliminated errors, and improved operational efficiency.",
      icon: <DollarSign className="w-5 h-5 text-primary" />
    },
    {
      question: "Can you integrate with our existing systems and software?",
      answer: "Yes! We specialize in creating seamless integrations with your existing tech stack. Whether it's your CRM, accounting software, inventory management system, or other business tools, we'll ensure your new application works harmoniously with them.",
      icon: <Zap className="w-5 h-5 text-primary" />
    },
    {
      question: "Is my business data secure with your applications?",
      answer: "Security is our top priority. We implement industry-standard encryption, secure authentication systems, and regular security audits. Our applications are built with data protection by design, ensuring your business information remains private and protected.",
      icon: <Shield className="w-5 h-5 text-primary" />
    },
    {
      question: "Do I own the source code of my application?",
      answer: "Yes, you receive full ownership of your application's source code. This gives you the freedom to modify or extend the application in the future, either through our services or with your own development team.",
      icon: <CheckCircle className="w-5 h-5 text-primary" />
    },
    {
      question: "How do you measure the success of the automation solution?",
      answer: "We establish clear KPIs and success metrics at the start of each project, tailored to your business goals. Our applications include built-in analytics dashboards that track time saved, error reduction, efficiency improvements, and other relevant metrics specific to your operations.",
      icon: <BarChart className="w-5 h-5 text-primary" />
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prevOpenItems => 
      prevOpenItems.includes(index)
        ? prevOpenItems.filter(item => item !== index)
        : [...prevOpenItems, index]
    );
  };

  return (
    <section id="faq" className="py-24 bg-white relative">
      <div className="absolute left-0 right-0 h-32 bg-light-500" style={{ top: -32, zIndex: -1 }}></div>
      
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          variants={fadeIn("up", "tween", 0.1, 1)}
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-1 w-10 bg-primary mr-3"></div>
            <span className="text-sm font-bold text-primary uppercase tracking-widest font-heading">FAQ</span>
            <div className="h-1 w-10 bg-primary ml-3"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-secondary">
            Questions You May <span className="text-primary">Ask</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600">
            Get answers to common questions about our services, process, and how we can 
            transform your business operations with custom automation.
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-4xl mx-auto space-y-6"
          variants={fadeIn("up", "tween", 0.2, 1)}
        >
          {customFaqsData.map((faq, index) => (
            <div 
              key={index} 
              className={`border-2 rounded-xl px-8 py-6 shadow-lg transition-all duration-300 ${
                openItems.includes(index) 
                  ? 'border-gray-300 bg-gray-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <button 
                onClick={() => toggleItem(index)}
                className="flex justify-between items-center w-full text-left cursor-pointer focus:outline-none group"
                aria-expanded={openItems.includes(index)}
              >
                <div className="flex items-center">
                  <div className="mr-4 flex-shrink-0">
                    {faq.icon}
                  </div>
                  <span className="text-xl font-bold text-secondary group-hover:text-primary transition-colors">
                    {faq.question}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown className="h-6 w-6 text-primary" />
                </motion.div>
              </button>
              
              {openItems.includes(index) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pl-12"
                >
                  <p className="text-gray-700 mt-4 text-lg leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center bg-black p-10 rounded-2xl shadow-lg"
          variants={fadeIn("up", "tween", 0.3, 1)}
        >
          <div className="inline-flex items-center justify-center mb-6">
            <HelpCircle className="w-8 h-8 text-white mr-3" />
            <h3 className="text-2xl font-bold text-white">Still Have Questions?</h3>
          </div>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
            Our team is ready to provide detailed answers to your specific business needs. 
            Schedule a free consultation and discover how our solutions can transform your operations.
          </p>
          <a 
            href="#contact" 
            className="px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-white/20 transform hover:-translate-y-1 inline-block"
          >
            Book Free Consultation
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
