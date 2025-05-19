import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";

export default function CTASection() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-600/90 to-primary/90"></div>
        <img 
          src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80" 
          alt="Digital transformation concept" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-3xl mx-auto text-center text-white"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeIn("up", "tween", 0.1, 1)}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Ready to Transform Your Business Operations?</h2>
          <p className="text-lg text-gray-100 mb-10 max-w-2xl mx-auto">
            Schedule a free consultation with our experts to discover how custom applications can streamline your processes and save you thousands of dollars annually.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="#contact" className="px-8 py-4 rounded-lg bg-white text-primary font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto text-center">
              Book a Free Consultation
            </a>
            <a href="#pricing" className="px-8 py-4 rounded-lg border border-white/30 text-white font-medium hover:bg-white/10 transition-colors w-full sm:w-auto text-center">
              View Pricing
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
