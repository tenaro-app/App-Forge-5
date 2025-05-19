import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";
import { statsData } from "@/lib/data";

export default function StatsSection() {
  return (
    <motion.section 
      className="py-10 bg-white"
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <motion.div 
              key={index}
              className="text-center"
              variants={fadeIn("up", "spring", index * 0.1, 0.75)}
            >
              <motion.p 
                className="text-4xl font-bold text-primary"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { 
                    duration: 0.8,
                    delay: index * 0.1
                  } 
                }}
                viewport={{ once: true }}
              >
                {stat.value}
              </motion.p>
              <p className="mt-2 text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
