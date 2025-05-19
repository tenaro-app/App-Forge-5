import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-dark-600 py-20 md:py-32">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-dark-600"></div>
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
      
      <motion.div 
        className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="max-w-3xl">
          <motion.h1 
            className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight"
            variants={fadeIn("up", "tween", 0.1, 1)}
          >
            Custom Business Apps <span className="text-primary-400">That Scale</span> With Your Success
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-lg text-gray-300 max-w-2xl"
            variants={fadeIn("up", "tween", 0.2, 1)}
          >
            We build custom applications that automate your business processes, saving you thousands of hours and dollars annually.
          </motion.p>
          
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            variants={fadeIn("up", "tween", 0.3, 1)}
          >
            <a 
              href="#pricing" 
              className="px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors text-center"
            >
              View Pricing
            </a>
            <a 
              href="#solutions" 
              className="px-8 py-3 rounded-lg border border-white/30 text-white font-medium hover:bg-white/10 transition-colors text-center"
            >
              Explore Solutions
            </a>
          </motion.div>
          
          <motion.div 
            className="mt-12 pt-10 border-t border-white/10"
            variants={fadeIn("up", "tween", 0.4, 1)}
          >
            <p className="text-gray-400 text-sm mb-3">Trusted by innovative companies</p>
            <div className="flex flex-wrap items-center gap-8 opacity-70">
              <div className="h-8 w-auto text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-full">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div className="h-8 w-auto text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-full">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
              <div className="h-8 w-auto text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-full">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div className="h-8 w-auto text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-full">
                  <path d="M18 8h1a4 4 0 010 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
