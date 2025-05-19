import { Check, X, Zap, Shield, BarChart } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  const toggleBilling = () => {
    setIsAnnual(!isAnnual);
  };
  
  const newPricingPlansData = [
    {
      name: "IGNITE",
      description: "Kickstart your business automation journey with essential features and rapid deployment.",
      price: "$4,999",
      annualPrice: "$3,999",
      tag: "MOST POPULAR",
      highlighted: false,
      custom: false,
      icon: <Zap className="h-8 w-8" />,
      features: [
        { text: "1 custom application", included: true },
        { text: "Up to 8 automation workflows", included: true },
        { text: "Advanced reporting dashboard", included: true },
        { text: "Priority email & chat support", included: true },
        { text: "1 YEAR free tech development", included: true },
        { text: "Up to 5 third-party integrations", included: true },
        { text: "Free lifetime hosting", included: true },
        { text: "24/7 monitoring & maintenance", included: false },
        { text: "Dedicated account manager", included: false }
      ]
    },
    {
      name: "ACCELERATE",
      description: "Comprehensive solution for growing businesses with complex automation requirements.",
      price: "$7,999",
      annualPrice: "$6,999",
      tag: "BEST VALUE",
      highlighted: true,
      custom: false,
      icon: <BarChart className="h-8 w-8" />,
      features: [
        { text: "1 custom enterprise application", included: true },
        { text: "Unlimited automation workflows", included: true },
        { text: "Custom analytics & BI dashboards", included: true },
        { text: "24/7 priority support", included: true },
        { text: "1 YEAR free tech development", included: true },
        { text: "Unlimited third-party integrations", included: true },
        { text: "Free lifetime hosting", included: true },
        { text: "24/7 monitoring & maintenance", included: true },
        { text: "Dedicated account manager", included: false }
      ]
    },
    {
      name: "DOMINATE",
      description: "Enterprise-grade solution suite for organizations requiring maximum power and flexibility.",
      custom: true,
      highlighted: false,
      icon: <Shield className="h-8 w-8" />,
      features: [
        { text: "Multiple custom applications", included: true },
        { text: "Unlimited automation workflows", included: true },
        { text: "Enterprise BI ecosystem", included: true },
        { text: "24/7 VIP support with SLAs", included: true },
        { text: "1 YEAR free tech development", included: true },
        { text: "Advanced API development", included: true },
        { text: "Free lifetime hosting", included: true },
        { text: "24/7 monitoring & maintenance", included: true },
        { text: "Dedicated account manager", included: true }
      ]
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="absolute left-0 right-0 h-40 bg-light-500" style={{ top: -40, zIndex: -1 }}></div>
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
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-1 w-10 bg-primary mr-3"></div>
            <span className="text-sm font-bold text-primary uppercase tracking-widest font-heading">Investment Plans</span>
            <div className="h-1 w-10 bg-primary ml-3"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-secondary">
            <span className="text-primary">Transformative</span> Solutions for Every Budget
          </h2>
          <p className="mt-6 text-xl text-gray-600">
            Choose the plan that fits your ambition, with premium features and 
            1 year of free tech development included in every package.
          </p>
        </motion.div>
        
        {/* Billing Toggle */}
        <motion.div 
          className="flex justify-center items-center mb-16"
          variants={fadeIn("up", "tween", 0.2, 1)}
        >
          <span className={`text-base font-medium ${!isAnnual ? 'text-primary font-bold' : 'text-gray-500'}`}>Monthly</span>
          <div className="relative mx-4 w-16 h-8">
            <input 
              type="checkbox" 
              id="billing-toggle" 
              className="peer sr-only" 
              checked={isAnnual}
              onChange={toggleBilling}
            />
            <label 
              htmlFor="billing-toggle" 
              className="absolute inset-0 cursor-pointer rounded-full bg-gray-300 peer-checked:bg-primary transition-colors"
            />
            <span className={`absolute inset-y-0 left-0 m-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-0'}`} />
          </div>
          <span className={`text-base font-medium ${isAnnual ? 'text-primary font-bold' : 'text-gray-500'}`}>
            Annual <span className="text-xs bg-primary text-white rounded-full px-2 py-0.5 ml-1">Save 20%</span>
          </span>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newPricingPlansData.map((plan, index) => (
            <motion.div 
              key={index}
              className={`relative border-2 ${plan.highlighted ? 'border-primary shadow-2xl shadow-primary/20' : 'border-gray-200 shadow-xl hover:shadow-2xl'} rounded-2xl overflow-hidden bg-white transition-all hover:-translate-y-2 duration-300`}
              variants={fadeIn("up", "spring", index * 0.1 + 0.3, 0.75)}
            >
              {plan.tag && (
                <div className={`absolute top-0 right-0 ${plan.highlighted ? 'bg-primary' : 'bg-gray-800'} text-white px-6 py-1 rounded-bl-xl font-bold transform translate-x-2 -translate-y-0 rotate-0 shadow-lg`}>
                  <span className="text-xs tracking-wider">{plan.tag}</span>
                </div>
              )}
              
              <div className={`${plan.highlighted ? 'bg-primary text-white' : 'bg-gray-100 text-gray-900'} p-8`}>
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full ${plan.highlighted ? 'bg-white text-primary' : 'bg-gray-800 text-white'} flex items-center justify-center mr-4`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-extrabold font-heading tracking-tight">{plan.name}</h3>
                </div>
                <p className={`${plan.highlighted ? 'text-white/90' : 'text-gray-600'} mb-6 text-sm`}>{plan.description}</p>
                
                <div className="mb-2">
                  {plan.price ? (
                    <>
                      <span className="text-5xl font-extrabold tracking-tight">{isAnnual ? plan.annualPrice : plan.price}</span>
                      <span className={`text-sm ${plan.highlighted ? 'text-white/80' : 'text-gray-500'} ml-1`}>/project</span>
                    </>
                  ) : (
                    <>
                      <span className="text-5xl font-extrabold tracking-tight">Custom</span>
                      <span className={`text-sm ${plan.highlighted ? 'text-white/80' : 'text-gray-500'} ml-1`}>/project</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className={`flex items-center ${feature.included ? '' : 'text-gray-400'}`}>
                      {feature.included ? (
                        <div className="bg-primary/10 rounded-full p-1 mr-3 flex-shrink-0">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                      ) : (
                        <div className="bg-gray-100 rounded-full p-1 mr-3 flex-shrink-0">
                          <X className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      <span className={`text-sm ${feature.included ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>{feature.text}</span>
                    </li>
                  ))}
                </ul>
                
                <a 
                  href="#contact" 
                  className={`block w-full py-4 rounded-xl ${
                    plan.highlighted 
                      ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30 hover:shadow-primary/40' 
                      : plan.custom 
                        ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/20'
                        : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                  } font-bold text-center transition-all transform hover:scale-105`}
                >
                  {plan.custom ? "Get Enterprise Quote" : "Start Your Project"}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-20 bg-gradient-to-br from-secondary to-primary rounded-3xl p-10 shadow-2xl overflow-hidden relative"
          variants={fadeIn("up", "tween", 0.6, 1)}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-grid-white/[0.1]" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold font-heading text-white mb-4">Not sure which plan fits your vision?</h3>
              <p className="text-white/90 text-lg">
                Our experts will analyze your business needs and customize the perfect solution to maximize your ROI.
              </p>
            </div>
            <div className="md:w-1/3 text-center md:text-right">
              <a href="#contact" className="px-8 py-4 rounded-xl bg-white text-primary font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all transform hover:-translate-y-1 inline-block">
                Schedule Free Consultation
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
