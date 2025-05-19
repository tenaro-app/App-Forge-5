import { Check, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer, fadeIn } from "@/lib/animations";
import { pricingPlansData } from "@/lib/data";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  const toggleBilling = () => {
    setIsAnnual(!isAnnual);
  };

  return (
    <section id="pricing" className="py-20 bg-white">
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
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Pricing</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold text-dark-600">Transparent, Value-Based Pricing</h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that's right for your business, with flexible options to scale as you grow.
          </p>
        </motion.div>
        
        {/* Billing Toggle */}
        <motion.div 
          className="flex justify-center items-center mb-12"
          variants={fadeIn("up", "tween", 0.2, 1)}
        >
          <span className={`text-sm font-medium ${!isAnnual ? 'text-dark-500' : 'text-gray-400'}`}>Monthly</span>
          <div className="relative mx-3 w-14 h-7">
            <input 
              type="checkbox" 
              id="billing-toggle" 
              className="peer sr-only" 
              checked={isAnnual}
              onChange={toggleBilling}
            />
            <label 
              htmlFor="billing-toggle" 
              className="absolute inset-0 cursor-pointer rounded-full bg-gray-200 peer-checked:bg-primary transition-colors"
            />
            <span className={`absolute inset-y-0 left-0 w-5 h-5 rounded-full bg-white border-gray-200 border-2 transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-1'}`} />
          </div>
          <span className={`text-sm font-medium ${isAnnual ? 'text-dark-500' : 'text-gray-400'}`}>
            Annual <span className="text-xs text-secondary-500 ml-1">Save 20%</span>
          </span>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlansData.map((plan, index) => (
            <motion.div 
              key={index}
              className={`relative border ${plan.highlighted ? 'border-primary' : 'border-gray-200'} rounded-xl p-8 bg-white ${plan.highlighted ? 'shadow-md' : 'shadow-sm hover:shadow-md transition-shadow'}`}
              variants={fadeIn("up", "spring", index * 0.1 + 0.3, 0.75)}
            >
              {plan.tag && (
                <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${plan.highlighted ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'} rounded-full px-4 py-1`}>
                  <span className="text-xs font-medium">{plan.tag}</span>
                </div>
              )}
              
              <h3 className="text-xl font-semibold font-heading mb-4">{plan.name}</h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              <div className="mb-6">
                {plan.price ? (
                  <>
                    <span className="text-4xl font-bold">{isAnnual ? plan.annualPrice : plan.price}</span>
                    <span className="text-sm text-gray-500">/project</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold">Custom</span>
                    <span className="text-sm text-gray-500">/project</span>
                  </>
                )}
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={`flex items-start ${feature.included ? '' : 'text-gray-400'}`}>
                    {feature.included ? (
                      <Check className="h-5 w-5 text-secondary-500 mr-2 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-gray-600' : ''}`}>{feature.text}</span>
                  </li>
                ))}
              </ul>
              
              <a 
                href={plan.custom ? "#" : "#"} 
                className={`block w-full py-3 rounded-lg ${
                  plan.highlighted || !plan.custom 
                    ? 'bg-primary text-white hover:bg-primary/90' 
                    : 'border border-primary text-primary hover:bg-primary-50'
                } font-medium text-center transition-colors`}
              >
                {plan.custom ? "Contact Sales" : "Get Started"}
              </a>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 bg-gray-50 rounded-xl p-8 border border-gray-200"
          variants={fadeIn("up", "tween", 0.6, 1)}
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-xl font-semibold font-heading mb-2">Not sure which plan is right for you?</h3>
              <p className="text-gray-600">
                Schedule a free consultation with our team to discuss your business needs and find the perfect solution.
              </p>
            </div>
            <div className="md:w-1/3 text-center md:text-right">
              <a href="#contact" className="px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors inline-block">
                Book a Free Consultation
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
