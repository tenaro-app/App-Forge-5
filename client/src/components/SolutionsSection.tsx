import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";
import { solutionsData } from "@/lib/data";
import IconRenderer from "./IconRenderer";

export default function SolutionsSection() {
  return (
    <section id="solutions" className="py-20 bg-light-500">
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
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Solutions</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold text-dark-600">
            Eliminate Repetitive Tasks With Custom Apps
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            We create tailored applications that automate your business processes and workflows, 
            freeing your team to focus on what matters.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutionsData.map((solution, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 border border-gray-100"
              variants={fadeIn("up", "spring", index * 0.1 + 0.2, 0.75)}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <IconRenderer icon={solution.icon} className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold font-heading mb-3">{solution.title}</h3>
              <p className="text-gray-600 mb-4">{solution.description}</p>
              <ul className="space-y-2 mb-6">
                {solution.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-secondary-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <a href="#" className="text-primary font-medium text-sm flex items-center">
                Learn more <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
