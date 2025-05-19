import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";
import { processStepsData } from "@/lib/data";

export default function ProcessSection() {
  return (
    <section className="py-20 bg-dark-500 text-white">
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
          <span className="text-sm font-semibold text-primary-300 uppercase tracking-wider">Our Process</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold text-white">How We Build Your Custom App</h2>
          <p className="mt-4 text-lg text-gray-300">
            Our streamlined development process ensures we deliver high-quality, tailored solutions that meet your business needs.
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-primary/30 transform -translate-x-1/2"></div>
          
          <div className="space-y-12 relative">
            {processStepsData.map((step, index) => (
              <motion.div 
                key={index}
                className="md:flex items-center"
                variants={fadeIn("up", "spring", index * 0.2 + 0.2, 0.75)}
              >
                <div className={`md:w-1/2 md:${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left order-1'} mb-6 md:mb-0 ${index % 2 !== 0 ? 'order-1' : ''}`}>
                  <span className="text-primary-300 font-semibold text-sm">{`STEP ${String(index + 1).padStart(2, '0')}`}</span>
                  <h3 className="text-xl font-semibold font-heading mb-2">{step.title}</h3>
                  <p className="text-gray-300">
                    {step.description}
                  </p>
                </div>
                
                <div className="hidden md:flex absolute left-1/2 w-12 h-12 rounded-full bg-primary transform -translate-x-1/2 items-center justify-center shadow-lg">
                  <span className="font-bold">{index + 1}</span>
                </div>
                
                <div className={`md:w-1/2 md:${index % 2 === 0 ? 'pl-12' : 'pr-12 order-2'} ${index % 2 !== 0 ? 'order-2' : ''}`}>
                  <div className="p-4 rounded-lg bg-dark-600/50">
                    <ul className="space-y-2">
                      {step.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-primary-300 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
