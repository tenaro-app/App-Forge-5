import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";
import { Zap, Code, Rocket } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-secondary py-24 md:py-36">
      <div className="absolute inset-0 z-0 opacity-15">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/70 to-secondary"></div>
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "overlay"
          }}
        ></div>
      </div>
      
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-secondary to-transparent z-10"></div>
      
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
            className="font-heading font-extrabold text-5xl md:text-6xl lg:text-7xl text-white leading-tight"
            variants={fadeIn("up", "tween", 0.1, 1)}
          >
            Business-<span className="text-primary">Transforming</span> Apps for the Digital Age
          </motion.h1>
          
          <motion.p 
            className="mt-8 text-xl text-gray-300 max-w-2xl"
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
              className="px-10 py-4 rounded-lg bg-primary text-white font-semibold text-lg hover:bg-primary/90 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-primary/30 text-center"
            >
              Explore Plans
            </a>
            <a 
              href="#solutions" 
              className="px-10 py-4 rounded-lg border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all transform hover:-translate-y-1 text-center group"
            >
              Our Solutions <span className="group-hover:ml-2 transition-all">→</span>
            </a>
          </motion.div>
          
          <motion.div 
            className="mt-16 pt-10 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10"
            variants={fadeIn("up", "tween", 0.4, 1)}
          >
            <div className="flex space-x-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Lightning Fast</h3>
                <p className="text-gray-300 text-sm mt-1">Apps delivered in weeks, not months</p>
              </div>
            </div>
            
            <div className="flex space-x-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Customized Code</h3>
                <p className="text-gray-300 text-sm mt-1">Tailored to your exact business needs</p>
              </div>
            </div>
            
            <div className="flex space-x-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Free Hosting</h3>
                <p className="text-gray-300 text-sm mt-1">Lifetime free deployment included</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-secondary to-transparent z-10"></div>
    </section>
  );
}
