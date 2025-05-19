import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { ArrowRight, Zap } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with red/black gradient instead of blue image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black to-primary"></div>
        {/* Diagonal pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-4xl mx-auto text-center text-white"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeIn("up", "tween", 0.1, 1)}
        >
          <div className="inline-flex items-center justify-center mb-6 group">
            <Zap className="w-6 h-6 text-primary mr-2 transition-all duration-300 group-hover:scale-125 group-hover:rotate-6 transform-gpu animate-pulse" />
            <span className="text-sm font-bold text-primary uppercase tracking-widest relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-500 group-hover:after:w-full">Business Transformation</span>
            <Zap className="w-6 h-6 text-primary ml-2 transition-all duration-300 group-hover:scale-125 group-hover:rotate-[-6deg] transform-gpu animate-pulse" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-8 transition-all duration-500 hover:scale-105 cursor-default">
            Ready to <span className="text-primary relative inline-block transition-all duration-500 hover:scale-110 hover:text-primary/90 after:absolute after:bottom-1 after:left-0 after:h-[3px] after:w-0 after:bg-primary/30 after:transition-all after:duration-700 hover:after:w-full">Transform</span> Your Business Operations?
          </h2>
          
          <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-300 hover:text-white">
            Schedule a free consultation with our experts to discover how custom applications can streamline your processes and <span className="font-bold text-primary relative inline-block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary/70 after:transition-all after:duration-500 hover:after:w-full">save you thousands of dollars annually</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-5 sm:space-y-0 sm:space-x-6">
            <a 
              href="#contact" 
              className="group w-full sm:w-auto px-8 py-5 rounded-xl bg-primary text-white font-bold text-lg flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300 transform hover:-translate-y-1 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                <span className="group-hover:translate-x-[-2px] transition-transform duration-300">Book a Free Consultation</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:ml-3 group-hover:scale-110 transition-all duration-300" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 group-hover:scale-110 transition-transform duration-500 ease-out"></span>
            </a>
            
            <a 
              href="#pricing" 
              className="group w-full sm:w-auto px-8 py-5 rounded-xl border-2 border-white text-white font-bold text-lg flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                <span className="group-hover:translate-x-[-2px] transition-transform duration-300">View Our Pricing</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:ml-3 group-hover:scale-110 transition-all duration-300" />
              </span>
              <span className="absolute inset-0 bg-white/0 group-hover:bg-white transition-transform duration-500 ease-out"></span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
