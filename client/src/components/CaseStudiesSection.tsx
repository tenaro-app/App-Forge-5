import { ArrowUpRight, CheckCheck, TrendingUp, DollarSign, BarChart4, Package, ShoppingCart, Users } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";

export default function CaseStudiesSection() {
  const caseStudiesData = [
    {
      company: "GreenGro Local Farm",
      category: "Retail & Distribution",
      roi: "318% ROI",
      description: "Small family farm struggling with inventory tracking and distribution implemented a custom app to manage harvest schedules, inventory levels, and deliveries to local restaurants.",
      metricValue: "96%",
      metricLabel: "Reduction in produce waste",
      metricIcon: <TrendingUp className="w-4 h-4 text-primary" />,
      bgColor: "from-green-900 to-green-700",
      icon: <Package className="w-6 h-6" />
    },
    {
      company: "Cornerstone Dental Group",
      category: "Healthcare Services",
      roi: "287% ROI",
      description: "Growing dental practice with 3 locations needed to streamline patient scheduling, record management, and equipment maintenance tracking across all facilities.",
      metricValue: "68%",
      metricLabel: "Reduction in scheduling errors",
      metricIcon: <CheckCheck className="w-4 h-4 text-primary" />,
      bgColor: "from-blue-900 to-blue-700",
      icon: <Users className="w-6 h-6" />
    },
    {
      company: "Metro Handyman Services",
      category: "Home Services",
      roi: "195% ROI",
      description: "Small handyman business struggling with job estimates, scheduling, and invoicing implemented a mobile app to manage technicians, provide real-time updates, and digitize paperwork.",
      metricValue: "$47K",
      metricLabel: "Annual savings",
      metricIcon: <DollarSign className="w-4 h-4 text-primary" />,
      bgColor: "from-orange-800 to-orange-600",
      icon: <CheckCheck className="w-6 h-6" />
    },
    {
      company: "Highland Craft Brewery",
      category: "Food & Beverage",
      roi: "273% ROI",
      description: "Microbrewery needed a solution to track inventory, manage production schedules, and maintain quality control across multiple brewing processes and distribution channels.",
      metricValue: "47%",
      metricLabel: "Increase in production output",
      metricIcon: <BarChart4 className="w-4 h-4 text-primary" />,
      bgColor: "from-amber-900 to-amber-700",
      icon: <Package className="w-6 h-6" />
    },
    {
      company: "Brightway Education",
      category: "Education Services",
      roi: "226% ROI",
      description: "Small education center streamlined student registration, teacher scheduling, and progress reporting with a custom application that integrated with their payment processing system.",
      metricValue: "84%",
      metricLabel: "Reduction in administrative tasks",
      metricIcon: <CheckCheck className="w-4 h-4 text-primary" />,
      bgColor: "from-indigo-900 to-indigo-700",
      icon: <Users className="w-6 h-6" />
    },
    {
      company: "Urban Closet Boutique",
      category: "Retail & E-commerce",
      roi: "341% ROI",
      description: "Small clothing boutique with online and physical presence implemented integrated inventory management with automated reordering and customer loyalty tracking.",
      metricValue: "215%",
      metricLabel: "Increase in online orders",
      metricIcon: <ShoppingCart className="w-4 h-4 text-primary" />,
      bgColor: "from-rose-900 to-rose-700",
      icon: <ShoppingCart className="w-6 h-6" />
    }
  ];

  return (
    <section id="case-studies" className="py-16 md:py-24 bg-light-500">
      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          variants={fadeIn("up", "tween", 0.1, 1)}
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-1 w-10 bg-primary mr-3"></div>
            <span className="text-sm font-bold text-primary uppercase tracking-widest font-heading">Success Stories</span>
            <div className="h-1 w-10 bg-primary ml-3"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-secondary">
            Small Businesses <span className="text-primary">Transformed</span> By Our Solutions
          </h2>
          <p className="mt-6 text-xl text-gray-600">
            See how our custom applications have helped small to medium-sized businesses 
            overcome their growth challenges and achieve remarkable results.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {caseStudiesData.map((study, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border border-gray-100 group hover:-translate-y-2 duration-300"
              variants={fadeIn("up", "spring", index * 0.05 + 0.1, 0.5)}
            >
              <div className={`h-32 w-full bg-gradient-to-r ${study.bgColor} relative overflow-hidden p-8 flex items-center`}>
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 0l15 15H0z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px'
                  }} />
                </div>
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  {study.icon}
                </div>
                <div className="z-10">
                  <h3 className="text-xl font-bold font-heading text-white">{study.company}</h3>
                  <p className="text-white/80 text-sm font-medium">{study.category}</p>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2">
                    {study.metricIcon}
                    <span className="text-xl font-bold text-gray-900">{study.metricValue}</span>
                  </div>
                  <span className="px-4 py-1 bg-primary text-white rounded-full text-xs font-bold tracking-wider shadow-sm">
                    {study.roi}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6 text-base">
                  {study.description}
                </p>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">{study.metricLabel}</span>
                  <a href="#contact" className="text-primary flex items-center text-sm font-bold group-hover:underline transition-all">
                    Get similar results <ArrowUpRight className="ml-1 h-4 w-4 group-hover:ml-2 transition-all" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          variants={fadeIn("up", "tween", 0.6, 1)}
        >
          <a 
            href="#contact" 
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white border-2 border-primary text-primary rounded-xl font-bold text-lg shadow-xl hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1"
          >
            <span>Get Your Own Success Story</span>
            <ArrowUpRight className="h-5 w-5" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
