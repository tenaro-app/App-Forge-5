import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";
import { industriesData } from "@/lib/data";
import IconRenderer from "./IconRenderer";

export default function IndustriesSection() {
  return (
    <section id="industries" className="py-20 bg-white">
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
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Industries</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold text-dark-600">
            Tailored Solutions for Every Industry
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Our custom applications are designed to address the unique challenges faced by businesses in various sectors.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {industriesData.map((industry, index) => (
            <motion.div 
              key={index}
              className="relative"
              variants={fadeIn("up", "spring", index * 0.1 + 0.2, 0.75)}
            >
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <IconRenderer icon={industry.icon} className="h-8 w-8 text-primary" />
              </div>
              <div className="pt-12 text-center">
                <h3 className="text-xl font-semibold font-heading mb-2 whitespace-nowrap overflow-hidden text-ellipsis">{industry.name}</h3>
                <p className="text-gray-600 mb-4 h-[3.2rem] line-clamp-2">
                  {industry.description}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {industry.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-3 py-1 bg-primary-50 text-primary rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
