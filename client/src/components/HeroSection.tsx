import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";
import { Zap, Code, Rocket } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-36">
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-primary/10"></div>
      </div>
      
      <motion.div 
        className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="max-w-3xl">
          <motion.div
            className="flex items-center space-x-2 mb-6"
            variants={fadeIn("up", "tween", 0.05, 1)}
          >
            <div className="h-1 w-10 bg-primary"></div>
            <span className="text-primary font-medium uppercase tracking-widest text-sm">AppForge Studio</span>
          </motion.div>
          
          <motion.h1 
            className="font-heading font-extrabold text-5xl md:text-6xl lg:text-7xl text-gray-900 leading-tight"
            variants={fadeIn("up", "tween", 0.1, 1)}
          >
            Business-<span className="text-primary">Transforming</span> Apps for the Digital Age
          </motion.h1>
          
          <motion.p 
            className="mt-8 text-xl text-gray-600 max-w-2xl"
            variants={fadeIn("up", "tween", 0.2, 1)}
          >
            We forge custom digital solutions that eliminate repetitive tasks, streamline operations, and save your business up to $250,000 annually.
          </motion.p>
          
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
            variants={fadeIn("up", "tween", 0.3, 1)}
          >
            <a 
              href="#pricing" 
              className="px-10 py-4 rounded-lg bg-primary text-white font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-primary/30 text-center group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                <span className="group-hover:translate-x-[-2px] transition-transform duration-300">Explore Plans</span>
                <svg className="w-0 h-5 ml-0 opacity-0 group-hover:opacity-100 group-hover:w-6 group-hover:ml-2 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </span>
            </a>
            <a 
              href="#solutions" 
              className="px-10 py-4 rounded-lg border-2 border-primary text-primary font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 text-center group relative overflow-hidden hover:bg-primary hover:text-white"
            >
              <span className="relative z-10 flex items-center justify-center">
                <span className="group-hover:translate-x-[-2px] transition-transform duration-300">Our Solutions</span>
                <svg className="w-5 h-5 ml-2 group-hover:ml-3 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </span>
            </a>
          </motion.div>
          
          <motion.div 
            className="mt-16 pt-10 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200"
            variants={fadeIn("up", "tween", 0.4, 1)}
          >
            <div className="flex space-x-4 items-start group cursor-pointer">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/30 group-hover:scale-110 group-hover:rotate-3 transform-gpu">
                <Zap className="w-6 h-6 text-primary transition-all duration-300 group-hover:scale-110" />
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold text-lg transition-colors duration-300 group-hover:text-primary">Lightning Fast</h3>
                <p className="text-gray-600 text-sm mt-1 transition-colors duration-300 group-hover:text-gray-700">Apps delivered in weeks, not months</p>
              </div>
            </div>
            
            <div className="flex space-x-4 items-start group cursor-pointer">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/30 group-hover:scale-110 group-hover:rotate-3 transform-gpu">
                <Code className="w-6 h-6 text-primary transition-all duration-300 group-hover:scale-110" />
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold text-lg transition-colors duration-300 group-hover:text-primary">Customized Code</h3>
                <p className="text-gray-600 text-sm mt-1 transition-colors duration-300 group-hover:text-gray-700">Tailored to your exact business needs</p>
              </div>
            </div>
            
            <div className="flex space-x-4 items-start group cursor-pointer">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/30 group-hover:scale-110 group-hover:rotate-3 transform-gpu">
                <Rocket className="w-6 h-6 text-primary transition-all duration-300 group-hover:scale-110" />
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold text-lg transition-colors duration-300 group-hover:text-primary">Free Hosting</h3>
                <p className="text-gray-600 text-sm mt-1 transition-colors duration-300 group-hover:text-gray-700">Lifetime free deployment included</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-secondary to-transparent z-10"></div>
    </section>
  );
}
