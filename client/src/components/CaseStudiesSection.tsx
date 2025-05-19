import { ArrowRight, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";
import { caseStudiesData } from "@/lib/data";

export default function CaseStudiesSection() {
  return (
    <section id="case-studies" className="py-20 bg-light-500">
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
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Success Stories</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold text-dark-600">Our Impact on Businesses</h2>
          <p className="mt-4 text-lg text-gray-600">
            See how our custom applications have transformed operations and saved costs for our clients.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {caseStudiesData.map((study, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              variants={fadeIn("up", "spring", index * 0.2 + 0.2, 0.75)}
            >
              <div className="h-64 w-full overflow-hidden">
                <img 
                  src={study.imageUrl} 
                  alt={study.imageAlt} 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <span className="px-3 py-1 bg-primary-50 text-primary rounded-full text-xs font-medium">
                    {study.category}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">ROI: {study.roi}</span>
                </div>
                <h3 className="text-xl font-semibold font-heading mb-2">{study.company}</h3>
                <p className="text-gray-600 mb-4">
                  {study.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {study.metricIcon === 'clock' ? 
                      <Clock className="h-4 w-4 text-gray-400 mr-1" /> : 
                      <TrendingUp className="h-4 w-4 text-gray-400 mr-1" />
                    }
                    <span className="text-sm text-gray-500">{study.metric}</span>
                  </div>
                  <a href="#" className="text-primary font-medium text-sm flex items-center">
                    Read case study <ArrowRight className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-12 text-center"
          variants={fadeIn("up", "tween", 0.5, 1)}
        >
          <a href="#" className="px-6 py-3 rounded-lg border border-primary text-primary font-medium hover:bg-primary-50 transition-colors inline-block">
            View All Case Studies
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
