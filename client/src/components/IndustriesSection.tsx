import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";
import { industriesData } from "@/lib/data";
import IconRenderer from "./IconRenderer";

export default function IndustriesSection() {
  return (
    <section id="industries" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          variants={fadeIn("up", "tween", 0.1, 1)}
        >
          <div className="inline-flex items-center justify-center mb-3">
            <div className="h-1 w-8 bg-primary mr-3"></div>
            <span className="text-sm font-bold text-primary uppercase tracking-widest">Industries We Serve</span>
            <div className="h-1 w-8 bg-primary ml-3"></div>
          </div>
          <h2 className="mt-2 text-4xl md:text-5xl font-heading font-bold text-dark-600">
            Tailored Solutions for <span className="text-primary">Every Industry</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Our custom applications address the unique challenges faced by businesses across various sectors, driving efficiency and growth.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
          {industriesData.map((industry, index) => (
            <motion.div 
              key={index}
              className="relative group"
              variants={fadeIn("up", "spring", index * 0.1 + 0.2, 0.75)}
            >
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-primary/90 to-primary/70 rounded-full flex items-center justify-center border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-300 z-10">
                <IconRenderer icon={industry.icon} className="h-8 w-8 text-white" />
              </div>
              
              <div className="bg-white rounded-xl pt-14 pb-6 px-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                <h3 className="text-xl font-bold font-heading mb-3 whitespace-nowrap overflow-hidden text-ellipsis text-gray-800">{industry.name}</h3>
                <div className="w-12 h-1 bg-primary/30 mx-auto mb-4"></div>
                <p className="text-gray-600 mb-5 h-[3.2rem] line-clamp-2">
                  {industry.description}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {industry.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <a href="#contact" className="inline-flex items-center text-primary font-medium text-sm hover:underline mt-3">
                  Learn More
                  <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          variants={fadeIn("up", "tween", 0.5, 1)}
        >
          <a 
            href="#contact" 
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <span>Discuss Your Industry Needs</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
