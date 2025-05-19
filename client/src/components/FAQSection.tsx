import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";
import { faqsData } from "@/lib/data";

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prevOpenItems => 
      prevOpenItems.includes(index)
        ? prevOpenItems.filter(item => item !== index)
        : [...prevOpenItems, index]
    );
  };

  return (
    <section className="py-20 bg-light-500">
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
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">FAQ</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold text-dark-600">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-gray-600">
            Find answers to common questions about our custom application development services.
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-3xl mx-auto divide-y divide-gray-200"
          variants={fadeIn("up", "tween", 0.2, 1)}
        >
          {faqsData.map((faq, index) => (
            <div key={index} className="py-5">
              <button 
                onClick={() => toggleItem(index)}
                className="flex justify-between items-center w-full text-left font-medium cursor-pointer focus:outline-none"
                aria-expanded={openItems.includes(index)}
              >
                <span className="text-lg font-semibold">{faq.question}</span>
                <motion.span
                  animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-5 w-5 text-primary" />
                </motion.span>
              </button>
              
              {openItems.includes(index) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-600 mt-3">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          variants={fadeIn("up", "tween", 0.3, 1)}
        >
          <p className="text-gray-600 mb-4">Still have questions? We're here to help!</p>
          <a href="#contact" className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors inline-block">
            Contact Us
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
