import { CheckCircle, ArrowRight, Zap, Code, Database, Smartphone, CheckCheck, Rocket, Search, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";
import { processStepsData } from "@/lib/data";

export default function ProcessSection() {
  return (
    <section id="process" className="py-24 bg-black text-white">
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
          <span className="text-sm font-bold text-primary uppercase tracking-wide">Our Process</span>
          <h2 className="mt-2 text-4xl md:text-5xl font-heading font-bold">
            How We Build Your <span className="text-primary">Custom App</span>
          </h2>
          <p className="mt-6 text-lg text-gray-300">
            Our streamlined development process ensures we deliver high-quality, tailored solutions that meet your business needs and drive growth.
          </p>
        </motion.div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-primary/30 transform -translate-x-1/2"></div>
          
          <div className="space-y-16 md:space-y-24 relative">
            {processStepsData.map((step, index) => (
              <motion.div 
                key={index}
                className="md:flex items-center"
                variants={fadeIn("up", "spring", index * 0.2 + 0.2, 0.75)}
              >
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left md:order-1'} mb-10 md:mb-0`}>
                  <div className="bg-primary inline-block px-3 py-1 rounded-full mb-4">
                    <span className="text-white font-semibold text-sm">{`STEP ${index + 1}`}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold font-heading mb-4">{step.title}</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {step.description}
                  </p>
                  
                  <div className="mt-8 flex flex-col space-y-3">
                    {step.features.map((feature, featureIndex) => (
                      <div 
                        key={featureIndex} 
                        className={`flex items-center ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}
                      >
                        <CheckCircle className={`h-5 w-5 text-primary ${index % 2 === 0 ? 'md:order-1 md:ml-3' : 'mr-3'}`} />
                        <span className="text-white font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center z-20">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-xl shadow-primary/20 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">{index + 1}</span>
                  </div>
                </div>
                
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-16' : 'md:pr-16 md:order-0'} md:hidden lg:block`}>
                  <div className="bg-gradient-to-br from-black to-secondary-500 rounded-xl border border-primary/20 shadow-2xl overflow-hidden">
                    <div className="p-1">
                      <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
                        <div className="mb-6 flex items-center">
                          {index === 0 && <FileText className="h-8 w-8 text-primary mr-3" />}
                          {index === 1 && <Smartphone className="h-8 w-8 text-primary mr-3" />}
                          {index === 2 && <Code className="h-8 w-8 text-primary mr-3" />}
                          {index === 3 && <Database className="h-8 w-8 text-primary mr-3" />}
                          <h4 className="text-xl font-bold">{`Phase ${index + 1}`}</h4>
                        </div>
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          {step.description}
                        </p>
                        <div className="flex justify-end">
                          <div className="inline-flex items-center space-x-1 text-primary font-medium text-sm">
                            <span>Learn more</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div 
          className="mt-20 text-center"
          variants={fadeIn("up", "tween", 0.6, 1)}
        >
          <a 
            href="#contact" 
            className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-primary/20 hover:bg-primary/90 transition-colors"
          >
            <Rocket className="h-6 w-6 mr-2" />
            <span>Start Your Digital Transformation</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
